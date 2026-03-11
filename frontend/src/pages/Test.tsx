import { HeroSection } from '@/components/HeroSection'
import UserRegisterForm from '../forms/registration/UserRegisterForm'
import { Progress } from '@/components/ui/progress'
import { CircleCheckBig, CircleEllipsis, CircleUserRound, Plus, SearchX } from 'lucide-react'
import React, { useEffect, useState, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { StepperLabel } from '@/components/ui/stepper'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"
import { useDebounce } from '@/hooks/use-debounce'
import axiosClient from '@/clients/axiosClient'
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut
} from "@/components/ui/command"
import type { UserSchema } from '@/schemas/user-schemas'
import { Button } from '@/components/ui/button'

export default function Test() {
    const [users, setUsers] = useState<Partial<UserSchema>[]>([])
    const [input, setInput] = useState('')
    const search = useDebounce(input, 1000)

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


    return (
        <>
            <div className='w-full max-w-5xl grid grid-cols-1 gap-3 p-3 mx-auto'>
                <div className='w-full bg-background border-2 p-3 rounded-lg shadow-lg flex flex-col gap-5'>
                </div>
            </div>
        </>
    )
}

