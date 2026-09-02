import { Badge } from "@/components/ui/badge"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { cn } from "@/lib/utils"
import { TagIcon, X } from 'lucide-react'
import * as React from "react"

interface MultipleInputProps {
    value?: string[]
    onChange?: (value: string[]) => void
    maxValues?: number | undefined
}

function MultipleInput({
    value = [],
    onChange,
    maxValues,
    className,
    disabled,
    placeholder = "Add tags...",
    "aria-invalid": ariaInvalid = false,
    ...props
}: MultipleInputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
    const [inputValue, setInputValue] = React.useState("")

    const addTag = () => {
        const tag = inputValue.trim()

        if (!tag) return
        if (value.includes(tag)) {
            setInputValue("")
            return
        }

        onChange?.([...value, tag])
        setInputValue("")
    }

    const removeTag = (tagToRemove: string) => {
        onChange?.(
            value.filter(tag => tag !== tagToRemove)
        )
    }

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {

        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault()

            if (maxValues && value.length >= maxValues) {
                return
            }

            addTag()
        }

        if (
            event.key === "Backspace" &&
            !inputValue &&
            value.length > 0
        ) {
            removeTag(value[value.length - 1])
        }
    }

    return (
        <InputGroup className="h-auto min-h-5" data-invalid={ariaInvalid}>
            <div
                className={cn(
                    "flex min-h-10 w-full flex-wrap items-center gap-2 px-3 py-2",
                    "dark:bg-input/30",
                    disabled && "cursor-not-allowed opacity-50",
                    className,
                )}
            >
                {value.map(tag => (
                    <Badge
                        key={tag}
                        variant={cn(ariaInvalid ? 'destructive' : "secondary") as ('destructive' | "secondary")}
                        className="gap-1 border border-input/30 dark:bg-white/20"
                    >
                        <TagIcon className='fill-accent/50' />
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            disabled={disabled}
                            className="rounded-full outline-none hover:bg-muted"
                        >
                            <X className="size-3" />
                            <span className="sr-only">
                                Remove {tag}
                            </span>
                        </button>
                    </Badge>
                ))}

                <InputGroupInput
                    aria-invalid={ariaInvalid}
                    value={inputValue}
                    onChange={event => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? placeholder : undefined}
                    disabled={disabled}
                    className="h-6 rounded-none min-w-30 flex-1 border-0 p-0 shadow-none focus-visible:ring-0 bg-background dark:bg-transparent"
                    {...props}
                />
            </div>
            {maxValues && (
                <InputGroupAddon align='block-end' className='py-1'>
                    <InputGroupText className='ml-auto text-xs'>
                        {value.length} / {maxValues}
                    </InputGroupText>
                </InputGroupAddon>
            )}
        </InputGroup>
    )
}

export default MultipleInput