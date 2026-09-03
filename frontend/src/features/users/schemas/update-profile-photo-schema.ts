import z from "zod";

export const changePhotoSchema = z.object({
    profilePictureUrl: z.string().nullable().optional(),
    profilePicture: z
        .instanceof(File, { message: 'Archivo inválido' })
        .nullable()
        .optional(),
    profilePictureDeleted: z.boolean().optional(),
})

export type ChangePhotoFormValues = z.infer<typeof changePhotoSchema>
