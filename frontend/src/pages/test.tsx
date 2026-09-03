import api from '@/clients/api'
import { notify } from '@/components/custom/notify'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator'
import EditParticipantForm from '@/features/participants/forms/edit-participant-form'
import ProgramForm from '@/features/program/forms/program-form'
import ReviewAssignmentForm from '@/features/reviews/forms/review-assignment-form'
import { routes } from '@/routes/routes'
import { PowerIcon, PowerOffIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import DownloadAbstractPDFButton from './test/test-abstract-feature'


export default function TestPage() {
    const [id, setId] = useState<number | null>(null)
    const [eventId, setEventId] = useState<number | null>(null)

    const navigate = useNavigate()

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
            </div>

            <div className='max-w-xl w-full mx-auto'>
                <Card className='shadow-lg'>
                    <CardHeader className='px-0 mb-8'>
                        <CardAction>
                            <Button size='icon' onClick={() => {
                                setEventId(prev => prev === null ? 1 : null)
                            }}>
                                {!eventId ? <PowerIcon /> : <PowerOffIcon />}
                            </Button>
                        </CardAction>
                    </CardHeader>

                    <CardContent>
                        <ProgramForm eventId={eventId} />
                    </CardContent>
                </Card>
            </div>

            <div className='max-w-4xl w-full mx-auto'>
                <section className='bg-background shadow-lg p-8'>
                    <CardHeader className='px-0 mb-8'>
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
