from django.http import HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
from weasyprint import HTML, CSS

from rest_framework.decorators import api_view
from rest_framework.request import Request
import os

from users.models import Abstract

@api_view(http_method_names=["get"])
def generate_pdf(request: Request):
    abstract = Abstract.objects.prefetch_related("authors__affiliation").get(id=1)
    context = get_abstract_context(abstract)

    html_string = render_to_string("abstract_template.html", context)
    path_to_css = os.path.join(settings.BASE_DIR, "static", "css", "abstract_styles.css")
    path_to_static = os.path.join(settings.BASE_DIR, "static")
    html = HTML(string=html_string, base_url=path_to_static)

    pdf_file = html.write_pdf(
        stylesheets=[CSS(filename=path_to_css)],
    )

    response = HttpResponse(pdf_file, content_type="application/pdf")
    response["Content-Disposition"] = f'inline; filename="{abstract.title or f'abstract_{abstract}'}.pdf"'
    return response


def get_abstract_context(abstract):
    authors_data = []
    affiliations_set = {}
    unique_affiliations = []

    counter = 1

    for author in abstract.authors.all():
        aff = author.affiliation
        aff_id = aff.id if aff else None
        if aff_id and aff_id not in affiliations_set:
            affiliations_set[aff_id] = counter
            unique_affiliations.append(
                {
                    "index": counter,
                    "text": f"{aff.institute}, {aff.department}, {aff.city}, {aff.get_nationality_display()}",
                }
            )
            counter += 1
        
        authors_data.append({
            'full_name': f"{author.first_name[0]}. {author.last_name}",            
            'aff_index': affiliations_set.get(aff_id), 
            # 'is_corresponding': author.is_corresponding
        })
        
    return {
        'abstract': abstract,
        'authors_list': authors_data,
        'affiliations_list': unique_affiliations
    }
