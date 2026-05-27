import { Controller, FormProvider, useForm, useFormContext, useWatch, } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, } from "@/components/ui/field"
import { useEffect, useMemo, useRef, useState } from "react"
import 'react-image-crop/dist/ReactCrop.css';
import '@/components/upload-file.css'
import ImageUpload, { type ImageUploadRef } from "@/components/upload-file"
import { changePhotoSchema, type ChangePhotoFormValues } from "@/schemas/update-profile-photo-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { PhotoCropDialog } from "./photo-crop-dialog"
import { Save, Trash2 } from "lucide-react"
import { Spinner } from "@/components/ui/spinner";

type Props = {
    data?: ChangePhotoFormValues
}

export function ChangePhotoForm({ data }: Props) {
    const form = useForm<ChangePhotoFormValues>({
        resolver: zodResolver(changePhotoSchema),
        defaultValues: {
            profilePicture: null,
            profilePictureDeleted: false,
            profilePictureUrl: ''
        }
    })

    const { handleSubmit, reset } = form

    const onFormSubmit = handleSubmit(async (data) => {
        console.log(data);
        if (data.profilePictureDeleted) {
            console.log('Borrando foto');
        } else if (data.profilePicture) {
            console.log('Guardando foto');
        }


    })

    useEffect(() => {
        if (data) {
            reset(data)
        }
    }, [data, reset])

    return (
        <FormProvider {...form}>
            <form id="change-photo-form" onSubmit={onFormSubmit}>
                <ProfilePictureForm />
            </form>
        </FormProvider>
    )
}


export function ProfilePictureForm() {
    const form = useFormContext<ChangePhotoFormValues>()
    const { control, handleSubmit, clearErrors, setError, setValue, formState: { isDirty, isSubmitting } } = form

    const imageUploadRef = useRef<ImageUploadRef>(null);
    const [open, setOpen] = useState(false)
    const [imgSrc, setImgSrc] = useState('');

    const profilePicture = useWatch({
        control,
        name: 'profilePictureUrl'
    });
    const deleted = useWatch({
        control,
        name: 'profilePictureDeleted'
    })
    const uploadedFile = useWatch({
        control,
        name: 'profilePicture'
    })

    const preview = useMemo(() => {
        if (deleted === true) {
            return ''
        }
        else if (profilePicture) {
            return profilePicture
        }
        return ''
    }, [profilePicture, deleted])

    return (
        <fieldset disabled={isSubmitting} className='flex items-center gap-10'>
            <div className="size-40">
                <Controller
                    name='profilePicture'
                    control={control}
                    defaultValue={null}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="w-full h-full">
                            <ImageUpload
                                className="w-full h-full shrink-0"
                                ref={imageUploadRef}
                                file={field.value}
                                overridePreview={preview as string}
                                aria-invalid={fieldState.invalid}
                                maxSize={1048576 * 10}
                                onRejected={errors => {
                                    errors[0].errors.map(error => {
                                        setError('profilePicture', {
                                            type: error.code,
                                            message: error.message
                                        })
                                    })
                                }}
                                onDelete={() => {
                                    setValue('profilePictureDeleted', true)
                                }}
                                onChange={(file) => {
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            clearErrors('profilePicture')
                                            setImgSrc(reader.result?.toString() || '')
                                            setOpen(true)
                                        }
                                        reader.readAsDataURL(file);
                                    } else {
                                        field.onChange(null)
                                    }
                                }}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                            <PhotoCropDialog
                                open={open}
                                image={imgSrc}
                                onClose={() => setOpen(false)}
                                onConfirm={(file) => {
                                    setValue('profilePictureDeleted', false)
                                    field.onChange(file)
                                    setOpen(false)
                                }}
                            />
                        </Field>
                    )}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Button
                    type="button"
                    variant="main"
                    onClick={() => imageUploadRef.current?.open()}
                    className="text-lg"
                >
                    Cambiar foto
                </Button>

                <span className="text-muted-foreground">Accepted files: JPG, PNG, WebP</span>
                {uploadedFile && (
                    <div>
                        <Button variant='link' type='submit' className='text-destructive'>
                            <Trash2 data-icon='inline-start' />
                            Remove
                        </Button>
                    </div>
                )}
                <Button
                    type='submit'
                    form='change-photo-form'
                    disabled={!isDirty}
                >
                    {isSubmitting ? <Spinner /> : <Save />}
                    Save Changes
                </Button>
            </div>
        </fieldset>
    )
}
