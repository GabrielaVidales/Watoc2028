from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Crea y guarda un usuario con el email y contraseña dados.
        """
        if not email:
            raise ValueError('El Email es obligatorio')
        
        # Normaliza el email (pone el dominio en minúsculas)
        email = self.normalize_email(email)
        
        # Crea el modelo
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Crea y guarda un Superusuario con el email y contraseña dados.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# 2. Modificamos el Modelo de Usuario
class CustomUser(AbstractUser):
    class NationalityType(models.TextChoices):
        # Norteamérica
        MX = 'MX', 'México'
        US = 'US', 'Estados Unidos'
        CA = 'CA', 'Canadá' 
        # Latinoamérica
        AR = 'AR', 'Argentina'
        BO = 'BO', 'Bolivia'
        BR = 'BR', 'Brasil'
        CL = 'CL', 'Chile'
        CO = 'CO', 'Colombia'
        CR = 'CR', 'Costa Rica'
        CU = 'CU', 'Cuba'
        DO = 'DO', 'República Dominicana'
        EC = 'EC', 'Ecuador'
        GT = 'GT', 'Guatemala'
        PE = 'PE', 'Perú'
        UY = 'UY', 'Uruguay'
        VE = 'VE', 'Venezuela'   
        # Europa
        ES = 'ES', 'España'
        DE = 'DE', 'Alemania'
        FR = 'FR', 'Francia'
        GB = 'GB', 'Reino Unido'
        IT = 'IT', 'Italia'
        PT = 'PT', 'Portugal'
        NL = 'NL', 'Países Bajos'
        RU = 'RU', 'Rusia'   
        # Asia y Oceanía
        CN = 'CN', 'China'
        JP = 'JP', 'Japón'
        KR = 'KR', 'Corea del Sur'
        IN = 'IN', 'India'
        AU = 'AU', 'Australia' 
        # Otros
        OTHER = 'OTHER', 'Otro'

    class UserType(models.TextChoices):
        STUDENT = 'STUDENT', 'Student'
        PARTICIPANT = 'PARTICIPANT', 'Participant'

    class PrefixType(models.TextChoices):
        MISS = 'Miss', 'Miss'
        MS = 'Ms.', 'Ms.'
        MRS = 'Mrs.', 'Mrs.'
        MR = 'Mr.', 'Mr.'
        DR = 'Dr.', 'Dr.'
        PROF = 'Prof.', 'Prof.'
        MX = 'Mx.', 'Mx.'      

    username = None  # < Eliminamos el campo username
    email = models.EmailField(unique=True)
    middle_name = models.CharField(max_length=150, blank=True, null=True)
    prefix = models.CharField(max_length=10, choices=PrefixType.choices, blank=True, null=True)
    pronouns = models.CharField(max_length=50, blank=True, null=True)
    secondary_email = models.EmailField(unique=True, blank=True, null=True)
    phone_number = models.CharField(max_length=20, unique=True, blank=True, null=True)

    nationality = models.CharField(
        max_length=5,
        choices=NationalityType.choices,
        default=NationalityType.MX
    )
    photo = models.ImageField(upload_to='users/photos/', blank=True, null=True)

    user_type = models.CharField(
        max_length=20,
        choices=UserType.choices,
        default=UserType.STUDENT
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # No requerimos campos extra para crear superuser

    # Asignamos el manager personalizado
    objects = CustomUserManager()

    def __str__(self):
        return self.email
