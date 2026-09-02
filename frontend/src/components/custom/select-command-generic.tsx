import api from "@/clients/api"
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { PaginatedResponse } from "@/domain/pagination"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown, SearchX, X } from "lucide-react"
import type { ButtonHTMLAttributes } from "react"
import React from "react"
import { useDebounce } from "use-debounce"


export interface GetTriggerLabel<T> {
    (
        item: Partial<T> | T | null,
        state?: {
            invalid?: boolean,
            disabled?: boolean
        }
    ): React.ReactNode
}

export interface RenderOption<T> {
    (
        item: Partial<T> | T | null,
        isSelected?: boolean,
    ): React.ReactNode
}

type SelectCommandProps<T> = {
    value: Partial<T> | T | null
    onChange: (item: T | null) => Promise<void> | void

    // fetching settings
    endpoint: string
    queryKey: string
    searchParam?: string
    queryParams?: Record<string, unknown>

    getId: (item: Partial<T> | T) => string | number
    getTriggerLabel: GetTriggerLabel<T>
    renderOption: RenderOption<T>

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
    "aria-invalid": ariaInvalid = false,
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
        setOpen(false)
    };

    const onItemUnselected = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        onChange(null);
        setSearch("");
        setOpen(false)

    };

    const renderIcon = () => {
        if (disabled) return null

        return value ? (
            <span
                role="button"
                tabIndex={-1}
                aria-label="Clear selection"
                onClick={onItemUnselected}
                onPointerDown={(e) => e.stopPropagation()}
                className={cn(
                    "inline-flex size-4 shrink-0 cursor-pointer items-center justify-center",
                    "rounded-sm outline-none transition-colors hover:text-destructive",
                )}
            >
                <X className="size-4 shrink-0" />
            </span>
        ) : (
            <ChevronDown
                className={cn(
                    "size-4 shrink-0 opacity-70 transition-transform duration-200",
                    open && "-rotate-180",
                )}
            />
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    {...rest}
                    aria-invalid={ariaInvalid}
                    disabled={disabled}
                    type="button"
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_auto]",
                        "items-center gap-1 overflow-hidden text-left",
                        className,
                    )}
                >
                    <span className={cn(
                        "block min-w-0 max-w-full overflow-hidden text-left",
                        "**:min-w-0 **:max-w-full",
                    )}>
                        {getTriggerLabel(value, {
                            invalid: ariaInvalid === true || ariaInvalid === "true",
                            disabled: disabled,
                        })}
                    </span>

                    <span className="flex shrink-0 items-center justify-center">
                        {renderIcon()}
                    </span>
                </Button>
            </PopoverTrigger>
            {!disabled && (
                <PopoverContent className={cn("md:w-100 p-0", contentClassName)} align="start">
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
