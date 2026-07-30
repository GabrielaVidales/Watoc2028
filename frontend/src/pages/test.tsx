import api from '@/clients/api'
import { notify } from '@/components/custom/notify'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command"
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import type { PaginatedResponse } from '@/domain/pagination'
import ReviewAssignmentForm from '@/forms/reviews/review-assignment-form'
import { cn } from '@/lib/utils'
import type { AbstractDTO } from '@/schemas/abstracts/abstract-schemas'
import type { UserSchema } from '@/schemas/user-schemas'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronDown, Circle, Plus, Pointer, SearchX, X } from 'lucide-react'
import React, { useEffect, type HTMLAttributes } from 'react'
import { useDebounce } from 'use-debounce'

function TestPage() {
    const [selected, setSelected] = React.useState<Partial<AbstractDTO>>(null);
    const [user, setUser] = React.useState<Partial<UserSchema>>(null);

    useEffect(() => {
        console.log(selected);
    }, [selected])

    return (
        <div className='max-w-lg mx-auto w-full gap-4 p-2'>

            <Card className='w-full mx-auto'>
                <CardHeader>
                    <CardTitle>Review Assignment</CardTitle>
                    <CardDescription>
                        View, create, edit, or remove author records for your submission.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent>
                    <Button onClick={() => {
                        const variants = ["default", "success", "warning", "destructive", "info"];
                        variants.forEach((v) => {
                            notify[v]('Something went wrong!!', {
                                description: 'Chingada puta de mierda cagada.',
                            })
                        });
                    }}>
                        Toast
                    </Button>

                    <Button onClick={async () => {
                        try {
                            const results = await Promise.all([
                                api.get('/users/session'),
                                api.get('/users/session'),
                                api.get('/users/session'),
                                api.get('/users/session'),
                                api.get('/users/session'),
                            ]);

                            console.log('✅ ¡Éxito! Todas las peticiones respondieron:', results);
                        } catch (error) {
                            console.error('❌ Una o más peticiones fallaron:', error);
                        }

                    }}>
                        Test requests
                    </Button>
                </CardContent>
            </Card>

        </div>
    )
}

export default TestPage


type SelectAbstractCommandProps = {
    value: Partial<AbstractDTO>
    onChange: (a: Partial<AbstractDTO>) => Promise<void> | void
}

export function SelectAbstractCommand({
    onChange,
    className,
    value,
}: SelectAbstractCommandProps & React.HTMLAttributes<HTMLDivElement>) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [debouncedSearch] = useDebounce(search, 400);
    const { data: abstracts = [], isFetching } = useQuery<AbstractDTO[]>({
        queryKey: ["abstracts", debouncedSearch],
        queryFn: async () => {
            const { data } = await api.get<PaginatedResponse<AbstractDTO>>("/abstracts/submissions", {
                params: { title: debouncedSearch },
            });
            return data.results;
        },
    });

    const onAbstractSelected = (abstract: AbstractDTO) => {
        onChange(abstract);
        setSearch("");
    }

    const onAbstractUnselected = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        onChange(null)
        setSearch("");
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "w-80 justify-between relative pr-7!",
                        className,
                    )}
                >
                    <span className='truncate'>{value?.title ?? "No submission assigned"}</span>
                    {value ? (
                        <div
                            onClick={onAbstractUnselected}
                            className={cn(
                                "absolute right-1 top-1/2 -translate-y-1/2 rounded-sm p-1 opacity-100 transition-opacity hover:text-destructive",
                                "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer",
                                "[&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none",
                                "size-6 [&_svg:not([class*='size-'])]:size-3",
                            )} >
                            <X className="size-4" />
                        </div>
                    ) : (
                        <ChevronDown className={cn(
                            "absolute right-1 top-1/2 -translate-y-1/2 rounded-sm p-1 size-6",
                            "shrink-0 opacity-100 transition-transform duration-200",
                            open && "-rotate-180",
                        )} />
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="md:w-100 p-0" align="end" >
                <Command shouldFilter={false}>
                    <CommandInput value={search} onValueChange={setSearch} placeholder="Search..." />
                    <CommandList className="max-h-87.5">
                        <CommandEmpty>
                            <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                                <SearchX className="mb-2 size-6" />
                                {isFetching ? <p>Searching...</p> : (
                                    <>
                                        <p>No submissions found</p>
                                        <p className="text-xs">
                                            Try another search.
                                        </p>
                                    </>
                                )}
                            </div>
                        </CommandEmpty>

                        {abstracts.length > 0 && (
                            <CommandGroup>
                                {abstracts.map((abstract) => (
                                    <CommandItem key={abstract.id} value={String(abstract.id)} onSelect={() => onAbstractSelected(abstract)}
                                        className={cn(value && value.id === abstract.id ? "bg-secondary" : "bg-card")}
                                    >
                                        <Pointer className={cn(
                                            "h-4 w-4 rotate-90 text-primary-main",
                                            value && value.id === abstract.id ? "opacity-100" : "opacity-0"
                                        )} />
                                        <div className="truncate">
                                            <p className="truncate" title={abstract.title}>{abstract.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {abstract.user?.full_name} ({abstract.user?.email})
                                            </p>
                                        </div>
                                        <CommandShortcut>
                                            <Plus className="size-4" />
                                        </CommandShortcut>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}




type SelectCommandProps<T> = {
    value: Partial<T> | null
    onChange: (item: T | null) => Promise<void> | void

    // fetching
    endpoint: string
    queryKey: string
    searchParam?: string // default: "search"
    queryParams?: Record<string, unknown> // params extra fijos, si hacen falta

    // identidad / comparación
    getId: (item: Partial<T> | T) => string | number


    // presentación
    getTriggerLabel: (value: Partial<T> | null) => React.ReactNode
    renderOption: (item: T, isSelected: boolean) => React.ReactNode

    placeholder?: string
    emptyLabel?: string
    emptyHint?: string
    contentClassName?: string

}

export function SelectCommand<T>({
    value,
    onChange,
    endpoint,
    queryKey,
    searchParam = "search",
    queryParams,
    getId,
    getTriggerLabel,
    renderOption,
    placeholder = "Search...",
    emptyLabel = "No results found",
    emptyHint = "Try another search.",
    className,
    contentClassName,
}: SelectCommandProps<T> & Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [debouncedSearch] = useDebounce(search, 400);

    const { data: items = [], isFetching } = useQuery<T[]>({
        queryKey: [queryKey, debouncedSearch],
        queryFn: async () => {
            const { data } = await api.get<PaginatedResponse<T>>(endpoint, {
                params: { [searchParam]: debouncedSearch, ...queryParams },
            });
            return data.results;
        },
    });

    const onItemSelected = (item: T) => {
        onChange(item);
        setSearch("");
    };

    const onItemUnselected = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        onChange(null);
        setSearch("");
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "w-80 justify-between relative pr-7!",
                        className,
                    )}
                >
                    <span className='truncate'>{getTriggerLabel(value)}</span>
                    {value ? (
                        <div
                            onClick={onItemUnselected}
                            className={cn(
                                "absolute right-1 top-1/2 -translate-y-1/2 rounded-sm p-1 opacity-100 transition-opacity hover:text-destructive",
                                "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer",
                                "[&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none",
                                "size-6 [&_svg:not([class*='size-'])]:size-3",
                            )}
                        >
                            <X className="size-4" />
                        </div>
                    ) : (
                        <ChevronDown className={cn(
                            "absolute right-1 top-1/2 -translate-y-1/2 rounded-sm p-1 size-6",
                            "shrink-0 opacity-100 transition-transform duration-200",
                            open && "-rotate-180",
                        )} />
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className={cn("md:w-100 p-0", contentClassName)} align="end">
                <Command shouldFilter={false}>
                    <CommandInput value={search} onValueChange={setSearch} placeholder={placeholder} />
                    <CommandList className="max-h-87.5">
                        <CommandEmpty>
                            <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                                <SearchX className="mb-2 size-6" />
                                {isFetching ? <p>Searching...</p> : (
                                    <>
                                        <p>{emptyLabel}</p>
                                        <p className="text-xs">{emptyHint}</p>
                                    </>
                                )}
                            </div>
                        </CommandEmpty>

                        {items.length > 0 && (
                            <CommandGroup>
                                {items.map((item) => {
                                    const id = getId(item);
                                    const isSelected = value != null && getId(value) === id;

                                    return (
                                        <CommandItem
                                            key={id}
                                            value={String(id)}
                                            onSelect={() => onItemSelected(item)}
                                            className={cn(isSelected ? "bg-secondary" : "bg-card")}
                                        >
                                            {renderOption(item, isSelected)}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}