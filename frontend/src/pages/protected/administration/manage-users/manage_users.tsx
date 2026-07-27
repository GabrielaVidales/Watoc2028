import { useAuth } from '@/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Activity, Eye, Filter, Search, Trash2, TriangleAlert } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from 'react-router'
import { routes } from '@/routes/routes'
import type { UserSchema } from '@/schemas/user-schemas'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { check } from 'zod'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import api from '@/clients/api'
import { useDebounce } from 'use-debounce'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import type { PaginatedResponse } from '@/domain/pagination'


type SearchFilters = {
    admin?: boolean,
    reviewer?: boolean,
    participant?: boolean,
}

function ManageUsersPage() {
    const [selectedUsers, setSelectedUsers] = useState<UserSchema[]>([])

    const [filters, setFilters] = React.useState<SearchFilters>({
        admin: false,
        reviewer: false,
        participant: false,
    })

    const onFilterChanged = (filters: SearchFilters) => {
        setFilters(prev => ({
            ...prev,
            ...filters,
        }))
    }

    const [search, setSearch] = React.useState('')
    const [debouncedInput] = useDebounce(search, 500)
    const { data, isFetching } = useQuery<PaginatedResponse<UserSchema>>({
        queryKey: ['users', debouncedInput],
        queryFn: async () => {
            const { data } = await api.get(`/users?search=${debouncedInput}`)
            console.log(data);
            
            return data
        }
    })

    const users = data?.results || []


    return (
        <div className='w-full max-w-5xl mx-auto'>
            <Breadcrumb className='mb-8'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={routes.users.profile}>
                                Dashboard
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={'#'}>
                                Administration
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Manage Users</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className='my-5'>
                <h1 className="text-2xl font-semibold">
                    Manage Users
                </h1>

                <p className="text-sm text-muted-foreground">
                    Search, filter and manage registered users.
                </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                    <InputGroup className="w-full max-w-md">
                        <InputGroupInput
                            placeholder="Search users..."
                            value={search}
                            onChange={(evt) => {
                                setSearch(evt.target.value)
                            }}
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            {data ? (data.results ? data.results.length : 0) : 0} results
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <Filter className="mr-2 size-4" />
                                Filters
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-60 space-y-3">
                            <FieldSet>
                                <FieldGroup data-slot="checkbox-group" className='gap-1!'>
                                    <p className='text-sm font-medium'>User role:</p>
                                    {[
                                        {
                                            id: 'role-admin',
                                            label: 'Administrator',
                                            value: filters.admin,
                                            onChecked: (b: boolean) => onFilterChanged({ admin: b })

                                        },
                                        {
                                            id: 'role-reviewer',
                                            label: 'Reviewer',
                                            value: filters.reviewer,
                                            onChecked: (b: boolean) => onFilterChanged({ reviewer: b })
                                        },
                                        {
                                            id: 'role-participant',
                                            label: 'Participant',
                                            value: filters.participant,
                                            onChecked: (b: boolean) => onFilterChanged({ participant: b })
                                        },
                                    ].map((item) => (
                                        <Field key={item.id} orientation="horizontal">
                                            <FieldLabel htmlFor={item.id} className='font-normal cursor-pointer p-1 rounded-sm'>
                                                <Checkbox
                                                    id={item.id}
                                                    name={item.id}
                                                    checked={item.value}
                                                    onCheckedChange={(checked) => item.onChecked(checked as boolean)}
                                                />
                                                <FieldContent>
                                                    {item.label}
                                                </FieldContent>
                                            </FieldLabel>
                                        </Field>
                                    ))}
                                </FieldGroup>
                            </FieldSet>
                        </PopoverContent>
                    </Popover>

                    <Button variant="ghost">
                        Reset
                    </Button>

                    <Button>
                        Apply
                    </Button>
                </div>
            </div>

            <main className='my-5 space-y-5'>

                {isFetching && Array.from({ length: 5 }).map((_, idx) => (
                    <Card key={idx}>
                        <CardContent className="flex items-center gap-4">
                            <Skeleton className="size-12 rounded-full shrink-0" />

                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-64" />
                                <Skeleton className="h-3 w-52" />
                            </div>

                            <div className="flex items-center gap-2">
                                <Skeleton className="size-10 rounded-md" />
                                <Skeleton className="size-10 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {users.map((user) => (
                    <Card
                        key={user.id}
                        className={cn(
                            "group cursor-pointer outline-2 outline-transparent rounded-md transition-colors duration-300",
                            "hover:outline-primary-light hover:shadow-sm",
                        )}
                    >
                        <CardContent className="flex items-center gap-4">
                            <Avatar className="size-12 shrink-0">
                                <AvatarImage src={user.photo as string || undefined} />
                                <AvatarFallback>
                                    {user.full_name
                                        ?.split(" ")
                                        .map((x) => x[0])
                                        .join("")
                                        .slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="truncate font-medium">
                                        {user.full_name}
                                    </h3>

                                    <Badge
                                        variant={user.is_active ? "default" : "secondary"}
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
                                    <Eye className="size-6" />
                                </Button>

                                <Button variant="ghost" size="icon-lg">
                                    <Trash2 className="size-6 text-destructive" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </main>
        </div>
    )
}

export default ManageUsersPage