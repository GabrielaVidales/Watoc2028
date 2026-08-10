import RichTextEditor, { countWordsFromHTML } from '@/components/EnrichedTextArea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Button, type ButtonProps } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroupText } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { routes } from '@/routes/routes'
import { type AbstractSchema, } from '@/schemas/abstracts/abstract-schemas'
import { createAbstractSchema, type CreateAbstractFormValues } from '@/schemas/abstracts/create-abstract-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FilePenLine, Plus, } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { createSubmission } from '@/services/submissions/submission-services'
import { DEBUG } from '@/lib/constants'


type CreateAbstractDialogProps = {
    redirect?: boolean
} & ButtonProps

export function CreateAbstractDialog({ redirect = true, ...rest }: CreateAbstractDialogProps) {
    const [open, setOpen] = useState(false)

    const { user: user } = useAuth()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { control, handleSubmit, reset } = useForm<CreateAbstractFormValues>({
        resolver: zodResolver(createAbstractSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
        }
    })

    const { mutateAsync: createAbstractAsync, isPending } = useMutation<AbstractSchema, AxiosError, CreateAbstractFormValues>({
        mutationFn: createSubmission,
        onError: error => {
            if (DEBUG) {
                console.log(error.response.data)
            }
        },
        onSuccess: (data) => {
            setOpen(false)
            redirect && navigate(routes.users.submissions.edit.build({ id: data.id }))
            queryClient.invalidateQueries({
                queryKey: ['abstract'],
            })
        }
    })

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset()
        }
        setOpen(isOpen)
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <Button onClick={() => reset()} disabled={isPending} {...rest}>
                    <Plus />
                    New Submission
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="-ml-8 md:ml-0 text-center p-3 flex size-12 md:size-14 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-3 border-primary-main/20 text-primary">
                            <FilePenLine className="text-primary-main stroke-2 size-10 md:size-12 shrink-0" />
                        </div>

                        <div className='text-left'>
                            <AlertDialogTitle className="text-xl md:text-2xl font-semibold">
                                Abstract Submissions
                            </AlertDialogTitle>
                            <p className="text-sm text-muted-foreground">
                                Add a title and create it
                            </p>
                        </div>
                    </div>
                </AlertDialogHeader>

                <Separator />

                <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                    This will create a new <b>draft submission</b>, then you can
                    enter your abstract, authors, and additional information before submitting it.
                </AlertDialogDescription>

                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='w-full'>
                            <FieldLabel htmlFor={field.name}>Abstract title</FieldLabel>
                            <FieldDescription>
                                Submission title (maximum 10 words).
                            </FieldDescription>
                            <RichTextEditor
                                {...field}
                                title='Abstract title'
                                invalid={fieldState.invalid}
                                id={field.name}
                                multiline={false}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                disabled={isPending}
                                className="wrap-anywhere text-lg"
                                maxLength={3500}
                                footer={
                                    <InputGroupText className={'ml-auto'}>
                                        <FieldLabel htmlFor={field.name} className={cn(
                                            'text-xs',
                                            (fieldState.invalid || countWordsFromHTML(field.value || "") > 10) && 'text-destructive'
                                        )}>
                                            {countWordsFromHTML(field.value || "")}/10 words
                                        </FieldLabel>
                                    </InputGroupText>
                                }
                            />
                            <div className={cn(
                                "overflow-hidden transition-all h-6 duration-200 ease-in-out",
                                fieldState.invalid ? " opacity-100" : " opacity-0"
                            )}>
                                <FieldError errors={[fieldState.error]} />
                            </div>
                        </Field>
                    )}
                />

                <Separator />

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>No</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} type='button' onClick={handleSubmit(async (v) => await createAbstractAsync(v))}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
