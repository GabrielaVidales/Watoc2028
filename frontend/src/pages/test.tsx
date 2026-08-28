import api from '@/clients/api'
import { notify } from '@/components/custom/notify'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator'
import { ConfirmProvider, useConfirm } from '@/contexts/ConfirmationDialogContext'
import { GenericConfirmProvider, useGenericConfirm } from '@/contexts/GenericConfirmationContext'
import EditParticipantForm from '@/forms/participants/edit-participant-form'
import ReviewAssignmentForm from '@/forms/reviews/review-assignment-form'
import { routes } from '@/routes/routes'
import type { AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import { getSubmissionById } from '@/services/submissions/submission-services'
import { IdCardLanyardIcon, PowerIcon, PowerOffIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import DownloadAbstractPDFButton from './test/test-abstract-feature'


const feePlans = [
    {
        value: "participant-early",
        id: "participant-early",
        title: "Participant",
        description: "Early Bird",
        label: '1 Oct 2024 — 28 Feb 2025',
        price: 15_000,
        currency: 'MXN',
        student_fee: false,
    },
    {
        value: "participant-regular",
        id: "participant-regular",
        title: "Participant",
        description: "Regular attendee",
        label: '1 Oct 2024 — 28 Feb 2025',
        price: 17_000,
        currency: 'MXN',
        student_fee: false,
    },
    {
        value: "participant-late",
        id: "participant-late",
        title: "Participant",
        description: "Late",
        label: '1 Oct 2024 — 28 Feb 2025',
        price: 18_000,
        currency: 'MXN',
        student_fee: false,
    },
    {
        value: "student-early",
        id: "student-early",
        title: "Student",
        description: "Early Bird",
        label: '1 Oct 2024 — 28 Feb 2025',
        price: 7_500,
        currency: 'MXN',
        student_fee: true,
    },
    {
        value: "student-regular",
        id: "student-regular",
        title: "Student",
        description: "Regular student",
        label: '1 Oct 2024 — 28 Feb 2025',
        price: 7_500,
        currency: 'MXN',
        student_fee: true,
    },
    {
        value: "student-late",
        id: "student-late",
        title: "Student",
        description: "Late",
        label: '1 Oct 2024 — 28 Feb 2025',
        price: 7_500,
        currency: 'MXN',
        student_fee: true,
    },
];


export default function TestPage() {
    const [id, setId] = useState<number | null>(null)

    const navigate = useNavigate()

    const errors = false

    return (
        <div className='bg-muted'>
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

            <div className='max-w-3xl w-full mx-auto'>
                <section className='bg-background shadow-lg p-8'>
                    <CardHeader className='px-0 mb-8'> 
                        <div className="flex gap-2 items-start">
                            <div className='bg-primary-light/20 rounded-full p-1 border-3 border-primary-light'>
                                <IdCardLanyardIcon className='text-primary-main' />
                            </div>
                            <div>
                                <CardTitle className='text-xl font-semibold'>Additional Information</CardTitle>
                                <CardDescription>Click the button to load/unload data</CardDescription>
                            </div>
                        </div>
                        <CardAction>
                            <Button size='icon' onClick={() => {
                                setId(prev => prev === null ? 1 : null)
                            }}>
                                {id === null ? (
                                    <PowerIcon />
                                ) : (
                                    <PowerOffIcon />
                                )}
                            </Button>
                        </CardAction>
                    </CardHeader>
                    
                    <CardContent>
                        <EditParticipantForm participantId={id} />
                    </CardContent>
                </section>
            </div>
        </div>
    )
}



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
