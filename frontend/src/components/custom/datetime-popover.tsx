import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { addDays, format } from 'date-fns'
import { CalendarIcon, ChevronDownIcon, Clock2Icon } from 'lucide-react'
import React, { type ButtonHTMLAttributes } from 'react'
import type { Matcher } from 'react-day-picker'


type DateDayPreset = {
    label: string
    days?: number
    date?: Date
}


type DateTimePopoverProps = {
    disableDates?: Matcher | Matcher[]
    value?: Date
    onChange?: (...event: any[]) => void
    presets?: DateDayPreset[]
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'>


export function DateTimePopover({
    value,
    onChange,
    presets = [],
    disableDates,
    className,
    ...rest
}: DateTimePopoverProps) {
    const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)

    const [currentMonth, setCurrentMonth] = React.useState<Date>(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    )

    React.useEffect(() => {
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    }, [])

    const onTimeChanged = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        let hours = 0, minutes = 0;

        const time = e.target.value;
        if (time) {
            const [h = "", m = ""] = time.split(":");

            hours = h === "" ? 0 : Number(h);
            minutes = m === "" ? 0 : Number(m);

            if (Number.isNaN(hours)) hours = 0;
            if (Number.isNaN(minutes)) minutes = 0;
        }

        const date = new Date(value ?? new Date());
        date.setHours(hours, minutes, 0, 0);
        onChange(date);
    }

    const onPresetSelected = (preset: DateDayPreset) => {
        const newDate = addDays(new Date(), preset.days);

        onChange(newDate);

        setCurrentMonth(
            new Date(newDate.getFullYear(), newDate.getMonth(), 1)
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    {...rest}
                    variant="outline"
                    className={cn(
                        "group w-full justify-between font-normal",
                        !value && "text-muted-foreground",
                        className,
                    )}
                >
                    <span className="flex items-center gap-2 group-aria-invalid:text-destructive">
                        <CalendarIcon className="size-4" />
                        {value ? format(value, "EEEE, PPP 'at' p") : "Select due date"}
                    </span>

                    <ChevronDownIcon className="size-4 opacity-60 group-aria-invalid:text-destructive" />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-auto overflow-hidden rounded-xl p-0 shadow-lg">
                <div className="grid md:grid-cols-[auto_300px]">
                    <Calendar
                        mode="single"
                        timeZone={timeZone}
                        selected={value}
                        onSelect={onChange}
                        captionLayout="dropdown"
                        month={currentMonth}
                        onMonthChange={setCurrentMonth}
                        fixedWeeks
                        disabled={disableDates}
                        className="border-r p-3"
                        classNames={{
                            today: "bg-primary/15 text-primary rounded-md",
                        }}
                    />

                    <div className="flex flex-col bg-muted/20">
                        <div className="border-b p-5 space-y-3">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Selected date
                            </p>

                            <div className="rounded-lg border bg-background p-3">
                                <p className="font-medium">
                                    {value ? format(value, "EEEE, MMMM d, yyyy") : "Choose a deadline"}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {value ? format(value, "hh:mm:ss a") : "Choose a deadline"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6 p-5">
                            <Field>
                                <FieldLabel>Time</FieldLabel>

                                <InputGroup>
                                    <InputGroupInput
                                        type="time"
                                        className="[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        step="60"
                                        value={value ? format(value, "HH:mm") : ""}
                                        onChange={onTimeChanged}
                                    />

                                    <InputGroupAddon>
                                        <Clock2Icon className="size-4 text-muted-foreground" />
                                    </InputGroupAddon>
                                    <InputGroupAddon align='inline-end'>
                                        <InputGroupText className='font-normal'>
                                            {value ? format(value, "a") : "Choose a deadline"}
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Field>

                            {presets.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Quick select
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {presets.map((preset) => (
                                            <Button
                                                key={preset.days}
                                                size="xs"
                                                variant="outline"
                                                onClick={() => onPresetSelected(preset)}
                                            >
                                                {preset.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}




interface DatePickerProps {
    value?: Date | null
    onChange?: (date: Date | undefined) => void
    onBlur?: () => void
    name?: string
    error?: string
    disabled?: boolean
    defaultValue?: Date
    presets?: DateDayPreset[]
    disableDates?: Matcher | Matcher[]
}

export function DatePicker({
    value,
    onChange,
    onBlur,
    name = 'datetime',
    disabled,
    defaultValue,
    presets = [],
    disableDates = [],
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [internalDate, setInternalDate] = React.useState<Date | undefined>(defaultValue)

    const isControlled = onChange !== undefined
    const currentDate = isControlled ? (value ?? undefined) : internalDate

    const [currentMonth, setCurrentMonth] = React.useState<Date>(
        currentDate ?? new Date()
    )

    const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)

    React.useEffect(() => {
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    }, [])

    const emit = (next: Date | undefined) => {
        if (isControlled) onChange(next)
        else setInternalDate(next)
    }

    const handleDateSelect = (selected: Date | undefined) => {
        if (!selected) return
        emit(selected)
        setCurrentMonth(selected)
        setOpen(false)
    }

    const onPresetSelected = (preset: DateDayPreset) => {
        const presetDate = preset.date ? preset.date : new Date()
        const newDate = addDays(presetDate, preset.days || 0);
        emit(newDate)
        setCurrentMonth(newDate)
    }

    return (
        <Popover
            open={open}
            onOpenChange={next => {
                setOpen(next)
                if (!next) onBlur?.()
            }}
        >
            <PopoverTrigger asChild>
                <Button variant='outline' id={`${name}-date`} disabled={disabled} className='flex-1 justify-between font-normal border-input'>
                    <span className="flex items-center gap-2 group-aria-invalid:text-destructive">
                        <CalendarIcon className="size-4" />
                        {currentDate ? format(currentDate, "dd MMMM yyyy") : 'Pick a date'}
                    </span>
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto overflow-hidden rounded-xl p-0 shadow-lg' align='start'>
                <Calendar
                    mode="single"
                    selected={currentDate}
                    onSelect={handleDateSelect}
                    captionLayout="label"
                    timeZone={timeZone}
                    disabled={disableDates}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    fixedWeeks
                    className="border-r p-3"
                    classNames={{
                        today: "bg-primary/15 text-primary rounded-md",
                    }}
                />

                {presets.length > 0 && (
                    <div className="w-full text-center space-y-2 p-4 pt-2">
                        <p className="text-xs font-medium uppercase tracking-wider">
                            Quick select
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {presets.map((preset) => (
                                <Button
                                    key={preset.days}
                                    size='sm'
                                    variant="outline"
                                    onClick={() => onPresetSelected(preset)}
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}

