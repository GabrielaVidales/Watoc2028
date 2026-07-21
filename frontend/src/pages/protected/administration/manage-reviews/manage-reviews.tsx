import axiosClient from '@/clients/axiosClient'
import { createFilter, Filters, type Filter, type FilterFieldConfig, type FilterOperator } from '@/components/reui/filters'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { UserSchema } from '@/schemas/user-schemas'
import { CalendarIcon, CheckCircle2, FunnelXIcon, FilterIcon, IdCard, ListFilterIcon, Mail, Power, Search, ShieldCheck, User2, X, Eye, Trash2, Menu, MoreHorizontal, Plus, Dot, Circle, FunctionSquare } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { format, } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemActions, ItemContent } from '@/components/ui/item'
import { cn } from '@/lib/utils'
import { UserSearchCommand } from '@/forms/AbstractAuthorForm'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/formatDate'
import { motion, AnimatePresence } from "motion/react"
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'


function ManageReviewsPage() {
    const [query, setQuery] = useState('')
    const { data: filteredUsers, isLoading } = useQuery<UserSchema[]>({
        queryKey: ['users', query],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 1000))
            const { data } = await axiosClient.get<UserSchema[]>(`/reviews/users${query}`)
            return data
        }
    })

    const operators: FilterOperator[] = [
        { value: "is_any_of", label: 'is' },
        { value: "is_not_any_of", label: 'is not' },
        { value: "includes_all", label: 'includes' },
        { value: "excludes_all", label: 'excludes' },
    ]

    const fields = useMemo<FilterFieldConfig[]>(() => [
        {
            key: 'assignee',
            label: 'Assignee',
            icon: <User2 className='size-3.5' />,
            type: "multiselect",
            className: "w-40 max-w-40 bg-destructive",
            placeholder: "Search assignee...",
            searchable: true,
            operators: operators,
            loadOptions: async (query: string) => {
                console.log(query);
                const { data } = await axiosClient.get<UserSchema[]>('/reviews/users')
                return data.map(u => ({
                    label: u.full_name,
                    value: u.id,
                    icon: (
                        <Avatar className="size-5">
                            <AvatarImage
                                src={u.photo as string || null}
                                alt={u.full_name}
                            />
                            <AvatarFallback>{u.first_name[0]}{u.last_name[0]}</AvatarFallback>
                        </Avatar>
                    ),
                }))
            },
            customValueRenderer: (values: any[], options: any[]) => {
                // Buscamos en las opciones actuales (las que devolvió loadOptions)
                const selected = values.map(val => options.find(opt => opt.value === val)).filter(Boolean);
                if (selected.length === 0) return <span className="text-muted-foreground">Select...</span>;
                if (selected.length === 1) {
                    const user = selected[0];
                    return (
                        <span className="flex items-center gap-1.5 max-w-40">
                            {user.icon || <User2 className="size-3.5" />}
                              <span className="min-w-0 truncate">{user.label}</span>
                        </span>
                    );
                }
                return <span>{selected.length} selected</span>;
            },
        },
        {
            key: 'roles',
            label: 'Roles',
            icon: <ShieldCheck className='size-3.5 text-muted-foreground' />,
            type: 'multiselect',
            className: "w-[180px]",
            placeholder: "Filter by role...",
            defaultOperator: 'includes',
            operators: [
                { value: "includes", label: "includes" },
                { value: "excludes", label: "excludes" },
            ],
            options: [
                { value: 'admin', label: 'Administrator', },
                { value: 'reviewer', label: 'Reviewer', },
                { value: 'participant', label: 'Participant', },
            ]
        },
        {
            key: 'email',
            label: 'Email',
            icon: <Mail className='size-3.5' />,
            type: 'text',
            className: "w-[200px]",
            placeholder: "example@email.com",
            operators: []
        },
        {
            key: 'is_active',
            label: 'Status',
            icon: <CheckCircle2 className='size-3.5 text-muted-foreground' />,
            type: 'select',
            className: "w-[180px]",
            placeholder: "Select status...",
            operators: [],
            options: [
                {
                    label: 'Active',
                    value: 'true',
                    icon: <Circle className="size-3 fill-green-600 text-green-600" />
                },
                {
                    label: 'Inactive',
                    value: 'false',
                    icon: <Circle className="size-3 fill-red-600 text-red-600" />
                },
            ]
        },
        {
            key: 'first_name',
            label: 'First name',
            icon: <IdCard className='size-3.5' />,
            type: 'text',
            className: "w-[150px]",
            operators: []
        },
        {
            key: 'last_name',
            label: 'Last name',
            icon: <IdCard className='size-3.5' />,
            type: 'text',
            className: "w-[150px]",
            operators: []
        },
        {
            key: "creation_date",
            label: "Creation Date",
            icon: <CalendarIcon className="size-3.5" />,
            type: "custom",
            operators: [
                { value: "is", label: "is" },
                { value: "is_not", label: "is not" },
                { value: "before", label: "before" },
                { value: "after", label: "after" },
            ],
            customRenderer: ({ values, onChange }) => (
                <CustomDateInput
                    values={values}
                    onChange={onChange}
                />
            ),
        },
    ], []);


    const [filters, setFilters] = useState<Filter[]>([
        createFilter('email', 'is', ['eduardo1582000@gmail.com']),
        createFilter('roles', 'includes', ['reviewer', 'participant']),
        createFilter('first_name', 'is', ['eduardo']),
        createFilter('last_name', 'is', ['escalante']),
    ])

    const handleFiltersChange = useCallback((filters: Filter[]) => {
        setFilters(filters)
    }, [])

    const applyFilters = () => {
        const query = filtersToQuery(filters)
        setQuery(query)
    }

    return (
        <div className='w-full mx-auto p-8'>
            <div>
                <h1 className="text-2xl font-semibold">
                    Manage Users
                </h1>

                <p className="text-sm text-muted-foreground">
                    Search, filter and manage registered users.
                </p>
            </div>

            <section className='grid grid-cols-[1fr_480px] gap-4'>
                <div className='space-y-4'>
                    <Card>
                        <CardContent className='flex justify-between w-full'>
                            <Button variant='success'>
                                Add User
                                <Plus />
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className='flex flex-col w-full gap-1.5 min-h-80'>
                            <AnimatePresence>
                                {filteredUsers?.map((user, index) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, x: -10, scale: 0.98 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: 10, scale: 0.98 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.1,
                                            ease: "easeOut",
                                        }}
                                    >
                                        <Card
                                            className={cn(
                                                "border-l-6 border-l-primary-dark w-full py-3",
                                                "group cursor-pointer outline-2 outline-transparent rounded-md transition-colors duration-300",
                                                "hover:outline-primary-light hover:shadow-sm",
                                            )}
                                        >
                                            <CardContent className="flex items-center gap-4">
                                                <Avatar className="size-14 shrink-0 shadow-md border">
                                                    <AvatarImage src={user.photo as string || undefined} />
                                                    <AvatarFallback className='text-lg'>
                                                        {user.full_name
                                                            ?.split(" ")
                                                            .map((x) => x[0])
                                                            .join("")
                                                            .slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="truncate font-medium text-lg text-primary-main">
                                                            {user.full_name}
                                                        </h3>

                                                        <Badge
                                                            variant={user.is_active ? "success" : "destructive"}
                                                            className="h-5 px-2 text-[10px]"
                                                        >
                                                            {user.is_active ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </div>

                                                    <p className="truncate text-sm text-muted-foreground">
                                                        {user.email}
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Joined {formatDate(user.date_joined)} • Last login {formatDate(user.last_login)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon-lg">
                                                        <MoreHorizontal className="size-6" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </div>
                <Card className='gap-3'>
                    <CardHeader className="border-b gap-0">
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-2 border-primary-main/20 text-primary">
                                <FunctionSquare className="text-primary-main stroke-[2.5] size-7" />
                            </div>

                            <div>
                                <CardTitle className='text-lg'>Search Filters</CardTitle>
                                <CardDescription className='text-sm'>
                                    Add one or more filters to refine the search.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent >
                        <Filters
                            size='sm'
                            variant='default'
                            filters={filters}
                            fields={fields}
                            onChange={handleFiltersChange}
                            className='w-full space-y-3'
                            trigger={
                                <Button variant="default" size='sm'>
                                    <FilterIcon />
                                    Add Filter
                                </Button>
                            }
                            actions={
                                <div className='flex gap-3 ml-auto'>
                                    <Button variant="outline" size='sm' onClick={() => setFilters([])}>
                                        <FunnelXIcon />
                                        Clear
                                    </Button>
                                    <Button onClick={applyFilters} size='sm'>
                                        Apply
                                    </Button>
                                </div>
                            }
                        />
                    </CardContent>
                </Card>
            </section>


        </div>
    )
}

export default ManageReviewsPage



export const DJANGO_OPERATOR_MAP = {
    is: '',                 // Equal / Se deja tal cual =
    is_not: 'ne',              // Not equal / Excluir fecha u opción
    contains: 'icontains',    // Búsqueda parcial (case-insensitive)
    equals: 'exact',          // Coincidencia exacta estricta
    includes: 'in',           // Búsqueda en una lista de opciones
    excludes: 'not_in',    // Excluir elementos de una lista
    startsWith: 'istartswith',// Inicia con (case-insensitive)
    endsWith: 'iendswith',    // Termina con (case-insensitive)
    greaterThan: 'gt',        // >
    lessThan: 'lt',            // <
    before: 'lt',          // Menor que (fechas)
    after: 'gt',           // Mayor que (fechas)
};


export function filtersToQuery(filters: Filter[]) {
    const queryUrl = filters.map(f => filterToQuery(f)).join('&')
    return `${queryUrl && '/?'}${queryUrl}`;
}

export function filterToQuery(filter: Filter) {
    const mappedOperator = DJANGO_OPERATOR_MAP[filter.operator]
    return `${filter.field}${mappedOperator && '__'}${mappedOperator}=${filter.values.join(',')}`
}


type CustomRendererProps = {
    values: unknown[]
    onChange: (values: unknown[]) => void
    autoFocus?: boolean
}

function CustomDateInput({ values, onChange, autoFocus }: CustomRendererProps) {
    const value = Number(values?.[0])
    const date = value ? new Date(value) : undefined

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (autoFocus) {
            const timer = setTimeout(() => setIsOpen(true), 400)
            return () => clearTimeout(timer)
        }
    }, [autoFocus])

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const iso = Number(selectedDate)
            onChange([iso])
            setIsOpen(false)
        }
    }

    const handleCancel = () => {
        setIsOpen(false)
    }

    const displayText = date ? format(date, "PPP") : "Select a date"

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className='flex items-center font-normal'>
                    {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                    {displayText}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                />
                <div className="border-border flex items-center justify-end gap-1.5 border-t p-3">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={() => setIsOpen(false)}>Apply</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}