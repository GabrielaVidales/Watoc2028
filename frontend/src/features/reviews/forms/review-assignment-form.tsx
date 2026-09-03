import { DateTimePopover } from '@/components/custom/datetime-popover'
import { SelectCommand } from '@/components/custom/select-command-generic'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import type { AbstractDTO } from '@/features/submissions/schemas/abstract-schemas'
import { cn } from '@/lib/utils'
import { assignmentSchema, type AssignmentFormInput, type AssignmentFormOutput } from '@/features/reviews/schemas/review-assignment-schema'
import type { UserSchema } from '@/features/users/schemas/user-schemas'
import { createAssignment, notifyAssignmentCreated, notifyAssignmentUpdated, updateAssignment } from '@/services/administration/review-assignments-services'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Plus, Pointer, RotateCw } from 'lucide-react'
import { useEffect, type FieldsetHTMLAttributes, type HTMLAttributes } from 'react'
import { Controller, useForm, useFormContext } from 'react-hook-form'


type Props = {
    defaultValues?: AssignmentFormInput
}

function ReviewAssignmentForm({ defaultValues, disabled, ...rest }: Props & FieldsetHTMLAttributes<HTMLFieldSetElement>) {

    const { control, reset, formState: { isSubmitting } } = useFormContext<AssignmentFormInput, any, AssignmentFormOutput>()

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset]);

    return (
        <fieldset className='px-1 grid grid-cols-1 gap-3' disabled={isSubmitting || disabled} {...rest}>
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
            <div className='grid grid-cols-2 gap-3'>
                <Controller
                    name="assigned_by"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation='responsive' data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Assigned by</FieldLabel>
                            <SelectCommand<UserSchema>
                                {...field}
                                value={defaultValues.assigned_by}
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
                                className='h-14 border-input'
                                contentClassName='md:max-w-70'
                                renderOption={null}
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
                                className='h-14 border-input'
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
            </div>
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
                            className='h-14 border-input'
                            contentClassName='md:max-w-100'
                            getId={u => u.id}
                            getTriggerLabel={abstract => abstract ? (
                                <div className={cn('text-left', fieldState.invalid && "text-destructive hover:text-destructive/80")}>
                                    <p className="truncate" dangerouslySetInnerHTML={{ __html: abstract?.title || 'No abstract selected' }} />
                                    <p className={cn('truncate font-normal text-xs', fieldState.invalid ? "text-destructive" : "text-muted-foreground")}>
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
                                className='border-input'
                                value={field.value}
                                onChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                                disableDates={{ before: new Date(new Date().setHours(24, 0, 0, 0)) }}
                                presets={[
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
    )
}

export default ReviewAssignmentForm
