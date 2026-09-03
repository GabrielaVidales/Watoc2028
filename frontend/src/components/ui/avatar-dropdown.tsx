import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { routes } from '@/routes/routes'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router'

export function AvatarDropdown() {
    const { handleLogout, user: user } = useAuth()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 rounded-full px-2" >
                    <Avatar className="size-8">
                        <AvatarImage
                            src={user.photo as string}
                            alt="shadcn"
                        />
                        <AvatarFallback>
                            {user.first_name[0]}
                            {user.last_name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="size-5 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link to={routes.users.profile} className='cursor-pointer'>
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to={routes.users.settings} className='cursor-pointer'>
                            Settings
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
