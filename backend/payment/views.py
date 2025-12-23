from rest_framework import generics, permissions
from .models import Payment
from .serializers import PaymentSerializer

# VISTA 1: Listar mis pagos y Crear un nuevo pago
class PaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Esta función filtra los pagos.
        - Si eres admin (is_staff): Ves TODOS los pagos.
        - Si eres usuario normal: Ves SOLO tus pagos.
        """
        user = self.request.user
        if user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Al guardar el pago, asignamos automáticamente el usuario logueado.
        """
        serializer.save(user=self.request.user)

# VISTA 2: Ver un pago específico (solo si es tuyo)
class PaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # Reutilizamos la misma lógica de get_queryset para seguridad.
    # Si un usuario intenta ver el ID de un pago que no es suyo, dará 404.
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(user=user)
