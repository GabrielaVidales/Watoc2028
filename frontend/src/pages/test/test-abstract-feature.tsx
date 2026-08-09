import api from '@/clients/api'
import websocketDispatcher from '@/stores/websocket-dispatcher'
import useWebsocket from '@/stores/websocket-store'
import { notify } from '@/components/custom/notify'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { FileDown, InfoIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { isAxiosError } from 'axios'
import { DEBUG } from '@/lib/constants'


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


type TestAbstractFeatureProps = {
    abstractId: number | null
}

function TestAbstractFeature({ abstractId }: TestAbstractFeatureProps) {
    const connect = useWebsocket(w => w.connect)
    const disconnect = useWebsocket(w => w.disconnect)

    const [job, setJob] = useState<PDFGenerationJob | null>(null)
    const [cachedFile, setCachedFile] = useState<Blob | null>(null)
    const [jobUri, setJobUri] = useState<string | null>(null)

    useEffect(() => {
        setJob(null)
        setCachedFile(null)
        setJobUri(null)
    }, [abstractId])

    const isLoading = job ? (
        job.status === "pending" ||
        job.status === "generating"
    ) : false

    useEffect(() => {
        if (!jobUri) return

        const jobId = jobUri.split('/')[1]
        const wsEventName = `pdf.status.${jobId}`

        websocketDispatcher.register(wsEventName, async (job: PDFGenerationJob) => {
            console.log('Listen:', job);

            if (job.status === 'completed') {
                try {
                    const file = await downloadAPIFile(job.id)
                    setCachedFile(file)
                    setJob(job)
                    disconnect(jobUri)

                } catch (error) {
                    console.log(error.response);
                }
            }
        })

        console.log("QUE COÑO???: " + jobUri);
        connect(jobUri)

        return () => {
            websocketDispatcher.unregister(wsEventName)
            disconnect(jobUri)
        }
    }, [jobUri])


    const onGeneratingPdf = async () => {
        if (cachedFile) {
            const url = typeof cachedFile === 'string' ?
                import.meta.env.VITE_API_URL + cachedFile :
                URL.createObjectURL(cachedFile);

            triggerDownload(url)
            return
        }

        try {
            const { data } = await api.post<PDFGenerationJob>('/abstracts/jobs/?force=1', {
                abstract_id: abstractId
            })

            setCachedFile(null)
            setJob(data)

            if (data.status === 'completed') {
                const file = await downloadAPIFile(data.id)
                setCachedFile(file)
            }

            if (['pending', 'generating'].includes(data.status)) {
                const socketUri = `pdf/${data.id}/`
                setJobUri(socketUri)
            }

        } catch (error) {
            if (isAxiosError(error)) {
                notify.destructive('Something went wrong!', {
                    description: `Server responded with code ${error.status}: ${error.response.statusText}`,
                })
            } else {
                notify.destructive('Error', {
                    description: 'An unexpected error occurred while generating the PDF.',
                })
            }

            setJob({
                error: 'Error',
                abstract: 0,
                completed_at: null,
                created_at: null,
                file: null,
                id: 'Not set',
                status: 'failed',
                content_hash: 'Not set',
            })
        }
    }

    const triggerDownload = (url: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `Abstract preview.pdf`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }

    const downloadAPIFile = async (id: string) => {
        const { data: blobdata } = await api.get(`abstracts/jobs/${id}/download`, {
            responseType: 'blob'
        })

        const url = URL.createObjectURL(blobdata)
        triggerDownload(url)
        return blobdata
    }

    return (
        <>
            <div className="rounded-lg border bg-muted/30 p-5 space-y-3">
                <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Job ID
                    </p>

                    <p className="break-all font-mono text-sm truncate" title={job?.id || "Not set"}>
                        {job?.id || "Not set"}
                    </p>
                </div>

                <div>
                    <div className='flex gap-2'>
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Abstract Hash
                        </p>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <InfoIcon className='size-3 text-muted-foreground' />
                            </TooltipTrigger>
                            <TooltipContent className='max-w-xs'>
                                <p>A unique fingerprint of the abstract's content when the PDF was generated. If the hash changes, the abstract was modified and the PDF needs to be regenerated.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <p className="font-mono text-sm truncate" title={job?.content_hash || "Not set"}>
                        {job?.content_hash || "Not set"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Status
                    </p>

                    <div className="flex items-center gap-2">
                        <span
                            className={cn(
                                "size-2 rounded-full",
                                job?.status === "completed" && "bg-green-500",
                                job?.status === "generating" && "bg-yellow-500",
                                job?.status === "failed" && "bg-red-500",
                                (!job?.status || job?.status === "pending") && "bg-muted-foreground",
                            )}
                        />

                        <span className="text-sm font-medium font-mono capitalize">
                            {job?.status || "Not set"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                    size='sm'
                    onClick={onGeneratingPdf}
                    disabled={isLoading || abstractId === null}
                >
                    {isLoading ? (
                        <>
                            <Spinner />
                            Generating...
                        </>
                    ) : (
                        <>
                            <FileDown />
                            Download PDF
                        </>
                    )}
                </Button>
            </div>
        </>
    )
}

export default TestAbstractFeature