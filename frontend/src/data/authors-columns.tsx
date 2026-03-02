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
        cell: ({ row }) => row.getValue('full_name')
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => row.getValue('email')
    },
    {
        accessorKey: 'affiliation',
        header: 'Affiliation',
        cell: ({ row }) => {
            const value = (row.getValue('affiliation') as AuthorAffiliationSchema)
            return (
                <div>
                    <div className={cn(
                        "hover:border-primary hover:bg-primary/10",
                        "border-input bg-background"
                    )}>
                        <div className="flex items-center justify-between">
                            <div className="grid grid-cols-2 w-full">
                                <div className="flex flex-col w-full gap-1">
                                    <h3 className="font-medium leading-none">{value.institute}</h3>
                                    <span className="text-sm text-muted-foreground truncate">
                                        {value.department}
                                    </span>

                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        Location: {value.nationality}, {value.city}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    },
]