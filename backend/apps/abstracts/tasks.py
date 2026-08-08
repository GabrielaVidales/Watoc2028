from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.files.base import ContentFile
from django.template.loader import render_to_string
from apps.abstracts.models import Abstract, PDFGenerationJob
from apps.abstracts.serializers import PDFGenerationJobSerializer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import html, os

User = get_user_model()


@shared_task
def generate_abstract_pdf(job_id):
    job = PDFGenerationJob.objects.get(id=job_id)
    print(job.content_hash)

    channel_layer = get_channel_layer()
    group = f"pdf_job_{job_id}"

    context = get_abstract_context(job.abstract)
    from weasyprint import HTML, CSS

    try:
        # Antes de empezar se guarda el job como GENERANDO...
        job.status = PDFGenerationJob.Status.GENERATING
        job.save(update_fields=["status"])

        html_string = render_to_string("abstract_template.html", context)
        path_to_css = os.path.join(settings.BASE_DIR, "static", "css", "abstract_styles.css")
        path_to_static = os.path.join(settings.BASE_DIR, "static")
        html_file = HTML(string=html_string, base_url=path_to_static)

        pdf_bytes = html_file.write_pdf(stylesheets=[CSS(filename=path_to_css)])
        pdf_file = ContentFile(pdf_bytes)

        job.file.save(
            name=f'{context["file_title"]}.pdf',
            content=pdf_file,
            save=False,
        )
        job.status = PDFGenerationJob.Status.COMPLETED
        job.completed_at = timezone.now()
        job.save()

        serializer = PDFGenerationJobSerializer(job)
        # Notificar por websocket
        async_to_sync(channel_layer.group_send)(
            group,
            {
                "type": "pdf_status",
                "message": serializer.data,
            },
        )
        return f"OK! Abstract PDF successfully generated!"

    except Exception as exc:

        job.status = PDFGenerationJob.Status.FAILED
        job.error = str(exc)

        job.save()

        serializer = PDFGenerationJobSerializer(job)
        # Si falla notificar por websocket
        async_to_sync(channel_layer.group_send)(
            group,
            {
                "type": "pdf_status",
                "message": serializer.data,
            },
        )
        raise


def get_abstract_context(abstract: Abstract):
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
                    "text": f"{aff.institution}, {aff.city}, {aff.get_country_display()}",
                }
            )
            counter += 1
        authors_data.append(
            {
                "full_name": f"{author.first_name[0]}. {author.last_name}",
                "aff_index": affiliations_set.get(aff_id),
            }
        )

    abstract.title = html.unescape(abstract.title)
    abstract.text = html.unescape(abstract.text)
    abstract.references = html.unescape(abstract.references)

    return {
        "file_title": abstract.get_plain_title(),
        "abstract": abstract,
        "authors_list": authors_data,
        "affiliations_list": unique_affiliations,
    }
