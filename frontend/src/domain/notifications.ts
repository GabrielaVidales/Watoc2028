import type { UserSchema } from "@/schemas/user-schemas"

type UserDetail = Omit<UserSchema, 'roles' | 'participant' | 'email_verified'>

type Notification = {
    id?: number
    recipient: UserDetail
    actor: UserDetail
    message: string
    target_url: string
    is_read: boolean
    created_at: number
}

type NotificationResponse = {
    notifications: Notification[]
    unread_count: number
}


export type {
    NotificationResponse,
    Notification,
    UserDetail
}