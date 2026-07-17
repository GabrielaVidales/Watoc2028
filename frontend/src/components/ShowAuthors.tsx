import axiosClient from '@/clients/axiosClient'
import type { AuthorSchema } from '@/schemas/author-schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Spinner } from './ui/spinner'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Edit, GripVertical, HardDriveDownload, Plus, Trash2, TriangleAlert, User2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Sortable, SortableItem, SortableItemHandle, } from "@/components/reui/sortable"
import { Field, FieldLabel } from './ui/field'
import { Switch } from './ui/switch'
import { isAxiosError } from 'axios'
import { InfoAlert } from './InfoAlert'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { ScrollArea } from './ui/scroll-area'
import { AuthorForm, AuthorFormContent } from '@/forms/AbstractAuthorForm'
import { CardAction, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useParams } from 'react-router'


type APIError = {
    root: string[],
    authors: string[],
}

type Props = {
    onAuthorEdit?: (a: AuthorSchema) => void | Promise<void>
    onAuthorDelete?: (a: AuthorSchema) => void | Promise<void>
}

function ShowAuthorsComponent({ }: Props) {
    const { id: abstractId } = useParams()

    const { data } = useQuery({
        queryKey: ['authors', abstractId],
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        queryFn: async () => {
            const { data } = await axiosClient<AuthorSchema[]>(`/abstracts/submissions/${abstractId}/authors`)
            return data
        }
    })

    const queryClient = useQueryClient()

    const saveAuthorsMutation = useMutation({
        mutationFn: async (authors: AuthorSchema[]) => {
            const data = {
                authors: authors.map(a => ({ ...a, affiliation_id: a.affiliation.id, }))
            }
            const { data: response } = await axiosClient.patch(`/abstracts/submissions/${abstractId}/authors/`, data)
            return response
        },
        onSuccess: () => {
            setErrors({ root: null, authors: null, })
            queryClient.invalidateQueries({
                queryKey: ["authors", abstractId]
            })
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                setErrors(error.response?.data.errors)

                if (import.meta.env.DEV) {
                    console.error(error.response?.data)
                }
            }
        }
    })

    const deleteAuthorMutation = useMutation({
        mutationFn: async (id: number) => {
            const { data: response } = await axiosClient.delete(`/abstracts/authors/${id}/`)
            return response
        },
        onSuccess: () => {
            setOpen(false)
            setDeleteAuthor(null)
            setErrors({ root: null, authors: null, })
            queryClient.invalidateQueries({
                queryKey: ["authors", abstractId]
            })
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                setErrors(error.response?.data.errors)

                if (import.meta.env.DEV) {
                    console.error(error.response?.data)
                }
            }
        }
    })

    const [open, setOpen] = useState(false)
    const [deleteAuthor, setDeleteAuthor] = useState<AuthorSchema>(null)

    const [openA, setOpenA] = useState(false)
    const [editAuthor, setEditAuthor] = useState<AuthorSchema>(null)

    const [errors, setErrors] = useState<APIError>({
        root: null,
        authors: null,
    })

    const [authors, setAuthors] = React.useState<AuthorSchema[]>([])
    const getAuthorValue = (a: AuthorSchema) => `${a.id}`
    const handleReorder = (a: AuthorSchema[]) => setAuthors(a)
    const handleSwitchValue = (value: boolean, ref: AuthorSchema) => {
        const next = authors.map(author => ({
            ...author,
            is_corresponding_author: author.id === ref.id ? value : false
        }))
        setAuthors(next)
        setErrors({
            root: null,
            authors: null,
        })
    }

    React.useEffect(() => { if (data) setAuthors(data) }, [data])

    if (!data) {
        return <Spinner />
    }

    return (
        <div className='max-w-full py-8 space-y-8'>
            <AlertDialog open={open} onOpenChange={(v) => { setDeleteAuthor(null); setOpen(v) }}>
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
                        <Button variant='destructive' onClick={() => deleteAuthorMutation.mutate(deleteAuthor.id)} disabled={deleteAuthorMutation.isPending}>
                            {deleteAuthorMutation.isPending ? (<>
                                <Spinner className="mr-2" />
                                Deleting...
                            </>) : 'Delete Author'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={openA} onOpenChange={() => { setOpenA(false); setEditAuthor(null); }}>
                <DialogContent className='md:max-w-3xl w-full'>
                    <DialogHeader>
                        <DialogTitle>{editAuthor !== null ? 'Edit Author' : 'Add a new author'}</DialogTitle>
                        <DialogDescription>
                            {editAuthor !== null
                                ? 'Update the necessary fields below and save your changes.'
                                : 'Fill out the form below to add a new author to the list.'}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="-mx-4 max-h-[60vh] overflow-y-auto px-4 overflow-visible">
                        <AuthorForm>
                            <AuthorFormContent values={editAuthor} onSubmit={() => {
                                setOpenA(false);
                                setEditAuthor(null);
                            }} />
                        </AuthorForm>
                    </ScrollArea>
                    <DialogDescription className='border-t-2 pt-2'>
                        Note: If you add a registered user as a co-author for your submission, they will be notified to see the work they are related to.
                        If the co-author is not a registered user, you can add their information manually.
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form='author-form'>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {errors?.root && (
                <InfoAlert
                    variant='destructive'
                    title="An error occurred while processing your request."
                    messages={errors.root}
                />
            )}

            <CardHeader className='px-0'>
                <CardDescription>
                    Complete the details (full name, email, affiliation and country) of collaboration authors. You can include a maximum of 16 authors. Please indicate which of the authors will present the abstract.                 </CardDescription>
                <CardAction>
                    <Button onClick={() => { setEditAuthor(null); setOpenA(true) }}>
                        <Plus />
                        Add author
                    </Button>
                </CardAction>
            </CardHeader>

            <Sortable
                value={authors}
                onValueChange={handleReorder}
                getItemValue={getAuthorValue}
                className='space-y-2 p-1 sm:p-3 bg-slate-50 border-dashed border-2 rounded-lg'
            >
                {authors?.map((author) => (
                    <SortableItem
                        key={author.id}
                        value={String(author.id)}
                        disabled={saveAuthorsMutation.isPending}
                        className={cn(
                            'relative p-3 border-2 border-border rounded-md transition-colors duration-300',
                            'bg-background hover:border-primary-light hover:shadow-md',
                            'flex flex-col gap-3',
                            'md:flex-row md:items-center md:justify-between',
                        )}
                    >
                        <SortableItemHandle
                            className={cn(
                                'text-muted-foreground',
                                'absolute right-3 top-4',
                                'md:static'
                            )}
                        >
                            <GripVertical />
                        </SortableItemHandle>

                        <Avatar className="size-10 shrink-0 border shadow-sm">
                            <AvatarImage loading='lazy' src={author.related_user?.photo as string ?? null} />
                            <AvatarFallback>
                                {author.related_user_id ? (
                                    author.related_user?.full_name
                                        .split(" ")
                                        .map((x) => x[0])
                                        .join("")
                                        .slice(0, 2)
                                ) : <User2 />}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                            <h4 className="min-w-0 truncate font-medium">
                                {author.first_name} {author.last_name}{" "}
                                <span className="block sm:inline break-all text-muted-foreground text-xs">
                                    ({author.email})
                                </span>
                            </h4>

                            <p className="text-sm text-muted-foreground break-all">
                                {author.affiliation.institution} | {author.affiliation.city}, {author.affiliation.country}
                            </p>
                        </div>

                        <div className="hidden md:flex items-center">
                            <Field orientation="horizontal" className="items-center gap-2">
                                <FieldLabel
                                    htmlFor={`switch-${author.id}`}
                                    className="text-xs cursor-pointer"
                                >
                                    Corresponding author
                                </FieldLabel>

                                <Switch
                                    id={`switch-${author.id}`}
                                    checked={author.is_corresponding_author}
                                    onCheckedChange={(bool) => handleSwitchValue(bool, author)}
                                />
                            </Field>
                        </div>

                        <fieldset
                            className={cn(
                                "flex items-center justify-between border-t pt-3",
                                "md:ml-auto md:border-l-2 md:border-t-0 md:pl-2 md:pt-0 md:justify-end md:gap-1"
                            )}
                        >
                            {/* Switch SOLO en mobile */}
                            <div className="flex md:hidden items-center justify-between w-full pr-3 mr-3 border-r-2">
                                <Field orientation="horizontal" className="items-start gap-2">
                                    <FieldLabel
                                        htmlFor={`switch-mobile-${author.id}`}
                                        className="text-xs cursor-pointer"
                                    >
                                        Corresponding author
                                    </FieldLabel>

                                    <Switch
                                        size='sm'
                                        id={`switch-mobile-${author.id}`}
                                        checked={author.is_corresponding_author}
                                        onCheckedChange={(bool) => handleSwitchValue(bool, author)}
                                    />
                                </Field>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => {
                                        setEditAuthor(author)
                                        setOpenA(true)
                                    }}
                                >
                                    <Edit className="size-5 text-primary-main" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => {
                                        setDeleteAuthor(author)
                                        setOpen(true)
                                    }}
                                >
                                    <Trash2 className="size-5 text-destructive" />
                                </Button>
                            </div>
                        </fieldset>
                    </SortableItem>
                ))}
            </Sortable>

            <div className="sticky bottom-20 z-20">
                <div className={cn(
                    "ml-auto flex w-fit items-center gap-3 rounded-xl border px-4 py-3 shadow-md",
                    (data === authors) ? 'bg-background/90' : 'bg-background'
                )}>
                    {data === authors ? (
                        <span className="text-sm text-muted-foreground">
                            No unsaved changes
                        </span>
                    ) : (
                        <span className="text-sm text-muted-foreground">
                            You have unsaved changes
                        </span>
                    )}

                    <Button
                        type="button"
                        onClick={() => saveAuthorsMutation.mutate(authors)}
                        disabled={data === authors || saveAuthorsMutation.isPending}
                    >
                        {saveAuthorsMutation.isPending ? (
                            <>
                                <Spinner />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <HardDriveDownload />
                                <span>Save</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div >
    )
}

export default ShowAuthorsComponent
