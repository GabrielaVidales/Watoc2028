from asgiref.sync import async_to_sync
from celery import shared_task
from channels.layers import get_channel_layer
from django.core.files.base import ContentFile
from django.utils import timezone

from apps.abstracts.models import Abstract, PDFGenerationJob
from apps.abstracts.serializers import PDFGenerationJobSerializer
from apps.abstracts.services.reportlab import build_abstract_pdf

import time


def get_abstract_context(abstract: Abstract) -> dict:
    authors_data = []
    affiliations_set = {}
    unique_affiliations = []

    # Se asume que abstract fue recuperado con prefetch_related('authors__affiliation')
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

        initial = f"{author.first_name[:1]}." if author.first_name else ""
        authors_data.append(
            {
                "full_name": f"{initial} {author.last_name}".strip(),
                "aff_index": affiliations_set.get(aff_id),
            }
        )

    return {
        "file_title": abstract.get_plain_title(),
        "title_html": abstract.title or "",
        "text_html": abstract.text or "",
        "references_html": abstract.references or "",
        "authors_list": authors_data,
        "affiliations_list": unique_affiliations,
    }


def _notify_job_status(job: PDFGenerationJob, group: str, channel_layer):
    serializer = PDFGenerationJobSerializer(job)
    async_to_sync(channel_layer.group_send)(
        group,
        {
            "type": "pdf_status",
            "message": serializer.data,
        },
    )


@shared_task
def generate_abstract_pdf(job_id: str):
    job = PDFGenerationJob.objects.select_related("abstract").get(id=job_id)
    abstract = Abstract.objects.prefetch_related("authors__affiliation").get(id=job.abstract_id)
    
    channel_layer = get_channel_layer()
    group = f"pdf_job_{job_id}"

    print(f"Job ID: {job_id} | Group: {group}")
    try:
        print('Generando PDF')
        job.status = PDFGenerationJob.Status.GENERATING
        job.save(update_fields=["status"])
        
        context = get_abstract_context(abstract)
        pdf_bytes = build_abstract_pdf(context)

        print('Generación completa')
        job.file.save(
            name=f"{context['file_title']}.pdf",
            content=ContentFile(pdf_bytes),
            save=False,
        )
        job.status = PDFGenerationJob.Status.COMPLETED
        job.completed_at = timezone.now()
        job.save()

        print('Respondiendo por websocket')
        _notify_job_status(job, group, channel_layer)
        return "OK! Abstract PDF successfully generated!"

    except Exception as exc:
        job.status = PDFGenerationJob.Status.FAILED
        job.error = str(exc)
        job.save(update_fields=["status", "error"])

        _notify_job_status(job, group, channel_layer)
        raise
