from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework import serializers
from . import models, text_choices
from datetime import datetime
import bleach

User = get_user_model()


class AffiliationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="user",
        write_only=True,
    )

    class Meta:
        model = models.Affiliation
        fields = "__all__"

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
        errors = {}
        
        if not attrs.get("first_name"):
            errors["first_name"] = ["First name is required"]

        if not attrs.get("last_name"):
            errors["last_name"] = ["Last name is required"]

        email = attrs.get("email")
        if not email:
            errors["email"] = ["Email is required"]

        abstract = attrs.get("abstract")
        if not abstract:
            errors["abstract"] = ["An abstract instance is required"]
        else:
            queryset = models.Author.objects.exclude(pk=attrs['id']) if attrs.get('id', None) else models.Author.objects
            email_duplicated = queryset.filter(abstract=abstract, email=email).exists()
            if email_duplicated:
                print(email)
                errors["email"] = ["Another author in this abstract already uses this email."]

        if attrs.get("affiliation"):
            attrs.pop('institution', None)
            attrs.pop('country', None)
            attrs.pop('city', None)
        else:
            if not attrs.get("institution"):
                errors["institution"] = ["Institution is required, since no existing affiliation was provided"]
            if not attrs.get("country"):
                errors["country"] = ["Country is required, since no existing affiliation was provided"]
            if not attrs.get("city"):
                errors["city"] = ["City is required, since no existing affiliation was provided"]

        if errors:
            raise serializers.ValidationError(errors)
        return attrs

    @transaction.atomic
    def create(self, validated_data):        
        related_user = validated_data.get("related_user", None)
        if related_user:
            validated_data['first_name'] = related_user.first_name
            validated_data['last_name'] = related_user.last_name
            validated_data['email'] = related_user.email
        
        affiliation = validated_data.get("affiliation", None)
        if not affiliation:
            institution = validated_data.pop("institution")
            city = validated_data.pop("city")
            country = validated_data.pop("country")

            affiliation, created = models.Affiliation.objects.get_or_create(
                institution=institution,
                country=country,
                city=city,
            )

            print("New affiliation instance was created" if created else "Existing affiliation instance was used")
            validated_data["affiliation"] = affiliation

        abstract = validated_data.get("abstract")
        validated_data["order"] = abstract.authors.count() + 1

        instance = super().create(validated_data)
        normalize_author_order(instance.abstract)

        # transaction.set_rollback(True)
        return instance

    @transaction.atomic
    def update(self, instance, validated_data):
        instance = self.instance
        
        related_user = validated_data.get("related_user", None)
        if related_user:
            validated_data['first_name'] = related_user.first_name
            validated_data['last_name'] = related_user.last_name
            validated_data['email'] = related_user.email


        affiliation_data:models.Affiliation = validated_data.pop("affiliation")
        if affiliation_data is not None:
            affiliation, _ = models.Affiliation.objects.update_or_create(
                institution=affiliation_data.institution,
                country=affiliation_data.country,
                city=affiliation_data.city,
                user=instance.abstract.user,
            )
        else:
            affiliation, _ = models.Affiliation.objects.update_or_create(
                institution=validated_data['institution'],
                country=validated_data['country'],
                city=validated_data['city'],
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


ALLOWED_TAGS = ["p", "b", "a", "strong", "i", "s", "sup", "sub"]


class AbstractSerializer(serializers.ModelSerializer):
    authors = serializers.SerializerMethodField()
    declarations = serializers.SerializerMethodField()

    class Meta:
        model = models.Abstract
        fields = "__all__"
        read_only_fields = ["created_at", "last_update", "needs_review"]

    def get_authors(self, instance):
        return AuthorSerializer(instance.authors.all(), many=True, context=self.context).data

    def get_declarations(self, instance):
        exists = hasattr(instance, "declarations")
        if not exists:
            return {}
        return AbstractDeclarationSerializer(instance.declarations).data

    def validate_title(self, value):
        sanitized_value = bleach.clean(value, ALLOWED_TAGS, {}, strip=True)
        return sanitized_value

    def validate_text(self, value):
        sanitized_value = bleach.clean(value, ALLOWED_TAGS, {}, strip=True)
        return sanitized_value

    def validate_references(self, value):
        sanitized_value = bleach.clean(value, ALLOWED_TAGS, {}, strip=True)
        return sanitized_value

    def validate(self, attrs):
        """
        Esta validación solo se ejecuta cuando se llama al endpoint
        PATCH /api/abstracts/submissions/?/submit/ y ejecuta las
        validaciones necesarias para asegurarse de que el abstract
        está en condiciones de ser enviado a revisión
        """

        instance: models.Abstract = self.instance
        action = self.context["view"].action

        if instance and action == "submit":
            errors = {}
            if not instance.title.strip():
                errors["title"] = ["Title required"]
            if not instance.text.strip():
                errors["text"] = ["Text required"]
            if instance.authors.count() == 0:
                errors["authors"] = ["At least one author is required"]

            orders = sorted(instance.authors.values_list("order", flat=True))
            supposed = list(range(1, len(orders) + 1))
            if orders != supposed:
                errors["authors"] = ["Author's order must be continuous"]

            for author in instance.authors.all():
                if isinstance(author, models.Author):
                    if not author.first_name:
                        errors["authors"] = ["Author's first name is required"]
                    if not author.last_name:
                        errors["authors"] = ["Author's last name is required"]
                    if not author.email:
                        errors["authors"] = ["Author's email is required"]
                    if not author.affiliation:
                        errors["authors"] = ["Author's affiliation is required"]

            if not instance.references.strip():
                errors["references"] = ["Abstract references are required"]
            if instance.status == models.AbstactStatus.SUBMITTED:
                errors["status"] = ["This abstract was already submitted"]

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


"""RUN VALIDATIONS (PARECE QUE SE PUEDEN BORRAR)"""


class AbstractSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Abstract
        fields = "__all__"
        read_only_fields = ["created_at", "last_update", "needs_review"]

    def validate(self, attrs=None):
        instance: models.Abstract = self.instance
        if not instance.title.strip():
            raise serializers.ValidationError("Title required")
        if not instance.text.strip():
            raise serializers.ValidationError("Text required")
        if instance.authors.count() == 0:
            raise serializers.ValidationError("At least one author required")

        orders = sorted(instance.authors.values_list("order", flat=True))
        supposed = list(range(1, len(orders) + 1))
        if orders != supposed:
            raise serializers.ValidationError("Author's order must be continuous")

        for author in instance.authors.all():
            if isinstance(author, models.Author):
                if not author.first_name:
                    raise serializers.ValidationError("First required")
                if not author.last_name:
                    raise serializers.ValidationError("Last required")
                if not author.email:
                    raise serializers.ValidationError("Email required")

                serializer = AffiliationSerializer(author.affiliation)
                serializer.validate()

        if not instance.references.strip():
            raise serializers.ValidationError("References required")
        if instance.status == models.AbstactStatus.SUBMITTED:
            raise serializers.ValidationError("Abstract already submitted")
        return attrs


class AuthorSubmitSerializer(serializers.ListSerializer):
    class Meta:
        model = models.Author
        exclude = ["abstract"]
        extra_kwargs = {
            "order": {
                "required": False,
                "read_only": True,
            },
        }

    def validate(self, attrs=None):
        instance: models.Author = self.instance
        if not instance.abstract.authors.filter(pk=instance.pk).exist():
            raise serializers.ValidationError("Unrelated abstract data")
        return attrs
