import { Field } from '@/components/ui/field';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronsLeftIcon, ChevronsRightIcon, HashIcon, } from 'lucide-react';
import { type HTMLAttributes } from 'react';


type PaginationControllerProps = {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function PaginationController({
    onPageChange,
    totalPages,
    page,
}: PaginationControllerProps) {
    const pages = Array.from(
        { length: totalPages },
        (_, i) => i + 1
    )

    return (
        <Pagination>
            <PaginationContent>

                <PaginationItem>
                    <PaginationLink
                        title="Go to first page"
                        aria-label="Go to first page"
                        className={cn("gap-1 px-2.5 sm:pl-2.5")}
                        size="icon"
                        onClick={e => {
                            e.preventDefault()
                            onPageChange(1)
                        }}
                    >
                        <ChevronsLeftIcon />
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={e => {
                            e.preventDefault()
                            if (page > 1)
                                onPageChange(page - 1)
                        }}
                    />
                </PaginationItem>

                <PaginationItem>
                    <Select
                        value={String(page)}
                        onValueChange={(value) =>
                            onPageChange(Number(value))
                        }
                    >
                        <SelectTrigger size='sm'>
                            <HashIcon className='text-transparent' />
                            <SelectValue /> / {totalPages}
                        </SelectTrigger>

                        <SelectContent>
                            {pages.map((item) => (
                                <SelectItem
                                    key={item}
                                    value={String(item)}
                                >
                                    {item}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </PaginationItem>

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={e => {
                            e.preventDefault()
                            if (page < totalPages)
                                onPageChange(page + 1)
                        }}
                    />
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink
                        title="Go to last page"
                        aria-label="Go to last page"
                        className={cn("gap-1 px-2.5 sm:pl-2.5")}
                        size="icon"
                        onClick={e => {
                            e.preventDefault()
                            onPageChange(totalPages)
                        }}
                    >
                        <ChevronsRightIcon />
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}



type SelectItemsPerPageProps = {
    itemsPerPage: number
    setItemsPerPage: (n: number) => void
    options?: number[]
    size?: "sm" | "default"
} & HTMLAttributes<HTMLSelectElement>

export function SelectItemsPerPage({
    setItemsPerPage,
    itemsPerPage,
    options = [5, 10, 20],
    size = 'default'
}: SelectItemsPerPageProps) {
    return (
        <Field orientation="horizontal" className="w-fit">
            <Select defaultValue="10" value={`${itemsPerPage}`} onValueChange={(value) => {
                const limit = Number(value)
                if (!isNaN(limit)) {
                    setItemsPerPage(limit)
                }
            }}>
                <SelectTrigger size={size} id="select-rows-per-page">
                    Show
                    <SelectValue />
                    items
                </SelectTrigger>
                <SelectContent align="start">
                    <SelectGroup>
                        {options.map(item => (
                            <SelectItem key={item} value={`${item}`}>{item}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </Field>
    )
}

