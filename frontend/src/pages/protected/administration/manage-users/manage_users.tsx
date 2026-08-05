import api from '@/clients/api'
import { CustomUserFilter } from '@/components/custom/custom-filter'
import { PaginationController, SelectItemsPerPage } from '@/components/custom/pagination-controller'
import type { Filter } from '@/components/reui/filters'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput, } from "@/components/ui/input-group"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import type { PaginatedResponse } from '@/domain/pagination'
import { AdminEditUserForm } from '@/forms/admin/users/admin-edit-user-form'
import { cn } from '@/lib/utils'
import type { UserSchema } from '@/schemas/user-schemas'
import { useQuery } from '@tanstack/react-query'
import { EditIcon, FunnelXIcon, ListFilter, MoreHorizontalIcon, PlusIcon, Search, Trash2Icon, Users2, X } from 'lucide-react'
import React from 'react'
import { useDebounce } from 'use-debounce'
import { filtersToQueryParams } from '../manage-reviews/manage-reviews'



function ManageUsersPage() {
    const [filters, setFilters] = React.useState<Filter[]>([])
    const [search, setSearch] = React.useState('')
    const [page, setPage] = React.useState(1)
    const [itemsPerPage, setItemsPerPage] = React.useState(5)
    const [debouncedInput] = useDebounce(search, 500)
    const { data, isLoading } = useQuery<PaginatedResponse<UserSchema>>({
        queryKey: ['users', debouncedInput, itemsPerPage, page, search, filters],
        queryFn: async () => {
            const { data } = await api.get(`/users`, {
                params: {
                    page: page,
                    limit: itemsPerPage,
                    search: debouncedInput,
                    ...filtersToQueryParams(filters),
                }
            })
            return data
        },
        refetchOnWindowFocus: false,
    })

    const users = data?.results || []

    const [selectedUser, setSelectedUser] = React.useState(null)
    const [sheetOpen, setSheetOpen] = React.useState(false)


    return (
        <article className='w-full h-full flex flex-col'>
            <header className='bg-background border-b-2 border-b-border space-y-4 p-8'>
                <div className='flex flex-col md:flex-row md:justify-between gap-5'>
                    <div className="flex items-start gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-2 border-primary-main/20 text-primary">
                            <Users2 className="text-primary-main stroke-2 size-8" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold">
                                Manage Users
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Manage and edit users
                            </p>
                        </div>
                    </div>

                </div>
            </header>

            <main className='border-b-2 border-b-border flex flex-col gap-4 p-2 md:p-4 lg:p-6 xl:p-8 flex-1'>
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

                        <Button size='sm'>
                            <PlusIcon />
                            Add User
                        </Button>
                    </div>
                </div>

                <section className='my-2 space-y-1 flex-1'>
                    {users.map((user) => (
                        <Item
                            key={user.id}
                            variant="outline"
                            className={cn(
                                "relative group cursor-pointer border-2 rounded-md transition-all duration-200",
                                "hover:shadow-md",
                                "max-sm:p-3 max-sm:gap-3",
                                user.is_active ?
                                    'bg-card border-primary-light/50 hover:border-primary-light' :
                                    'bg-destructive/10 border-destructive/20 hover:border-destructive'
                            )}
                        >
                            <ItemMedia>
                                <Avatar className={cn(
                                    "size-10 shrink-0 shadow",
                                )}>
                                    <AvatarImage src={user.photo as string || undefined} />
                                    <AvatarFallback>
                                        {user.full_name
                                            ?.split(" ")
                                            .map((x) => x[0])
                                            .join("")
                                            .slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                            </ItemMedia>
                            <ItemContent className="min-w-0">
                                <ItemTitle className='truncate max-sm:text-xs'>
                                    {user.full_name}
                                </ItemTitle>
                                <ItemDescription className='truncate max-sm:text-xs'>
                                    {user.email}
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions className='mb-auto'>
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon-lg" onClick={e => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}>
                                            <MoreHorizontalIcon className="size-5" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-40" align="end">
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                                Actions
                                            </DropdownMenuLabel>

                                            <DropdownMenuItem
                                                onSelect={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    setSelectedUser(user)
                                                    requestAnimationFrame(() => {
                                                        setSheetOpen(true)
                                                    })
                                                }}
                                            >
                                                <React.Fragment>
                                                    <EditIcon />
                                                    <span>Edit</span>
                                                </React.Fragment>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                variant="destructive"
                                                onSelect={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }}
                                            >
                                                <Trash2Icon />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </ItemActions>

                            <Badge
                                variant={user.is_active ? "primary" : "destructive"}
                                className={"absolute top-0 left-0 tracking-widest text-[10px] py-0 px-2 rounded-none rounded-br-sm rounded-tl-sm"}
                            >
                                {user.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </Item>
                    ))}
                </section>

                <section className='mt-auto'>
                    {users.length > 0 && (
                        <PaginationController
                            onPageChange={setPage}
                            page={page}
                            totalPages={data.meta.total_pages}
                        />
                    )}
                </section>

                <Sheet open={sheetOpen} modal={false}>
                    <SheetContent
                        side="right"
                        showCloseButton={false}
                        className="flex h-full w-full flex-col p-0 gap-0 md:max-w-2xl"
                    >
                        {selectedUser && (
                            <React.Fragment>
                                <SheetHeader className="border-b px-8 py-6">
                                    <SheetTitle className="text-xl font-semibold">
                                        Edit User
                                    </SheetTitle>

                                    <SheetDescription>
                                        {selectedUser.full_name}
                                    </SheetDescription>
                                </SheetHeader>

                                <ScrollArea className="min-h-0 no-scrollbar px-8">
                                    <AdminEditUserForm
                                        values={{
                                            id: selectedUser.id,
                                            email: selectedUser.email,
                                            email_verified: selectedUser.email_verified,
                                            firstName: selectedUser.first_name,
                                            middleName: selectedUser.middle_name,
                                            lastName: selectedUser.last_name,
                                            is_active: selectedUser.is_active,
                                            city: selectedUser.city,
                                            nationality: selectedUser.nationality,
                                            prefix: selectedUser.prefix,
                                            roles: selectedUser.roles,
                                            photo: selectedUser.photo as string,
                                            delete_photo: false,
                                            photo_file: null,
                                        }}
                                    />
                                </ScrollArea>

                                <SheetFooter className="border-t bg-background px-8 py-4 sm:flex-row sm:justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setSheetOpen(false)}
                                    >
                                        Cancel
                                    </Button>

                                    <Button form="admin-edit-user-form" type="submit">
                                        Save changes
                                    </Button>
                                </SheetFooter>
                            </React.Fragment>
                        )}
                    </SheetContent>
                </Sheet>
            </main>
        </article >
    )
}

export default ManageUsersPage