import api from '@/clients/api'
import { Filters, type Filter, type FilterFieldConfig, type FilterOperator } from '@/components/reui/filters'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { UserSchema } from '@/schemas/user-schemas'
import { CalendarIcon, CheckCircle2, FunnelXIcon, FilterIcon, IdCard, Mail, Search, ShieldCheck, X, MoreHorizontal, Plus, Circle, ListFilter, UserSquare, Users, UserCheck, UserRound, ClipboardCheck } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { format, } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/formatDate'
import { motion, AnimatePresence } from "motion/react"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useDebounce } from 'use-debounce'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import type { PaginatedResponse } from '@/domain/pagination'


function ManageReviewsPage() {
    const [query, setQuery] = useState('')
    const [queryParams] = useDebounce(query, 300)
    const { data } = useQuery<UserSchema[]>({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 1000))
            const { data } = await api.get<UserSchema[]>(`/reviews/users${queryParams}`)
            return data
        }
    })


    const filteredUsers = (data as any)?.results || []
    console.log(filteredUsers);

    const operators: FilterOperator[] = [
        { value: "includes", label: "includes" },
        { value: "excludes", label: "excludes" },
    ]

    const fields = useMemo<FilterFieldConfig[]>(() => [
        {
            key: 'roles',
            label: 'Roles',
            icon: <ShieldCheck className='size-3.5 shrink-0' />,
            type: 'multiselect',
            className: "w-[180px]",
            placeholder: "Filter by role...",
            defaultOperator: 'includes',
            operators: operators,
            options: [
                { value: 'admin', label: 'Administrator', },
                { value: 'reviewer', label: 'Reviewer', },
                { value: 'participant', label: 'Participant', },
            ]
        },
        {
            key: 'email',
            label: 'Email',
            icon: <Mail className='size-3.5 shrink-0' />,
            type: 'text',
            className: "w-[200px]",
            placeholder: "example@email.com",
            operators: []
        },
        {
            key: 'is_active',
            label: 'Status',
            icon: <CheckCircle2 className='size-3.5 shrink-0' />,
            type: 'select',
            className: "w-[180px]",
            placeholder: "Select status...",
            operators: [],
            options: [
                {
                    label: 'Active',
                    value: 'true',
                    icon: <Circle className="size-3 shrink-0 fill-green-600 text-green-600" />
                },
                {
                    label: 'Inactive',
                    value: 'false',
                    icon: <Circle className="size-3 shrink-0 fill-red-600 text-red-600" />
                },
            ]
        },
        {
            key: 'first_name',
            label: 'First name',
            icon: <IdCard className='size-3.5 shrink-0' />,
            type: 'text',
            className: "w-[150px]",
            operators: []
        },
        {
            key: 'last_name',
            label: 'Last name',
            icon: <IdCard className='size-3.5 shrink-0' />,
            type: 'text',
            className: "w-[150px]",
            operators: []
        },
        {
            key: "creation_date",
            label: "Creation Date",
            icon: <CalendarIcon className="size-3.5 shrink-0" />,
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

    const [filters, setFilters] = useState<Filter[]>([])

    const handleFiltersChange = useCallback((filters: Filter[]) => {
        setFilters(filters)
    }, [])

    const applyFilters = () => {
        const query = filtersToQuery(filters)
        setQuery(query)
    }

    useEffect(() => {
        const query = filtersToQuery(filters)
        setQuery(query)
    }, [filters])


    const colorClasses = {
        blue: {
            border: "border-t-blue-700",
            text: "text-blue-700",
            fill: "fill-blue-700",
        },
        green: {
            border: "border-t-green-700",
            text: "text-green-700",
            fill: "fill-green-700",
        },
        red: {
            border: "border-t-red-700",
            text: "text-red-700",
            fill: "fill-red-700",
        },
        amber: {
            border: "border-t-amber-700",
            text: "text-amber-700",
            fill: "fill-amber-700",
        },
    } as const

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='bg-background border-b-2 border-b-border p-8'>
                <div className="flex items-center gap-3">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-3 border-primary-main/20 text-primary">
                        <UserSquare className="text-primary-main stroke-2 size-12" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Manage Users
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Search, filter and manage registered users.
                        </p>
                    </div>
                </div>

                <ScrollArea className='flex justify-between gap-5 mt-8 w-full'>
                    <div className="flex w-max space-x-4">
                        {[
                            {
                                color: "blue",
                                title: "Total Users",
                                count: 19,
                                Icon: Users,
                            },
                            {
                                color: "green",
                                title: "Active Users",
                                count: 15,
                                Icon: UserCheck,
                            },
                            {
                                color: "amber",
                                title: "Administrators",
                                count: 2,
                                Icon: ShieldCheck,
                            },
                            {
                                color: "blue",
                                title: "Participants",
                                count: 10,
                                Icon: UserRound,
                            },
                            {
                                color: "green",
                                title: "Reviewers",
                                count: 7,
                                Icon: ClipboardCheck,
                            },
                        ].map((item) => {
                            const c = colorClasses[item.color]

                            return (
                                <Card key={item.title} className={cn("w-55 shrink-0 border-t-6 py-4 gap-0", c.border)}>
                                    <CardHeader className="items-center">
                                        <CardAction className="order-first">
                                            <item.Icon className={cn("size-5", c.text, c.fill)} />
                                        </CardAction>
                                        <CardTitle>{item.title}</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <CardDescription className={cn("text-3xl font-bold", c.text)}>
                                            {item.count}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            <section className='flex-1 h-full'>
                <div className='space-y-4 bg-card py-4 px-8 h-full'>
                    <div className='flex justify-between'>
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-sm font-medium">
                                    {filteredUsers?.length ?? 0} users found
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    {filters.length > 0
                                        ? `${filters.length} active filter${filters.length > 1 ? "s" : ""}`
                                        : "Showing all users"}
                                </p>
                            </div>

                            {filters.length > 0 && (
                                <Badge variant="secondary">
                                    {filters.length} filter{filters.length > 1 ? "s" : ""}
                                </Badge>
                            )}
                        </div>

                        <div className='flex gap-2'>
                            <InputGroup className="max-w-xs">
                                <InputGroupInput placeholder="Search..." />
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                            </InputGroup>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant='outline' size='sm' className='group relative pr-6!'>
                                        <ListFilter />
                                        Filters

                                        {filters.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setFilters([])
                                                }}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-sm p-1 opacity-0 transition-opacity group-hover:opacity-100 group-hover:bg-accent"
                                            >
                                                <X className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                            </button>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-120">
                                    <div className="grid gap-2">
                                        <div className="flex justify-between">
                                            <div className='space-y-1'>
                                                <h4 className="leading-none font-medium">Filters</h4>
                                                <p className='text-muted-foreground text-xs'>Refine search params</p>
                                            </div>
                                            <Button variant="outline" size='sm' onClick={() => setFilters([])}>
                                                <FunnelXIcon />
                                                Clear
                                            </Button>
                                        </div>
                                        <div className="grid gap-2">
                                            <Filters
                                                size='sm'
                                                variant='default'
                                                filters={filters}
                                                fields={fields}
                                                onChange={handleFiltersChange}
                                                className='w-full'
                                                trigger={
                                                    <Button variant="default" size='sm'>
                                                        <FilterIcon />
                                                        Add Filter
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <Button size='sm'>
                                <Plus />
                                Add User
                            </Button>
                        </div>
                    </div>

                    <div>
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
                                            "border-l-6 border-l-primary-dark w-full py-3 rounded-l-none!",
                                            "group cursor-pointer outline-2 outline-transparent rounded-md transition-colors duration-300",
                                            "hover:outline-primary-light hover:shadow-sm",
                                        )}
                                    >
                                        <CardContent className="flex items-center gap-4">
                                            <Avatar className="size-16 shrink-0 shadow-md border-3 bg-card">
                                                <AvatarImage src={user.photo as string || undefined} />
                                                <AvatarFallback className='text-xl'>
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

                                                <p className="truncate text-sm font-medium text-muted-foreground">
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
                    </div>
                </div>
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