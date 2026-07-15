import React from 'react'
import axiosClient from '@/clients/axiosClient'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { authorFormSchema, type AuthorFormSchema, type AuthorSchema } from '@/schemas/author-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Plus, School, Search, UserRoundX, X } from 'lucide-react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut, } from "@/components/ui/command"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent } from '@/components/ui/item'
import { Skeleton } from '@/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { UserSchema } from '@/schemas/user-schemas'
import type { Affiliation } from '@/schemas/affiliation-schema'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { countries, getCountryImage } from '@/utils/countriesInfo'
import { Switch } from '@/components/ui/switch'
import { isAxiosError } from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { useParams } from 'react-router'


export function AuthorForm({ children }: React.PropsWithChildren) {
    const form = useForm<AuthorFormSchema>({
        resolver: zodResolver(authorFormSchema),
        mode: 'onChange',
        defaultValues: {
            affiliation_id: null,
            email: '',
            first_name: '',
            id: null,
            is_corresponding_author: false,
            last_name: '',
            order: 1,
            related_user_id: null,
            city: '',
            country: '',
            institution: '',
        }
    })

    return (
        <FormProvider {...form} >
            {children}
        </FormProvider>
    )
}


type Props = {
    values?: AuthorSchema
    onSubmit?: () => void
}
export function AuthorFormContent({ onSubmit, values }: Props) {
    const { id: abstractId } = useParams()

    const queryClient = useQueryClient()

    const { control, setValue, handleSubmit, getValues, reset, formState: { isSubmitting, isLoading } } = useFormContext<AuthorFormSchema>()
    const [user, setUser] = React.useState<Partial<UserSchema>>(null)
    const handleUserSelection = (user: UserSchema | null) => {
        if (user === null) {
            setValue('related_user_id', null)
            setValue('first_name', '')
            setValue('last_name', '')
            setValue('email', '')
            setUser(null)
            return
        }
        setUser(user)
        setValue('related_user_id', user.id)
        setValue('first_name', user.first_name, { shouldValidate: true })
        setValue('last_name', user.last_name, { shouldValidate: true })
        setValue('email', user.email, { shouldValidate: true })
    }

    const [affiliation, setAffiliation] = React.useState<Affiliation>(null)
    const handleAffiliationSelected = (affiliation: Affiliation | null) => {
        if (affiliation === null) {
            setValue('affiliation_id', null)
            setValue('institution', '')
            setValue('country', '')
            setValue('city', '')
            setAffiliation(null)
            return
        }
        setValue('affiliation_id', affiliation.id)
        setValue('institution', affiliation.institution, { shouldValidate: true })
        setValue('country', affiliation.country, { shouldValidate: true })
        setValue('city', affiliation.city, { shouldValidate: true })
        setAffiliation(affiliation)
    }

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            if (data.id) {
                const res = await axiosClient.patch(`/abstracts/authors/${data.id}/`, { ...data, abstract_id: 1 })
                if (import.meta.env.DEV)
                    console.log(res);
            } else {
                const res = await axiosClient.post('/abstracts/authors/', { ...data, id: undefined, abstract_id: 1 })
                if (import.meta.env.DEV)
                    console.log(res);
            }

            reset(data)
            onSubmit?.()
            queryClient.invalidateQueries({
                queryKey: ['authors', abstractId],
            })
        } catch (error) {
            if (isAxiosError(error)) {
                if (import.meta.env.DEV) {
                    console.error(error.response);
                }
            }
        }
    }, async (data) => {
        if (import.meta.env.DEV) {
            console.error(data, getValues());
        }
    })


    React.useEffect(() => {
        if (values) {
            setTimeout(() => {
                reset({
                    ...values,
                    affiliation_id: values.affiliation?.id || null,
                    related_user_id: values.related_user?.id || null,
                    institution: values.affiliation?.institution || '',
                    country: values.affiliation?.country || '',
                    city: values.affiliation?.city || '',
                    is_corresponding_author: values.is_corresponding_author,
                }, {
                    keepDefaultValues: false,
                })

                if (values.affiliation) {
                    setAffiliation({
                        id: values.affiliation?.id,
                        institution: values.affiliation?.institution,
                        country: values.affiliation?.country,
                        city: values.affiliation?.city,
                    })
                }

                if (values.related_user) {
                    setUser({
                        id: values.related_user?.id,
                        first_name: values.related_user?.first_name,
                        last_name: values.related_user.last_name,
                        full_name: values.related_user.full_name,
                        email: values.related_user.email,
                        photo: values.related_user.photo,
                    })
                }
            }, 100)
        }
    }, [values, setAffiliation, setUser, reset])

    return (
        <form id='author-form' onSubmit={onFormSubmit}>
            <fieldset className='px-1 space-y-3 grid grid-cols-1 md:grid-cols-2 md:gap-x-5 gap-3' disabled={isSubmitting}>
                <div className='space-y-3'>
                    {/* Related user */}
                    <Field>
                        <FieldLabel htmlFor={'related-user-id'}>Search registered author</FieldLabel>
                        <Item variant='outline' className={cn(
                            "group relative cursor-pointer p-3 border-2 border-border rounded-md transition-colors duration-300",
                            "hover:border-primary-light hover:shadow-sm",
                            "flex flex-row items-center justify-between gap-3",
                        )}>
                            <ItemActions>
                                <Avatar className="size-8 border shadow-sm">
                                    <AvatarImage loading='lazy' src={user?.photo as string ?? null} />
                                    <AvatarFallback>
                                        {user ? (
                                            user.full_name
                                                .split(" ")
                                                .map((x) => x[0])
                                                .join("")
                                                .slice(0, 2)

                                        ) : (
                                            'NA'
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                            </ItemActions>
                            <ItemContent className='mb-auto'>
                                {user ? (
                                    <div className='text-xs'>
                                        <p className='tracking-wide font-medium'>{user.first_name} {user.last_name}</p>
                                        <p className='text-muted-foreground'>{user.email}</p>
                                    </div>
                                ) : (
                                    <div className='text-xs'>
                                        <p className='tracking-wide font-medium'>Not user selected</p>
                                        <p className='text-muted-foreground'>No information displayed</p>
                                    </div>
                                )}
                            </ItemContent>
                            <ItemActions>
                                {user ? (
                                    <Button
                                        type='button'
                                        variant="ghost"
                                        size="icon-sm"
                                        className='hover:text-destructive'
                                        onClick={() => handleUserSelection(null)}
                                    >
                                        <X />
                                    </Button>
                                ) : (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type='button'
                                                variant="outline"
                                                size="sm"
                                                className='hover:text-primary-main'
                                            >
                                                <span>Search</span>
                                                <Search />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-xs bg-transparent shadow-none border-none">
                                            <UserSearchCommand onUserSelected={handleUserSelection} />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </ItemActions>
                        </Item>
                    </Field>

                    <fieldset className='space-y-1' disabled={Boolean(user)}>
                        <Controller
                            name={`first_name`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    <div className={cn(
                                        "overflow-hidden transition-all h-6 duration-200 ease-in-out",
                                        fieldState.invalid ? " opacity-100" : " opacity-0"
                                    )}>
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </Field>
                            )}
                        />
                        <Controller
                            name={`last_name`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    <div className={cn(
                                        "overflow-hidden transition-all h-6 duration-200 ease-in-out",
                                        fieldState.invalid ? " opacity-100" : " opacity-0"
                                    )}>
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </Field>
                            )}
                        />
                        <Controller
                            name={`email`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            maxLength={100}
                                            placeholder='email@example.com'
                                        />
                                        <InputGroupAddon>
                                            <Mail />
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <div className={cn(
                                        "overflow-hidden transition-all h-6 duration-200 ease-in-out",
                                        fieldState.invalid ? " opacity-100" : " opacity-0"
                                    )}>
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </Field>
                            )}
                        />
                    </fieldset>

                    <Controller
                        name="is_corresponding_author"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="horizontal" data-invalid={fieldState.invalid} className='justify-between'>
                                <FieldContent>
                                    <FieldLabel htmlFor="form-rhf-switch-twoFactor">
                                        Mark as corresponding author
                                    </FieldLabel>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldContent>
                                <Switch
                                    id="form-rhf-switch-twoFactor"
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                />
                            </Field>
                        )}
                    />
                </div>

                <div className="space-y-3 border-t pt-6 md:pt-0 md:border-t-0 md:border-l-2 md:pl-6">
                    {/* Afiliación */}
                    <Field>
                        <FieldLabel htmlFor={'related-user-id'}>Search existing affiliation</FieldLabel>
                        <Item variant='outline' className={cn(
                            "group relative cursor-pointer p-3 border-2 border-border rounded-md transition-colors duration-300",
                            "hover:border-primary-light hover:shadow-sm",
                            "flex flex-row items-center justify-between gap-3",
                        )}>
                            <ItemActions>
                                <Avatar className="size-8 border shadow-sm flex justify-center items-center">
                                    <School className='size-5 text-muted-foreground' />
                                </Avatar>
                            </ItemActions>
                            <ItemContent className='mb-auto'>
                                {affiliation ? (
                                    <div className='text-xs'>
                                        <p className='tracking-wide font-medium'>{affiliation.institution}</p>
                                        <p className='text-muted-foreground'>{affiliation.city}, {affiliation.country}</p>
                                    </div>
                                ) : (
                                    <div className='text-xs'>
                                        <p className='tracking-wide font-medium'>Not affiliation selected</p>
                                        <p className='text-muted-foreground'>No information displayed</p>
                                    </div>
                                )}

                            </ItemContent>
                            <ItemActions>
                                {affiliation ? (
                                    <Button
                                        type='button'
                                        variant="ghost"
                                        size="icon-sm"
                                        className='hover:text-destructive'
                                        onClick={() => handleAffiliationSelected(null)}
                                    >
                                        <X />
                                    </Button>
                                ) : (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type='button'
                                                variant="outline"
                                                size="sm"
                                                className='hover:text-primary-main'
                                            >
                                                <span>Search</span>
                                                <Search />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-xs bg-transparent shadow-none border-none">
                                            <AffiliationSearchCommand onAffiliationSelected={handleAffiliationSelected} />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </ItemActions>
                        </Item>
                    </Field>

                    <fieldset className='space-y-1' disabled={Boolean(affiliation)}>
                        <Controller
                            name={'institution'}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Institution</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />

                                    <div
                                        className={cn(
                                            "overflow-hidden transition-all h-6 duration-200 ease-in-out",
                                            fieldState.invalid ? " opacity-100" : " opacity-0"
                                        )}
                                    >
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </Field>
                            )}
                        />

                        <Controller
                            name={`country`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor="form-select-nationality"   >
                                            Country
                                        </FieldLabel>
                                    </FieldContent>
                                    <Select
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={puta => {
                                            console.log('OJALA TE VIOLEN PUTA', puta);

                                            field.onChange(puta)
                                        }}
                                    >
                                        <SelectTrigger
                                            id="form-select-nationality"
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <SelectValue placeholder="Select an option..." />
                                        </SelectTrigger>
                                        <SelectContent position="item-aligned">
                                            {countries.map(c => (
                                                <SelectItem value={c.value as string} key={c.value}>
                                                    {getCountryImage(c.label)}
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div
                                        className={cn(
                                            "overflow-hidden transition-all h-6 duration-200 ease-in-out",
                                            fieldState.invalid ? " opacity-100" : " opacity-0"
                                        )}
                                    >
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </Field>
                            )}
                        />

                        <Controller
                            name={'city'}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>City</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    <div
                                        className={cn(
                                            "overflow-hidden transition-all h-6 duration-200 ease-in-out",
                                            fieldState.invalid ? " opacity-100" : " opacity-0"
                                        )}
                                    >
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </Field>
                            )}
                        />
                    </fieldset>
                </div>
            </fieldset>
        </form>
    )
}


type UserSearchProps = {
    onUserSelected?: (item: Partial<UserSchema>) => void
}

export function UserSearchCommand({ onUserSelected }: UserSearchProps) {
    const [input, setInput] = React.useState('')
    const [debouncedInput] = useDebounce(input, 300)
    const { data, isLoading } = useQuery<UserSchema[]>({
        queryKey: ['users', debouncedInput],
        queryFn: async () => {
            if (input === '') return []
            try {
                const { data } = await axiosClient.get<UserSchema[]>(`users?search=${debouncedInput}`)
                return data
            } catch (error) {
                return []
            }
        }
    })

    return (
        <Command shouldFilter={false} className="w-full h-full rounded-lg border shadow-md">
            <CommandInput
                placeholder="Search by name or email..."
                value={input}
                onValueChange={(value) => { setInput(value) }}
            />
            <CommandList>
                {input === "" ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Search className="size-8 text-muted-foreground" />
                        <p className="font-medium">Search for an author</p>
                        <p className="text-sm text-muted-foreground">
                            Enter a name or email address.
                        </p>
                    </div>
                ) : isLoading ? (
                    <div className="space-y-3 p-4">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                    </div>
                ) : data?.length === 0 ? (
                    <CommandEmpty>
                        <div className="flex flex-col items-center justify-center gap-2 py-8">
                            <UserRoundX className="size-8 text-muted-foreground" />
                            <p className="font-medium">No users found</p>
                            <p className="text-sm text-muted-foreground">
                                No users match "{input}".
                            </p>
                        </div>
                    </CommandEmpty>
                ) : (
                    <CommandGroup heading="Users">
                        {data.map((user) => (
                            <CommandItem
                                key={user.id}
                                className='cursor-pointer p-2'
                                onSelect={() => onUserSelected(user)}
                            >
                                <Avatar className="size-12 border shadow-sm">
                                    <AvatarImage loading='lazy' src={user.photo as string ?? null} />
                                    <AvatarFallback>
                                        {user.full_name
                                            .split(" ")
                                            .map((x) => x[0])
                                            .join("")
                                            .slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='tracking-wide font-medium'>{user.first_name} {user.last_name}</p>
                                    <p className='text-xs text-muted-foreground'>{user.email}</p>
                                </div>
                                <CommandShortcut>
                                    <Plus className='size-5' />
                                </CommandShortcut>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </Command>
    )
}


type AffiliationSearchProps = {
    onAffiliationSelected?: (item: Partial<Affiliation>) => void
}

export function AffiliationSearchCommand({ onAffiliationSelected }: AffiliationSearchProps) {
    const [input, setInput] = React.useState('')
    const [debouncedInput] = useDebounce(input, 300)
    const { data, isLoading } = useQuery<Affiliation[]>({
        queryKey: ['users', debouncedInput],
        queryFn: async () => {
            try {
                const { data } = await axiosClient.get<Affiliation[]>(`abstracts/affiliations/?search=${debouncedInput}`)
                return data
            } catch (error) {
                return []
            }
        }
    })

    return (
        <Command shouldFilter={false} className="w-full h-full rounded-lg border shadow-md">

            <CommandInput
                placeholder="Search by name or email..."
                value={input}
                onValueChange={(value) => { setInput(value) }}
            />
            <CommandList>
                {input === "" ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <School className="size-8 text-muted-foreground" />
                        <p className="font-medium">Search for an affiliation</p>
                        <p className="text-sm text-muted-foreground">
                            Enter an institution, city or country.
                        </p>
                    </div>
                ) : isLoading ? (
                    <div className="space-y-3 p-4">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                    </div>
                ) : data?.length === 0 ? (
                    <CommandEmpty>
                        <div className="flex flex-col items-center justify-center gap-2 py-8">
                            <School className="size-8 text-muted-foreground" />
                            <p className="font-medium">No affiliations found</p>
                            <p className="text-sm text-muted-foreground">
                                No affiliations match "{input}".
                            </p>
                        </div>
                    </CommandEmpty>
                ) : (
                    <CommandGroup heading="Previously used affiliations">
                        {data.map((affiliation) => (
                            <CommandItem
                                key={affiliation.id}
                                className='cursor-pointer p-2'
                                onSelect={() => onAffiliationSelected(affiliation)}
                            >
                                <Avatar className="size-8 border shadow-sm flex justify-center items-center">
                                    <School className='size-5 text-muted-foreground' />
                                </Avatar>

                                <div className='text-sm'>
                                    <p className='tracking-wide font-medium'>{affiliation.institution}</p>
                                    <p className='text-xs text-muted-foreground'>{affiliation.city}, {affiliation.country}</p>
                                </div>
                                <CommandShortcut>
                                    <Plus className='size-5' />
                                </CommandShortcut>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>

        </Command>
    )
}