import api from '@/clients/api'
import { notify } from '@/components/custom/notify'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator'
import ReviewAssignmentForm from '@/forms/reviews/review-assignment-form'
import { routes } from '@/routes/routes'
import { useNavigate } from 'react-router'

function TestPage() {
    const navigate = useNavigate()

    return (
        <div className='max-w-xl mx-auto w-full space-y-4 py-4'>

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
        </div>
    )
}

export default TestPage
