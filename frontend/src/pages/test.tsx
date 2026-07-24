import axiosClient from '@/clients/axiosClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command"
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { AbstractDTO } from '@/schemas/abstract-schemas'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Plus, Pointer, SearchX, X } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDebounce } from 'use-debounce'

function TestPage() {
    const [selected, setSelected] = React.useState<Partial<AbstractDTO>>(null);

    useEffect(() => {
        console.log(selected);
    }, [selected])

    return (
        <div className='max-w-2xl mx-auto w-full gap-4 p-2'>

            <Card className='w-full mx-auto'>
                <CardHeader>
                    <CardTitle>Manage Authors</CardTitle>
                    <CardDescription>
                        View, create, edit, or remove author records for your submission.
                    </CardDescription>
                </CardHeader>
                <CardContent className='border-y p-3 space-y-1'>
                    <Field orientation="responsive">
                        <FieldContent>
                            <FieldLabel>
                                Assign submission
                            </FieldLabel>
                            <FieldDescription>
                                Select a submission from the list
                            </FieldDescription>
                        </FieldContent>

                        <SelectAbstractCommand
                            value={selected}
                            onChange={setSelected}
                        />
                    </Field>
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
        queryKey: ["users", debouncedSearch],
        queryFn: async () => {
            const { data } = await axiosClient.get("/abstracts/submissions", {
                params: { title: debouncedSearch },
            });
            return data;
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

