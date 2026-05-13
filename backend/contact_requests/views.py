from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ContactRequest
from .serializers import ContactRequestSerializer
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings

from .tasks import send_mail_async

class ContactRequestListCreateView(generics.ListCreateAPIView):
    queryset = ContactRequest.objects.all().order_by("-created_at")
    serializer_class = ContactRequestSerializer

    def get_permissions(self):
        """
        Lógica personalizada de permisos:
        - POST (Crear mensaje): Cualquiera puede hacerlo (AllowAny).
        - GET (Ver lista): Solo administradores (IsAdminUser).
        """
        if self.request.method == "POST":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @transaction.atomic
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance: ContactRequest = serializer.save()
            transaction.on_commit(lambda: self.on_post_commit(instance.pk))
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def on_post_commit(self, instance_id):
        instance = ContactRequest.objects.get(pk=instance_id)
        subject = f"Solicitud de Contacto: {instance.subject} - {instance.firstName} {instance.lastName}"
        message = f"""
        Estimado administrador,

        Se ha recibido una nueva solicitud de contacto a través del sitio web. 
        A continuación se detallan los datos del remitente:

        -------------------------------------------------------
        INFORMACIÓN DEL CONTACTO
        -------------------------------------------------------
        • Nombre:   {instance.firstName} {instance.lastName}
        • Correo:   {instance.email}
        • Asunto:   {instance.subject}
        -------------------------------------------------------

        MENSAJE DEL USUARIO:
        "{instance.message}"

        -------------------------------------------------------
        Saludos,
        Tu Sistema de Notificaciones.
        """
        try:
            print("--- Intentando enviar correo... ---")
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.DEFAULT_FROM_EMAIL],
                fail_silently=False,
            )
            print("--- CORREO ENVIADO ---")
        except Exception as e:
            print(f"--- ERROR AL ENVIAR: {e} ---")


@api_view(http_method_names=['GET'])
def test_celery(request):
    
    send_mail_async.delay(
        subject='Prueba',
        message='ASDASDASDADASD',
        recipient_list=[
            'eduardo1582000@gmail.com'
        ],
    )

    return Response(status=status.HTTP_200_OK)
