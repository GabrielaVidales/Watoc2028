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
    const isFirstPage = page <= 1
    const isLastPage = page >= totalPages
    const pages = Array.from(
        { length: totalPages },
        (_, i) => i + 1
    )

    return (
        <Pagination>
            <PaginationContent>

                <PaginationItem>
                    <PaginationLink
                        href="#"
                        aria-disabled={isFirstPage}
                        title="Go to first page"
                        aria-label="Go to first page"
                        tabIndex={isFirstPage ? -1 : 0}
                        className={cn(
                            "gap-1 px-2.5 sm:pl-2.5",
                            isFirstPage && "pointer-events-none opacity-50"
                        )}
                        size="icon"
                        onClick={e => {
                            e.preventDefault()
                            if (!isFirstPage) onPageChange(1)
                        }}
                    >
                        <ChevronsLeftIcon />
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        aria-disabled={isFirstPage}
                        tabIndex={isFirstPage ? -1 : 0}
                        className={cn(
                            isFirstPage && "pointer-events-none opacity-50"
                        )}
                        onClick={(e) => {
                            e.preventDefault()
                            if (!isFirstPage) onPageChange(page - 1)
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
                        aria-disabled={isLastPage}
                        tabIndex={isLastPage ? -1 : 0}
                        className={cn(
                            isLastPage && "pointer-events-none opacity-50"
                        )}
                        onClick={(e) => {
                            e.preventDefault()
                            if (!isLastPage) onPageChange(page + 1)
                        }}
                    />
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink
                        href="#"
                        aria-disabled={isLastPage}
                        tabIndex={isLastPage ? -1 : 0}
                        title="Go to last page"
                        aria-label="Go to last page"
                        className={cn(
                            "gap-1 px-2.5 sm:pl-2.5",
                            isLastPage && "pointer-events-none opacity-50"
                        )}
                        size="icon"
                        onClick={(e) => {
                            e.preventDefault()
                            if (!isLastPage) onPageChange(totalPages)
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

