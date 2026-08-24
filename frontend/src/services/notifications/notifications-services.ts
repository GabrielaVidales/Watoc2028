import api from "@/clients/api";
import type { Notification } from "@/domain/notifications";


async function toggleIsReadNotification(ctx: { id: number, is_read: boolean }) {
    const { data } = await api.patch<Notification>(`/notifications/${ctx.id}/toggle-is-read/`, { is_read: ctx.is_read });
    return data;
}

async function deleteNotification(id: number) {
    const { data } = await api.delete<void>(`/notifications/${id}/`);
    return data;
}

export {
    deleteNotification, toggleIsReadNotification
};

