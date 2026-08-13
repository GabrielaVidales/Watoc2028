import type { UserSchema } from "@/schemas/user-schemas"
import type { PaginatedResponse } from "./pagination"

type UserDetail = Omit<UserSchema, 'roles' | 'participant' | 'email_verified'>

type Notification = {
    id?: number
    user: UserDetail
    actor: UserDetail
    message: string
    urlpath: string
    is_read: boolean
    created_at: number
}

type NotificationResponse = {
    notifications: PaginatedResponse<Notification>
    unread_count: number
}


export type {
    Notification, NotificationResponse, UserDetail
}
