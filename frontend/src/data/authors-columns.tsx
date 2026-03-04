import { cn } from "@/lib/utils"
import type { AuthorAffiliationSchema, AuthorSchema } from "@/schemas/abstract-schemas"
import { type ColumnDef } from "@tanstack/react-table"

export const authorColumns: ColumnDef<AuthorSchema>[] = [
    {
        accessorKey: 'order',
        header: '#',
        cell: ({ row }) => (row.getValue('order') as number) + 1
    },
    {
        id: 'full_name',
        header: 'Full Name',
        accessorFn: (data) => `${data.first_name} ${data.last_name}`,
        cell: ({ row }) => (
            <div>
                <p>{row.getValue('full_name')}</p>
                <p>{row.original.email}</p>
            </div>
        )
    },
    {
        accessorKey: 'affiliation',
        header: 'Affiliation',
        cell: ({ row }) => {
            const value = (row.getValue('affiliation') as AuthorAffiliationSchema)
            return (
                <div className="flex flex-col w-full gap-1">
                    <h3 className="font-medium leading-none">{value.institute}</h3>
                    <span className="text-sm text-muted-foreground truncate">
                        {value.department}
                    </span>

                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {value.city}, {value.nationality}
                    </span>
                </div>
            )
        }
    },
]