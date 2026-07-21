import axiosClient from '@/clients/axiosClient'
import { createFilter, Filters, type Filter, type FilterFieldConfig, type FilterOperator } from '@/components/reui/filters'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { UserSchema } from '@/schemas/user-schemas'
import { CalendarIcon, CheckCircle2, FunnelXIcon, FilterIcon, IdCard, ListFilterIcon, Mail, Power, Search, ShieldCheck, User2 } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { format, } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function ManageReviewsPage() {
    const operators: FilterOperator[] = [
        { value: "is_any_of", label: 'is any of' },
        { value: "is_not_any_of", label: 'is not any of' },
        { value: "includes_all", label: 'includes all' },
        { value: "excludes_all", label: 'excludes all' },
    ]

    const fields = useMemo<FilterFieldConfig[]>(() => [
        {
            key: 'assignee',
            label: 'Assignee',
            icon: <User2 className='size-3.5' />,
            type: "multiselect",
            className: "w-[200px]",
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
                        <span className="flex items-center gap-1.5">
                            {user.icon || <User2 className="size-3.5" />}
                            <span>{user.label}</span>
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
        },
        {
            key: 'status',
            label: 'Status',
            icon: <CheckCircle2 className='size-3.5 text-muted-foreground' />,
            type: 'select',
            className: "w-[180px]",
            placeholder: "Select status...",
        },
        {
            key: 'first_name',
            label: 'First name',
            icon: <IdCard className='size-3.5' />,
            type: 'text',
            className: "w-[150px]",
        },
        {
            key: 'last_name',
            label: 'Last name',
            icon: <IdCard className='size-3.5' />,
            type: 'text',
            className: "w-[150px]",
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
        createFilter('email', 'contains', ['eduardo1582000@gmail.com']),
        createFilter('first_name', 'contains', ['eduardo']),
        createFilter('roles', 'includes', ['reviewer', 'participant']),
    ])

    const handleFiltersChange = useCallback((filters: Filter[]) => {
        setFilters(filters)
    }, [])

    return (
        <div className='w-full max-w-5xl mx-auto'>

            <div className='my-5'>
                <h1 className="text-2xl font-semibold">
                    Manage Users
                </h1>

                <p className="text-sm text-muted-foreground">
                    Search, filter and manage registered users.
                </p>
            </div>

            <Card className='mb-4'>
                <CardContent className='flex justify-between w-full'>
                    <div className="w-full">
                        <Filters
                            size='sm'
                            filters={filters}
                            fields={fields}
                            onChange={handleFiltersChange}
                            trigger={
                                <Button variant="default">
                                    <FilterIcon />
                                    Add Filter
                                </Button>
                            }
                        />
                    </div>
                    <div className='flex gap-3 ml-auto'>
                        <Button onClick={() => {
                            console.log(filters);

                            console.log(filtersToQuery(filters))
                        }}>
                            <Search />
                            Apply
                        </Button>
                        <Button variant="outline" onClick={() => setFilters([])}>
                            <FunnelXIcon />
                            Clear
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className='flex justify-between w-full'>

                    { }

                </CardContent>
            </Card>
        </div>
    )
}

export default ManageReviewsPage



export const DJANGO_OPERATOR_MAP = {
    contains: 'icontains',    // Búsqueda parcial (case-insensitive)
    equals: 'exact',          // Coincidencia exacta estricta
    includes: 'in',           // Búsqueda en una lista de opciones
    excludes: 'not_in',    // Excluir elementos de una lista
    startsWith: 'istartswith',// Inicia con (case-insensitive)
    endsWith: 'iendswith',    // Termina con (case-insensitive)
    greaterThan: 'gt',        // >
    lessThan: 'lt',            // <
    is: 'exact',
    is_not: 'ne',          // Not equal / Excluir fecha u opción
    before: 'lt',          // Menor que (fechas)
    after: 'gt',           // Mayor que (fechas)
};


export function filtersToQuery(filters: Filter[]) {
    const queryUrl = filters.map(f => filterToQuery(f)).join('&')
    return `/?${queryUrl}`;
}

export function filterToQuery(filter: Filter) {
    return `${filter.field}__${DJANGO_OPERATOR_MAP[filter.operator]}=${filter.values.join(',')}`
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