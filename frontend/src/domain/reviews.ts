type Status = "pending" | "accepted" | "declined" | "completed" | "cancelled"

type ReviewAssignment = {
    id: number
    last_update_timestamp: number
    created_at_timestamp: number
    due_date_timestamp: number
    user: UserDetail
    abstract: AbstractDetail
    assigned_by: UserDetail
    is_active: boolean
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
    AbstractDetail, ReviewAssignment, UserDetail
}

