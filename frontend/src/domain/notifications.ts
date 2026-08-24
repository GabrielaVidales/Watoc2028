import type { UserSchema } from "@/schemas/user-schemas"
import type { PaginatedResponse } from "./pagination"

type UserDetail = Partial<UserSchema>

type Notification = {
    id?: number
    user: UserDetail | null
    actor: UserDetail | null
    message: string
    urlpath: string
    is_read: boolean
    created_at: number
}

type NotificationResponse = {
    notifications: PaginatedResponse<Notification>
    unread_count: number
}



function isNotification(value: unknown): value is Notification {
    if (typeof value !== "object" || value === null) return false

    const notification = value as Record<string, unknown>

    const isUserDetail = (value: unknown): value is UserDetail =>
        value === null ||
        (typeof value === "object" && value !== null)

    return (
        (notification.id === undefined || typeof notification.id === "number") &&
        isUserDetail(notification.user) &&
        isUserDetail(notification.actor) &&
        typeof notification.message === "string" &&
        typeof notification.urlpath === "string" &&
        typeof notification.is_read === "boolean" &&
        typeof notification.created_at === "number"
    )
}

export {
    isNotification,
    type Notification,
    type NotificationResponse,
    type UserDetail
}

