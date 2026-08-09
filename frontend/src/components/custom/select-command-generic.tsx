import api from "@/clients/api"
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { PaginatedResponse } from "@/domain/pagination"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown, SearchX, X } from "lucide-react"
import type { ButtonHTMLAttributes, HTMLAttributes } from "react"
import React from "react"
import { useDebounce } from "use-debounce"


type SelectCommandProps<T> = {
    value: Partial<T> | null
    onChange: (item: T | null) => Promise<void> | void
    // fetching settings
    endpoint: string
    queryKey: string
    searchParam?: string
    queryParams?: Record<string, unknown>

    getId: (item: Partial<T> | T) => string | number
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
    className = '',
    contentClassName = '',
    disabled = false,
    ...rest
}: SelectCommandProps<T> & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'>) {
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

    const renderIcon = () => {
        if (disabled) return null

        return value ? (
            <div
                onClick={onItemUnselected}
                className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 opacity-100 transition-opacity hover:text-destructive",
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer",
                    "[&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none",
                    "size-6 [&_svg:not([class*='size-'])]:size-3",
                )}
            >
                <X className="size-4" />
            </div>
        ) : (
            <ChevronDown className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 size-6",
                "shrink-0 opacity-100 transition-transform duration-200",
                open && "-rotate-180",
            )} />
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    {...rest}
                    disabled={disabled}
                    type="button"
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "w-full justify-between relative pr-7!",
                        className,
                    )}
                >
                    <span className='truncate'>{getTriggerLabel(value)}</span>
                    {renderIcon()}
                </Button>
            </PopoverTrigger>
            {!disabled && (
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
            )}
        </Popover>
    );
}