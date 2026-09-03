import { UploadFile } from '@/components/UploadFile'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from '@/components/ui/separator'
import { useRegistrationStore } from '@/data/store'
import { selectFeeSchema, type SelectFeeValues } from "@/features/participants/schemas/select-fee-schema"
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileCheck, FileText, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'


type FeeOption = {
    name: string
    description: string
    amount: string
    value: string
}

const feeOptions: FeeOption[] = [
    {
        name: 'Participant',
        amount: '$ 9900.00 MXN',
        description: 'Regular fee',
        value: 'regular'
    },
    {
        name: 'PhD Student',
        amount: '$ 7200.00 MXN',
        description: 'A proof of student status is required to confirm eligibility for the discounted fee.',
        value: 'student'
    },
]

const letterOptions = [
    {
        label: 'No thanks, I do not require a letter of invitation.',
        value: 'false'
    },
    {
        label: 'Yes, I do require a letter of invitation.',
        value: 'true'
    },
]


export default function SelectFeeForm() {
    const { setData, setStudentProof, getStudentProof, fee } = useRegistrationStore()

    const { control, watch, handleSubmit, reset, formState: { isSubmitting} } = useForm<SelectFeeValues>({
        resolver: zodResolver(selectFeeSchema),
        defaultValues: {
            plan: undefined,
            studentProof: undefined,
            invitationLetter: null
        }
    })

    const isStudent = watch('plan')

    const onFormSubmit = handleSubmit(async (data) => {
        if (import.meta.env.DEV) {
            console.log('Saving in localforage:')
            console.log(data)
        }
        await setStudentProof(data.studentProof)
        setData({ fee: data })
    })

    const setDefaultValues = async () => {
        if (fee) {
            const file = await getStudentProof()
            reset({
                ...fee,
                studentProof: file
            })
        }
    }

    useEffect(() => {
        if (!useRegistrationStore.persist.hasHydrated) return
        setDefaultValues()
    }, [useRegistrationStore.persist.hasHydrated, fee])


    const items = [
        "Admission to all scientific sessions, including plenary lectures, invited talks, and contributed presentations",
        "Access to poster sessions presenting current research in theoretical and computational chemistry",
        "Participation in networking and social events during the congress",
        "Coffee breaks and lunches during the official congress days",
        "Congress materials (delegate badge, final programme, and conference materials)",
        "Access to conference abstracts and digital congress resources",
    ]

    return (
        <form id='select-fee-form' onSubmit={onFormSubmit} className='pb-5'>
            <fieldset disabled={isSubmitting} className='space-y-10'>
                <Controller
                    name="plan"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldSet>
                            <FieldLegend>The in-person registration fee includes</FieldLegend>
                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                {items.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            <RadioGroup
                                name={field.name}
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                                defaultChecked={false}
                            >
                                {feeOptions.map(fee => (
                                    <FieldLabel key={fee.value} htmlFor={fee.value} className='cursor-pointer'>
                                        <Field orientation="horizontal" className='flex justify-between'>
                                            <RadioGroupItem value={fee.value} id={fee.value} />

                                            <FieldContent>
                                                <FieldTitle>{fee.name}</FieldTitle>
                                                <FieldDescription>
                                                    {fee.description}
                                                </FieldDescription>
                                            </FieldContent>

                                            <div>
                                                <div className='p-2 bg-black/5 rounded-lg border'>
                                                    <p>Amount</p>
                                                    <p className='font-normal'>{fee.amount}</p>
                                                </div>
                                            </div>
                                        </Field>
                                    </FieldLabel>
                                ))}
                            </RadioGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </FieldSet>
                    )}
                />

                <Separator className='my-9 bg-input' />

                {isStudent === 'student' && (<>
                    <Controller
                        name='studentProof'
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLegend>Student Proof</FieldLegend>
                                <FieldDescription className='text-balance text-primary'>
                                    The resident/PhD student status must be confirmed by a formal declaration (incl. start and end date of the residency/PhD programme) in English language from the Head of Department or the responsible for the training programme. All documents must be issued in 2026.
                                    An example declaration can be downloaded from the following link: Sample of Resident Proof
                                </FieldDescription>
                                <FieldContent className="max-w-lg mx-auto w-full space-y-3 mt-8">
                                    <UploadFile
                                        accept={{ "application/pdf": [".pdf"] }}
                                        onChange={(files) => field.onChange(files[0])}
                                        icon={FileText}
                                        className={cn(fieldState.invalid ? 'error' : '')}
                                    />
                                    <div className="flex items-center gap-3 border-2 border-input rounded-md p-3 bg-muted/40">
                                        <div className="flex items-center justify-center size-9 rounded-md bg-primary/10">
                                            <FileCheck className="size-4 text-primary" />
                                        </div>

                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="text-xs text-muted-foreground">
                                                Uploaded file
                                            </span>

                                            <div className='flex gap-2 items-center'>
                                                <Input placeholder="No file uploaded" readOnly value={field.value?.name || ''} aria-invalid={fieldState.invalid} />

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    type="button"
                                                    onClick={() => field.onChange(null)}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </div>

                                    </div>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldContent>
                            </Field>
                        )}
                    />

                    <Separator className='my-9 bg-input' />
                </>)}

                <Controller
                    name="invitationLetter"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldSet>
                            <FieldLegend>Invitation Letter</FieldLegend>
                            <FieldDescription>
                                <span className='text-primary'>
                                    Do you require a letter of invitation for visa purposes?
                                </span>
                                <br />
                                Please note: the WATOC 2028 Congress will take place in Mexico.
                                Participants from certain countries may require a visa to enter the country.
                                Citizens of the European Union (EU) and many other nationalities may not require a visa for short stays,
                                but attendees are advised to verify the entry requirements that apply to their nationality.
                            </FieldDescription>
                            <RadioGroup
                                name={field.name}
                                value={field.value === null ? '' : String(field.value)}
                                onValueChange={value => {
                                    if (value === 'true') {
                                        field.onChange(true)
                                    } else if (value === 'false') {
                                        field.onChange(false)
                                    } else {
                                        field.onChange(null)
                                    }
                                }}
                            >
                                {letterOptions.map((fee, index) => (
                                    <FieldLabel key={index} htmlFor={fee.value} className='cursor-pointer'>
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <RadioGroupItem value={fee.value} id={fee.value} aria-invalid={fieldState.invalid} />
                                            <FieldContent>
                                                <FieldTitle>{fee.label}</FieldTitle>
                                            </FieldContent>
                                        </Field>
                                    </FieldLabel>
                                ))}
                            </RadioGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </FieldSet>
                    )}
                />
            </fieldset>
        </form>
    )
}
