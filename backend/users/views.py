from django.db import transaction
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import update_last_login
from django.conf import settings
from .serializers import UserSerializer, AbstractSerializer, ParticipantSerializer, AuthorSerializer, AuthorAffiliationSerializer, AbstractDeclarationsSerializer
from .models import Abstract, Author, AuthorAffiliation, AbstractDeclarations
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
import os


User = get_user_model()


class UserView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=["get"], url_path="session")
    def whoami(self, request):
        user = request.user
        data = {}
        data["anonymous"] = user.is_anonymous
        if user.is_authenticated:
            data["user"] = self.get_serializer(user).data

        return Response(data)

    @action(detail=False, methods=["get"], url_path="profile")
    def profiles(self, request):
        profiles = {}
        user_is_participant = request.user.groups.filter(name="participant").exists()
        if user_is_participant and hasattr(request.user, "participant"):
            profiles["participant"] = ParticipantSerializer(request.user.participant).data
        return Response(profiles, status=200)

    @action(detail=False, methods=["post"], url_path="change-profile-pic")
    def change_profile_pic(self, request):
        user = self.request.user
        file = request.data.get("photo", None)
        if file is not None and user.is_authenticated:
            if user.photo:
                user.photo.delete()
            user.photo = file
            user.save()
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="change-password")
    def change_password(self, request):
        user = self.request.user

        old_password = request.data.get("oldPassword")
        if not old_password:
            return Response(
                {"oldPassword": ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_password = request.data.get("newPassword", None)
        if not new_password:
            return Response(
                {"newPassword": ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_old_pwd_ok = user.check_password(old_password)
        if not is_old_pwd_ok:
            return Response(
                {"oldPassword": ["Current password is incorrect."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        return Response(
            {"detail": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            email = request.data.get("email", None)
            user = User.objects.get(email=email)
            update_last_login(None, user)

            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")
            response.set_cookie(
                "access_token",
                access_token,
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Lax",
                max_age=900,
            )

            response.set_cookie(
                "refresh_token",
                refresh_token,
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Lax",
                max_age=86400,
            )
        return response


class CustomTokenRefreshView(TokenRefreshView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.COOKIES.get("refresh_token")
        if token:
            request.data.update({"refresh": token})
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
            response = super().post(request, *args, **kwargs)
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")
            response.set_cookie(
                "access_token",
                access_token,
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Lax",
                max_age=900,
            )
            response.set_cookie(
                "refresh_token",
                refresh_token,
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Lax",
                max_age=86400,
            )
            return response
        except:
            no_token_res = Response(status=status.HTTP_401_UNAUTHORIZED)
            no_token_res.set_cookie(
                "access_token",
                "",
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Lax",
                max_age=0,
            )
            no_token_res.set_cookie(
                "refresh_token",
                "",
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Lax",
                max_age=0,
            )
            return no_token_res


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.COOKIES.get("refresh_token"))
            token.blacklist()
            pass
        except Exception as e:
            pass

        response = Response({"message": "Logout exitoso"}, status=status.HTTP_200_OK)

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response


class AbstractView(ModelViewSet):
    queryset = Abstract.objects.all()
    serializer_class = AbstractSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=["get"], url_path="affiliations")
    def get_affiliations(self, request, pk=None):
        abstract = self.get_object()
        data = AuthorAffiliationSerializer(abstract.affiliations.all(), many=True)
        return Response(data.data)

    @action(detail=True, methods=["get", "patch"], url_path="authors")
    def get_authors(self, request, pk=None):
        abstract = self.get_object()
        if request.method == "PATCH":
            author_data = request.data.get("authors")
            for index, author in enumerate(author_data, start=1):
                instance = Author.objects.get(
                    id=author.get("id"),
                    abstract=abstract,
                )
                instance.order = index
                instance.save()

            serializer = AuthorSerializer(abstract.authors, data=author_data, many=True)
            if serializer.is_valid(raise_exception=True):
                return Response(serializer.data)

        serializer = AuthorSerializer(abstract.authors, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get", "patch"], url_path="declarations")
    def update_declarations(self, request, pk=None):
        instance = self.get_object()
        if request.method == "GET":
            declarations, _ = AbstractDeclarations.objects.get_or_create(abstract=instance)
            serializer = AbstractDeclarationsSerializer(declarations)
            return Response(serializer.data)

        if request.method == "PATCH":
            declarations, _ = AbstractDeclarations.objects.update_or_create(
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
            serializer = AbstractDeclarationsSerializer(declarations)
            return Response(serializer.data)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"], url_path="preview")
    def generate_pdf(self, request: Request, pk=None):
        abstract = Abstract.objects.prefetch_related("authors__affiliation").get(id=pk)
        context = self.get_abstract_context(abstract)

        html_string = render_to_string("abstract_template.html", context)
        path_to_css = os.path.join(settings.BASE_DIR, "static", "css", "abstract_styles.css")
        path_to_static = os.path.join(settings.BASE_DIR, "static")
        html = HTML(string=html_string, base_url=path_to_static)

        pdf_file = html.write_pdf(
            stylesheets=[CSS(filename=path_to_css)],
        )

        response = HttpResponse(pdf_file, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{abstract.title or f'abstract_{abstract}'}.pdf"'
        return response
    
    @action(detail=True, methods=["get"], url_path="authors-preview")
    def get_abstract_author_context(self, request, pk=None):
        abstract = Abstract.objects.prefetch_related("authors__affiliation").get(id=pk)
        context = self.get_abstract_context(abstract)
        print(context)
        return Response({
            'authors_list': context['authors_list'],
            'affiliations_list': context['affiliations_list'],
        })    


    def get_abstract_context(self, abstract):
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
                        "text": f"{aff.institute}, {aff.department}, {aff.city}, {aff.get_nationality_display()}",
                    }
                )
                counter += 1

            authors_data.append(
                {
                    "full_name": f"{author.first_name[0]}. {author.last_name}",
                    "aff_index": affiliations_set.get(aff_id),
                }
            )

        return {
            "abstract": abstract,
            "authors_list": authors_data,
            "affiliations_list": unique_affiliations,
        }


class AuthorsView(ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [permissions.IsAuthenticated]


class AuthorAffiliationsView(ModelViewSet):
    queryset = AuthorAffiliation.objects.all()
    serializer_class = AuthorAffiliationSerializer
    permission_classes = [permissions.IsAuthenticated]


class AuthorDeclarationsView(ModelViewSet):
    queryset = AbstractDeclarations.objects.all()
    serializer_class = AbstractDeclarationsSerializer
    permission_classes = [permissions.IsAuthenticated]
