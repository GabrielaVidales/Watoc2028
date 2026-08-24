import api from '@/clients/api'
import AdaptableTooltip from '@/components/custom/adaptable-tooltip'
import { notify } from '@/components/custom/notify'
import { Button, type ButtonProps } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator, } from "@/components/ui/button-group"
import { Spinner } from '@/components/ui/spinner'
import type { PDFGenerationJob } from '@/domain/pdf-generation-job'
import { DEBUG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import websocketDispatcher from '@/stores/websocket-dispatcher'
import useWebsocket from '@/stores/websocket-store'
import { isAxiosError } from 'axios'
import { FileDown, InfoIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useState } from 'react'

type DownloadAbstractPDFButtonProps = {
    abstractId: number | null
} & ButtonProps

function DownloadAbstractPDFButton({ abstractId }: DownloadAbstractPDFButtonProps) {
    const connect = useWebsocket(w => w.connect)
    const disconnect = useWebsocket(w => w.disconnect)

    const [job, setJob] = useState<PDFGenerationJob | null>(null)
    const [jobUri, setJobUri] = useState<string | null>(null)
    const [showJob, setShowJob] = useState(false)

    useEffect(() => {
        setJob(null)
        setJobUri(null)
    }, [abstractId])

    useEffect(() => {
        if (!jobUri) return

        const jobId = jobUri.split("/").filter(Boolean).at(-1)
        const wsEventName = `pdf.status.${jobId}`

        websocketDispatcher.register(wsEventName, async (job: PDFGenerationJob) => {
            if (job.status === 'completed') {
                notify.success('PDF generated successfully', { description: 'Your file is ready for download.' });
                setJob(job)

                const file = await downloadAPIFile(job)
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
                notify.success('PDF is ready', { description: 'Download starting automatically...' });
                await downloadAPIFile(data)

            } else if (['pending', 'generating'].includes(data.status)) {
                const socketUri = `api/abstracts/jobs/pdf/${data.id}/`
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

    const downloadAPIFile = async (job: PDFGenerationJob): Promise<Blob | false> => {
        try {
            const { data: blob } = await api.get<Blob>(`abstracts/jobs/${job.id}/download`, {
                responseType: 'blob'
            })

            const url = URL.createObjectURL(blob)
            triggerDownload(url, job.abstract_detail?.plain_title)
            return blob

        } catch (error) {
            DEBUG && console.log(error)
            return false
        }
    }

    const triggerDownload = (url: string, filename: string = 'Abstract preview') => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.pdf`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }

    const isLoading = job ? (
        job.status === "pending" ||
        job.status === "generating"
    ) : false

    return (
        <>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <ButtonGroup>
                    <Button
                        size='sm'
                        variant='main'
                        onClick={onGeneratingPdf}
                        disabled={isLoading || abstractId === null}
                    >
                        {isLoading ? (
                            <React.Fragment>
                                <Spinner />
                                Generating...
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <FileDown />
                                Download PDF
                            </React.Fragment>
                        )}
                    </Button>

                    <ButtonGroupSeparator />

                    <Button
                        size='icon-sm'
                        variant='main'
                        disabled={!job}
                        onClick={() => setShowJob(prev => !prev)}
                    >
                        {!job ? (
                            <InfoIcon />
                        ) : (
                            <InfoIcon />
                        )}
                    </Button>
                </ButtonGroup>
            </div>
            <AnimatePresence>
                {showJob && job && (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <JobInfo job={job} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}


type JobInfoProps = {
    job?: PDFGenerationJob
}

function JobInfo({ job }: JobInfoProps) {
    if (!job) return null

    return (
        <div className="min-w-0 w-full overflow-hidden rounded-lg border bg-card py-3 px-4 space-y-3">
            <div className="min-w-0 w-full overflow-hidden">
                <div className='flex gap-2'>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Job ID
                    </p>

                    <AdaptableTooltip
                        content={<p>Each PDF generation task is identified in the system by it's unique ID.</p>}
                    />
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
                    <AdaptableTooltip
                        content={<p>Each PDF generation task is identified in the system by it's unique ID.</p>}
                    />
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
    )
}

export default DownloadAbstractPDFButton