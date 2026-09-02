import { scheduledEventSchema, type ScheduledEvent } from "@/domain/program";
import { set } from "date-fns";
import z from "zod";


export const scheduledEventFormSchema = scheduledEventSchema
    .pick({
        id: true,
        title: true,
        description: true,
        lounge: true,
        tags: true,
    })
    .extend({
        date: z.date(),

        start_time: z.iso.time({ precision: -1 }),
        end_time: z.iso.time({ precision: -1 }),

        resource_type: z.enum(['abstract', 'user']),
        resource_id: z.number(),
    })
    .transform(data => {
        const startDate = set(
            data.date,
            {
                hours: Number(data.start_time.split(':')[0]),
                minutes: Number(data.start_time.split(':')[1]),
                seconds: 0,
                milliseconds: 0,
            }
        )

        const endDate = set(
            data.date,
            {
                hours: Number(data.end_time.split(':')[0]),
                minutes: Number(data.end_time.split(':')[1]),
                seconds: 0,
                milliseconds: 0,
            }
        )

        const value: ScheduledEvent = {
            title: data.title,
            description: data.description,
            lounge: data.lounge,
            tags: data.tags,
            start_time: startDate,
            end_time: endDate,
            resource: {
                type: data.resource_type,
                resource_id: data.resource_id,
                object: null,
            },
            is_active: true,
        }
        return value
    })

type ScheduleEventFormInputValues = z.input<typeof scheduledEventFormSchema>

type ScheduleEventFormOutputValues = z.output<typeof scheduledEventFormSchema>


export {
    scheduledEventSchema,
    type ScheduleEventFormInputValues,
    type ScheduleEventFormOutputValues
};

