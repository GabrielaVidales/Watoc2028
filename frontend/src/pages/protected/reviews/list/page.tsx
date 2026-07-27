import api from '@/clients/api'
import { CustomFilter } from '@/components/custom/custom-filter'
import type { Filter } from '@/components/reui/filters'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/contexts/AuthContext'
import type { ReviewAssignment } from '@/domain/reviews'
import { cn } from '@/lib/utils'
import { SelectAbstractCommand } from '@/pages/test'
import { routes } from '@/routes/routes'
import type { AbstractDTO } from '@/schemas/abstracts/abstract-schemas'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

type Props = {}

function ReviewsList({ }: Props) {
    const navigate = useNavigate()

    const [filters, setFilters] = useState<Filter[]>([])

    const [selected, setSelected] = useState<Partial<AbstractDTO>>(null);

    const { user: user } = useAuth()

    const { data, isLoading } = useQuery<ReviewAssignment[]>({
        queryKey: ['reviews', user.id],
        queryFn: async () => {
            const { data } = await api.get('/reviews/assignments')
            return data
        }
    })

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    const pendingReviews = data.filter(r => r.status === 'pending')

    return (
        <div className='p-8'>
            <div className="flex flex-col gap-4 h-full">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Reviews
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your assigned abstracts and submit reviews.
                        </p>
                    </div>

                    <div > 
                        <CustomFilter
                            filters={filters}
                            setFilters={setFilters}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline">
                            Pending
                        </Button>

                        <Button variant="outline">
                            Completed
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 flex-1">
                    <section className="space-y-3">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reviewer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Abstract</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {data.map((assignment) => (
                                    <TableRow key={assignment.id}>
                                        <TableCell>
                                            {assignment.user ? (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="size-8">
                                                        <AvatarImage
                                                            src={assignment.user.photo as string}
                                                        />
                                                        <AvatarFallback>
                                                            {assignment.user.first_name[0]}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div>
                                                        <p className="font-medium">
                                                            {assignment.user.first_name}{" "}
                                                            {assignment.user.last_name}
                                                        </p>

                                                        <p className="text-xs text-muted-foreground">
                                                            {assignment.user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    Unassigned
                                                </span>
                                            )}
                                        </TableCell>


                                        <TableCell>
                                            <Badge>
                                                {assignment.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <SelectAbstractCommand
                                                value={selected}
                                                onChange={setSelected}
                                            />
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="icon-sm"
                                                    variant="ghost"
                                                >
                                                    <X />
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate(routes.users.reviews.view.build({ id: assignment.id }))}
                                                >
                                                    <Search />
                                                    View
                                                </Button>
                                            </div>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </section>

                    <aside className={cn("hidden xl:flex flex-col gap-4 sticky top-4 h-fit")}>
                        <div className={cn('rounded-lg border p-4 space-y-3')}>
                            <h2 className="font-semibold">
                                Summary
                            </h2>

                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Pending
                                    </span>
                                    <span className="font-medium">
                                        {pendingReviews.length}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Total
                                    </span>
                                    <span className="font-medium">
                                        {data.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

            </div>
        </div>
    )
}

export default ReviewsList