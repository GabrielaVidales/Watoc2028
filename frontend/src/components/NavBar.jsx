import { ExpandLess, ExpandMore, Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Box, Toolbar, Typography, useScrollTrigger, IconButton, Menu, MenuItem, ListItemText, MenuList, ListItemButton, Collapse, List } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ScrollTop } from './ScrollTop';
import CustomDropdownMenu from './CustomDropdownMenu';
import logo from '../assets/WatocPNGLogo.png';

const MobileNavMenu = ({ open, anchorEl, handleClose, aboutSubmenus }) => {
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
                {submenuOpen ? <ExpandLess /> : <ExpandMore />}
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
            <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>
                <MenuItem onClick={handleClose}>
                    <ListItemText primary='Registration' />
                </MenuItem>
            </Link>
        </MenuList>
    </Menu>)
}

export default function NavBar({ invertImg = true }) {
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

    const linkStyle = {
        fontSize: '1.2rem',
        fontWeight: 500,
        textAlign: 'center',
        color: (trigger || !invertImg) ? 'black' : 'white',
        transition: 'color 0.3s ease',

        '&:hover': {
            transition: 'all .3s ease',
            transform: 'translateY(-5px) scale(1.05)'
        },
        '&::after': {
            content: '""',
            position: 'relative',
            display: 'block',
            transform: 'scaleX(0)',
            transformOrigin: 'bottom',
            height: 2,
            borderRadius: 10,
            transition: 'all .3s ease',
        },
        '&:hover::after': {
            content: '""',
            transform: 'scaleX(1)',
            transition: 'all .3s ease',
            backgroundColor: (trigger || !invertImg) ? 'black' : 'white',
        }
    }

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
            <Box>
                <Link to={path} style={{ textDecoration: 'none' }} onClick={() => {
                    scrollRef.current.click()
                }}>
                    <Typography component="div" sx={linkStyle} >
                        {label}
                    </Typography>
                </Link>
            </Box>
        )
    }

    return (
        <>
            <AppBar position='fixed' elevation={5} sx={{
                backgroundColor: (trigger || !invertImg) ? 'white' : 'transparent',
                transition: 'all 0.3s ease',
            }}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: { xs: 'end', md: 'space-between' },
                        minHeight: { xs: 64, md: 100 }
                    }}
                >
                    <Box
                        sx={{
                            position: { xs: 'absolute', md: 'static' },
                            left: { xs: '50%', md: 'auto' },
                            transform: { xs: 'translateX(-50%)', md: 'none' },
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Link to='/'>
                            <Box
                                component="img"
                                alt="WATOC 2028 Logo"
                                src={logo}
                                sx={{
                                    filter: (trigger || !invertImg) ? 'none' : 'invert()',
                                    maxHeight: { xs: 50, sm: 70, md: 80 },
                                    padding: { xs: 0, sm: 1, md: 0 },
                                    width: 'auto'
                                }}
                            />
                        </Link>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', sm: 'none', md: 'flex' },
                            alignItems: 'center',
                            gap: 4
                        }}
                    >
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
                        <HomeMenuLink path='/register' label='Registration' />
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            alignItems: 'center',
                            justifyContent: 'end',
                            gap: 4
                        }}
                    >
                        <IconButton size='large'
                            onClick={handleOpen}
                            sx={{
                                color: (trigger || !invertImg) ? 'black' : 'white',
                                transition: '.3s ease',
                            }}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <MobileNavMenu open={open} anchorEl={mobileMenuAnchorEl} handleClose={handleClose} aboutSubmenus={aboutSubmenus} />
            <ScrollTop ref={scrollRef} />
        </>
    )
}