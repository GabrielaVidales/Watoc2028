import api from "@/clients/api";
import type { ScheduledEvent } from "@/features/program/types/program";


async function getScheduledEvent<T = unknown>(id: number) {
    const { data } = await api.get<ScheduledEvent<T>>(`/program/events/${id}/`)
    return data
}

async function createScheduledEvent<T = unknown>(scheduledData: ScheduledEvent<T>) {
    const { resource: { type, resource_id } } = scheduledData

    const { data } = await api.post<ScheduledEvent<T>>("/program/events/", {
        ...scheduledData,
        resource_id,
        resource_type: type,
    })
    return data
}


export {
    createScheduledEvent, getScheduledEvent
};

