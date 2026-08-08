import api from '@/clients/api'
import { notify } from '@/components/custom/notify'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import ReviewAssignmentForm from '@/forms/reviews/review-assignment-form'
import { cn } from '@/lib/utils'
import { routes } from '@/routes/routes'
import websocketDispatcher from '@/stores/websocket-dispatcher'
import useWebsocket from '@/stores/websocket-store'
import { FileDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'


type PDFGenerationJob = {
    id: string;
    abstract: number;
    content_hash: string;
    status: "pending" | "generating" | "completed" | "failed";
    file: string | null;
    error: string | null;
    created_at: string;
    completed_at: string | null;
};


function TestPage() {
    const navigate = useNavigate()

    const connect = useWebsocket(w => w.connect)
    const disconnect = useWebsocket(w => w.disconnect)

    const [jobUri, setJobUri] = useState<string | null>(null)
    const [jobId, setJobId] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)
    const [file, setFile] = useState<Blob | string | null>()

    const isLoading = (
        status === "pending" ||
        status === "generating"
    )

    useEffect(() => {
        if (!jobUri || !jobId) return

        connect(jobUri)

        websocketDispatcher.register(`pdf.status.${jobId}`, async (job: PDFGenerationJob) => {
            console.log('Listen:', job);

            if (job.status === 'completed') {
                try {
                    const { data: file } = await api.get(`abstracts/jobs/${job.id}/download`, {
                        responseType: 'blob'
                    })

                    setFile(file)
                    disconnect(jobUri)
                    setStatus(job.status)
                } catch (error) {
                    console.log(error.response);

                }

            }
        })

        return () => {
            disconnect(jobUri)
            websocketDispatcher.unregister(jobUri)
        }
    }, [jobUri, jobId])


    const onGeneratingPdf = async () => {
        const { data } = await api.post<PDFGenerationJob>('/abstracts/jobs/?force=1', {
            abstract_id: 16
        })

        console.log('Created:', data);

        setFile(null)
        setJobId(data.id)
        setStatus(data.status)

        if (data.status === 'completed') {
            console.log('Ya existía');

            setFile(data.file)

        } else if (data.status === 'pending') {
            console.log('Creando...');
            const socketUri = `pdf/${data.id}/`
            setJobUri(socketUri)


        } else if (data.status === 'generating') {

        } else if (data.status === 'failed') {

        }
    }


    const handleDownloadPDF = () => {
        if (!file) return

        const url = typeof file === 'string' ? file : URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = url;
        link.download = `Abstract preview.pdf`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }

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

            <Card className='w-full mx-auto'>
                <CardHeader>
                    <CardTitle>Test abstract</CardTitle>
                    <CardDescription>
                        View, create, edit, or remove author records for your submission.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border bg-muted/30 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Job ID
                            </p>

                            <p className="mt-1 break-all font-mono text-sm">
                                {jobId || "Not set"}
                            </p>
                        </div>

                        <div className="rounded-lg border bg-muted/30 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Status
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                                <span
                                    className={cn(
                                        "size-2 rounded-full",
                                        status === "completed" && "bg-green-500",
                                        status === "generating" && "bg-yellow-500",
                                        status === "failed" && "bg-red-500",
                                        (!status || status === "pending") && "bg-muted-foreground",
                                    )}
                                />

                                <span className="text-sm font-medium capitalize">
                                    {status || "Not set"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={handleDownloadPDF}
                            disabled={!file || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner />
                                    Preparing...
                                </>
                            ) : (
                                <>
                                    <FileDown />
                                    Download
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={onGeneratingPdf}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner />
                                    Generating...
                                </>
                            ) : (
                                "Generate PDF"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default TestPage
