import type { UserSchema } from "@/features/users/schemas/user-schemas";

export type PDFGenerationJob = {
    id: string;
    abstract: number
    abstract_detail?: {
        id: number
        title: string
        plain_title: string
        user: UserSchema
    };
    content_hash: string;
    status: "pending" | "generating" | "completed" | "failed";
    file: string | null;
    error: string | null;
    created_at: string;
    completed_at: string | null;
}