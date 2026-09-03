import z from "zod";


const tagSchema = z.object({
    id: z.number()
        .nullable()
        .optional(),
    description: z
        .string()
        .min(1)
        .max(30)
})

const scheduledEventSchema = z.object({
    id: z.number().nullable(),
    title: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(150),
    tags: z.array(tagSchema).min(0).max(16, 'Max limit is 16'),

    lounge: z.string().trim().min(1).max(150),
    is_active: z.boolean().nullable().optional(),
    last_update: z.date().nullable().optional(),
    created_at: z.date().nullable().optional(),
    start_time: z.date().nullable().optional(),
    end_time: z.date().nullable().optional(),
})


type Resource<T> = {
    resource: {
        type: 'abstract' | 'user'
        object: T
        resource_id?: number
    }
}

type TagSchema = z.infer<typeof tagSchema>

type ScheduledEventSchema = z.infer<typeof scheduledEventSchema>

type ScheduledEvent<T = unknown> = ScheduledEventSchema & Resource<T>

export {
    scheduledEventSchema,
    type Resource,
    type ScheduledEvent,
    type ScheduledEventSchema,
    type TagSchema
};

