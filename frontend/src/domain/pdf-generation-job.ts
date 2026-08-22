
export type PDFGenerationJob = {
    id: string;
    abstract: number;
    content_hash: string;
    status: "pending" | "generating" | "completed" | "failed";
    file: string | null;
    error: string | null;
    created_at: string;
    completed_at: string | null;
}