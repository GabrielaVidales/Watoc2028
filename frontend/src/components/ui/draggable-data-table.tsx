import { useState } from "react"
import {
    DndContext,
    closestCenter,
    type DragEndEvent,
} from "@dnd-kit/core"
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    MouseSensor,
    TouchSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"

type RowData = {
    id: string
    name: string
    description: string
}

export default function ReorderableTable() {
    const [rows, setRows] = useState<RowData[]>([
        {
            id: "1",
            name: "Introducción",
            description: "Descripción 1",
        },
        {
            id: "2",
            name: "Metodología",
            description: "Descripción 2",
        },
        {
            id: "3",
            name: "Resultados",
            description: "Descripción 3",
        },
    ])

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor)
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (!over || active.id === over.id) return

        setRows((current) => {
            const oldIndex = current.findIndex(
                (row) => row.id === active.id
            )

            const newIndex = current.findIndex(
                (row) => row.id === over.id
            )

            return arrayMove(current, oldIndex, newIndex)
        })
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12" />
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-32">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <SortableContext
                        items={rows.map((row) => row.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {rows.map((row) => (
                            <SortableRow
                                key={row.id}
                                row={row}
                            />
                        ))}
                    </SortableContext>
                </TableBody>
            </Table>
        </DndContext>
    )
}

function SortableRow({
    row,
}: {
    row: RowData
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: row.id,
    })

    return (
        <TableRow
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            <TableCell>
                <Button
                    variant="ghost"
                    size="icon"
                    className="touch-none cursor-grab active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-4 w-4" />
                </Button>
            </TableCell>

            <TableCell>
                {row.name}
            </TableCell>

            <TableCell>
                {row.description}
            </TableCell>

            <TableCell>
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                        size="icon"
                        variant="destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}