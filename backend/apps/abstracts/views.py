from rest_framework import permissions, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django_filters import rest_framework as filters
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from rest_framework.decorators import action
from django.conf import settings
from django.http import HttpResponse
from config.pagination import Pagination
from apps.abstracts.filters import AbstractSearchFilter
from config.services import is_redis_available
from .tasks import generate_abstract_pdf
from .models import Affiliation, Abstract, Author, AbstactStatus, AbstractDeclaration, AbstractPresentation, PDFGenerationJob
from .serializers import AffiliationSerializer, AbstractSerializer, AuthorSerializer, AbstractDeclarationSerializer, PDFGenerationJobSerializer
import os, logging, html

User = get_user_model()

logger = logging.getLogger("abstracts")


class PDFGenerationViewSet(ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = PDFGenerationJob.objects.all()
    serializer_class = PDFGenerationJobSerializer

    def create(self, request: Request):
        force_param = request.query_params.get("force", None)
        force = force_param in ["true", "1"]

        abstract_id = request.data.get("abstract_id", None)

        abstract = Abstract.objects.filter(id=abstract_id).first()
        if abstract is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Obtiene el último PDF generado del abstract existente
        existing_job = self.queryset.filter(abstract=abstract).order_by("-completed_at").first()

        if existing_job is not None and not force:
            # si existe hay que comprobar que el abstract no ha cambiado
            new_hash = abstract.get_hash()
            last_hash = existing_job.content_hash

            same_hash = new_hash == last_hash
            is_completed = existing_job.status == existing_job.Status.COMPLETED

            # si el abstract no ha cambiado desde la última generación, devolverla
            if same_hash and is_completed:
                print("REUSAR")
                serializer = self.serializer_class(existing_job)
                return Response(serializer.data, status=status.HTTP_208_ALREADY_REPORTED)

        logger.info("generando PDF")
        if is_redis_available():
            job = PDFGenerationJob.objects.create(
                abstract=abstract,
                content_hash=abstract.get_hash(),
            )
            serializer = self.serializer_class(job)

            if is_redis_available():
                generate_abstract_pdf.delay(f"{job.id}")

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request: Request):
        job_id = request.data.get("abstract_id", None)
        job = self.queryset.filter(id=job_id)

        if job.exists():
            return Response(
                {
                    "job_id": str(job.id),
                    "status": job.status,
                },
                status=status.HTTP_202_ACCEPTED,
            )

        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["get"], url_path="download")
    def download(self, request: Request, pk=None):
        job = self.get_object()
        response = HttpResponse(job.file, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{job.abstract.get_plain_title()}.pdf"'
        return response


class AffiliationViewSet(ModelViewSet):
    serializer_class = AffiliationSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ["institution", "city", "country"]
    filter_backends = [SearchFilter]
    pagination_class = Pagination

    def get_queryset(self):
        queryset = Affiliation.objects.all()

        user = self.request.user
        if not user.is_superuser:
            return queryset.filter(user__id=user.id)

        return queryset

    def destroy(self, request, pk=None):
        instance = self.get_object()

        authors_count = instance.authors.all().count()
        if authors_count != 0:
            raise ValidationError({"errors": {"root": ["This affiliation cannot be deleted because it is currently assigned to one or more authors."]}})

        self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)


class AbstractView(ModelViewSet):
    queryset = Abstract.objects.all()
    serializer_class = AbstractSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = AbstractSearchFilter
    pagination_class = Pagination

    def perform_create(self, serializer):
        """
        Cuando crea un nuevo abstract, le añade automáticamente
        al user que lo creó como el primer Author, usando sus datos
        de afiliación.
        """

        # TODO: cambiar (otra vez) los atributos en Participants para que queden mejor en las affiliations

        with transaction.atomic():
            abstract: Abstract = serializer.save()
            data = {
                "abstract_id": abstract.pk,
                "related_user_id": abstract.user.pk,
                "is_corresponding_author": True,
                "editable": False,
                "institution": "NA",
                "country": "NA",
                "city": "NA",
            }

            participant_data = abstract.user.participant
            if participant_data:
                data["institution"] = participant_data.affiliation
                data["institution"] = abstract.user.nationality
                data["institution"] = abstract.user.city

            author_serializer = AuthorSerializer(data=data)
            author_serializer.is_valid(raise_exception=True)
            author_serializer.save()

    # region otras vistas
    @action(detail=True, methods=["get"], url_path="affiliations")
    def get_affiliations(self, request, pk=None):
        abstract = self.get_object()
        data = AuthorAffiliationSerializer(abstract.affiliations.all(), many=True)
        # data = AuthorAffiliationSerializer([], many=True)
        return Response(data.data)

    @action(detail=True, methods=["get", "patch"], url_path="authors")
    def get_set_authors(self, request, pk=None):
        """
        Esta vista devuelve los autores de un abstract dado (GET)
        o los actualiza (PATCH)
        """

        abstract = self.get_object()
        if request.method == "PATCH":
            author_data = request.data.get("authors")

            ids = [a["id"] for a in author_data]
            queryset = Author.objects.filter(id__in=ids)

            # Convertir a lista para facilitar recálculo del orden
            authors = list(queryset)
            authors_by_id = {author.id: author for author in authors}

            for i, data in enumerate(author_data, start=1):
                author = authors_by_id[data["id"]]
                author.order = i
                author.is_corresponding_author = data.get(
                    "is_corresponding_author",
                    author.is_corresponding_author,
                )

            corresponding_authors = [author for author in authors if author.is_corresponding_author]
            corresponding_authors_count = len(corresponding_authors)
            if corresponding_authors_count == 0:
                raise ValidationError({"errors": {"root": ["At least one corresponding author is required."]}})
            if corresponding_authors_count > 1:
                raise ValidationError(
                    {
                        "errors": {
                            "root": ["There must be exactly one corresponding author."],
                            "authors": [author.id for author in corresponding_authors if author.is_corresponding_author is True],
                        }
                    }
                )

            Author.objects.bulk_update(authors, ["order", "is_corresponding_author"])

            authors.sort(key=lambda x: x.order)

            serializer = AuthorSerializer(authors, many=True, context={"request": request})
            return Response(serializer.data)

        serializer = AuthorSerializer(
            abstract.authors,
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)

    @action(detail=True, methods=["get", "patch"], url_path="declarations")
    def update_declarations(self, request, pk=None):
        instance = self.get_object()
        if request.method == "GET":
            declarations, _ = AbstractDeclaration.objects.get_or_create(abstract=instance)
            serializer = AbstractDeclarationSerializer(declarations)
            return Response(serializer.data)

        if request.method == "PATCH":
            declarations, _ = AbstractDeclaration.objects.update_or_create(
                abstract=instance,
                defaults={
                    "confirm_accuracy": request.data.get("confirm_accuracy", False),
                    "consent_publication": request.data.get("consent_publication", False),
                    "submit_on_behalf": request.data.get("submit_on_behalf", False),
                    "commitment_attendance": request.data.get("commitment_attendance", False),
                    "not_previously_published": request.data.get("not_previously_published", False),
                    "no_ai_used": request.data.get("no_ai_used", False),
                },
            )
            declarations.save()
            serializer = AbstractDeclarationSerializer(declarations)
            return Response(serializer.data)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"], url_path="preview")
    def generate_pdf(self, request: Request, pk=None):
        abstract = Abstract.objects.prefetch_related("authors__affiliation").get(id=pk)
        context = self.get_abstract_context(abstract)

        from weasyprint import HTML, CSS

        html_string = render_to_string("abstract_template.html", context)
        path_to_css = os.path.join(settings.BASE_DIR, "static", "css", "abstract_styles.css")
        path_to_static = os.path.join(settings.BASE_DIR, "static")
        html_file = HTML(string=html_string, base_url=path_to_static)

        pdf_file = html_file.write_pdf(
            stylesheets=[CSS(filename=path_to_css)],
        )

        response = HttpResponse(pdf_file, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{abstract.get_plain_title()}.pdf"'
        return response

    @action(detail=True, methods=["get"], url_path="authors-preview")
    def get_abstract_author_context(self, request, pk=None):
        abstract = Abstract.objects.prefetch_related("authors__affiliation").get(id=pk)
        context = self.get_abstract_context(abstract)
        return Response(
            {
                "authors_list": context["authors_list"],
                "affiliations_list": context["affiliations_list"],
            }
        )

    @action(detail=True, methods=["patch"], url_path="submit")
    def submit(self, request, pk=None):
        abstract = self.get_object()

        serializer = self.get_serializer(
            abstract,
            data={},
            partial=True,
        )
        serializer.is_valid(raise_exception=True)

        abstract.status = AbstactStatus.SUBMITTED
        abstract.save()
        return Response()

    def get_abstract_context(self, abstract: Abstract):
        authors_data = []
        affiliations_set = {}
        unique_affiliations = []

        counter = 1
        for author in abstract.authors.all():
            aff = author.affiliation
            aff_id = aff.id if aff else None
            if aff_id and aff_id not in affiliations_set:
                affiliations_set[aff_id] = counter
                unique_affiliations.append(
                    {
                        "index": counter,
                        "text": f"{aff.institute}, {aff.city}, {aff.get_nationality_display()}",
                    }
                )
                counter += 1
            authors_data.append(
                {
                    "full_name": f"{author.first_name[0]}. {author.last_name}",
                    "aff_index": affiliations_set.get(aff_id),
                }
            )

        abstract.title = html.unescape(abstract.title)
        abstract.text = html.unescape(abstract.text)
        abstract.references = html.unescape(abstract.references)

        return {
            "file_title": abstract.get_plain_title(),
            "abstract": abstract,
            "authors_list": authors_data,
            "affiliations_list": unique_affiliations,
        }

    # endregion

    @action(detail=False, methods=["get"], url_path="pending-posters")
    def get_pending_posters(self, request):
        # Empieza con todos los abstracts
        queryset_base = Abstract.objects.all()
        # encadena varios filtros pero sin ejecutar
        pending_posters = queryset_base.filter(status=AbstactStatus.SUBMITTED).filter(presentation_type=AbstractPresentation.POSTER).filter(user__email_verified=True).order_by("-last_update")
        # aquí es donde realmente ejecuta la consulta, al momento de leer
        serializer = self.get_serializer(pending_posters, many=True)
        return Response(serializer.data)


class AuthorsView(ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, pk=None):
        """
        Antes de eliminar un autor se debe validar que no sea el autor
        que representa al propio usuario que creó el abstract, ese no
        se puede eliminar, solo editar. Un participante DEBE ser coautor
        del abstract que envía.
        """

        instance = self.get_object()

        author_user_pk = instance.related_user.pk
        abstract_user_pk = instance.abstract.user.pk
        author_is_creator = author_user_pk == abstract_user_pk

        if author_is_creator:
            raise ValidationError({"errors": {"root": ["At least one corresponding author is required."]}})

        self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)


class AuthorDeclarationView(ModelViewSet):
    queryset = AbstractDeclaration.objects.all()
    serializer_class = AbstractDeclarationSerializer
    permission_classes = [permissions.IsAuthenticated]
    """
    {
        "abstract_id": 1,
        "confirm_accuracy": true,
        "consent_publication": true,
        "submit_on_behalf": true,
        "commitment_attendance": true,
        "not_previously_published": true,
        "no_ai_used": true
    }
    """
