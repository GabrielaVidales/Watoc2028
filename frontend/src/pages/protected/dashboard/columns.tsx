import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "./features";
import { ArrowUpDownIcon, ClipboardCopy, ClipboardCopyIcon, EyeIcon, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router";
import { routes } from "@/routes/routes";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import type { AbstractSchema } from "@/features/submissions/schemas/abstract-schemas";


const columnHelper = createColumnHelper<DataTableFeatures, AbstractSchema>()


export const columns = columnHelper.columns([
    columnHelper.accessor('title', {
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Title" />
            )
        },
        cell: (ctx) => <div className="max-w-100 truncate overflow-hidden" dangerouslySetInnerHTML={{ __html: ctx.getValue() }} />
    }),
    columnHelper.accessor('presentation_type', {
        header: 'Presentation',
        cell: ({ row }) => {
            const abstract = row.original

            const isYoungWatoc = abstract.is_for_young_watoc

            if (isYoungWatoc) {
                return (
                    <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" >
                        Young WATOC
                    </Badge>
                )
            }

            const statusConfig = {
                draft: { label: "Not submitted", className: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20" },
                submitted: { label: "Sent", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
                accepted: { label: "Accepted", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
                rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
                corrections: { label: "Corrections", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
                deleted: { label: "Deleted", className: "bg-red-500/10 text-red-600 line-through border-red-500/20" }
            };
            const config = statusConfig[abstract.status || "draft"];

            return (
                <Badge className={config.className} >
                    {config.label}
                </Badge>
            )

        }
    }),
    columnHelper.display({
        header: 'Actions',
        cell: ({ row }) => {
            // return 'jeje'
            const navigate = useNavigate()

            const abstract = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" className="w-full">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="size-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(abstract.title)}
                        >
                            <ClipboardCopyIcon />
                            Copy title
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigate(routes.users.submissions.edit.build({ id: abstract.id }))}
                        >
                            <EyeIcon />
                            View detail
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    })
])