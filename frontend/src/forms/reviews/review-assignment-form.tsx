import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CommandShortcut } from '@/components/ui/command'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { SelectCommand } from '@/pages/test'
import type { AbstractDTO } from '@/schemas/abstracts/abstract-schemas'
import { assignmentSchema, type AssignmentFormOutput, type AssignmentFormInput } from '@/schemas/reviews/review-assignment-schema'
import type { UserSchema } from '@/schemas/user-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Plus, Pointer } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

type Props = {
    defaultValues?: AssignmentFormInput
}

function ReviewAssignmentForm({
    defaultValues = {
        user: null,
        abstract: null,
        assigned_by: null,
        due_date: null,
        is_active: true,
    }
}: Props) {
    const { control, handleSubmit, getValues, formState: { isSubmitting } } = useForm<AssignmentFormInput, any, AssignmentFormOutput>({
        resolver: zodResolver(assignmentSchema),
        mode: 'onChange',
        defaultValues: defaultValues
    })

    const onFormSubmit = handleSubmit(async (data) => {
        console.log(data);
    }, async (errors) => {
        console.log(errors, getValues());
    })

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset className='space-y-5 min-w-0' disabled={isSubmitting}>
                <section className='px-1 grid grid-cols-1 gap-6' >
                    <div className='space-y-6'>
                        <Controller
                            name="user"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field orientation='responsive' data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Select reviewer</FieldLabel>
                                    <SelectCommand<UserSchema>
                                        {...field}
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
                                        className='h-12'
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
                                    <FieldDescription>
                                        Search for an user to review this submission
                                    </FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                                        endpoint='/abstracts/submissions'
                                        queryKey='abstracts'
                                        className='h-12'
                                        contentClassName='md:max-w-100'
                                        getId={u => u.id}
                                        getTriggerLabel={abstract => (
                                            <div className='text-left'>
                                                <p className="truncate" dangerouslySetInnerHTML={{ __html: abstract?.title || 'No abstract selected' }} />
                                                <p className='truncate font-normal text-muted-foreground text-xs'>
                                                    {abstract.user?.full_name} ({abstract.user?.email})
                                                </p>
                                            </div>
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
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="assigned_by"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field orientation='responsive' data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Assigned by</FieldLabel>
                                    <SelectCommand<UserSchema>
                                        {...field}
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
                                        className='h-12'
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
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="due_date"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field orientation='responsive' data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Due date</FieldLabel>
                                    <FieldContent>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    aria-invalid={fieldState.invalid}
                                                    variant="outline"
                                                    className={cn(
                                                        "justify-start text-left font-normal",
                                                        fieldState.invalid && 'text-destructive'
                                                    )}
                                                >
                                                    <CalendarIcon />
                                                    {field.value ? format(field.value, "PPP") : <span>Seleccioná una fecha</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    captionLayout="dropdown"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FieldContent>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                </section>

                <section>
                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="horizontal" className='justify-between' data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldLabel htmlFor="form-rhf-switch-twoFactor">
                                        Enable assignment
                                    </FieldLabel>
                                    <FieldDescription>
                                        Enable multi-factor authentication to secure your account.
                                    </FieldDescription>
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
                </section>

                <div className='space-x-3'>
                    <Button type='button' variant='outline'>
                        Cancel
                    </Button>
                    <Button disabled={isSubmitting}>
                        Submit
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}

export default ReviewAssignmentForm