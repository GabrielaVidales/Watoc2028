# # users/serializers.py
# from rest_framework import serializers
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'email', 'first_name', 'last_name']

# class RegisterSerializer(serializers.ModelSerializer):
#     # Mapeamos los campos de React (camelCase) a los del modelo Django (snake_case)
#     firstName = serializers.CharField(source='first_name', required=True)
#     lastName = serializers.CharField(source='last_name', required=True)
#     password = serializers.CharField(write_only=True, style={'input_type': 'password'})

#     class Meta:
#         model = User
#         # Estos son los campos que API aceptará y devolverá
#         fields = ['email', 'firstName', 'lastName', 'password']

#     def create(self, validated_data):
#         # validated_data ya tendrá las claves 'first_name' y 'last_name' 
#         # gracias al parametro source definido arriba.
#         user = User.objects.create_user(
#             email=validated_data['email'],
#             password=validated_data['password'],
#             first_name=validated_data.get('first_name', ''),
#             last_name=validated_data.get('last_name', '')
#         )
#         return user

from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'password', 'first_name', 'last_name', 
            'middle_name', 'prefix', 'pronouns', 'secondary_email', 
            'phone_number', 'nationality', 'photo', 'user_type', 
            'date_joined'
        ]
        # Configuraciones extra de seguridad
        extra_kwargs = {
            'password': {'write_only': True}, # Nunca devolver el password en la respuesta
            'photo': {'required': False}      # La foto puede ser opcional al registrarse
        }

    def create(self, validated_data):
        """
        Sobrescribimos el método create para usar create_user
        y que la contraseña se encripte correctamente.
        """
        password = validated_data.pop('password', None)
        # Instanciamos el modelo con los datos validados
        instance = self.Meta.model(**validated_data)
        
        if password is not None:
            instance.set_password(password) # Encripta el password
        
        instance.save()
        return instance

    def update(self, instance, validated_data):
        """
        Opcional: Si permites actualizar password en el mismo endpoint
        """
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if password is not None:
            instance.set_password(password)
            
        instance.save()
        return instance