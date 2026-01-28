from rest_framework import serializers
from django.contrib.auth import get_user_model
from utils.mixins import EmptyStringToNoneMixin
from django.contrib.auth.password_validation import validate_password
from .models import PasswordResetCode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from datetime import timedelta
from participants.models import Participant
from participants.serializers import ParticipantSerializer

User = get_user_model()

class CustomUserSerializer(EmptyStringToNoneMixin, serializers.ModelSerializer):

    participant_profile = ParticipantSerializer(required=False)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'password', 'first_name', 'last_name', 
            'middle_name', 'prefix', 'pronouns', 'nationality', 'photo', 'user_type', 'participant_profile'
        ]
        # Configuraciones extra de seguridad
        extra_kwargs = {
            'password': {'write_only': True}, 
            'photo': {'required': False}  
        }

    def create(self, validated_data):
        """
        La creación del usuario
        y su perfil de participante en una sola transacción.
        """
        participant_data = validated_data.pop('participant_profile', None)
        password = validated_data.pop('password', None)
        # Instanciamos el modelo con los datos validados
        instance = self.Meta.model(**validated_data)
        
        if password is not None:
            instance.set_password(password) # Encripta el password

        instance.save()    

        if participant_data:
            Participant.objects.create(user=instance, **participant_data)     
          
        return instance
    
class CustomUserUpdateSerializer(EmptyStringToNoneMixin, serializers.ModelSerializer):
    participant_profile = ParticipantSerializer(required=False)
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 
            'middle_name', 'prefix', 'pronouns', 'nationality', 'photo', 'user_type', 'participant_profile'
        ]
        # Configuraciones extra de seguridad
        extra_kwargs = {
            'photo': {'required': False} 
        }    
    def update(self, instance, validated_data):
        """
        instance: Es el objeto User que se está editando.
        validated_data: Es el diccionario con los datos nuevos.
        """
        participant_data = validated_data.pop('participant_profile', None)
        instance = super().update(instance, validated_data)

        # --- Actualización del Participante (Participant) ---
        if participant_data:
            participant, created = Participant.objects.get_or_create(user=instance)
            for attr, value in participant_data.items():
                setattr(participant, attr, value)
            
            participant.save()

        return instance    
        

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required = True, write_only=True) 
    new_password = serializers.CharField(required = True, write_only=True, validators=[validate_password])  

    def validate_old_password(self,value):
        user = self.context['request'].user
        print("user:",user)

        if not user.check_password(value):
            raise serializers.ValidationError("Your current password is incorrect.")  
        return value

    def validate(self, data):
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError("The new password must be different from your previous password.") 
        return data
   
    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()  
        return instance
    
class RequestResetCodeSerializer(serializers.Serializer):
    email = serializers.EmailField(required = True, write_only= True)
    
    def validate_email(self, value):
        if value is None or value=="":
            raise serializers.ValidationError("This field cannot be empty")
        if not User.objects.filter(email= value).exists():
            raise serializers.ValidationError("There is no user with this email addres.")
        return value
    
class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    verification_code = serializers.CharField(max_length=6,required = True)

    def validate(self, data):
        email = data.get('email')
        code = data.get('verification_code')
        

        # Buscamos el código en la BD
        try:
            user = User.objects.get(email=email)
            reset_code = PasswordResetCode.objects.get(user=user)
            current_time= timezone.now()   
        except (User.DoesNotExist, PasswordResetCode.DoesNotExist):
            raise serializers.ValidationError("Datos inválidos.")

        if reset_code.code != code:
            raise serializers.ValidationError("El código de verificación es incorrecto.")
        
        if reset_code.created_at + timedelta(minutes=15) < current_time:
            raise serializers.ValidationError("Tu código de verificación a experido.")
                        
        # Opcional: Aquí podrías verificar si 'reset_code.created_at' expiró (ej. > 15 min)

        return data    

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, min_length=8)
    uidb64 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    def validate(self, data):
        uidb64 = data.get('uidb64')
        token = data.get('token')
        password = data.get('password')

        # 1. Decodificar el UID para obtener el usuario
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Token inválido o usuario no encontrado.")

        # 2. Verificar que el token sea válido para ese usuario
        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError("El token es inválido o ha expirado.")

        # Guardamos el usuario en el contexto para usarlo en la vista o save()
        self.user = user
        return data             
    
# class RecoveryPassword(serializers.Serializer):
#     verification_code = serializers.CharField(max_length=6, required = True, write_only=True)

#     def validate_verification_code(self,value):
#         if value is None or value=="":
#             raise serializers.ValidationError("This field cannot be empty")
        
#         if not value.isdigit():
#             raise serializers.ValidationError("The verification code must only be digit")
#         return value
    
#     def validate(self,data):
#         correct_code = "123445"
#         input_code = data.get('verification_code')
#         if input_code !=  correct_code:
#             raise serializers.ValidationError("Your verification code is incorrect")
        
#         return data
    
    
        