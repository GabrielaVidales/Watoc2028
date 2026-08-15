import { CustomUserFilter } from '@/components/custom/custom-filter'
import { PaginationController } from '@/components/custom/pagination-controller'
import { type Filter } from '@/components/reui/filters'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import type { PaginatedRequest, PaginatedResponse } from '@/domain/pagination'
import type { ReviewAssignment } from '@/domain/reviews'
import DialogReviewAssignmentForm from '@/forms/reviews/dialog-assignment-form'
import ReviewAssignmentForm from '@/forms/reviews/review-assignment-form'
import { getAllAssignments } from '@/services/administration/review-services'
import { formatDate } from '@/utils/formatDate'
import { useQuery } from '@tanstack/react-query'
import { CalendarDaysIcon, EyeIcon, FunnelXIcon, InfoIcon, ListFilter, MoreHorizontal, Plus, Search, UserSquare, X } from 'lucide-react'
import { motion } from "motion/react"
import { useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'


function ManageReviewsPage() {
    const [filters, setFilters] = useState<Filter[]>([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [debouncedSearch] = useDebounce(search, 500)

    const requestParams = useMemo<PaginatedRequest>(() => ({
        filters,
        page,
        itemsPerPage,
        search: debouncedSearch,
    }), [filters, page, itemsPerPage, debouncedSearch]);

    const { data: pageResults, isLoading } = useQuery<PaginatedResponse<ReviewAssignment>>({
        queryKey: ['reviewers', requestParams],
        queryFn: async () => await getAllAssignments(requestParams)
    })

    const [selected, setSelected] = useState<number>(-1)
    const [open, setOpen] = useState(false)

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='bg-background border-b-2 border-b-border p-8'>
                <div className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-2 border-primary-main/20 text-primary">
                        <UserSquare className="text-primary-main stroke-2 size-8" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Gestión de Reviews
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            En esta vista puedes visualizar y gestionar la asignación de Abstracts a los revisores del congreso.
                        </p>
                    </div>
                </div>
            </div>

            <section className='flex-1 h-full bg-secondary p-2 md:p-6'>
                <div className='space-y-4 h-full'>
                    <div className='flex justify-between'>
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-sm font-medium">
                                    {/* {filteredUsers?.length ?? 0} users found */}
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
                                <InputGroupInput
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search..."
                                />
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
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setFilters([])
                                                }}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-sm p-1 opacity-0 transition-opacity group-hover:opacity-100 group-hover:bg-accent hover:text-destructive"
                                            >
                                                <X className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
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

                            <Button size='sm' onClick={() => {
                                setSelected(null)
                                setOpen(true)
                            }}>
                                <Plus />
                                Add Assignment
                            </Button>
                        </div>
                    </div>

                    <DialogReviewAssignmentForm
                        onClose={() => {
                            setSelected(null)
                            setOpen(false)
                        }}
                        assignment={selected}
                        setOpen={setOpen}
                        open={open}
                    />

                    <section className="flex flex-wrap items-stretch gap-3">
                        {pageResults?.results.map((assignment, i) => (
                            <motion.div
                                key={assignment.id}
                                className="w-full max-w-sm flex"
                                initial={{ opacity: 0, x: 12, scale: 0.98 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -12, scale: 0.98 }}
                                transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.1 }}
                            >
                                <ReviewAssignmentComponent
                                    onAssignmentSelected={a => {
                                        if (selected === a.id) {
                                            setSelected(null)
                                            setOpen(false)
                                            return
                                        }
                                        setSelected(a.id)
                                        setOpen(true)
                                    }}
                                    assignment={assignment}
                                />
                            </motion.div>
                        ))}
                    </section>

                    <div>
                        <PaginationController
                            onPageChange={setPage}
                            page={page}
                            totalPages={pageResults ? pageResults.meta.total_pages : 0}
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ManageReviewsPage



type ReviewAssignmentComponentProps = {
    assignment: ReviewAssignment
    onAssignmentSelected?: (a: ReviewAssignment) => void
}

export function ReviewAssignmentComponent({ assignment, onAssignmentSelected }: ReviewAssignmentComponentProps) {
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
        <Card key={assignment.id} className="h-full w-full overflow-hidden transition-shadow hover:shadow-md gap-0">
            <CardHeader>
                <div className="flex items-start gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <InfoIcon className="mt-1 stroke-3 size-4 shrink-0 text-primary-main dark:text-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs w-full truncate">Assigned by:</p>
                            <p className="font-medium">{assignment.assigned_by.full_name}</p>{" "}
                            <p className='text-[10px]'>{assignment.assigned_by.email}</p>

                            <Separator className='my-2' />

                            <p>Created: {formatDate(new Date(assignment.created_at_timestamp))}</p>
                            <p>Updated: {formatDate(new Date(assignment.last_update_timestamp))}</p>
                        </TooltipContent>
                    </Tooltip>
                    <CardTitle
                        className="line-clamp-2 max-sm:text-sm text-lg leading-tight"
                        dangerouslySetInnerHTML={{
                            __html: assignment.abstract.title,
                        }}
                    />
                </div>

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
                                    onClick={() => {
                                        onAssignmentSelected(assignment)
                                    }}
                                // onClick={() => navigate(routes.users.reviews.view.build({ id: assignment.id }))}
                                >
                                    <EyeIcon />
                                    <span>View detail</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardAction>
            </CardHeader>

            <CardContent>
                <CardDescription className="border-b pb-3 mb-3 flex flex-wrap items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                        <CalendarDaysIcon className="size-3.5" />
                        <span>
                            Due date: {formatDate(new Date(assignment.due_date_timestamp))}
                        </span>
                    </div>

                    <Badge
                        variant={badgeVariant}
                        className="h-5 text-[10px] ml-auto"
                    >
                        {remainingText}
                    </Badge>
                </CardDescription>

                <div className='text-left font-normal flex gap-2 items-center'>
                    <Avatar className="size-8 shrink-0 border shadow-sm">
                        <AvatarImage loading='lazy' src={assignment.user.photo as string ?? null} />
                        <AvatarFallback>
                            <span className='text-xs leading-0'>
                                {assignment.user.full_name
                                    .split(" ")
                                    .map((x) => x[0])
                                    .join("")
                                    .slice(0, 2)
                                }
                            </span>
                        </AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                        <p className="max-sm:text-[10px] text-xs text-muted-foreground">Assigned to</p>
                        <p className="max-sm:text-xs text-sm truncate font-medium" title={assignment.user.full_name}>{assignment.user.full_name}</p>
                        <p className='max-sm:text-[10px] text-xs truncate text-muted-foreground'>{assignment.user.email}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
