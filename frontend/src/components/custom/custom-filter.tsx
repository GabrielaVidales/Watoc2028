import api from "@/clients/api"
import { Filters, type Filter, type FilterFieldConfig, type FilterOperator, type FilterOption, } from "@/components/reui/filters"
import type { PaginatedResponse } from "@/domain/pagination"
import { CustomDateInput } from "@/pages/protected/administration/manage-reviews/manage-reviews"
import type { UserSchema } from "@/schemas/user-schemas"
import { CalendarIcon, CheckCircle2, Circle, FilterIcon, IdCard, Mail, ShieldCheck, UsersIcon } from 'lucide-react'
import { useMemo, useRef } from "react"
import { Button } from "../ui/button"


type CustomFilterProps = {
    filters?: Filter[]
    setFilters?: (filters: Filter[]) => void
}

export function CustomUserFilter({
    filters = [],
    setFilters = () => { },
}: CustomFilterProps) {
    const cacheRef = useRef<FilterOption[] | null>(null)

    const operators: FilterOperator[] = [
        { value: "includes", label: "includes" },
        { value: "excludes", label: "excludes" },
    ]

    const fields = useMemo<FilterFieldConfig[]>(() => [
        {
            key: "team",
            label: "Team",
            icon: <UsersIcon className="size-3.5" />,
            type: "multiselect",
            loadOptions: async (query: string) => {
                if (!cacheRef.current) {
                    await new Promise((resolve) => setTimeout(resolve, 600))
                    const { data } = await api.get<PaginatedResponse<UserSchema>>(`/users/?search=${query}`)

                    if (data.results) {
                        cacheRef.current = data.results.map(user => ({
                            value: user.id,
                            label: user.full_name
                        }))
                    }
                }
                const q = query.trim().toLowerCase()
                return q
                    ? cacheRef.current.filter((team) =>
                        team.label.toLowerCase().includes(q)
                    )
                    : cacheRef.current
            },

        },
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

    return (
        <Filters
            size="sm"
            filters={filters}
            fields={fields}
            onChange={setFilters}
            className='w-full'
            trigger={
                <Button variant="default" size='xs'>
                    <FilterIcon />
                    Add Filter
                </Button>
            }
        />
    )
}
