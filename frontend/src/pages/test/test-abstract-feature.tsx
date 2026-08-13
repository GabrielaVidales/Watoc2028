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
    const [jobUri, setJobUri] = useState<string | null>(null)

    useEffect(() => {
        setJob(null)
        setJobUri(null)
    }, [abstractId])

    useEffect(() => {
        if (!jobUri) return

        const jobId = jobUri.split('/')[1]
        const wsEventName = `pdf.status.${jobId}`

        websocketDispatcher.register(wsEventName, async (job: PDFGenerationJob) => {
            if (job.status === 'completed') {
                setJob(job)

                const file = await downloadAPIFile(job.id)
                if (file) {
                    disconnect(jobUri)
                }
            }
        })

        connect(jobUri)

        return () => {
            websocketDispatcher.unregister(wsEventName)
            disconnect(jobUri)
        }
    }, [jobUri])

    const onGeneratingPdf = async () => {
        try {
            const { data } = await api.post<PDFGenerationJob>('/abstracts/jobs/', {
                abstract_id: abstractId
            })

            setJob(data)

            if (data.status === 'completed') {
                await downloadAPIFile(data.id)

            } else if (['pending', 'generating'].includes(data.status)) {
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

    const downloadAPIFile = async (id: string): Promise<Blob | false> => {
        try {
            const { data: blob } = await api.get<Blob>(`abstracts/jobs/${id}/download`, {
                responseType: 'blob'
            })

            const url = URL.createObjectURL(blob)
            triggerDownload(url)
            return blob

        } catch (error) {
            DEBUG && console.log(error)
            return false
        }
    }
    
    const isLoading = job ? (
        job.status === "pending" ||
        job.status === "generating"
    ) : false

    return (
        <>
            <div className="min-w-0 w-full overflow-hidden rounded-lg border bg-muted/30 p-3 space-y-1">
                <div className="min-w-0 w-full overflow-hidden">
                    <div className='flex gap-2'>
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Job ID
                        </p>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <InfoIcon className='size-3 text-muted-foreground' />
                            </TooltipTrigger>
                            <TooltipContent className='max-w-60'>
                                <p>Each PDF generation task is identified in the system by it's unique ID.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <p className="min-w-0 w-full truncate font-mono text-sm" title={job?.id || "Not set"}>
                        {job?.id || "Not set"}
                    </p>
                </div>

                <div className="min-w-0 w-full overflow-hidden">
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

                    <p className="min-w-0 w-full truncate font-mono text-sm" title={job?.content_hash || "Not set"}>
                        {job?.content_hash || "Not set"}
                    </p>
                </div>

                <div className="min-w-0 w-full overflow-hidden">
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