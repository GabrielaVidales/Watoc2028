# from django.test import TestCase

# Create your tests here.
from weasyprint import HTML

html_content = """
    <h1>¡Funciona en Windows!</h1>
    <p>Este PDF fue generado con <b>WeasyPrint</b>.</p>
"""
HTML(string=html_content).write_pdf("resultado.pdf")

print("PDF creado exitosamente.")