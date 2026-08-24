from django.db import transaction, IntegrityError
from django.contrib.auth import get_user_model
from rest_framework import serializers
from . import models, text_choices
from datetime import datetime
import logging, bleach

User = get_user_model()

logger = logging.getLogger(__name__)


MAX_AUTHORS_PER_ABSTRACT = 10
ALLOWED_HTML_TAGS = ["p", "b", "a", "strong", "i", "s", "sup", "sub"]


class AbstractSerializer(serializers.ModelSerializer):
    authors = serializers.SerializerMethodField()
    declarations = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    plain_title = serializers.SerializerMethodField()

    class Meta:
        model = models.Abstract
        fields = "__all__"
        read_only_fields = ["created_at", "last_update", "needs_review"]

    # region GETTERS
    def get_user(self, instance):
        return RelatedUserSerializer(instance.user, context=self.context).data

    def get_plain_title(self, instance):
        return instance.get_plain_title()

    def get_authors(self, instance):
        return AuthorSerializer(instance.authors.all(), many=True, context=self.context).data

    def get_declarations(self, instance):
        exists = hasattr(instance, "declarations")
        if not exists:
            return {}
        return AbstractDeclarationSerializer(instance.declarations).data

    # endregion

    # region VALIDATE_FIELD
    def validate_title(self, value):
        sanitized_value = bleach.clean(value, ALLOWED_HTML_TAGS, {}, strip=True)
        return sanitized_value

    def validate_text(self, value):
        sanitized_value = bleach.clean(value, ALLOWED_HTML_TAGS, {}, strip=True)
        return sanitized_value

    def validate_references(self, value):
        sanitized_value = bleach.clean(value, ALLOWED_HTML_TAGS, {}, strip=True)
        return sanitized_value

    # endregion

    def validate(self, attrs):
        """
        Esta validación solo se ejecuta cuando se llama al endpoint
        PATCH /api/abstracts/submissions/?/submit/ y ejecuta las
        validaciones necesarias para asegurarse de que el abstract
        está en condiciones de ser enviado a revisión
        """

        instance: models.Abstract = self.instance

        validation = self.context.get("validation")

        if instance and validation == "deep":
            errors = {}
            if not instance.title.strip():
                errors["title"] = ["Title required"]
            if not instance.text.strip():
                errors["text"] = ["Text required"]
            if not instance.references.strip():
                errors["references"] = ["Abstract references are required"]
            if instance.status == models.AbstactStatus.SUBMITTED:
                errors["status"] = ["This abstract was already submitted"]

            # Validar tipo de presentación (si no es para Young WATOC)
            if not instance.is_for_young_watoc:
                if instance.presentation_type == "":
                    errors["presentation_type"] = ["Choose a valid presentation format"]

            author_errors = []

            authors = instance.authors.all()

            # Validar cantidad de autores
            author_count = authors.count()
            if author_count == 0:
                author_errors.append("At least one author is required")
            elif author_count > MAX_AUTHORS_PER_ABSTRACT:
                author_errors.append(f"An abstract can have at most {MAX_AUTHORS_PER_ABSTRACT} authors")

            # Validar que el orden de los autores tenga sentido
            orders = sorted(authors.values_list("order", flat=True))
            supposed_order = list(range(1, len(orders) + 1))
            if orders != supposed_order:
                author_errors.append("Author's order must be continuous")

            # Validar solo 1 autor corresponsal
            corresponding_authors = authors.filter(is_corresponding_author=True).count()
            if corresponding_authors == 0:
                author_errors.append("One corresponding author is required")
            elif corresponding_authors > 1:
                author_errors.append("There must be exactly one corresponding author")

            # Validaciones intrínsecas a los autores
            for author in authors.all():
                if isinstance(author, models.Author):
                    author_serializer = AuthorSerializer(
                        author,
                        data=AuthorSerializer(author).data,
                        context=self.context,
                    )
                    if not author_serializer.is_valid():
                        author_errors.extend(author_serializer.errors.get("non_field_errors", []))

                    if author_errors:
                        errors.setdefault("authors", []).append(
                            {
                                "author_id": author.id,
                                "errors": author_errors,
                            }
                        )

            if errors:
                raise serializers.ValidationError(errors)

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        instance = models.Abstract(**validated_data)
        request = self.context.get("request", None)
        instance.user = request.user
        instance.save()
        # TODO Notificación: Abstract creado
        # transaction.on_commit(lambda: signals.on_abstract_created(instance))
        # transaction.set_rollback(True)
        return instance

    @transaction.atomic
    def update(self, instance: models.Abstract, validated_data):
        extra_kwargs = {"previous_status": instance.status}
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.extra_kwargs = extra_kwargs
        instance.save()
        # TODO Notificación: Abstract modificado
        # transaction.on_commit(lambda: signals.on_abstract_updated(instance))
        return instance


class AbstractDetailSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    plain_title = serializers.SerializerMethodField()

    class Meta:
        model = models.Abstract
        fields = [
            "user",
            "plain_title",
            "title",
            "id",
        ]

    def get_user(self, instance):
        return RelatedUserSerializer(instance.user, context=self.context).data

    def get_plain_title(self, instance):
        return instance.get_plain_title()


class PDFGenerationJobSerializer(serializers.ModelSerializer):
    abstract_detail = serializers.SerializerMethodField()

    class Meta:
        model = models.PDFGenerationJob
        fields = [
            "id",
            "abstract",
            "abstract_detail",
            "content_hash",
            "status",
            "file",
            "error",
            "created_at",
            "completed_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "content_hash",
            "abstract_detail",
            "file",
            "error",
            "created_at",
            "completed_at",
        ]

    def get_abstract_detail(self, instance):
        return AbstractDetailSerializer(instance.abstract).data


class AffiliationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(
        required=False,
        allow_null=True,
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="user",
        write_only=True,
    )

    class Meta:
        model = models.Affiliation
        fields = "__all__"
        validators = []

    def validate(self, attrs=None):
        errors = {}

        if not attrs.get("institution"):
            errors["institution"] = ["Institution name required"]

        country = attrs.get("country")
        if not country:
            errors["country"] = ["Country is required."]
        elif country not in text_choices.Nationality.values:
            errors["country"] = ["Invalid country."]

        if not attrs.get("city"):
            errors["city"] = ["City required"]

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        try:
            instance = super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError(
                {"non_field_errors": ["An affiliation with these values already exists."]},
            )
        return instance


class RelatedUserSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "is_active",
            "first_name",
            "middle_name",
            "last_name",
            "prefix",
            "pronouns",
            "photo",
            "full_name",
        ]

    def get_photo(self, obj):
        if not obj.photo:
            return None
        try:
            photo_url = obj.photo.url
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            request = self.context.get("request")

            if request is not None:
                photo_url = request.build_absolute_uri(photo_url)

            return f"{photo_url}?t={timestamp}"
        except Exception:
            return None


class AuthorSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    abstract_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Abstract.objects.all(),
        source="abstract",
    )
    affiliation = AffiliationSerializer(read_only=True, required=False)
    affiliation_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Affiliation.objects.all(),
        source="affiliation",
        write_only=True,
        allow_null=True,
        required=False,
    )
    institution = serializers.CharField(
        write_only=True,
        allow_null=True,
        required=False,
    )
    country = serializers.CharField(
        write_only=True,
        allow_null=True,
        required=False,
    )
    city = serializers.CharField(
        write_only=True,
        allow_null=True,
        required=False,
    )
    related_user = RelatedUserSerializer(read_only=True, required=False)
    related_user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="related_user",
        write_only=True,
        allow_null=True,
        required=False,
    )

    class Meta:
        model = models.Author
        fields = [
            "id",
            "abstract_id",
            "affiliation_id",
            "related_user_id",
            "first_name",
            "last_name",
            "order",
            "email",
            "editable",
            "is_corresponding_author",
            "affiliation",
            "related_user",
            "institution",
            "country",
            "city",
        ]
        extra_kwargs = {
            "order": {
                "required": False,
                "read_only": True,
            },
        }

    def validate(self, attrs=None):
        """
        Valida los datos de entrada. related_user_id se mapea
        a related_user. abstract_id se mapea a abstract
        """

        errors = {}

        email = attrs.get("email", None)
        abstract = attrs.get("abstract")
        related_user = attrs.get("related_user", None)

        if related_user:
            email = related_user.email

        else:
            if not attrs.get("first_name"):
                errors["first_name"] = ["First name is required"]
            if not attrs.get("last_name"):
                errors["last_name"] = ["Last name is required"]

        if not email:
            errors["email"] = ["Email is required"]

        if not abstract:
            errors["abstract"] = ["An abstract instance is required"]
        else:
            queryset = models.Author.objects.exclude(pk=attrs["id"]) if attrs.get("id", None) else models.Author.objects
            email_duplicated = queryset.filter(abstract=abstract, email=email)
            if email_duplicated.exists():
                errors["email"] = ["Another author in this abstract already uses this email."]

        # si trae afiliación, se usa eso y se quitan los campos individuales
        if attrs.get("affiliation"):
            attrs.pop("institution", None)
            attrs.pop("country", None)
            attrs.pop("city", None)
        else:
            # si no trae afiliación, deben estar los 3
            if not attrs.get("institution"):
                errors["institution"] = ["Institution is required, since no existing affiliation was provided"]
            if not attrs.get("country"):
                errors["country"] = ["Country is required, since no existing affiliation was provided"]
            if not attrs.get("city"):
                errors["city"] = ["City is required, since no existing affiliation was provided"]

        if errors:
            raise serializers.ValidationError({"errors": errors})

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        """
        Al crear hay que verificar que no se repita un autor en el,
        abstract no con el mismo related_user ni con el mismo email.
        """

        abstract = validated_data.get("abstract")

        # Validar si ya se superó el límite de autores
        authors_count = abstract.authors.count()
        if authors_count >= MAX_AUTHORS_PER_ABSTRACT:
            raise serializers.ValidationError({"errors": {"root": f"Maximum of authors is {MAX_AUTHORS_PER_ABSTRACT}"}})

        validated_data["order"] = abstract.authors.count() + 1

        # Si este es corresponing author, los demás se deseleccionan
        is_corresponding_author = validated_data["is_corresponding_author"]
        if is_corresponding_author:
            abstract.authors.update(is_corresponding_author=False)

        # Si se le pasa un related user, usar sus datos de ese momento
        related_user = validated_data.get("related_user", None)
        if related_user:
            validated_data["first_name"] = related_user.first_name
            validated_data["last_name"] = related_user.last_name
            validated_data["email"] = related_user.email

        # Si se le pasa afiliación, usar la instancia, sino, crearla
        affiliation = validated_data.get("affiliation", None)
        if not affiliation:
            institution = validated_data.pop("institution")
            city = validated_data.pop("city")
            country = validated_data.pop("country")

            # TODO: usar un serializer para validar
            affiliation, created = models.Affiliation.objects.get_or_create(
                institution=institution,
                country=country,
                city=city,
            )

            validated_data["affiliation"] = affiliation

            if created:
                logger.info(f"Affiliation created: {affiliation}")
            else:
                logger.info(f"Existing affiliation instance: {affiliation}")

        try:
            instance = super().create(validated_data)
        except IntegrityError as e:
            raise serializers.ValidationError(
                {"non_field_errors": ["An affiliation with these values already exists."]},
            )

        normalize_author_order(instance.abstract)

        # transaction.set_rollback(True)
        return instance

    @transaction.atomic
    def update(self, instance, validated_data):
        instance = self.instance

        abstract = validated_data.get("abstract")

        is_corresponding_author = validated_data["is_corresponding_author"]
        if is_corresponding_author:
            abstract.authors.update(is_corresponding_author=False)

        related_user = validated_data.get("related_user", None)
        if related_user:
            validated_data["first_name"] = related_user.first_name
            validated_data["last_name"] = related_user.last_name
            validated_data["email"] = related_user.email

        affiliation_data: models.Affiliation = validated_data.pop("affiliation")
        if affiliation_data is not None:
            affiliation, _ = models.Affiliation.objects.update_or_create(
                institution=affiliation_data.institution,
                country=affiliation_data.country,
                city=affiliation_data.city,
                user=instance.abstract.user,
            )
        else:
            affiliation, _ = models.Affiliation.objects.update_or_create(
                institution=validated_data["institution"],
                country=validated_data["country"],
                city=validated_data["city"],
                user=instance.abstract.user,
            )
        validated_data["affiliation"] = affiliation

        instance = super().update(instance, validated_data)
        normalize_author_order(instance.abstract)

        # transaction.set_rollback(True)
        return instance


def normalize_author_order(abstract):
    if abstract is None:
        return

    authors = abstract.authors.order_by("order")
    for index, author in enumerate(authors, start=1):
        if author.order != index:
            author.order = index
            author.save(update_fields=["order"])


class AbstractDeclarationSerializer(serializers.ModelSerializer):
    abstract_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Abstract.objects.all(),
        source="abstract",
    )

    class Meta:
        model = models.AbstractDeclaration
        exclude = ["abstract"]
