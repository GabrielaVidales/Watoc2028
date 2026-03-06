import { useFetch } from '@/hooks/use-fetch'
import { type AuthorSchema } from '@/schemas/abstract-schemas'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Hand, Menu, PencilLine, Save, Trash, User2 } from 'lucide-react'
import { Reorder } from 'motion/react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { isAxiosError } from 'axios'
import { Spinner } from '@/components/ui/spinner'
import AddOrEditAuthorDialog from '@/forms/wrappers/AddOrEditAuthorDialog'
import { useMutation } from '@/hooks/use-mutation'
import { InfoAlert } from '@/components/InfoAlert'


function EditAuthorsPage() {
    const { id } = useParams()
    const { loading, mutate, } = useMutation()
    const {
        data: authors,
        setData: setAuthors,
        fetchData: fetchAuthors,
    } = useFetch<AuthorSchema[]>(`/abstracts/${id}/authors/`)

    const onReorder = (data: AuthorSchema[]) => {
        setAuthors(data.map((item, i) => ({ ...item, order: i + 1 })))
    }

    //#region DELETE AUTHOR
    const [openDeleteAuthor, setOpenDeleteAuthor] = useState(false)
    const [authorIdToDelete, setAuthorIdToDelete] = useState(0)
    const onDeleteAuthor = async () => {
        try {
            await mutate('delete', `/authors/${authorIdToDelete}/`)
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
            await mutate('patch', `/abstracts/${id}/authors/`, {
                authors: authors.map(item => ({ ...item, abstract_id: parseInt(id) }))
            })
            await fetchAuthors()
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response);
                }
            }
        }
    }
    // #endregion

    return (
        <div className='w-full space-y-5 p-5'>
            <h2 className='text-2xl font-semibold'>Abstract Submission</h2>

            <div className='flex flex-col gap-3'>
                <InfoAlert
                    title={<span><b>Drag to reorder</b> the list of authors.</span>}
                    messages={[]}
                    icon={<Hand />}
                />

                <Reorder.Group axis="y" values={authors} onReorder={onReorder} style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.7 : 1 }}>
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-3 overflow-auto">
                        {authors?.map((item, index) => (
                            <Reorder.Item key={item.id} value={item} className='w-full'>
                                <div className='cursor-grab border-2 bg-background rounded-sm flex justify-between items-start p-3 mb-2 gap-3'>
                                    <div className=' flex justify-center items-center'>
                                        <Menu className='stroke-3 size-5' />
                                    </div>

                                    <div className='font-semibold'>
                                        {index + 1}.
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
                                        <Button variant='ghost' className='size-8 border-2 border-primary-main' onClick={() => {
                                            setOpen(true)
                                            setAuthorIdToEdit(item.id)
                                            console.log(item);

                                        }}>
                                            <PencilLine className='shrink-0 size-5 stroke-primary-main' />
                                        </Button>
                                        <Button variant='ghost' className='size-8 border-2 border-destructive' onClick={() => {
                                            setOpenDeleteAuthor(true)
                                            setAuthorIdToDelete(item.id)
                                        }}>
                                            <Trash className='shrink-0 size-5 stroke-destructive' />
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

                <fieldset disabled={loading} className='flex items-center justify-between'>
                    <Button type='button' onClick={() => {
                        setOpen(true)
                        setAuthorIdToEdit(null)
                    }}>
                        {loading ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <Save data-icon="inline-start" />
                        )}
                        Add Author
                    </Button>
                    <Button type='button' onClick={onSaveAuthors} disabled={!authors || authors.length === 0}>
                        {loading ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <Save data-icon="inline-start" />
                        )}
                        Save Changes
                    </Button>
                </fieldset>

                {authors && (<>
                    <AddOrEditAuthorDialog
                        open={open}
                        setOpen={setOpen}
                        author={authors?.find(x => x.id === authorIdToEdit)}
                        onSubmit={async () => {
                            setAuthorIdToDelete(0)
                            setAuthorIdToEdit(0)
                            await fetchAuthors()
                        }}
                    />

                    <AlertDialog open={openDeleteAuthor} onOpenChange={setOpenDeleteAuthor}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Author</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the author.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button type='submit' form='authors-form' onClick={onDeleteAuthor} disabled={loading}>
                                    {loading && (
                                        <Spinner data-icon="inline-start" />
                                    )}
                                    Save
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>)}
            </div>
        </div>
    )
}

export default EditAuthorsPage