import React from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { useTheme } from '../theme-provider'
import { MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"


function ChangeThemeButton(props: ButtonProps) {
    const { theme, setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size='icon-sm' variant="outline" {...props}>
                    {theme === 'dark' ? (
                        <MoonIcon className='size-5' />
                    ) : theme === 'light' ? (
                        <SunIcon className='size-5' />
                    ) : (
                        <SunMoonIcon className='size-5' />
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