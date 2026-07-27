import api from '@/clients/api'
import { AbstractData } from '@/components/AbstractData'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useFetch } from '@/hooks/use-fetch'
import { routes } from '@/routes/routes'
import { type AbstractDeclarationValues } from '@/schemas/abstract-declaration-schema'
import { type AbstractSchema, type AuthorSchema } from '@/schemas/abstracts/abstract-schemas'
import { isAxiosError } from 'axios'
import { ChevronsLeft, Download, FileText } from 'lucide-react'
import { Link, useParams } from 'react-router'

type Props = {}

function AbstractPreview({ }: Props) {
    const { id } = useParams()

    const { data: abstract } = useFetch<AbstractSchema>(`/abstracts/submissions/${id}/`)
    const { data: authors } = useFetch<AuthorSchema[]>(`/abstracts/submissions/${id}/authors/`)
    const { data: declarations } = useFetch<AbstractDeclarationValues>(`/abstracts/submissions/${id}/declarations/`)

    const handlePreview = async (id: number | string, name: string = 'abstract') => {
        try {
            const response = await api.get<Blob>(`/abstracts/submissions/${id}/preview`, {
                responseType: 'blob',
            })
            const href = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', `${name.replaceAll(" ", "_")}_preview.pdf`);
            link.click();
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    }

    return (
        <div className='w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-3 p-3 mx-auto'>
            <div className='col-span-full w-full flex gap-3 justify-center'>
                <div className='w-full bg-background border-2 rounded-lg shadow-lg flex flex-col'>

                    <section className="flex items-start gap-3 p-4 border-b-2 border-b-input rounded-t-lg bg-neutral-200 border-dashed shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full text-primary">
                                <FileText size={20} />
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between w-full gap-2'>
                            <div>
                                <p className="text-sm font-medium">PDF Preview Available</p>
                                <p className="text-xs text-muted-foreground">Download to check the final formatting.</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 w-fit self-end"
                                onClick={() => {
                                    handlePreview(abstract.id, abstract.title)
                                }}
                                disabled={!abstract?.id}
                            >
                                <Download size={14} /> Download PDF
                            </Button>
                        </div>
                    </section>

                    <section className='p-5'>
                        <AbstractData abstract={abstract} authors={authors} declarations={declarations} />
                    </section>

                    <Separator />
                    
                    <section className='p-5 flex items-center justify-center'>
                        <Link to={routes.users.submissions.summary}>
                            <Button>
                                <ChevronsLeft/>
                                Return to abstracts
                            </Button>
                        </Link>
                    </section>
                </div>
            </div>
        </div >
    )
}

export default AbstractPreview