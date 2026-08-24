import { Field } from '@/components/ui/field';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import { type HTMLAttributes } from 'react';
import { Button } from '../ui/button';


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
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant='outline' size='sm' className='font-normal'>
                                <span>{page} / {totalPages}</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-14 p-1'>
                            <div className="flex flex-col">
                                {pages.map((item) => (
                                    <Button
                                        key={item}
                                        size='xs'
                                        variant='ghost'
                                        className='w-full text-sm font-normal'
                                        onClick={() => onPageChange(item)}
                                    >
                                        {item}
                                    </Button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
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
    size?: "sm" | "default" | "xs"
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
                <SelectTrigger size={size} id="select-rows-per-page" className={cn(size === 'xs' ? 'gap-1 h-6!' : size === 'sm' ? 'gap-2' : 'gap-3')}>
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