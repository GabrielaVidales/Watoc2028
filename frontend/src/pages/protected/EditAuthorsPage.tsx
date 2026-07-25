import { InfoAlert } from '@/components/InfoAlert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import AddOrEditAuthorDialog from '@/forms/wrappers/AddOrEditAuthorDialog'
import { useFetch } from '@/hooks/use-fetch'
import { useMutation } from '@/hooks/use-mutation'
import { type AuthorSchema } from '@/schemas/abstracts/abstract-schemas'
import { isAxiosError } from 'axios'
import { AlertTriangle, ChevronLeft, ChevronRight, Edit, Hand, Menu, Plus, Save, Trash2, TriangleAlert, User2 } from 'lucide-react'
import { Reorder } from 'motion/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import type { EditAbstractCallbacks } from './EditAbstractPage'

"DEPRECAR ESTA MADRE"

function EditAuthorsPage({ onStepBack, onStepForward }: EditAbstractCallbacks) {
    const { id } = useParams()
    const { loading, mutate, } = useMutation()
    const {
        data: authors,
        setData: setAuthors,
        fetchData: fetchAuthors,
    } = useFetch<AuthorSchema[]>(`/abstracts/submissions/${id}/authors/`)

    const onReorder = (data: AuthorSchema[]) => {
        setAuthors(data.map((item, i) => ({ ...item, order: i + 1 })))
    }

    const [originalAuthors, setOriginalAuthors] = useState<AuthorSchema[] | null>(null);

    useEffect(() => {
        if (authors && !originalAuthors) {
            setOriginalAuthors(authors);
        }
    }, [authors]);

    const isDirty = JSON.stringify(authors) !== JSON.stringify(originalAuthors);

    //#region DELETE AUTHOR
    const [openDeleteAuthor, setOpenDeleteAuthor] = useState(false)
    const [authorIdToDelete, setAuthorIdToDelete] = useState(0)
    const onDeleteAuthor = async () => {
        try {
            await mutate('delete', `/abstracts/authors/${authorIdToDelete}/`)
            await fetchAuthors()
            setOpenDeleteAuthor(false)
            setAuthorIdToDelete(0)
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response);
                }
            }
        } finally {
            setAuthorIdToDelete(0)
        }
    }
    //  #endregion

    // #region EDIT AUTHOR
    const [open, setOpen] = useState(false)
    const [authorIdToEdit, setAuthorIdToEdit] = useState(0)
    const onSaveAuthors = async () => {
        try {
            await mutate('patch', `/abstracts/submissions/${id}/authors/`, {
                authors: authors.map(item => ({ ...item, abstract_id: parseInt(id) }))
            })
            await fetchAuthors()
            setOriginalAuthors(authors)

        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response);
                }
            }
        }
    }
    // #endregion

    const [openInvalid, setOpenInvalid] = useState(false)
    const onValidate = async () => {
        const valid = authors.length > 0
        if (!valid) {
            setOpenInvalid(true)
            return
        }
        onStepForward?.()
    }

    return (
        <div className='w-full space-y-5'>

            <div className='space-y-5'>
                <InfoAlert
                    title={<span><b>Drag to reorder</b> the list of authors.</span>}
                    messages={[]}
                    icon={<Hand />}
                />

                <Reorder.Group axis="y" values={authors} onReorder={onReorder} style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.7 : 1 }}>
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-3 overflow-auto">
                        {authors?.map((item) => (
                            <Reorder.Item key={item.id} value={item} className='w-full'>
                                <div className='cursor-grab border-2 bg-background rounded-sm flex justify-between items-center p-3 mb-2 gap-3'>
                                    <div className=' flex justify-center items-center'>
                                        <Menu className='stroke-3 size-5' />
                                    </div>

                                    <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                        <div className='w-full'>
                                            <p className='text-sm font-semibold'>{item.first_name} {item.last_name}</p>
                                            <p className='text-xs text-muted-foreground'>{item.email}</p>
                                        </div>

                                        <div className="flex flex-col w-full gap-1">
                                            <span className="font-medium leading-none">
                                                {item.affiliation?.institute}
                                            </span>
                                            <span className="text-sm text-muted-foreground truncate">
                                                {item.affiliation?.department}
                                            </span>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {item.affiliation?.city && item.affiliation?.nationality && (
                                                    <>
                                                        {item.affiliation.city}, {item.affiliation.nationality}
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <fieldset disabled={loading} className='flex flex-col sm:flex-row gap-3'>
                                        <Button variant='ghost' size='icon-sm' onClick={() => {
                                            setOpen(true)
                                            setAuthorIdToEdit(item.id)
                                        }}>
                                            <Edit className='shrink-0 size-5 stroke-primary-main' />
                                        </Button>
                                        <Button variant='ghost' size='icon-sm' onClick={() => {
                                            setOpenDeleteAuthor(true)
                                            setAuthorIdToDelete(item.id)
                                        }}>
                                            <Trash2 className='shrink-0 size-5 stroke-destructive' />
                                        </Button>
                                    </fieldset>
                                </div>
                            </Reorder.Item>
                        ))}
                        {authors?.length === 0 && (
                            <>
                                <div className="rounded-full bg-muted p-3 mb-3">
                                    <User2 className="size-6 text-muted-foreground" />
                                </div>
                                <h4 className="font-medium text-muted-foreground">No authors added</h4>
                                <p className="text-sm text-muted-foreground/60">
                                    Start by adding a new affiliation in the form.
                                </p>
                            </>
                        )}
                    </div>
                </Reorder.Group>

                <fieldset disabled={loading} className='flex items-center justify-center'>
                    <Button type='button' onClick={() => { setOpen(true) }}>
                        <Plus data-icon="inline-start" />
                        Add Author
                    </Button>
                </fieldset>

                {authors && (<>
                    <AddOrEditAuthorDialog
                        open={open}
                        setOpen={setOpen}
                        author={authors?.find(x => x.id === authorIdToEdit)}
                        onClose={() => {
                            setAuthorIdToDelete(0)
                            setAuthorIdToEdit(0)
                        }}
                        onSubmit={async () => {
                            setAuthorIdToDelete(0)
                            setAuthorIdToEdit(0)
                            await fetchAuthors()
                        }}
                    />

                    <AlertDialog open={openDeleteAuthor} onOpenChange={setOpenDeleteAuthor}>
                        <AlertDialogContent size='sm'>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="p-3 bg-destructive/10 rounded-full mb-2">
                                    <TriangleAlert className='size-8 text-destructive' />
                                </AlertDialogTitle>
                                <AlertDialogTitle>Delete Author?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action <strong>cannot be undone</strong>. This will permanently remove the author from this abstract.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button variant='destructive' onClick={onDeleteAuthor} disabled={loading}>
                                    {loading ? (<>
                                        <Spinner className="mr-2" />
                                        Deleting...
                                    </>) : 'Delete Author'}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>)}

                <Separator />

                <fieldset disabled={loading} className='flex justify-between items-start gap-2 w-full'>
                    <Button type='button' onClick={onStepBack}>
                        <ChevronLeft /> Back
                    </Button>

                    <Button type='button' onClick={onSaveAuthors} disabled={!isDirty || !authors || authors.length === 0}>
                        {loading ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <Save data-icon="inline-start" />
                        )}
                        Save Changes
                    </Button>

                    <Button type='button' onClick={onValidate}>
                        Next <ChevronRight />
                    </Button>
                </fieldset>
            </div>

            <AlertDialog open={openInvalid} onOpenChange={setOpenInvalid}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <AlertTriangle />
                        </AlertDialogMedia>
                        <AlertDialogTitle>
                            Some information is incomplete
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-balance'>
                            Your abstract contains fields that do not meet the submission requirements.
                        </AlertDialogDescription>
                        <AlertDialogDescription className='text-balance'>

                            You may continue to the next step, but these issues must be resolved before
                            the final submission.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Go Back and Fix
                        </AlertDialogCancel>
                        <AlertDialogAction variant='destructive' onClick={onStepForward}>
                            Continue Anyway
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default EditAuthorsPage