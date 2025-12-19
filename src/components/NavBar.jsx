import { ArrowRight, ArrowRightSharp, KeyboardArrowDown, Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Box, Toolbar, Typography, useScrollTrigger, IconButton, Menu, MenuItem, ListItemText, ListItemIcon, ClickAwayListener, MenuList, Divider } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ScrollTop } from './ScrollTop';

export default function NavBar({ invertImg = true }) {
    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
    const [anchorAbout, setAnchorAbout] = useState(null)
    const aboutMenuOpen = Boolean(anchorAbout)
    const scrollRef = useRef(null)
    const open = Boolean(mobileMenuAnchorEl)
    const [timer, setTimer] = useState(null);


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
        color: (trigger || !invertImg) ? 'black' : 'white',
        transition: '0.3s ease',
        '&:hover': {
            transition: '.3s ease',
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
            transition: '.3s ease',
        },
        '&:hover::after': {
            content: '""',
            transform: 'scaleX(1)',
            transition: '.3s ease',
            backgroundColor: (trigger || !invertImg) ? 'black' : 'white',

        }
    }


    const aboutSubmenus = useMemo(() => [
        {
            url: '/watoc',
            label: 'WATOC',
        },
        {
            url: '/hotel-booking',
            label: 'Hotel Booking',
        },
        {
            url: '/abstract-submission',
            label: 'Abstract Submission',
        },
        {
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
                    <Typography variant="h6" component="div" sx={linkStyle} >
                        {label}
                    </Typography>
                </Link>
            </Box>
        )
    }

    const handleOnMouseOver = ({ currentTarget }) => {
        setAnchorAbout(currentTarget)
    }

    function handleOnMouseLeave() {
        setAnchorAbout(null);
    }

    return (
        <>
            <AppBar position='fixed' elevation={5} sx={{
                backgroundColor: (trigger || !invertImg) ? 'white' : 'transparent',
                transition: '0.35s ease',
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
                                src="/WatocPNGLogo.png"
                                sx={{
                                    filter: (trigger || !invertImg) ? 'none' : 'invert()',
                                    maxHeight: { xs: 60, sm: 70, md: 80 },
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
                        <HomeMenuLink path='/venue' label='Venue' />
                        <HomeMenuLink path='/young-watoc' label='Young WATOC' />
                        <Box
                            onMouseEnter={handleOnMouseOver}
                            sx={{
                                color: (trigger || !invertImg) ? 'black' : 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                cursor: 'pointer',
                                transition: '0.3s ease',
                                transform: aboutMenuOpen ? 'translateY(-5px) scale(1.05)' : 'none',
                            }}
                        >
                            <Typography variant="h6" component="div" >
                                About
                            </Typography>
                            <KeyboardArrowDown />
                        </Box>
                        {/* <HomeMenuLink path='/contact' label='Contact' /> */}
                        <HomeMenuLink path='/register' label='Registration' />
                        <Menu
                            disableScrollLock
                            disableAutoFocusItem
                            disableEnforceFocus
                            open={aboutMenuOpen}
                            anchorEl={anchorAbout}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                            slotProps={{
                                list: {
                                    onMouseLeave: handleOnMouseLeave,
                                },
                            }}
                        >
                            {aboutSubmenus.map((item, index) => (
                                <Link key={index} to={item.url} style={{ textDecoration: 'none', }}>
                                    <MenuItem onClick={handleOnMouseLeave}>
                                        <ListItemText sx={{ gap: 3, color: '#383838ff' }}>
                                            {item.label}
                                        </ListItemText>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
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
            <Menu
                open={open}
                anchorEl={mobileMenuAnchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >
                <MenuList dense>
                    <MenuItem onClick={handleClose}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                            Home
                        </Link>
                    </MenuItem>

                    <MenuItem onClick={handleClose}>
                        <Link to="/venue" style={{ textDecoration: 'none', color: 'black' }}>
                            Venue
                        </Link>
                    </MenuItem>

                    <MenuItem onClick={handleClose}>
                        <Link to="/young-watoc" style={{ textDecoration: 'none', color: 'black' }}>
                            Young WATOC
                        </Link>
                    </MenuItem>

                    <Divider />
                    {aboutSubmenus.map((item, index) => (
                        <MenuItem key={index} onClick={handleOnMouseLeave}>
                            <Link to={item.url} style={{ textDecoration: 'none', color: 'black' }}>
                                {item.label}
                            </Link>
                        </MenuItem>
                    ))}
                    <Divider />

                    {/* <MenuItem onClick={handleClose}>
                        <Link to="/contact" style={{ textDecoration: 'none', color: 'black' }}>
                            Contact
                        </Link>
                    </MenuItem> */}

                    <MenuItem onClick={handleClose}>
                        <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>
                            Registration
                        </Link>
                    </MenuItem>
                </MenuList>
            </Menu>
            <ScrollTop ref={scrollRef} />
        </>
    )
}
