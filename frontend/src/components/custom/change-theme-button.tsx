import React from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from '../theme-provider'
import { MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react'


function ChangeThemeButton(props: ButtonProps) {
    const { theme, setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size='icon-sm' variant="outline" {...props}>
                    {theme === 'dark' ? (
                        <MoonIcon />
                    ) : theme === 'light' ? (
                        <SunIcon />
                    ) : (
                        <SunMoonIcon />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => setTheme('light')}>
                        <SunIcon />
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setTheme('dark')}>
                        <MoonIcon />
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setTheme('system')}>
                        <SunMoonIcon />
                        System
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ChangeThemeButton