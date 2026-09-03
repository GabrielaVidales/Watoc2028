import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useConfirm } from '@/contexts/ConfirmationDialogContext'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import type { AbstractSchema } from '@/features/submissions/schemas/abstract-schemas'
import { deleteSubmission } from '@/features/submissions/services/submission-services'
import { DEBUG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { routes } from '@/routes/routes'
import { formatDate } from '@/utils/formatDate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { CircleAlert, Eye, FilePenIcon, MoreVertical, Pencil, Send, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router'

export const presentationTypes = [
    {
        value: 'oral',
        label: 'Oral Presentation'
    },
    {
        value: 'poster',
        label: 'Poster Presentation'
    },
    {
        value: '',
        label: 'Not Set'
    },
]

type AbstractItemProps = {
    disabled?: boolean
    abstract: AbstractSchema
    onAbstractSelected: (a: AbstractSchema) => void
}

export function AbstractItem({
    abstract,
    onAbstractSelected,
}: AbstractItemProps) {
    const { user: user } = useAuth()

    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const confirm = useConfirm()


    const { mutateAsync } = useMutation<void, AxiosError, number | string>({
        mutationKey: ['delete-submission'],
        mutationFn: deleteSubmission,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['abstracts', user.id],
                exact: false,
            })
        },
        onError: (error) => {
            DEBUG && console.log(error.response.data);
        }
    })

    const handleDelete = async () => {
        await confirm({
            title: 'Delete Abstract?',
            description: 'This action cannot be undone. The abstract will be permanently deleted.',
            onConfirm: async () => await mutateAsync(abstract.id)
        })
    }


    return (
        <Card key={abstract.id} className="p-4 group outline-2 outline-transparent hover:shadow-md hover:outline-primary-light transition-all duration-300">
            <CardHeader className="flex flex-row items-start gap-3 px-0">
                <CardAction>
                    <div className={cn(
                        "p-1 flex flex-col size-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 border-2 border-amber-400 text-primary",
                        "transition-all duration-400 group-hover:-translate-y-1 group-hover:shadow-md"
                    )}>
                        <FilePenIcon className="text-amber-400 size-6 shrink-0" />
                        {/* <p className='text-amber-400 mx-auto text-center font-semibold text-[11px]'>
                            Not submitted
                        </p> */}
                    </div>
                </CardAction>
                <div className='space-y-2 min-w-0'>
                    <CardTitle className="text-base sm:text-lg font-semibold leading-tight min-w-0">
                        {abstract.title ? (
                            <div
                                onClick={() => onAbstractSelected(abstract)}
                                title={abstract.plain_title}
                                className="cursor-pointer hover:underline truncate"
                                dangerouslySetInnerHTML={{ __html: abstract.title }}
                            />
                        ) : (
                            <span className="flex items-center gap-2 text-destructive">
                                <CircleAlert className="shrink-0 size-5" />
                                Undefined title
                            </span>
                        )}
                    </CardTitle>

                    <CardDescription className="text-sm flex gap-1 items-center">
                        {abstract.is_for_young_watoc ? (
                            <Badge variant="outline">
                                <span className="flex items-center gap-1">
                                    Young WATOC
                                </span>
                            </Badge>
                        ) : (
                            <Badge variant="outline">
                                {presentationTypes?.find((p) => p.value === abstract.presentation_type)?.label || (
                                    <span className="flex items-center gap-1 text-destructive">
                                        <CircleAlert className="size-3.5 shrink-0" />
                                        Presentation type not set
                                    </span>
                                )}
                            </Badge>
                        )}
                    </CardDescription>

                    <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                            Created: {formatDate(abstract.created_at)} | Last update: {formatDate(abstract.last_update)}
                        </p>
                    </div>
                </div>
                <CardAction className='ml-auto'>
                    <div className="flex items-center ml-auto gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <MoreVertical className="size-5" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onAbstractSelected(abstract)}>
                                    <Eye className="mr-2 size-4" />
                                    Preview
                                </DropdownMenuItem>

                                {abstract.status !== "submitted" && (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                navigate(routes.users.submissions.edit.build({
                                                    id: abstract.id,
                                                }))
                                            }}
                                        >
                                            <Pencil className="mr-2 size-4" />
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => {
                                                navigate(routes.users.submissions.edit.build({
                                                    id: abstract.id,
                                                }) + "?action=submit")
                                            }}
                                        >
                                            <Send className="mr-2 size-4" />
                                            Submit
                                        </DropdownMenuItem>
                                    </>
                                )}

                                <DropdownMenuSeparator />

                                <DropdownMenuItem variant='destructive' onClick={handleDelete}>
                                    <Trash2 className="mr-2 size-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardAction>
            </CardHeader>
        </Card>
    )
}