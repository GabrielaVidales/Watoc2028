import { useAuth } from '@/features/auth/contexts/AuthContext'
import React, { useRef, useState, type HTMLAttributes } from 'react'
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { UploadFile } from '@/components/UploadFile';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profilePicSchema } from '@/features/users/schemas/user-schemas';
import { Field, FieldContent, FieldError, FieldTitle } from '@/components/ui/field';
import { centerCrop, makeAspectCrop, ReactCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import api from '@/clients/api';
import { Save, Trash2 } from 'lucide-react';
import { GalleryUpload } from '@/components/ui/file-upload';
import { AvatarUpload } from '@/components/ui/upload-avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Briefcase, GraduationCap, Calendar, ShieldCheck } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';

export function UserPictureForm() {
    const { fetchUser, user: user } = useAuth()

    const { handleSubmit, reset, control, formState: { isValid, isSubmitting } } = useForm({
        resolver: zodResolver(profilePicSchema),
        defaultValues: {
            photo: null,
        }
    })

    const onFormSubmit = handleSubmit(async (data) => {
        await api.post('/users/change-profile-pic/', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        await fetchUser()
        reset()
    })

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset className='space-y-5' disabled={isSubmitting}>

                <Controller
                    name='photo'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldTitle>Upload or change your profile photo</FieldTitle>
                            <FieldContent></FieldContent>
                            <AvatarUpload
                                onFileChange={(files) => {
                                    field.onChange(files?.file || null)
                                }}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />


                <Card className="w-full max-w-md mx-auto overflow-hidden border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950 rounded-2xl">
                    {/* Header/Banner Minimalista */}
                    <div className="h-24 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

                    <CardHeader className="relative pb-4 pt-0 px-6">
                        {/* Avatar flotante */}
                        <div className="absolute -top-12 left-6">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-md dark:border-zinc-950">
                                <AvatarImage src={user.photo as string} alt={user.full_name} className="object-cover" />
                                <AvatarFallback className="bg-zinc-100 font-bold text-zinc-800 text-xl">
                                    {user.first_name?.[0]}
                                    {user.last_name?.[0]}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Roles / Badges */}
                        <div className="flex justify-end gap-1.5 pt-4">
                            {user.roles.map((role) => (
                                <Badge
                                    key={role}
                                    variant={role === 'admin' ? 'destructive' : 'secondary'}
                                    className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full"
                                >
                                    {role}
                                </Badge>
                            ))}
                        </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-6 space-y-6">
                        {/* Información Principal */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                    {user.prefix && <span className="text-zinc-400 font-medium mr-1">{user.prefix}</span>}
                                    {user.full_name}
                                </h2>
                                {user.email_verified && (
                                    <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                                )}
                            </div>
                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                {user.participant?.job_title || 'User'}
                            </p>
                        </div>

                        <hr className="border-zinc-100 dark:border-zinc-800" />

                        {/* Detalles del Perfil */}
                        <div className="space-y-3.5 text-sm text-zinc-600 dark:text-zinc-400">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-zinc-400" />
                                <span className="truncate">{user.email}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-zinc-400" />
                                <span>
                                    {user.city}, {user.nationality}
                                </span>
                            </div>

                            {user.participant?.affiliation && (
                                <div className="flex items-center gap-3">
                                    <Briefcase className="h-4 w-4 text-zinc-400" />
                                    <span>{user.participant.affiliation}</span>
                                </div>
                            )}

                            {user.participant?.field_of_study && (
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="h-4 w-4 text-zinc-400" />
                                    <span className="font-mono text-xs bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-100 dark:border-zinc-800">
                                        {user.participant.field_of_study}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Footer / Info de Registro */}
                        <div className="flex items-center justify-between pt-2 text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Joined {formatDate(user.date_joined)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>



                {/* 
                <Controller
                    name='photo'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldTitle>Upload or change your profile photo</FieldTitle>
                            <FieldContent>
                                <UploadFile
                                    maxSize={1048576 * 10}
                                    onChange={(e) => {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            clearErrors('photo')
                                            setImgSrc(reader.result?.toString() || '')
                                            setOpen(true)
                                        }
                                        reader.readAsDataURL(e[0]);
                                    }}
                                    onRejected={errors => {
                                        errors[0].errors.map(error => {
                                            setError('photo', {
                                                type: 'custom',
                                                message: error.message
                                            })
                                        })
                                    }}
                                />
                            </FieldContent>
                            {field.value && (
                                <FieldContent className='flex w-full items-center justify-center text-center gap-4 py-2'>
                                    <div className='flex flex-col items-center flex-1'>
                                        <span className='font-semibold text-sm'>Uploaded picture</span>
                                        <ImagePreview file={field.value as File} className='w-40' />
                                        <Button variant='link' type='button' onClick={() => field.onChange(null)} className='text-destructive'>
                                            <Trash2 data-icon='inline-start' />
                                            Remove
                                        </Button>
                                    </div>
                                </FieldContent>
                            )}
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Crop Your Photo</DialogTitle>
                                        <DialogDescription>Drag and scale to fit your face within the square</DialogDescription>
                                        <DialogDescription asChild>
                                            <div className='space-y-5'>
                                                <div className="relative flex items-center justify-center bg-gray-300 rounded-md border-2 border-gray-500 overflow-hidden">
                                                    <ReactCrop
                                                        crop={crop}
                                                        onChange={(c) => setCrop(c)}
                                                        onComplete={(c) => setCompletedCrop(c)}
                                                        aspect={1}
                                                        className='max-h-90 flex items-center justify-center'
                                                    >
                                                        <img
                                                            ref={imgRef}
                                                            src={imgSrc}
                                                            className="max-h-40 w-auto object-contain"
                                                            onLoad={(e) => {
                                                                const { width, height } = e.currentTarget;
                                                                setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1, width, height), width, height));
                                                            }}
                                                        />
                                                    </ReactCrop>
                                                </div>

                                            </div>
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button className='' onClick={async () => {
                                            if (!imgRef.current || !completedCrop) return;

                                            const canvas = document.createElement('canvas');
                                            canvas.width = completedCrop.width;
                                            canvas.height = completedCrop.height;
                                            const ctx = canvas.getContext('2d');

                                            const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
                                            const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

                                            if (ctx) {
                                                ctx.imageSmoothingEnabled = true
                                                ctx.imageSmoothingQuality = 'high'
                                                ctx.drawImage(
                                                    imgRef.current,
                                                    completedCrop.x * scaleX,
                                                    completedCrop.y * scaleY,
                                                    completedCrop.width * scaleX,
                                                    completedCrop.height * scaleY,
                                                    0, 0, completedCrop.width, completedCrop.height
                                                );

                                                canvas.toBlob((blob) => {
                                                    if (blob) {
                                                        const file = new File([blob], 'cropped.webp', { type: 'image/webp' });
                                                        field.onChange(file);
                                                        setOpen(false)
                                                    }
                                                }, 'image/webp');
                                            }
                                        }}>
                                            Crop image
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </Field>
                    )}
                /> */}


                <div className='flex justify-end'>
                    <Button type='submit' className='p-5 w-60 uppercase' disabled={!isValid}>
                        {isSubmitting ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <Save data-icon="inline-start" />
                        )}
                        Save changes
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}

const ImagePreview = ({ file, className }: { file?: File } & HTMLAttributes<HTMLDivElement>) => {
    const [previewURL, setPreviewURL] = React.useState('')
    React.useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewURL(url)
        }
        return () => {
            if (previewURL) {
                URL.revokeObjectURL(previewURL)
            }
        }
    }, [file])

    return (<>
        {previewURL && (
            <img
                src={previewURL}
                alt="Previsualización de imagen"
                className={cn('bg-white object-cover border-2 border-foreground/50 rounded-lg overflow-hidden', className)}
            />
        )}
    </>)
}