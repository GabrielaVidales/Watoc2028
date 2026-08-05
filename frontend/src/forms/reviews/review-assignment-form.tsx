import { DateTimePopover } from '@/components/custom/datetime-popover'
import { SelectCommand } from '@/components/custom/select-command-generic'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CommandShortcut } from '@/components/ui/command'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import type { AbstractDTO } from '@/schemas/abstracts/abstract-schemas'
import { assignmentSchema, type AssignmentFormInput, type AssignmentFormOutput } from '@/schemas/reviews/review-assignment-schema'
import type { UserSchema } from '@/schemas/user-schemas'
import { createAssignment, notifyAssignmentCreated } from '@/services/administration/review-services'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pointer } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'


type Props = {
    defaultValues?: AssignmentFormInput
    updateQueryKey?: readonly unknown[]
}

function ReviewAssignmentForm({ defaultValues, updateQueryKey }: Props) {
    const queryClient = useQueryClient()

    const { user } = useAuth()

    const { control, handleSubmit, setValue, reset, getValues, formState: { isSubmitting } } = useForm<AssignmentFormInput, any, AssignmentFormOutput>({
        resolver: zodResolver(assignmentSchema),
        mode: 'onChange',
        defaultValues: {
            user: null,
            abstract: null,
            assigned_by: user,
            due_date: null,
            is_active: true,
        }
    })

    const onFormSubmit = handleSubmit(async (data) => {
        await create.mutateAsync(data)
    }, async (errors) => {
        console.log(errors, getValues());
    })

    const create = useMutation({
        mutationFn: createAssignment,
        onSuccess: (assignment => {
            notifyAssignmentCreated(assignment)
            queryClient.invalidateQueries({
                queryKey: updateQueryKey,
            })
        }),
        onError: (error) => {
            console.warn('Erorr?: ', error)
        }
    })

    useEffect(() => {
        setValue('assigned_by', user)
        if (defaultValues) {
            reset({
                assigned_by: user,
                abstract: defaultValues.abstract,
                due_date: defaultValues.due_date,
                is_active: defaultValues.is_active,
                user: defaultValues.user,
            })
        }
    }, [defaultValues])

    return (
        <form onSubmit={onFormSubmit} id='review-assignment-form'>
            <fieldset className='px-1 grid grid-cols-1 gap-3' disabled={isSubmitting}>
                <Controller
                    name="assigned_by"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation='responsive' data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Assigned by</FieldLabel>
                            <SelectCommand<UserSchema>
                                {...field}
                                value={user}
                                disabled
                                endpoint='/users/'
                                queryKey='users'
                                getId={u => u.id}
                                getTriggerLabel={user => user ? (
                                    <div className='text-left font-normal flex gap-2 items-center'>
                                        <Avatar className="size-8 shrink-0 border shadow-sm">
                                            <AvatarImage loading='lazy' src={user?.photo as string ?? null} />
                                            <AvatarFallback>
                                                <span className='text-xs leading-0'>
                                                    {user?.full_name
                                                        .split(" ")
                                                        .map((x) => x[0])
                                                        .join("")
                                                        .slice(0, 2)
                                                    }
                                                </span>
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="truncate">
                                            <p className="truncate" title={user?.full_name}>{user?.full_name}</p>
                                            <p className='truncate text-muted-foreground text-xs'>{user?.email}</p>
                                        </div>
                                    </div>
                                ) : 'Select an user'}
                                className='h-14'
                                contentClassName='md:max-w-70'
                                renderOption={null}
                            />
                        </Field>
                    )}
                />
                <Controller
                    name="is_active"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" className='justify-between' data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor={field.name} className='cursor-pointer'>
                                    Enable assignment
                                </FieldLabel>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </FieldContent>
                            <Switch
                                id={field.name}
                                name={field.name}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                            />
                        </Field>
                    )}
                />
                <Controller
                    name="user"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation='responsive' data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Select reviewer</FieldLabel>
                            <SelectCommand<UserSchema>
                                {...field}
                                aria-invalid={fieldState.invalid}
                                endpoint='/users/'
                                queryKey='users'
                                getId={u => u.id}
                                getTriggerLabel={user => user ? (
                                    <div className='text-left font-normal flex gap-2 items-center'>
                                        <Avatar className="size-8 shrink-0 border shadow-sm">
                                            <AvatarImage loading='lazy' src={user?.photo as string ?? null} />
                                            <AvatarFallback>
                                                <span className='text-xs leading-0'>
                                                    {user?.full_name
                                                        .split(" ")
                                                        .map((x) => x[0])
                                                        .join("")
                                                        .slice(0, 2)
                                                    }
                                                </span>
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="truncate">
                                            <p className="truncate" title={user?.full_name}>{user?.full_name}</p>
                                            <p className='truncate text-muted-foreground text-xs'>{user?.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <span className={cn('font-normal', fieldState.invalid ? "text-destructive" : "text-muted-foreground")}>
                                        No user selected
                                    </span>
                                )}
                                className='h-14'
                                contentClassName='md:max-w-70'
                                renderOption={(user) => (
                                    <>
                                        <Avatar className="size-8 shrink-0 border shadow-sm">
                                            <AvatarImage loading='lazy' src={user?.photo as string ?? null} />
                                            <AvatarFallback>
                                                <span className='text-xs leading-0'>
                                                    {user?.full_name
                                                        .split(" ")
                                                        .map((x) => x[0])
                                                        .join("")
                                                        .slice(0, 2)
                                                    }
                                                </span>
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="truncate">
                                            <p className="truncate" title={user?.full_name}>{user?.full_name}</p>
                                            <p className='truncate text-muted-foreground text-xs'>{user?.email}</p>
                                        </div>
                                        <CommandShortcut>
                                            <Plus className="size-4" />
                                        </CommandShortcut>
                                    </>
                                )}
                            />
                        </Field>
                    )}
                />
                <Controller
                    name="abstract"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation='responsive' data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Select submission</FieldLabel>
                            <SelectCommand<AbstractDTO>
                                {...field}
                                aria-invalid={fieldState.invalid}
                                endpoint='/abstracts/submissions'
                                queryKey='abstracts'
                                className='h-14'
                                contentClassName='md:max-w-100'
                                getId={u => u.id}
                                getTriggerLabel={abstract => abstract ? (
                                    <div className='text-left'>
                                        <p className="truncate" dangerouslySetInnerHTML={{ __html: abstract?.title || 'No abstract selected' }} />
                                        <p className='truncate font-normal text-muted-foreground text-xs'>
                                            {abstract.user?.full_name} ({abstract.user?.email})
                                        </p>
                                    </div>
                                ) : (
                                    <span className={cn('font-normal', fieldState.invalid ? "text-destructive" : "text-muted-foreground")}>
                                        No submission selected
                                    </span>
                                )}
                                renderOption={(abstract, isSelected) => (
                                    <>
                                        <Pointer className={cn(
                                            "h-4 w-4 rotate-90 text-primary-main",
                                            isSelected ? "opacity-100" : "opacity-0"
                                        )} />
                                        <div className="truncate">
                                            <p className="truncate font-medium" title={abstract.title} dangerouslySetInnerHTML={{ __html: abstract.title }} />
                                            <p className="text-xs text-muted-foreground truncate">
                                                {abstract.user?.full_name} ({abstract.user?.email})
                                            </p>
                                        </div>
                                        <CommandShortcut>
                                            <Plus className="size-4" />
                                        </CommandShortcut>
                                    </>
                                )}
                            />
                        </Field>
                    )}
                />
                <Controller
                    name="due_date"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Due date</FieldLabel>
                            <FieldContent>
                                <DateTimePopover
                                    value={field.value}
                                    onChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    presets={[
                                        { label: "Today", days: 0, },
                                        { label: "Tomorrow", days: 1, },
                                        { label: "3 Days", days: 3, },
                                        { label: "1 Week", days: 7, },
                                        { label: "2 Weeks", days: 14, },
                                        { label: "1 Month", days: 30, },
                                    ]}
                                />
                            </FieldContent>
                            <div className="flex justify-end h-5 -mb-2">
                                <FieldError errors={[fieldState.error]} />
                            </div>
                        </Field>
                    )}
                />
            </fieldset>
        </form>
    )
}

export default ReviewAssignmentForm
