from django.test import TestCase
from apps.abstracts.models import Abstract
from apps.abstracts.services.submission import (
    validate_abstract_for_submission,
)
from django.core.exceptions import ValidationError



class AbstractSubmissionTest(TestCase):

    def test_abstract_with_invalid_author_cannot_be_submitted(self):
        abstract = Abstract.objects.all()
        
        for a in abstract:
            try:
               validate_abstract_for_submission(a)
            except ValidationError as e:
                print(f'Error ID={a.pk}: {e}')
                