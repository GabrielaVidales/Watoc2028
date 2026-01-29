from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.conf import settings

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

# Modelo de Usuario
class CustomUser(AbstractUser):
    class NationalityType(models.TextChoices):
        #region --- NORTEAMÉRICA ---
        MX = 'MX', 'México'
        US = 'US', 'United States'
        CA = 'CA', 'Canada'
        #endregion
        #region --- LATINOAMÉRICA ---
        AR = 'AR', 'Argentina'
        BO = 'BO', 'Bolivia'
        BR = 'BR', 'Brazil'
        CL = 'CL', 'Chile'
        CO = 'CO', 'Colombia'
        CR = 'CR', 'Costa Rica'
        CU = 'CU', 'Cuba'
        DO = 'DO', 'Dominican Republic'
        EC = 'EC', 'Ecuador'
        GT = 'GT', 'Guatemala'
        HN = 'HN', 'Honduras'
        NI = 'NI', 'Nicaragua'
        PA = 'PA', 'Panama'
        PY = 'PY', 'Paraguay'
        PE = 'PE', 'Peru'
        PR = 'PR', 'Puerto Rico'
        SV = 'SV', 'El Salvador'
        UY = 'UY', 'Uruguay'
        VE = 'VE', 'Venezuela'
        #endregion
        #region --- EUROPA ---
        AD = 'AD', 'Andorra'
        AL = 'AL', 'Albania'
        AT = 'AT', 'Austria'
        AX = 'AX', 'Alland Islands'
        BA = 'BA', 'Bosnia and Herzegovina'
        BE = 'BE', 'Belgium'
        BG = 'BG', 'Bulgaria'
        BY = 'BY', 'Belarus'
        CH = 'CH', 'Switzerland'
        CY = 'CY', 'Cyprus'
        CZ = 'CZ', 'Czech Republic'
        DE = 'DE', 'Germany'
        DK = 'DK', 'Denmark'
        EE = 'EE', 'Estonia'
        ES = 'ES', 'Spain'
        FI = 'FI', 'Finland'
        FO = 'FO', 'Faroe Islands'
        FR = 'FR', 'France'
        GB = 'GB', 'United Kingdom'
        GE = 'GE', 'Georgia'
        GG = 'GG', 'Guernsey'
        GI = 'GI', 'Gibraltar'
        GR = 'GR', 'Greece'
        HR = 'HR', 'Croatia'
        HU = 'HU', 'Hungary'
        IE = 'IE', 'Ireland'
        IM = 'IM', 'Isle of Man'
        IS = 'IS', 'Iceland'
        IT = 'IT', 'Italy'
        JE = 'JE', 'Jersey'
        LI = 'LI', 'Liechtenstein'
        LT = 'LT', 'Lithuania'
        LU = 'LU', 'Luxembourg'
        LV = 'LV', 'Latvia'
        MC = 'MC', 'Monaco'
        MD = 'MD', 'Moldova'
        ME = 'ME', 'Montenegro'
        MK = 'MK', 'Macedonia'
        MT = 'MT', 'Malta'
        NL = 'NL', 'Netherlands'
        NO = 'NO', 'Norway'
        PL = 'PL', 'Poland'
        PT = 'PT', 'Portugal'
        RO = 'RO', 'Romania'
        RS = 'RS', 'Serbia'
        RU = 'RU', 'Russian Federation'
        SE = 'SE', 'Sweden'
        SI = 'SI', 'Slovenia'
        SJ = 'SJ', 'Svalbard and Jan Mayen'
        SK = 'SK', 'Slovakia'
        SM = 'SM', 'San Marino'
        UA = 'UA', 'Ukraine'
        VA = 'VA', 'Holy See (Vatican City State)'
        XK = 'XK', 'Kosovo'
        #endregion
        #region --- ASIA ---
        AE = 'AE', 'United Arab Emirates'
        AF = 'AF', 'Afghanistan'
        AM = 'AM', 'Armenia'
        AZ = 'AZ', 'Azerbaijan'
        BD = 'BD', 'Bangladesh'
        BH = 'BH', 'Bahrain'
        BN = 'BN', 'Brunei Darussalam'
        BT = 'BT', 'Bhutan'
        CN = 'CN', 'China'
        HK = 'HK', 'Hong Kong'
        ID = 'ID', 'Indonesia'
        IN = 'IN', 'India'
        IQ = 'IQ', 'Iraq'
        IR = 'IR', 'Iran'
        IL = 'IL', 'Israel'
        JO = 'JO', 'Jordan'
        JP = 'JP', 'Japan'
        KG = 'KG', 'Kyrgyzstan'
        KH = 'KH', 'Cambodia'
        KP = 'KP', 'North Korea'
        KR = 'KR', 'South Korea'
        KW = 'KW', 'Kuwait'
        KZ = 'KZ', 'Kazakhstan'
        LA = 'LA', 'Laos'
        LB = 'LB', 'Lebanon'
        LK = 'LK', 'Sri Lanka'
        MM = 'MM', 'Myanmar'
        MN = 'MN', 'Mongolia'
        MO = 'MO', 'Macao'
        MV = 'MV', 'Maldives'
        MY = 'MY', 'Malaysia'
        NP = 'NP', 'Nepal'
        OM = 'OM', 'Oman'
        PH = 'PH', 'Philippines'
        PK = 'PK', 'Pakistan'
        PS = 'PS', 'Palestine'
        QA = 'QA', 'Qatar'
        SA = 'SA', 'Saudi Arabia'
        SG = 'SG', 'Singapore'
        SY = 'SY', 'Syrian Arab Republic'
        TH = 'TH', 'Thailand'
        TJ = 'TJ', 'Tajikistan'
        TL = 'TL', 'Timor-Leste'
        TM = 'TM', 'Turkmenistan'
        TR = 'TR', 'Turkey'
        TW = 'TW', 'Taiwan'
        UZ = 'UZ', 'Uzbekistan'
        VN = 'VN', 'Vietnam'
        YE = 'YE', 'Yemen'
        #endregion
        #region --- ÁFRICA ---
        AO = 'AO', 'Angola'
        BF = 'BF', 'Burkina Faso'
        BI = 'BI', 'Burundi'
        BJ = 'BJ', 'Benin'
        BW = 'BW', 'Botswana'
        CD = 'CD', 'Congo (Dem. Rep.)'
        CF = 'CF', 'Central African Republic'
        CG = 'CG', 'Congo (Rep.)'
        CI = 'CI', "Cote d'Ivoire"
        CM = 'CM', 'Cameroon'
        CV = 'CV', 'Cape Verde'
        DJ = 'DJ', 'Djibouti'
        DZ = 'DZ', 'Algeria'
        EG = 'EG', 'Egypt'
        EH = 'EH', 'Western Sahara'
        ER = 'ER', 'Eritrea'
        ET = 'ET', 'Ethiopia'
        GA = 'GA', 'Gabon'
        GH = 'GH', 'Ghana'
        GM = 'GM', 'Gambia'
        GN = 'GN', 'Guinea'
        GQ = 'GQ', 'Equatorial Guinea'
        GW = 'GW', 'Guinea-Bissau'
        KE = 'KE', 'Kenya'
        KM = 'KM', 'Comoros'
        LR = 'LR', 'Liberia'
        LS = 'LS', 'Lesotho'
        LY = 'LY', 'Libya'
        MA = 'MA', 'Morocco'
        MG = 'MG', 'Madagascar'
        ML = 'ML', 'Mali'
        MR = 'MR', 'Mauritania'
        MU = 'MU', 'Mauritius'
        MW = 'MW', 'Malawi'
        MZ = 'MZ', 'Mozambique'
        NA = 'NA', 'Namibia'
        NE = 'NE', 'Niger'
        NG = 'NG', 'Nigeria'
        RE = 'RE', 'Reunion'
        RW = 'RW', 'Rwanda'
        SC = 'SC', 'Seychelles'
        SD = 'SD', 'Sudan'
        SH = 'SH', 'Saint Helena'
        SL = 'SL', 'Sierra Leone'
        SN = 'SN', 'Senegal'
        SO = 'SO', 'Somalia'
        SS = 'SS', 'South Sudan'
        ST = 'ST', 'Sao Tome and Principe'
        SZ = 'SZ', 'Swaziland'
        TD = 'TD', 'Chad'
        TG = 'TG', 'Togo'
        TN = 'TN', 'Tunisia'
        TZ = 'TZ', 'Tanzania'
        UG = 'UG', 'Uganda'
        YT = 'YT', 'Mayotte'
        ZA = 'ZA', 'South Africa'
        ZM = 'ZM', 'Zambia'
        ZW = 'ZW', 'Zimbabwe'
        #endregion
        #region --- OCEANÍA ---
        AS = 'AS', 'American Samoa'
        AU = 'AU', 'Australia'
        CK = 'CK', 'Cook Islands'
        FJ = 'FJ', 'Fiji'
        FM = 'FM', 'Micronesia'
        GU = 'GU', 'Guam'
        KI = 'KI', 'Kiribati'
        MH = 'MH', 'Marshall Islands'
        MP = 'MP', 'Northern Mariana Islands'
        NC = 'NC', 'New Caledonia'
        NR = 'NR', 'Nauru'
        NU = 'NU', 'Niue'
        NZ = 'NZ', 'New Zealand'
        PF = 'PF', 'French Polynesia'
        PG = 'PG', 'Papua New Guinea'
        PW = 'PW', 'Palau'
        SB = 'SB', 'Solomon Islands'
        TK = 'TK', 'Tokelau'
        TO = 'TO', 'Tonga'
        TV = 'TV', 'Tuvalu'
        VU = 'VU', 'Vanuatu'
        WF = 'WF', 'Wallis and Futuna'
        WS = 'WS', 'Samoa'
        #endregion
        #region --- OTROS / ISLAS ---
        AG = 'AG', 'Antigua and Barbuda'
        AI = 'AI', 'Anguilla'
        AQ = 'AQ', 'Antarctica'
        AW = 'AW', 'Aruba'
        BB = 'BB', 'Barbados'
        BM = 'BM', 'Bermuda'
        BS = 'BS', 'Bahamas'
        BV = 'BV', 'Bouvet Island'
        BZ = 'BZ', 'Belize'
        CC = 'CC', 'Cocos Islands'
        CW = 'CW', 'Curacao'
        CX = 'CX', 'Christmas Island'
        DM = 'DM', 'Dominica'
        FK = 'FK', 'Falkland Islands'
        GD = 'GD', 'Grenada'
        GF = 'GF', 'French Guiana'
        GL = 'GL', 'Greenland'
        GP = 'GP', 'Guadeloupe'
        GS = 'GS', 'South Georgia'
        GY = 'GY', 'Guyana'
        HM = 'HM', 'Heard Island'
        HT = 'HT', 'Haiti'
        IO = 'IO', 'British Indian Ocean Territory'
        JM = 'JM', 'Jamaica'
        KN = 'KN', 'Saint Kitts and Nevis'
        KY = 'KY', 'Cayman Islands'
        LC = 'LC', 'Saint Lucia'
        MF = 'MF', 'Saint Martin'
        MQ = 'MQ', 'Martinique'
        MS = 'MS', 'Montserrat'
        NF = 'NF', 'Norfolk Island'
        PM = 'PM', 'Saint Pierre and Miquelon'
        PN = 'PN', 'Pitcairn'
        SR = 'SR', 'Suriname'
        SX = 'SX', 'Sint Maarten'
        TC = 'TC', 'Turks and Caicos Islands'
        TF = 'TF', 'French Southern Territories'
        TT = 'TT', 'Trinidad and Tobago'
        VC = 'VC', 'Saint Vincent and the Grenadines'
        VG = 'VG', 'British Virgin Islands'
        VI = 'VI', 'US Virgin Islands'
        #endregion
        OTHER = 'OTHER', 'Otro'

    class UserType(models.TextChoices):
        PARTICIPANT = 'PARTICIPANT', 'Participant'
        STUDENT = 'STUDENT', 'Student'
        

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

    nationality = models.CharField(
        max_length=5,
        choices=NationalityType.choices,
        default=NationalityType.MX
    )
    photo = models.ImageField(upload_to='users/photos/', blank=True, null=True)

    user_type = models.CharField(
        max_length=20,
        choices=UserType.choices,
        default=UserType.PARTICIPANT
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # No requerimos campos extra para crear superuser

    # Asignamos el manager personalizado
    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
class PasswordResetCode(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.code}"    
