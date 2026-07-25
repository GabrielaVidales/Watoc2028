from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class Pagination(PageNumberPagination):
    max_page_size = 100
    last_page_strings = ("last", "end", "final", "nether")

    def get_page_size(self, request):
        try:
            return min(int(request.query_params.get("limit", 10)), self.max_page_size)
        except (TypeError, ValueError):
            return 10

    def get_paginated_response(self, data):
        return Response(
            {
                "meta": {
                    "page": self.page.number,
                    "page_size": self.get_page_size(self.request),
                    "from": self.page.start_index(),
                    "to": self.page.end_index(),
                    "total_pages": self.page.paginator.num_pages,
                    "total_items": self.page.paginator.count,
                    "has_next": self.page.has_next(),
                    "has_previous": self.page.has_previous(),
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "results": data,
            }
        )
