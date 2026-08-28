import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import React from 'react'

type CheckboxCardGroupContextValue = {
    name?: string
    value: string[]
    invalid: boolean
    disabled: boolean
    toggle: (value: string, checked: boolean) => void
}

const CheckboxCardGroupContext =
    React.createContext<CheckboxCardGroupContextValue | null>(null)

function useCheckboxCardGroup() {
    return React.useContext(CheckboxCardGroupContext)
}

function CheckboxCardGroup({
    className,
    name,
    value,
    onValueChange,
    invalid = false,
    disabled = false,
    ...props
}: Omit<React.ComponentProps<typeof FieldGroup>, "onChange"> & {
    name?: string
    value?: string[]
    onValueChange?: (value: string[]) => void
    invalid?: boolean
    disabled?: boolean
}) {
    const selected = React.useMemo(() => value ?? [], [value])

    const toggle = React.useCallback(
        (itemValue: string, checked: boolean) => {
            onValueChange?.(
                checked
                    ? [...selected, itemValue]
                    : selected.filter((v) => v !== itemValue),
            )
        },
        [onValueChange, selected],
    )

    const context = React.useMemo<CheckboxCardGroupContextValue>(
        () => ({ name, value: selected, invalid, disabled, toggle }),
        [name, selected, invalid, disabled, toggle],
    )

    return (
        <CheckboxCardGroupContext.Provider value={context}>
            <FieldGroup
                role="group"
                data-slot="checkbox-group"
                data-invalid={invalid || undefined}
                className={cn(
                    "grid w-full grid-cols-1 sm:grid-cols-3 md:grid-cols-4",
                    className,
                )}
                {...props}
            />
        </CheckboxCardGroupContext.Provider>
    )
}

function CheckboxCard({
    className,
    id,
    value,
    icon,
    title,
    description,
    checked,
    onCheckedChange,
    invalid,
    disabled,
    children,
    ...props
}: Omit<
    React.ComponentProps<typeof FieldLabel>,
    "title" | "onChange" | "children"
> & {
    value: string
    icon?: React.ReactNode
    title?: React.ReactNode
    description?: React.ReactNode
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    invalid?: boolean
    disabled?: boolean
    children?: React.ReactNode
}) {
    const group = useCheckboxCardGroup()
    const generatedId = React.useId()

    const fieldName = group?.name ?? ''
    const inputId = id ?? `${fieldName ?? "checkbox-card"}-${value ?? generatedId}`
    const isChecked = checked ?? group?.value.includes(value) ?? false
    const isInvalid = invalid ?? group?.invalid ?? false
    const isDisabled = disabled ?? group?.disabled ?? false

    const handleCheckedChange = (next: boolean) => {
        onCheckedChange?.(next)
        group?.toggle(value, next)
    }

    return (
        <FieldLabel
            htmlFor={inputId}
            data-slot="checkbox-card"
            data-invalid={isInvalid || undefined}
            className={cn(
                "group/checkbox-card cursor-pointer border-2! bg-card border-input/50",
                "hover:border-primary-light",
                "has-data-[state=checked]:border-primary-main",
                "has-data-[state=checked]:bg-primary-main/10!",
                "transition-all duration-150 hover:-translate-y-1 hover:shadow-md",
                "has-disabled:pointer-events-none has-disabled:opacity-50 has-disabled:hover:translate-y-0",
                "data-invalid:border-destructive/30! data-invalid:hover:border-destructive/50!",
                "data-invalid:bg-destructive/5",
                "data-invalid:has-data-[state=checked]:bg-[linear-gradient(color-mix(in_oklab,var(--destructive)_10%,transparent),color-mix(in_oklab,var(--destructive)_10%,transparent)),color-mix(in_oklab,var(--primary-main)_10%,transparent)]!",
                className,
            )}
            {...props}
        >
            <Field data-invalid={isInvalid || undefined} orientation="vertical">
                <div className="relative flex items-start justify-between gap-1">
                    <FieldContent>
                        <div className="flex items-start gap-2">
                            {icon && (
                                <div
                                    className={cn(
                                        "flex size-10 shrink-0 items-center justify-center rounded-lg border-2",
                                        "border-primary-main/20 bg-primary-light/20 [&_svg]:text-primary-main",
                                        "group-data-invalid/checkbox-card:border-destructive/50",
                                        "group-data-invalid/checkbox-card:bg-destructive/10",
                                        "group-data-invalid/checkbox-card:[&_svg]:text-destructive",
                                    )}
                                >
                                    {icon}
                                </div>
                            )}
                            <FieldContent>
                                {title && (
                                    <FieldTitle
                                        className={cn(
                                            "font-semibold text-primary-main dark:text-white",
                                            "group-data-invalid/checkbox-card:text-destructive",
                                            "dark:group-data-invalid/checkbox-card:text-destructive",
                                        )}
                                    >
                                        {title}
                                    </FieldTitle>
                                )}
                                {description && (
                                    <FieldDescription>{description}</FieldDescription>
                                )}
                                {children}
                            </FieldContent>
                        </div>
                    </FieldContent>

                    <Checkbox
                        id={inputId}
                        name={fieldName}
                        value={value}
                        checked={isChecked}
                        disabled={isDisabled}
                        aria-invalid={isInvalid}
                        onCheckedChange={(state) => handleCheckedChange(state === true)}
                    />
                </div>
            </Field>
        </FieldLabel>
    )
}

export { CheckboxCard, CheckboxCardGroup }

