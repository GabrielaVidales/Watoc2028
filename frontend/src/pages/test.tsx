import api from '@/clients/api'
import AdaptableTooltip from '@/components/custom/adaptable-tooltip'
import { notify } from '@/components/custom/notify'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet, FieldTitle, } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from '@/components/ui/separator'
import { ConfirmProvider, useConfirm } from '@/contexts/ConfirmationDialogContext'
import { GenericConfirmProvider, useGenericConfirm } from '@/contexts/GenericConfirmationContext'
import ReviewAssignmentForm from '@/forms/reviews/review-assignment-form'
import { cn } from '@/lib/utils'
import { routes } from '@/routes/routes'
import type { AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import { getSubmissionById } from '@/services/submissions/submission-services'
import { ChartColumnIncreasingIcon, LightbulbIcon, SparklesIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import DownloadAbstractPDFButton from './test/test-abstract-feature'


const presentationOptions = [
    {
        value: "plus",
        id: "plus-plan",
        title: "Oral Presentation",
        description: "Present your research orally during the congress.",
        icon: LightbulbIcon,
    },
    {
        value: "pro",
        id: "pro-plan",
        title: "Poster",
        description: "Present your research as a scientific poster.",
        icon: ChartColumnIncreasingIcon,
    },
    {
        value: "enterprise",
        id: "enterprise-plan",
        title: "Young WATOC",
        description: "Submit your work to the Young WATOC program.",
        icon: SparklesIcon,
    },
];


function TestPage() {
    const navigate = useNavigate()

    const errors = false

    return (
        <div className='bg-muted h-full'>
            <div className='max-w-sm mx-auto w-full space-y-4 py-4'>
                <Card className='w-full mx-auto'>
                    <CardHeader>
                        <CardTitle>Review Assignment</CardTitle>
                        <CardDescription>
                            View, create, edit, or remove author records for your submission.
                        </CardDescription>
                    </CardHeader>

                    <Separator />

                    <CardContent>
                        <Button onClick={() => {
                            const variants = ["default", "success", "warning", "destructive", "info"];
                            variants.forEach((v) => {
                                notify[v]('Something went wrong!!', {
                                    description: 'Chingada puta de mierda cagada.',
                                })
                            });
                        }}>
                            Toast
                        </Button>

                        <Button onClick={async () => {
                            try {
                                const results = await Promise.all([
                                    api.get('/users/session'),
                                    api.get('/users/session'),
                                    api.get('/users/session'),
                                    api.get('/users/session'),
                                    api.get('/users/session'),
                                ]);

                                console.log('✅ ¡Éxito! Todas las peticiones respondieron:', results);
                            } catch (error) {
                                console.error('❌ Una o más peticiones fallaron:', error);
                            }

                        }}>
                            Test refresh token
                        </Button>

                        <Button onClick={() => {
                            navigate(routes.auth.login, {
                                state: {
                                    code: 'account-created',
                                    title: 'Verify your email address',
                                    email: 'data@email.com',
                                    description:
                                        "We've sent a new verification link to your email address. Please check your inbox and spam folder."
                                }
                            })

                            const email = "data@email.com"
                            notify.success('Verify your email address', {
                                description: (
                                    <span>
                                        We've sent a new verification link to your email address{" "}
                                        <span className='font-bold'>{email}</span>.{" "}
                                        Please check your inbox and spam folder.
                                    </span>
                                )
                            })
                        }}>
                            Nav state
                        </Button>
                    </CardContent>
                </Card>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent
                        onInteractOutside={(e) => e.preventDefault()}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                        className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
                    >
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you&apos;re
                                done.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="-mx-4 no-scrollbar max-h-[60vh] px-4">
                            <ReviewAssignmentForm />
                        </div>

                        <div className="max-sm:text-xs text-xs text-muted-foreground">
                            <span className="font-semibold">Note:</span>{" "}
                            Each abstract submission can only be assigned to <strong>one reviewer</strong> at a time.
                            If the submission has already been assigned, you must remove the current assignment before assigning it to another reviewer.
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button form='review-assignment-form' type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <DownloadAbstractPDFButton abstractId={38} />

                <div className='flex justify-between items-center gap-3 mt-6'>
                    <ConfirmProvider>
                        <TestButtonComponent />
                    </ConfirmProvider>

                    <GenericConfirmProvider>
                        <TestComponent />
                    </GenericConfirmProvider>
                </div>
            </div>

            <div className='max-w-2xl w-full mx-auto'>
                <Card>
                    <CardContent>
                        <FieldSet>
                            <FieldLegend variant='label' className='flex items-center gap-2 mb-1'>
                                Presentation Type
                                <AdaptableTooltip
                                    content='Pinche puta'
                                    triggerClassName='text-primary'
                                />
                            </FieldLegend>
                            <FieldDescription>
                                Choose your preferred presentation type
                            </FieldDescription>
                            <RadioGroup aria-invalid defaultValue="plus" className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">

                                {presentationOptions.map(item => (
                                    <FieldLabel
                                        key={item.id}
                                        htmlFor={item.id}
                                        className={cn(
                                            "cursor-pointer border-2!",
                                            "hover:border-primary-light",
                                            "has-data-[state=checked]:border-primary-main",
                                            "has-data-[state=checked]:bg-primary-main/5!",
                                            "transition-all duration-150 hover:-translate-y-1 hover:shadow-md",
                                            errors && "border-destructive! hover:border-destructive! bg-destructive/5 has-data-[state=checked]:bg-destructive/10!",
                                        )}
                                    >
                                        <Field data-invalid={errors} orientation="vertical">
                                            <div className="relative flex items-start justify-between gap-3">
                                                <FieldContent>
                                                    <FieldTitle className="font-semibold mb-2 text-primary-main">
                                                        {item.title}
                                                    </FieldTitle>

                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className={cn(
                                                            "flex size-10 shrink-0 items-center justify-center rounded-xl border-2",
                                                            errors
                                                                ? "border-destructive bg-destructive/10"
                                                                : "border-primary-main/20 bg-primary-light/20",
                                                        )}>
                                                            <item.icon className={cn(
                                                                errors
                                                                    ? 'text-destructive'
                                                                    : 'text-primary-main',
                                                            )} />
                                                        </div>
                                                        <FieldContent>
                                                            <FieldDescription className="text-xs">
                                                                {item.description}
                                                            </FieldDescription>
                                                        </FieldContent>
                                                    </div>
                                                </FieldContent>
                                                <RadioGroupItem className='absolute top-0 right-0' value={item.value} id={item.id} />
                                            </div>
                                        </Field>
                                    </FieldLabel>
                                ))}
                            </RadioGroup>
                        </FieldSet>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default TestPage


function TestComponent() {
    const {
        confirm,
        resolvedData,
    } = useGenericConfirm<AbstractSchema>()

    return (
        <Button
            onClick={async () => {
                const selection = await confirm({
                    resolveFn: async () => await getSubmissionById(38),
                    keepPreviousData: false,
                    options: {
                        btnLabel: 'Delete',
                        cancelBtnLabel: 'Cancel',
                        description: 'This action cannot be undone. The abstract will be permanently deleted.',
                        title: 'Delete Abstract?',
                        onCancel: () => console.log('Cancel'),
                        onConfirm: async () => {
                            await new Promise(r => setTimeout(r, 500))
                            console.log('Confirm')
                        }
                    },
                })

                console.log(selection);
            }}
        >
            {resolvedData ? 'Awebo' : 'Haz click aquí'}
        </Button>
    )
}


function TestButtonComponent() {
    const confirm = useConfirm()

    return (
        <Button
            onClick={async () => {

                const selection = await confirm({
                    btnLabel: 'Delete',
                    cancelBtnLabel: 'Cancel',
                    description: 'This action cannot be undone. The abstract will be permanently deleted.',
                    title: 'Delete Abstract?',
                    onCancel: () => console.log('Cancel'),
                    onConfirm: async () => {
                        await new Promise(r => setTimeout(r, 500))
                        console.log('Confirm')
                    }
                })

                if (selection) {
                    console.log('AWEBO PINCHE PUTA!');
                }
            }}
        >
            Confirm?
        </Button>
    )
}