import type { Filter } from "@/components/reui/filters";

export interface PaginatedResponse<T> {
    meta: {
        page: number;
        page_size: number;
        from: number;
        to: number;
        total_pages: number;
        total_items: number;
        has_next: boolean;
        has_previous: boolean;
        next: string | null;
        previous: string | null;
    };
    results: T[];
}

export interface PaginatedRequest {
    page?: number,
    filters?: Filter[],
    itemsPerPage?: number
    search?: string
}
