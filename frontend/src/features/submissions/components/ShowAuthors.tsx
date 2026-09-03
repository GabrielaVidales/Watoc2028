import { Sortable, SortableItem, SortableItemHandle, } from "@/components/reui/sortable"
import { ConfirmProvider, useConfirm } from "@/contexts/ConfirmationDialogContext"
import { AuthorForm, AuthorFormContent } from '@/features/submissions/forms/AbstractAuthorForm'
import { DEBUG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { deleteAuthor, getAbstractAuthors, saveAbstractAuthors, type SaveAbstractAuthorsParams } from '@/features/submissions/services/author-services'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Edit, GripVertical, MailIcon, Plus, RotateCw, Trash2, Upload, User2, UserPlus, Users2 } from 'lucide-react'
import React, { useState } from 'react'
import { notify } from '../../../components/custom/notify'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Button } from '../../../components/ui/button'
import { CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Field, FieldLabel } from '../../../components/ui/field'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Spinner } from '../../../components/ui/spinner'
import { Switch } from '../../../components/ui/switch'
import type { AuthorSchema } from "@/features/submissions/schemas/author-schema"


type APIError = {
    root: string[],
    authors: string[],
}

type Props = {
    abstractId: number | string
    onAuthorEdit?: (a: AuthorSchema) => void | Promise<void>
    onAuthorDelete?: (a: AuthorSchema) => void | Promise<void>
}

function ShowAuthorsComponent({ abstractId }: Props) {
    const confirm = useConfirm()

    const queryClient = useQueryClient()

    const { data = [] } = useQuery<AuthorSchema[]>({
        queryKey: ['authors', abstractId],
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: !!abstractId,
        queryFn: () => getAbstractAuthors(abstractId)
    })

    const editMutation = useMutation<AuthorSchema[], AxiosError, SaveAbstractAuthorsParams>({
        mutationFn: saveAbstractAuthors,
        onSuccess: () => {
            notify.success('Information saved successfully!', {
                description: 'Your submission author information was changed.'
            })
            queryClient.invalidateQueries({
                queryKey: ["authors", abstractId]
            })
        },
        onError: (error) => {
            DEBUG && console.error(error.response.data)

            const errors = (error.response.data as any).errors as APIError
            if (errors.root) {
                notify.destructive('Something went wrong!', {
                    description: errors.root.join(". "),
                })
            }
        }
    })

    const deleteMutation = useMutation<void, AxiosError, number>({
        mutationFn: deleteAuthor,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["authors", abstractId]
            })
        },
        onError: (error) => {
            DEBUG && console.error(error.response?.data)
        }
    })

    const [openA, setOpenA] = useState(false)
    const [editAuthor, setEditAuthor] = useState<AuthorSchema>(null)

    const [authors, setAuthors] = React.useState<AuthorSchema[]>([])
    const getAuthorValue = (a: AuthorSchema) => `${a.id}`
    const handleReorder = (a: AuthorSchema[]) => setAuthors(a)
    const handleSwitchValue = (value: boolean, ref: AuthorSchema) => {
        const next = authors.map(author => ({
            ...author,
            is_corresponding_author: author.id === ref.id ? value : false
        }))
        setAuthors(next)
    }

    React.useEffect(() => { setAuthors(data) }, [data])

    const handleDelete = (author: AuthorSchema) => {
        confirm({
            title: 'Delete Author?',
            btnLabel: 'Delete author',
            onConfirm: () => deleteMutation.mutate(author.id),
            description: <span>This action <strong>cannot be undone</strong>. This will permanently remove the author from this abstract.</span>
        })
    }

    if (!data) {
        return <Spinner />
    }

    return (
        <div className='max-w-full space-y-4'>
            <Dialog open={openA}
                onOpenChange={() => {
                    setOpenA(false);
                    setEditAuthor(null);
                }}
            >
                <DialogContent className='md:max-w-3xl w-full gap-0' onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>{editAuthor !== null ? 'Edit Author' : 'Add a new author'}</DialogTitle>
                        <DialogDescription className='max-sm:text-xs'>
                            {editAuthor !== null
                                ? 'Update an existent co-author.'
                                : 'Add a new co-author to the list.'}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="-mx-4 my-1 border-y overflow-y-auto px-4 overflow-visible max-sm:max-h-[40dvh] max-ms:max-h-[50dvh] max-h-[60dvh]">
                        <AuthorForm>
                            <AuthorFormContent abstractId={abstractId} values={editAuthor} onSubmit={() => {
                                setOpenA(false);
                                setEditAuthor(null);
                            }} />
                        </AuthorForm>
                    </ScrollArea>
                    <DialogDescription className='max-sm:text-[10px] text-xs pt-2'>
                        Note: If you add a registered user as a co-author for your submission, they will be notified to see the work they are related to.
                        If the co-author is not a registered user, you can add their information manually.
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button size='sm' variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button size='sm' form='author-form'>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <CardHeader className='px-0'>
                <CardTitle className="flex gap-3 items-center">
                    <UserPlus className='text-primary-main' />
                    <h2 className='text-xl font-semibold'>Authors List</h2>
                </CardTitle>
                <CardDescription>
                    Complete the details (full name, email, affiliation and country) of collaboration authors. You can include a maximum of 16 authors. Please indicate which of the authors will present the abstract.
                </CardDescription>
            </CardHeader>

            <Button size='sm' onClick={() => { setEditAuthor(null); setOpenA(true) }}>
                <Plus />
                Add Author
            </Button>

            <CardContent className='px-0'>
                <Sortable
                    value={authors}
                    onValueChange={handleReorder}
                    getItemValue={getAuthorValue}
                    className='space-y-1'
                >
                    {authors.length === 0 && (
                        <div
                            className={cn(
                                'flex flex-col justify-start gap-3 p-4 min-h-15',
                                'rounded-md border-2 border-dashed border-border'
                            )}
                        >
                            <div className='flex items-center gap-3 max-w-70 mx-auto'>
                                <Avatar className="size-14 shrink-0 border shadow-sm">
                                    <AvatarFallback variant='indigo'>
                                        <Users2 className='size-6' />
                                    </AvatarFallback>
                                </Avatar>

                                <div className='min-w-0 flex-1'>
                                    <h4 className='font-medium'>No authors added yet</h4>
                                    <p className='text-sm text-muted-foreground max-w-xs'>
                                        Add at least one author and select the corresponding author.
                                    </p>
                                </div>
                            </div>

                            <div className='mx-auto'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='shrink-0'
                                    onClick={() => {
                                        setEditAuthor(null)
                                        setOpenA(true)
                                    }}
                                >
                                    <UserPlus className='size-4' />
                                    Add Author
                                </Button>
                            </div>
                        </div>
                    )}

                    {authors?.map((author) => (
                        <SortableItem
                            key={author.id}
                            value={String(author.id)}
                            disabled={editMutation.isPending}
                            className={cn(
                                'relative p-2 border-2 border-border rounded-md transition-colors! duration-300',
                                'flex flex-col gap-3 cursor-auto',
                                'md:flex-row md:items-center md:justify-between',
                                'bg-background active:border-primary-light active:shadow-md'
                            )}
                        >
                            <SortableItemHandle
                                className={cn(
                                    'text-muted-foreground',
                                    'absolute right-3 top-4',
                                    'md:static',
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

                            <div className="min-w-0 flex-1 space-y-0">
                                {author.is_corresponding_author ? (
                                    <h4 className="flex min-w-0 items-center gap-1 truncate font-medium text-sm">
                                        <span className="truncate">
                                            {author.first_name} {author.last_name}
                                        </span>
                                        <MailIcon className="size-3.5 shrink-0 text-primary-main" />
                                    </h4>
                                ) : (
                                    <h4 className="truncate font-medium text-sm">
                                        {author.first_name} {author.last_name}{" "}
                                    </h4>
                                )}
                                <p className="truncate text-xs text-muted-foreground">
                                    {author.email}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
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

                                    {author?.editable && (
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => handleDelete(author)}
                                        >
                                            <Trash2 className="size-5 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                            </fieldset>
                        </SortableItem>
                    ))}
                </Sortable>
            </CardContent>

            <div className={"flex w-fit items-center gap-3 ml-auto"}>
                <Button
                    type='button'
                    variant='outline'
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['authors', abstractId], })}
                    disabled={data === authors || editMutation.isPending}
                >
                    <RotateCw className='text-muted-foreground' /> Reset
                </Button>

                <Button
                    type="button"
                    onClick={() => editMutation.mutate({ abstractId, authors })}
                    disabled={data === authors || editMutation.isPending}
                >
                    {editMutation.isPending ? (
                        <>
                            <Spinner />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Upload />
                            <span>Save Changes</span>
                        </>
                    )}
                </Button>
            </div>
        </div >
    )
}

export default (props: Props) => (
    <ConfirmProvider>
        <ShowAuthorsComponent {...props} />
    </ConfirmProvider>
)
