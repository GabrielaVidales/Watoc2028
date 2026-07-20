type Status = "pending" | "accepted" | "declined" | "completed" | "cancelled"

type ReviewAssignment = {
    id: number
    status: Status
    last_update: number
    created_at: number
    user: UserDetail
    abstract: AbstractDetail
    assigned_by: UserDetail
}


interface UserDetail {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    prefix: string;
    photo: string;
    full_name: string;
}

interface AbstractDetail {
    id: number;
    title: string;
    presentation_type: "poster" | "oral" | string; // Añadido literal por si hay más tipos comunes
    created_at: string; // ISO Date String
    last_update: string; // ISO Date String
    last_review_at: string | null;
}


export type {
    ReviewAssignment,
    AbstractDetail,
    UserDetail
}