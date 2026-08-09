from django.conf import settings
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
import  os


def generate_pdf(context):
    html_string = render_to_string("abstract_template.html", context)
    path_to_css = os.path.join(settings.BASE_DIR, "static", "css", "abstract_styles.css")
    path_to_static = os.path.join(settings.BASE_DIR, "static")
    html_file = HTML(string=html_string, base_url=path_to_static)

    pdf_bytes = html_file.write_pdf(stylesheets=[CSS(filename=path_to_css)])
