import api from '@/clients/api'
import { CustomUserFilter } from '@/components/custom/custom-filter'
import { PaginationController, SelectItemsPerPage } from '@/components/custom/pagination-controller'
import type { Filter } from '@/components/reui/filters'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/contexts/AuthContext'
import type { PaginatedResponse } from '@/domain/pagination'
import type { ReviewAssignment } from '@/domain/reviews'
import { filtersToQueryParams } from '@/utils/filter-operations'
import { formatDate } from '@/utils/formatDate'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { CalendarDaysIcon, EyeIcon, FunnelXIcon, ListFilter, MoreHorizontal, PlusIcon, SearchIcon, Users2Icon, XIcon } from 'lucide-react'
import React from 'react'
import { useDebounce } from 'use-debounce'
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from 'react-router'
import { routes } from '@/routes/routes'


function ReviewsList() {
    const { user: user } = useAuth()
    const navigate = useNavigate()

    const [filters, setFilters] = React.useState<Filter[]>([])
    const [search, setSearch] = React.useState('')
    const [page, setPage] = React.useState(1)
    const [itemsPerPage, setItemsPerPage] = React.useState(5)
    const [debouncedInput] = useDebounce(search, 500)
    const { data, isLoading } = useQuery<PaginatedResponse<ReviewAssignment>>({
        queryKey: ['reviews', user.id, debouncedInput, itemsPerPage, page, search, filters],
        queryFn: async () => {
            const { data } = await api.get('/reviews/assignments/for-user/', {
                params: {
                    page: page,
                    limit: itemsPerPage,
                    search: debouncedInput,
                    ...filtersToQueryParams(filters),
                }
            })
            return data
        },
        placeholderData: keepPreviousData
    })

    console.log(data);

    const assignments = data?.results ? data.results : []

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <article className='w-full h-full flex flex-col'>
            <header className='bg-background border-b-2 border-b-border space-y-4 p-8'>
                <div className='flex flex-col md:flex-row md:justify-between gap-5'>
                    <div className="flex items-start gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-2 border-primary-main/20 text-primary">
                            <Users2Icon className="text-primary-main stroke-2 size-8" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold">
                                My Review Assignments
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Manage your assignments
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className='flex flex-col gap-4 py-2 px-2 md:px-4 lg:px-6 xl:px-8 flex-1'>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                        <InputGroup className="w-full max-w-xs h-8 p-2 px-0 text-xs">
                            <InputGroupInput
                                placeholder="Search users..."
                                value={search}
                                onChange={(evt) => {
                                    setSearch(evt.target.value)
                                }}
                            />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                            <InputGroupAddon align="inline-end" className='text-xs'>
                                {data ? (data.results ? data.results.length : 0) : 0} results
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <div className="flex items-center gap-2">
                        <SelectItemsPerPage
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            size='sm'
                        />

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant='outline' size='sm' className='group relative pr-6!'>
                                    <ListFilter />
                                    Filters {" "}

                                    {filters.length > 0 && (
                                        <span>({filters.length})</span>
                                    )}

                                    {filters.length > 0 && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setFilters([])
                                            }}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-sm p-1  group-hover:bg-accent hover:text-destructive"
                                        >
                                            <XIcon className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        </div>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-120" align='end'>
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
                                        <CustomUserFilter
                                            filters={filters}
                                            setFilters={setFilters}
                                        />
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Button size='sm'>
                            <PlusIcon />
                            Add User
                        </Button>
                    </div>
                </div>

                <section className='my-2 space-y-1 flex-1 rounded-sm'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                        <AnimatePresence mode="sync">
                            {assignments.map((assignment, i) => {
                                const now = Date.now();
                                const remaining = assignment.due_date_timestamp - now;

                                const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
                                const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
                                const minutes = Math.floor((remaining / (1000 * 60)) % 60);

                                const remainingText = remaining <= 0 ?
                                    "Expired" : `${days}d ${hours}h ${minutes}m remaining`;

                                const badgeVariant = (
                                    remaining <= 0 ?
                                        "destructive" : remaining < 1000 * 60 * 60 * 24 ?
                                            "warning" : "success"
                                ) as "success" | "warning" | "destructive"

                                return (
                                    <motion.div
                                        key={assignment.id}
                                        initial={{ opacity: 0, x: 12, scale: 0.98, }}
                                        animate={{ opacity: 1, x: 0, scale: 1, }}
                                        exit={{ opacity: 0, x: -12, scale: 0.98, }}
                                        transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.07 }}
                                    >
                                        <Card className="overflow-hidden transition-shadow hover:shadow-md gap-1">
                                            <CardHeader className="flex flex-row items-start justify-between">
                                                <CardTitle
                                                    className="line-clamp-2 text-lg leading-tight"
                                                    dangerouslySetInnerHTML={{
                                                        __html: assignment.abstract.title,
                                                    }}
                                                />
                                                <CardAction>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreHorizontal className="size-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent className="w-40" align="end">
                                                            <DropdownMenuGroup>
                                                                <DropdownMenuLabel className="text-xs text-muted-foreground">
                                                                    Actions
                                                                </DropdownMenuLabel>

                                                                <DropdownMenuItem
                                                                    onClick={() => navigate(routes.users.reviews.view.build({ id: assignment.id }))}
                                                                >
                                                                    <EyeIcon />
                                                                    <span>View detail</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </CardAction>
                                            </CardHeader>

                                            {/* Caja destacada para Fecha Límite */}
                                            <CardContent className="py-2 text-xs">
                                                <div className="flex justify-between gap-2 rounded-md bg-muted/50 p-2.5 border border-border/40">
                                                    <div className='flex items-center gap-2'>
                                                        <CalendarDaysIcon className="size-4 text-muted-foreground shrink-0" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                                                                Due date
                                                            </span>
                                                            <span className="font-medium text-foreground">
                                                                {formatDate(new Date(assignment.due_date_timestamp))}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <Badge variant={badgeVariant}>
                                                        {remainingText}
                                                    </Badge>
                                                </div>
                                            </CardContent>

                                            {/* Footer con metadata e información del autor */}
                                            <CardFooter className="flex flex-col items-start gap-0 text-[11px] text-muted-foreground">
                                                <div className="flex w-full justify-between">
                                                    <span>Created: {formatDate(new Date(assignment.created_at_timestamp))}</span>
                                                    <span>Updated: {formatDate(new Date(assignment.last_update_timestamp))}</span>
                                                </div>

                                                <div className="w-full truncate pt-1 text-foreground/80">
                                                    Assigned by: <span className="font-medium">{assignment.assigned_by.full_name}</span>{" "}
                                                    <span className="text-muted-foreground">({assignment.assigned_by.email})</span>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                </section>

                <section className='mt-auto'>
                    {assignments.length > 0 && (
                        <PaginationController
                            onPageChange={setPage}
                            page={page}
                            totalPages={data.meta.total_pages}
                        />
                    )}
                </section>
            </main>
        </article>
    )
}

export default ReviewsList