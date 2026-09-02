import { cn } from "@/lib/utils";
import type { AbstractDTO } from "@/schemas/abstracts/abstract-schemas";
import type { UserSchema } from "@/schemas/user-schemas";
import type { ButtonHTMLAttributes } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SelectCommand, type GetTriggerLabel } from "./select-command-generic";


type SelectUserProps<T> = {
    value: T | null
    onChange: (item: T | null) => Promise<void> | void
    contentClassName?: string
    invalid?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'>

export function SelectUser({
    value,
    onChange,
    disabled,
    invalid,
    className,
    contentClassName,
    ...props
}: SelectUserProps<UserSchema>) {
    return (
        <SelectCommand<UserSchema>
            aria-invalid={invalid}
            disabled={disabled}
            onChange={onChange}
            value={value}
            endpoint='/users/'
            queryKey='users'
            getId={u => u.id}
            getTriggerLabel={getUserLabel}
            className={cn('h-12', className)}
            contentClassName={cn('md:max-w-70', contentClassName)}
            renderOption={o => getUserLabel(o)}
            {...props}
        />
    )
}


const getUserLabel: GetTriggerLabel<UserSchema> = (user, { invalid, disabled } = { disabled: false, invalid: false }) => {
    if (!user) {
        return (
            <div className={cn(
                'text-left font-normal flex gap-2 items-center',
                disabled && 'opacity-50'
            )}>
                <Avatar className="size-8 shrink-0 border shadow-sm">
                    <AvatarImage src={null} />
                    <AvatarFallback>NA</AvatarFallback>
                </Avatar>
                <div className="truncate text-xs font-medium">
                    <p
                        title={user?.full_name}
                        className={cn(
                            "truncate", invalid ?
                            'text-destructive' : 'text-primary'
                        )}
                    >
                        No user selected
                    </p>
                    <p
                        className={cn(
                            "truncate text-muted-foreground font-normal text-xs",
                            invalid ? 'text-destructive' : 'text-muted-foreground'
                        )}
                    >
                        No information displayed
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={cn(
            'text-left font-normal flex gap-2 items-center',
            disabled && 'opacity-50'
        )}>
            <Avatar className="size-8 shrink-0 border shadow-sm">
                <AvatarImage loading='lazy' src={user?.photo as string ?? null} />
                <AvatarFallback>
                    <span className='text-xs leading-0'>
                        {user?.full_name
                            .split(" ")
                            .map((x) => x[0])
                            .join("")
                            .slice(0, 2)
                        }
                    </span>
                </AvatarFallback>
            </Avatar>
            <div className="truncate">
                <p className="truncate" title={user?.full_name}>{user?.full_name}</p>
                <p className='truncate text-muted-foreground text-xs'>{user?.email}</p>
            </div>
        </div>
    )
}


export function SelectAbstract({
    value,
    onChange,
    invalid,
    disabled,
    className,
    contentClassName,
    ...props
}: SelectUserProps<AbstractDTO>) {
    return (
        <SelectCommand<AbstractDTO>
            value={value}
            onChange={onChange}
            aria-invalid={invalid}
            searchParam="title"
            endpoint='/abstracts/submissions'
            queryKey='abstracts'
            className={cn('h-12', className)}
            contentClassName={cn(contentClassName)}
            getId={u => u.id}
            getTriggerLabel={getAbstractLabel}
            renderOption={o => getAbstractLabel(o)}
            {...props}
        />
    )
}


const getAbstractLabel: GetTriggerLabel<AbstractDTO> = (abstract, { invalid = false } = { disabled: false, invalid: false }) => {
    if (!abstract) {
        return (
            <div className='text-left font-normal items-center min-w-0'>
                <div className={cn('font-normal truncate', invalid ? "text-destructive" : "text-muted-foreground")}>
                    No submission selected
                </div>
            </div>
        )
    }
    return (
        <div className="truncate">
            <p className="truncate font-medium text-ellipsis" title={abstract.title} dangerouslySetInnerHTML={{ __html: abstract.title }} />
            <p className="text-xs text-muted-foreground truncate">
                {abstract.user?.full_name} ({abstract.user?.email})
            </p>
        </div>
    )
}