from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    # Usamos ReadOnlyField para mostrar el email del usuario, 
    # pero que no se pueda modificar enviando un JSON.
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Payment
        fields = ['id', 'user_email', 'status', 'transaction_token', 'created_at']
        read_only_fields = ['id', 'created_at', 'user_email'] 
        # 'user' se asigna en la vista, no aquí.