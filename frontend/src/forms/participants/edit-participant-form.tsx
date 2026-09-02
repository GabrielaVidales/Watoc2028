import { notify } from '@/components/custom/notify'
import TableFileUploader from '@/components/reui/table-upload'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { participantFormSchema, type ParticipantFormSchema, type ParticipantSchema } from '@/domain/participants'
import type { FileMetadata } from '@/hooks/use-file-upload'
import { DEBUG, feePlans } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { getParticipantData, getStudentProofFile, saveParticipantData, saveStudentProofFile } from '@/services/auth/auth-services'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { FileUpIcon, GraduationCap, RotateCcwIcon, UploadIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Fragment, useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'


type Props = {
    participantId?: number
}

function EditParticipantForm({ participantId = null }: Props) {
    const [studentProof, setStudentProof] = useState<FileMetadata[]>([])
    const [loadingFileData, setLoadingFileData] = useState(false);

    const saveFileMutation = useMutation<void, AxiosError, [number, File]>({
        mutationFn: ([id, student_proof]) => saveStudentProofFile(id, student_proof),
        onError: error => {
            notify.destructive('Something went wrong!', {
                description: `Student proof couldn't be saved: ${error.message}`
            })
        },
        onSuccess: () => {
            notify.success('Student proof file saved successfully!')
        }
    })

    const saveMutation = useMutation<ParticipantSchema, AxiosError, ParticipantFormSchema>({
        mutationFn: saveParticipantData,
        onError: error => {
            DEBUG && console.log(error.response.data);
            notify.destructive('Something went wrong!', {
                description: `Participant information couldn't be saved: ${error.message}`
            })
        },
        onSuccess: () => {
            notify.success('Participant information saved successfully!')
        }
    })

    const defaultValues: ParticipantFormSchema = {
        city: '',
        country: '',
        field_of_study: '',
        job_title: '',
        needs_invitation_letter: false,
        invitation_letter: null,
        student_proof: null,
        user: null,
        fee_plan_id: null,
    }

    const {
        control,
        handleSubmit,
        reset,
        formState: {
            isSubmitting,
            isDirty,
            isValid,
        }
    } = useForm<ParticipantFormSchema>({
        resolver: zodResolver(participantFormSchema),
        mode: 'all',
        defaultValues,
    })

    const onFormSubmit = handleSubmit(
        async validData => {
            if (!data) {
                notify.destructive('Invalid request', {
                    description: 'This form has no data.'
                })
                return
            }

            const {
                invitation_letter,
                student_proof,
                ...updateFields
            } = validData

            saveMutation.mutate(updateFields)

            if (student_proof) {
                saveFileMutation.mutate([validData.user, student_proof])
            }
        },
        invalidData => DEBUG && console.log(invalidData)
        
    )

    const { data } = useQuery<ParticipantSchema>({
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        queryKey: ['participant', 'edit', participantId],
        queryFn: () => getParticipantData(participantId),
        enabled: !!participantId
    })

    useEffect(() => {
        if (data) {
            const asyncSet = async () => {
                let file: File = null
                try {
                    setLoadingFileData(true)

                    if (data.student_proof) {
                        file = await getStudentProofFile(data.student_proof)

                        setStudentProof([{
                            name: file.name,
                            id: data.student_proof,
                            size: file.size,
                            type: file.type,
                            url: data.student_proof
                        }])
                    }

                } catch (error) {
                    console.log('Error fetching file data: ', error);
                } finally {
                    setLoadingFileData(false)
                }

                reset({
                    city: data.city || '',
                    country: data.country ?? '',
                    field_of_study: data.field_of_study || '',
                    job_title: data.job_title ?? '',
                    needs_invitation_letter: data.needs_invitation_letter ?? false,
                    student_proof: file,
                    user: data.user ?? null,
                    invitation_letter: null,
                })
            }

            asyncSet()
            return
        }

        setStudentProof([])
        reset(defaultValues)
    }, [reset, data])

    const formDisabled = isSubmitting || loadingFileData || saveMutation.isPending || saveFileMutation.isPending

    const fee_plan_id = useWatch({
        control,
        name: 'fee_plan_id',
    })

    const hasStudentFee = [3, 4, 5].includes(fee_plan_id)

    return (
        <form id='edit-participant-form' onSubmit={onFormSubmit}>
            <h2 className='text-2xl font-medium text-primary-main mb-4'>Registration Fee</h2>

            <fieldset className='space-y-12' disabled={formDisabled || !data}>
                <FieldLegend>The in-person registration fee includes</FieldLegend>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                    {items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>

                <Controller
                    name="fee_plan_id"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldSet data-invalid={fieldState.invalid}>
                            <FieldLegend variant="label">Select a congress fees</FieldLegend>
                            <FieldDescription>
                                All congress fees are listed and paid in Mexican currency (MX)
                                and include full participation in WATOC 2025. The fees cover
                                attendance at all congress sessions, refreshments at the opening
                                on Sunday, coffee during breaks, and refreshments at the three
                                poster sessions.
                            </FieldDescription>
                            <RadioGroup
                                name={field.name}
                                value={`${field.value}`}
                                onValueChange={value => field.onChange(Number(value))}
                                className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 mt-8"
                            >
                                {feePlans.map(item => {
                                    const errors = false;

                                    const formatter = new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: item.currency,
                                    })

                                    return (
                                        <FieldLabel
                                            key={item.id}
                                            htmlFor={item.id}
                                            className={cn(
                                                "cursor-pointer border-2! border-input/50 bg-card",
                                                "hover:border-primary-light",
                                                "hover:bg-primary-light/5",
                                                "has-data-[state=checked]:border-primary-main",
                                                "has-data-[state=checked]:bg-primary-main/10!",
                                                "transition-all duration-150 hover:-translate-y-1 hover:shadow-md",
                                                errors && "border-destructive! hover:border-destructive! bg-destructive/5 has-data-[state=checked]:bg-destructive/10!",
                                            )}
                                        >
                                            <Field data-invalid={errors} orientation="vertical">
                                                <div className="relative flex items-start justify-between gap-2">
                                                    <RadioGroupItem className='absolute top-0 right-0' value={`${item.value}`} id={item.id} />

                                                    <FieldContent>
                                                        <FieldTitle className={cn(
                                                            "font-semibold text-lg gap-1",
                                                            errors ? 'text-destructive' : 'text-primary-main'
                                                        )}>
                                                            {item.title}{" "}
                                                            {item.student_fee && (
                                                                <GraduationCap className={cn(
                                                                    'size-4', errors
                                                                    ? 'text-destructive fill-destructive/50' :
                                                                    'text-primary-main fill-primary-light/50'
                                                                )} />
                                                            )}
                                                        </FieldTitle>
                                                        <FieldContent>
                                                            <FieldDescription className="text-sm font-medium">
                                                                {item.description}
                                                            </FieldDescription>
                                                            <FieldDescription className="text-sm italic">
                                                                {item.label}
                                                            </FieldDescription>
                                                        </FieldContent>
                                                    </FieldContent>

                                                    <div className={cn(
                                                        "flex p-2 shrink-0 items-center justify-center rounded-xl border-2 mt-auto", errors
                                                        ? "border-destructive bg-destructive/10"
                                                        : "border-primary-main/20 bg-primary-light/20",
                                                    )}>
                                                        <span
                                                            className={cn(
                                                                'text-sm', errors
                                                                ? 'text-destructive'
                                                                : 'text-primary-main',
                                                            )}
                                                        >
                                                            {formatter.format(item.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Field>
                                        </FieldLabel>
                                    )
                                })}
                            </RadioGroup>
                        </FieldSet>
                    )}
                />

                <AnimatePresence>
                    {hasStudentFee && (
                        <motion.div
                            key={'will-assist'}
                            initial={{ opacity: 0, height: 0, scale: 0.5 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.5 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className='overflow-hidden'
                        >
                            <Separator />
                            <div className='h-12' />

                            <div className="flex gap-2 items-center mb-4">
                                <FileUpIcon className='text-primary-main' />
                                <h2 className='text-2xl font-medium'>Student Fees:</h2>
                            </div>

                            <Controller
                                name='student_proof'
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Upload your Student Proof of Enrollment</FieldLabel>
                                        <FieldDescription className='text-[13px]'>
                                            The resident/PhD student status must be confirmed by a formal declaration
                                            (incl. start and end date of the residency/PhD programme) in English language
                                            from the Head of Department or the responsible for the training programme.
                                            All documents must be issued in 2026.
                                        </FieldDescription>
                                        <FieldContent className="mx-auto w-full space-y-4 mt-2">
                                            <TableFileUploader
                                                maxFiles={1}
                                                multiple={false}
                                                accept='.pdf'
                                                defaultFiles={studentProof}
                                                onFilesChange={files => {
                                                    if (files.length === 0) {
                                                        field.onChange(null);
                                                        return
                                                    }
                                                    field.onChange(files[0] ? files[0].file : null)
                                                }}
                                            />
                                        </FieldContent>
                                    </Field>
                                )}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <Separator />

                <Controller
                    name="needs_invitation_letter"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldSet data-invalid={fieldState.invalid}>
                            <FieldLegend variant="label">Invitation letter for Visa purposes</FieldLegend>
                            <FieldDescription className='text-[13px]'>
                                14<sup>th</sup> WATOC 2028 Trienal Congress will take place in Mexico.
                                Participants from certain countries may require a visa to enter the country.
                                Citizens of the European Union (EU) and many other nationalities may not require
                                a visa for short stays, but attendees are advised to verify the entry requirements
                                that apply to their nationality.
                            </FieldDescription>
                            <FieldGroup data-slot="checkbox-group">
                                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                    <Checkbox
                                        id={field.name}
                                        name={field.name}
                                        aria-invalid={fieldState.invalid}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className='size-5'
                                    />
                                    <FieldContent>
                                        <FieldLabel htmlFor={field.name} className="font-normal cursor-pointer inline">
                                            Mark if yoy need an invitation letter.
                                        </FieldLabel>
                                        <p className='text-[13px] italic text-muted-foreground'>
                                            * Invitation letters for visa purposes can only be sent to participants
                                            who have completed the registration process.
                                        </p>
                                    </FieldContent>
                                </Field>
                            </FieldGroup>

                        </FieldSet>
                    )}
                />

                <div className={"flex w-fit items-center gap-3 ml-auto"}>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => reset()}
                        disabled={!isDirty || formDisabled}
                    >
                        <RotateCcwIcon className='text-muted-foreground' /> Reset
                    </Button>

                    <Button
                        type="submit"
                        form="edit-participant-form"
                        // disabled={!isValid || !isDirty || formDisabled}
                        onClick={onFormSubmit}
                    >
                        {formDisabled ? (
                            <Fragment>
                                <Spinner />
                                <span>{loadingFileData ? 'Loading...' : 'Saving...'}</span>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <UploadIcon />
                                <span>{(isDirty && isValid) ? 'Save changes' : 'No Changes'}</span>
                            </Fragment>
                        )}
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}

export default EditParticipantForm


const items = [
    "Admission to all scientific sessions, including plenary lectures, invited talks, and contributed presentations",
    "Access to poster sessions presenting current research in theoretical and computational chemistry",
    "Participation in networking and social events during the congress",
    "Coffee breaks and lunches during the official congress days",
    "Congress materials (delegate badge, final programme, and conference materials)",
    "Access to conference abstracts and digital congress resources",
]
