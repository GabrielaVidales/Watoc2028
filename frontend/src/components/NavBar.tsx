import React from 'react';
import { Link, NavLink } from 'react-router';
import { ChevronDown, Menu } from 'lucide-react';
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger, } from "@/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "@/components/ui/hover-card"
import { Item, ItemContent, } from "@/components/ui/item"
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useScroll } from '@/hooks/use-scroll';
import { urls } from '@/routes/routes';
import { cn } from '@/lib/utils';
import logo from '../assets/WatocPNGLogo.png';

type Props = {
    enableScroll?: boolean,
    scrollThreshold?: number,
    variant?: 'fixed' | 'sticky'
    invertImg?: boolean
}

const menuItems = [
    {
        label: 'Home',
        url: urls.home.index
    },
    {
        label: 'WATOC',
        url: urls.home.watoc
    },
    {
        label: 'Young WATOC',
        url: urls.home.youngWatoc
    },
    {
        label: 'About',
        submenus: [
            {
                url: '/venue',
                label: 'Venue',
            },
            {
                url: '/hotel-booking',
                label: 'Hotel Booking',
            },
            {
                url: '/restaurants',
                label: 'Restaurants',
            },
            {
                url: '/transportation',
                label: 'Transportation',
            },
            {
                url: '/abstract-submission',
                label: 'Abstract Submission',
            },
            {
                url: '/visa',
                label: 'Visa Requirements',
            },
        ],
    },
    {
        label: 'Contact',
        url: urls.home.contact
    },
]

export default function NavBar({
    enableScroll = true,
    variant = 'fixed',
    scrollThreshold = 150,
    invertImg = true,
}: Props) {
    const scroll = useScroll(scrollThreshold)

    const { currentUser: user } = useAuth()

    const menus = [
        ...menuItems,
        user ? {
            label: 'Profile',
            url: urls.users.profile,
            submenus: [],
        } : {
            label: 'Registration',
            url: urls.auth.login,
            submenus: [],
        }
    ]

    return (
        <header className={cn(
            'h-18 lg:h-22 w-full z-50 fixed top-0',
            'transition-all duration-300 bg-white',
            !enableScroll || scroll ? 'bg-white shadow-lg' : 'bg-white/5',
            variant,
        )}>
            <div className="max-w-7xl h-full flex justify-between items-center gap-3 mx-auto p-2">
                <div className="flex justify-center absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0">
                    <Link to={urls.home.index} className='relative'>
                        <img
                            src={logo}
                            alt="WATOC 2028 Logo"
                            className={cn(
                                'w-auto transition-all duration-300',
                                'max-h-14 lg:max-h-18 w-full',
                                'transition-transform hover:scale-105',
                                (scroll || !invertImg) ? 'invert-0' : 'invert',
                            )}
                        />
                    </Link>
                </div>

                <nav className={cn(
                    "hidden lg:flex items-center gap-5 text-lg",
                    !enableScroll || scroll ? 'text-black' : 'text-white',
                )}>
                    {menus.map((item, i) => (
                        <React.Fragment key={i}>
                            {item.url ? (
                                <NavLink to={item.url} end key={i} className={cn(
                                    'group text-xl font-medium flex flex-col',
                                    'cursor-pointer hover:scale-105 transition-transform'
                                )}>
                                    {({ isActive }) => (
                                        <>
                                            <span className={cn(
                                                isActive ?
                                                    'opacity-50' :
                                                    'transition-colors'
                                            )}>
                                                {item.label}
                                            </span>
                                            <div className={cn(
                                                'h-[0.2rem] rounded-full mt-auto origin-center scale-x-0',
                                                !enableScroll || scroll ? 'bg-black' : 'bg-white',
                                                isActive ?
                                                    'scale-x-100 opacity-50' :
                                                    'group-hover:scale-x-100 transition-transform',
                                            )} />
                                        </>
                                    )}
                                </NavLink>
                            ) : (
                                <div className={cn(
                                    'group text-xl font-medium flex flex-col',
                                    'cursor-pointer hover:scale-105 transition-transform'
                                )}>
                                    <HoverCard openDelay={100} closeDelay={200}>
                                        <HoverCardTrigger>
                                            <div className='flex items-center gap-1 transition-colors'>
                                                {item.label}
                                                <ChevronDown className='size-5 stroke-3' />
                                            </div>
                                            <div className={cn(
                                                'h-[0.2rem] rounded-full mt-auto origin-center scale-x-0',
                                                !enableScroll || scroll ? 'bg-black' : 'bg-white',
                                                'group-hover:scale-x-100 transition-transform',
                                            )} />
                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            <div className='space-y-3'>
                                                {item.submenus?.map(item => (
                                                    <NavLink to={item.url} end key={i} className={({ isActive }) => (
                                                        'group text-lg flex flex-col' + (!isActive && 'cursor-pointer hover:scale-105 hover:translate-x-2 transition-transform')
                                                    )}>
                                                        {({ isActive }) => (
                                                            <>
                                                                <span className={cn(
                                                                    isActive ?
                                                                        'opacity-50' :
                                                                        'group-hover:opacity-50 transition-colors'
                                                                )}>
                                                                    {item.label}
                                                                </span>
                                                                <div className={cn(
                                                                    'h-[0.2rem] rounded-full mt-auto origin-center scale-x-0',
                                                                    !enableScroll || scroll ? 'bg-black' : 'bg-white',
                                                                    isActive ?
                                                                        'scale-x-100 opacity-50' :
                                                                        'group-hover:scale-x-100 transition-transform',
                                                                )} />
                                                            </>
                                                        )}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </nav>

                <div className={cn(
                    'lg:hidden ml-auto'
                )}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size='icon-lg' variant='ghost' className={cn(
                                !enableScroll || scroll ?
                                    'text-black/80 hover:text-black/50 active:text-black' :
                                    'text-white/80 hover:text-white/50 active:text-white',

                                !enableScroll || scroll ?
                                    'bg-black/10 hover:bg-black/5 active:bg-black/15' :
                                    'bg-background/20 hover:bg-background/10 active:bg-background/25'
                            )}>
                                <Menu className='stroke-3' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='p-0 max-w-60 shadow-2xl'>
                            <PopoverHeader>
                                {menus.map((link, index) =>
                                    <React.Fragment key={index}>
                                        {link.url ? (
                                            <NavLink
                                                key={index}
                                                to={link.url}
                                                className={({ isActive }) => cn(isActive && 'pointer-events-none')}
                                                onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}
                                            >
                                                {({ isActive }) => (
                                                    <Item key={index} asChild variant='default' className='py-2 px-5'>
                                                        <ItemContent className={cn(
                                                            "flex flex-col items-start justify-start w-full",
                                                            isActive ? 'bg-muted' : 'justify-start text-left w-full'
                                                        )}>
                                                            <ItemContent className={cn(
                                                                'text-sm',
                                                                isActive ? 'text-muted-foreground' : ''
                                                            )}>
                                                                {link.label}
                                                            </ItemContent>
                                                        </ItemContent>
                                                    </Item>
                                                )}
                                            </NavLink>
                                        ) : (
                                            <Collapsible className='py-2 px-5'>
                                                <CollapsibleTrigger className="flex items-center justify-between w-full group data-[state=open]:text-muted-foreground/80">
                                                    {link.label}
                                                    <ChevronDown className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className={cn(
                                                    "text-popover-foreground outline-none overflow-hidden transition-all",
                                                    "data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up",
                                                    "data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
                                                    "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
                                                    "data-[side=top]:slide-in-from-bottom-2",
                                                    "pt-2",
                                                )}>
                                                    {link.submenus?.map((item, index) => (
                                                        <NavLink
                                                            key={index}
                                                            to={item.url}
                                                            className={({ isActive }) => cn(isActive && 'pointer-events-none')}
                                                            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}
                                                        >
                                                            {({ isActive }) => (
                                                                <Item key={index} asChild variant='default' className='py-2 pl-3'>
                                                                    <ItemContent className={cn(
                                                                        "flex flex-col items-start justify-start w-full",
                                                                    )}>
                                                                        <ItemContent className={cn(
                                                                            'text-sm flex flex-row items-center',
                                                                            isActive && 'text-muted-foreground/80',
                                                                        )}>
                                                                            {item.label}
                                                                            {/* <ChevronRight className='size-4' /> */}
                                                                        </ItemContent>
                                                                    </ItemContent>
                                                                </Item>
                                                            )}
                                                        </NavLink>
                                                    ))}
                                                </CollapsibleContent>
                                            </Collapsible>
                                        )}
                                    </React.Fragment>
                                )}
                            </PopoverHeader>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </header >
    )
}