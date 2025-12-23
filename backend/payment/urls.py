from django.urls import path
from .views import PaymentListCreateView, PaymentDetailView

urlpatterns = [
    # GET: Ver todos mis pagos
    # POST: Crear un nuevo pago
    path('payments/', PaymentListCreateView.as_view(), name='payment-list'),

    # GET: Ver detalle de un pago específico (ej: /api/payments/5/)
    path('payments/<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
]