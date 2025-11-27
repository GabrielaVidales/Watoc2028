from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash
import mongoengine as mongo
from datetime import datetime, timezone


Categorias = [
    ('participant', 'Participante'),
    ('student', 'Estudiante'),
]

Tiers = [
    ('early_bird', 'Early Bird'),
    ('regular', 'regular'),
    ('late', 'Late'),
]

class VisaStatus(mongo.EmbeddedDocument):
    required = mongo.BooleanField()
    invitation_letter = mongo.BooleanField()

class Transaction(mongo.EmbeddedDocument):
    has = mongo.BooleanField(default=True)
    token = mongo.StringField(
        required=False,
        max_length=256
    )

"""
Se puede renombrar a User y crear una subclase que
herede de User llamada Assistant (los datos se guardarían)
en el mismo Document de MongoDB pero con atributos dinámicos
según la clase
"""
class User(mongo.Document, UserMixin):
    email = mongo.EmailField(required=True, unique=True, max_length=128)
    password = mongo.StringField(required=True, min_length=8, max_length=256)
    first_name = mongo.StringField(required=True, max_length=128, min_length=1)
    last_name = mongo.StringField(required=True, max_length=128, min_length=1)
    category = mongo.StringField(choices=Categorias, default='participant')
    tier = mongo.StringField(choices=Tiers, default='regular')
    cena_congreso = mongo.BooleanField(required=True, default=False)
    visa = mongo.EmbeddedDocumentField(VisaStatus)
    transaccion = mongo.EmbeddedDocumentField(Transaction)
    fecha_registro = mongo.DateTimeField(default=datetime.now(timezone.utc))

    meta = {
        'collection': 'users',  
        'db_alias': 'default',  
        'allow_inheritance': True,
    }

    def check_password(self, value) -> bool:
        return check_password_hash(self.password, value)

    def __init__(self, first_name=None, last_name=None, email=None,
                 category='participant', tier='regular', cena_congreso=False,
                 visa=None, transaccion=None, *args, **kwargs) -> str:
        super().__init__(
            *args,
            first_name=first_name,
            last_name=last_name,
            email=email,
            category=category,
            tier=tier,
            cena_congreso=cena_congreso,
            visa=visa,
            transaccion=transaccion,
            **kwargs
        )

    def __str__(self) -> str:
        return (
            f"Assistant("
            f"id={getattr(self, 'id', None)}, "
            f"name={self.first_name} {self.last_name}, "
            f"email={self.email}, "
            f"category={self.category}, "
            f"tier={self.tier}, "
            f"cena_congreso={self.cena_congreso}"
            f")"
        )


"""
Esta subclase hereda de usuario pero además
se le pondrían atributos únicos para los Assistant
"""
class Assistant(User):
    pass

class ContactRequest(mongo.Document):
    first_name = mongo.StringField(required=True, max_length=128)
    last_name = mongo.StringField(required=True, max_length=128,    )
    email = mongo.EmailField(required=True)
    inquiry = mongo.StringField(required=True, max_length=512)
    request_type = mongo.IntField(required=True, choices=[0,1,2,3,4])
    contact_date = mongo.DateTimeField(default=datetime.now(timezone.utc))

    meta = {
        'collection': 'contact_request',  
        'db_alias': 'default',  
    }

    def __init__(self, first_name=None, last_name=None, email=None, request_type=None, inquiry=None, *args, **kwargs):
        super().__init__( *args, first_name=first_name, last_name=last_name, email=email, request_type=request_type, inquiry=inquiry, **kwargs)

    def __str__(self) -> str:
        return (
            f"ContactRequest("
            f"id={getattr(self, 'id', None)}, "
            f"name={self.first_name} {self.last_name}, "
            f"email={self.email}, "
            f"request_type={self.request_type}, "
            f"contact_date={self.contact_date}"
            f")"
        ) 


class Sponsor(mongo.Document):
    first_name = mongo.StringField()
    last_name = mongo.StringField() 
    organization = mongo.StringField()
    email = mongo.EmailField()
    sponsor_tier = mongo.IntField(
        choices=[0,1,2,3],
        default=0,
    )
    visa = mongo.EmbeddedDocumentField(VisaStatus)
    transaccion = mongo.EmbeddedDocumentField(Transaction)
    cena_congreso = mongo.BooleanField(
        required=True,
        default=False
    )
    fecha_registro = mongo.DateTimeField(required=True)

