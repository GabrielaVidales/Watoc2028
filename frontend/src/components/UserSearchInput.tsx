import type { UserSchema } from "@/schemas/user-schemas"
import axiosClient from "@/clients/axiosClient"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"
import { useEffect, useState, type HTMLAttributes } from "react"
import { Button } from "./ui/button"
import { CircleUserRound, Plus, Search, SearchX } from "lucide-react"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut, } from "@/components/ui/command"

export type UserSearchInputProps = {
    delay?: number
    onUserSelected?: (item: Partial<UserSchema>) => void
}

export function UserSearchInput({
    delay = 500,
    onUserSelected,
    className,
}: UserSearchInputProps & HTMLAttributes<HTMLDivElement>) {
    const [open, setOpen] = useState(false)

    const [users, setUsers] = useState<Partial<UserSchema>[]>([])
    const [input, setInput] = useState('')
    const search = useDebounce(input, delay)

    const searchUsers = async (input: string) => {
        const trimmedInput = input.trim()
        if (trimmedInput === '') {
            setUsers([])
            return
        }
        try {
            const res = await axiosClient.get(`users?search=${trimmedInput}`)
            setUsers(res.data)
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error(err)
            }
        }
    }

    useEffect(() => {
        searchUsers(search)
    }, [search])

    const handleSelectedUser = (user: Partial<UserSchema>) => {
        onUserSelected?.(user)
        setOpen(false)
        setInput('')
        setUsers([])
    }

    return (
        <div className={cn(className)}>
            <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => setOpen(true)}
            >
                <Search className="size-4" />
                Search registered user
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
                <CommandInput
                    placeholder="Search..."
                    value={input}
                    onValueChange={(value) => { setInput(value) }}
                />
                <CommandList>
                    <CommandEmpty>
                        <div className="flex flex-col items-center justify-center py-3 text-center text-muted-foreground space-y-2">
                            <SearchX className="size-6" />
                            <p className="text-sm font-medium">
                                No registered users found
                            </p>
                            <p className="text-xs max-w-70">
                                You can still add the author manually by filling out the form fields.
                            </p>
                        </div>
                    </CommandEmpty>
                    {users.length > 0 && (
                        <CommandGroup heading="Users">
                            {users.map(u => (
                                <CommandItem key={u.id} className='text-xs cursor-pointer' onSelect={() => handleSelectedUser(u)}>
                                    <CircleUserRound className='shrink-0 size-5' />
                                    <span>{u.first_name} {u.last_name} ({u.email})</span>
                                    <CommandShortcut>
                                        <Plus />
                                    </CommandShortcut>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </div>
    )
}


