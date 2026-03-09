import { AppBar, Toolbar, useScrollTrigger, IconButton, Menu, MenuItem, ListItemText, MenuList, ListItemButton, Collapse, List } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { ScrollTop } from './ScrollTop';
import CustomDropdownMenu from './CustomDropdownMenu';
import logo from '../assets/WatocPNGLogo.png';
import { ChevronDown, ChevronUp, MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { urls } from '@/routes/routes';


const MobileNavMenu = ({ open, anchorEl, handleClose, aboutSubmenus }) => {
    const { currentUser } = useAuth()
    const [submenuOpen, setSubmenuOpen] = useState(false)

    const handleClick = () => {
        setSubmenuOpen(!submenuOpen);
    };

    return (<Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
            list: {
                'aria-labelledby': 'basic-button',
            },
        }}
    >
        <MenuList dense sx={{
            minWidth: 190,
        }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                <MenuItem onClick={handleClose}>
                    <ListItemText primary='Home' />
                </MenuItem>
            </Link>
            <Link to="/watoc" style={{ textDecoration: 'none', color: 'black' }}>
                <MenuItem onClick={handleClose}>
                    <ListItemText primary='WATOC' />
                </MenuItem>
            </Link>
            <Link to="/young-watoc" style={{ textDecoration: 'none', color: 'black' }}>
                <MenuItem onClick={handleClose}>
                    <ListItemText primary='Young WATOC' />
                </MenuItem>
            </Link>
            <ListItemButton onClick={handleClick}>
                <ListItemText primary='About' />
                {submenuOpen ? <ChevronDown /> : <ChevronUp />}
            </ListItemButton>
            <Collapse in={submenuOpen} timeout={400} unmountOnExit>
                <List dense component="div" disablePadding>
                    {aboutSubmenus.map((item) => (
                        <Link key={item.id} to={item.url} style={{ textDecoration: 'none', color: 'black' }}>
                            <ListItemButton onClick={handleClose} sx={{ pl: 4 }}>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </Link>
                    ))}
                </List>
            </Collapse>
            <Link to="/contact" style={{ textDecoration: 'none', color: 'black' }}>
                <MenuItem onClick={handleClose}>
                    <ListItemText primary='Contact' />
                </MenuItem>
            </Link>
            <Link to={currentUser ? urls.users.profile : urls.auth.login} style={{ textDecoration: 'none', color: 'black' }}>
                <MenuItem onClick={handleClose}>
                    <ListItemText primary='Registration' />
                </MenuItem>
            </Link>
        </MenuList>
    </Menu>)
}

export default function NavBar({ invertImg = true }) {
    const { currentUser } = useAuth()

    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
    const open = Boolean(mobileMenuAnchorEl)
    const scrollRef = useRef(null)

    const handleOpen = (event) => {
        setMobileMenuAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setMobileMenuAnchorEl(null);
    };

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 50,
    });

    const aboutSubmenus = useMemo(() => [
        {
            id: 0,
            url: '/venue',
            label: 'Venue',
        },
        {
            id: 1,
            url: '/hotel-booking',
            label: 'Hotel Booking',
        },
        {
            id: 2,
            url: '/restaurants',
            label: 'Restaurants',
        },
        {
            id: 3,
            url: '/transportation',
            label: 'Transportation',
        },
        {
            id: 4,
            url: '/abstract-submission',
            label: 'Abstract Submission',
        },
        {
            id: 5,
            url: '/visa',
            label: 'Visa Requirements',
        },
    ], [])

    const HomeMenuLink = ({ path = '#', label = '' }) => {
        return (
            <NavLink to={path} end style={{ textDecoration: 'none' }} >
                {({ isActive }) => (
                    <div className={cn(
                        'text-lg font-medium tracking-wider',
                        isActive ? 'opacity-50' : "hover:after:scale-x-100 after:content-[''] after:relative after:block after:h-0.5 after:rounded-[10px] after:scale-x-0 after:origin-bottom after:transition-all after:duration-300",
                        (trigger || !invertImg) ? 'text-black after:bg-black' : 'text-white after:bg-white', 'hover:scale-105 duration-300',
                    )}>
                        {label}
                    </div>
                )}
            </NavLink>
        )
    }

    return (
        <>
            <AppBar position='fixed' elevation={trigger ? 5 : 0} sx={{
                backgroundColor: (trigger || !invertImg) ? 'white' : 'transparent',
                transition: 'all 0.3s ease',
            }}>
                <div className="my-2 px-3 flex items-center justify-end lg:justify-between max-w-7xl mx-auto w-full">
                    <div className="h-16 lg:h-24 flex items-center justify-center absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0">
                        <Link to='/'>
                            <img
                                src={logo}
                                alt="WATOC 2028 Logo"
                                className={cn(
                                    'w-auto transition-all duration-300',
                                    'max-h-13  md:max-h-15 lg:max-h-18',
                                    'transition-transform hover:scale-105',
                                    (trigger || !invertImg) ? 'invert-0' : 'invert',
                                )}
                            />
                        </Link>
                    </div>
                    <div className="hidden lg:flex items-center gap-8">
                        <HomeMenuLink path='/' label='Home' />
                        <HomeMenuLink path='/watoc' label='WATOC' />
                        <HomeMenuLink path='/young-watoc' label='Young WATOC' />
                        <CustomDropdownMenu textBlack={trigger || !invertImg} >
                            {aboutSubmenus.map((item) => (
                                <Link key={item.id} to={item.url} style={{ textDecoration: 'none', }}>
                                    <MenuItem>
                                        <ListItemText sx={{ gap: 3, color: '#383838ff' }}>
                                            {item.label}
                                        </ListItemText>
                                    </MenuItem>
                                </Link>
                            ))}
                        </CustomDropdownMenu>
                        <HomeMenuLink path='/contact' label='Contact' />
                        {currentUser ? (
                            <HomeMenuLink path={urls.users.profile} label='My Profile' />
                        ) : (
                            <HomeMenuLink path={urls.auth.login} label='Registration' />
                        )}
                    </div>
                    <div className="flex lg:hidden items-center justify-end gap-4">
                        <IconButton size='large'
                            onClick={handleOpen}
                            sx={{
                                color: (trigger || !invertImg) ? 'black' : 'white',
                                transition: '.3s ease',
                            }}>
                            <MenuIcon />
                        </IconButton>
                    </div>
                </div>
            </AppBar >
            <MobileNavMenu open={open} anchorEl={mobileMenuAnchorEl} handleClose={handleClose} aboutSubmenus={aboutSubmenus} />
            <ScrollTop ref={scrollRef} />
        </>
    )
}