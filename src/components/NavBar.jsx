import { KeyboardArrowDown, Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Box, Toolbar, Typography, useScrollTrigger, IconButton, Menu, MenuItem, ListItemText } from '@mui/material';
import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { ScrollTop } from './ScrollTop';

export default function NavBar({ invertImg = true }) {
    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
    const scrollRef = useRef(null)

    const [anchorProgram, setAnchorProgram] = useState(null)
    const programMenuOpen = Boolean(anchorProgram)

    const handleOpen = (event) => {
        setMobileMenuAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setMobileMenuAnchorEl(null);
    };

    const open = Boolean(mobileMenuAnchorEl)

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 50,
    });

    const linkStyle = {
        color: (trigger || !invertImg) ? 'black' : 'white',
        transition: '0.35s ease',
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

    const HomeMenuLink = ({ path = '#', label = '' }) => {
        return (
            <Box>
                <Link to={path} style={{ textDecoration: 'none' }} onClick={() => {
                    console.log(scrollRef.current.click())
                }}>
                    <Typography variant="h6" component="div" sx={linkStyle} >
                        {label}
                    </Typography>
                </Link>
            </Box>
        )
    }

    const handleOnMouseOver = ({ currentTarget }) => {
        console.log('PUTA');
        setAnchorProgram(currentTarget)
    }

    function handleOnMouseLeave() {
        console.log('MIERDA');
        setAnchorProgram(null);
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
                        component='a'
                        href='/'
                        sx={{
                            position: { xs: 'absolute', md: 'static' },
                            left: { xs: '50%', md: 'auto' },
                            transform: { xs: 'translateX(-50%)', md: 'none' },
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
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
                        <Box
                            aria-haspopup="true"
                            onMouseEnter={handleOnMouseOver}
                            onMouseLeave={handleOnMouseLeave}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                cursor: 'pointer',
                                transition: '0.3s ease',
                                transform: programMenuOpen ? 'translateY(-5px) scale(1.05)' : 'none',
                                '&:hover .menu-link': {
                                    transform: 'translateY(-5px) scale(1.05)',
                                },

                                '&:hover .menu-link::after': {
                                    transform: 'scaleX(1)',
                                },
                            }}
                        >
                            <Typography variant="h6" className='menu-link' component="div" sx={linkStyle} >
                                About
                            </Typography>
                            <KeyboardArrowDown sx={linkStyle} />
                            <Menu
                                disableScrollLock
                                open={programMenuOpen}
                                anchorEl={anchorProgram}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                                slotProps={{
                                    list: {
                                        onMouseEnter: () => setAnchorProgram(anchorProgram),
                                        onMouseLeave: () => setAnchorProgram(null),
                                    },
                                }}
                            >
                                {[
                                    ['/watoc', 'WATOC'],
                                    ['/hotel-booking', 'Hotel Booking'],
                                    ['/abstract-submission', 'Abstract Submission'],
                                    ['/visa', 'Visa Requirements'],
                                ].map((item, index) => (
                                    <Link key={index} to={item[0]} style={{ textDecoration: 'none', color: 'black' }}>
                                        <MenuItem onClick={handleOnMouseLeave}>
                                            <ListItemText>
                                                {item[1]}
                                            </ListItemText>
                                        </MenuItem>
                                    </Link>
                                ))}
                            </Menu>
                        </Box>
                        <HomeMenuLink path='/contact' label='Contact' />
                        <HomeMenuLink path='/register' label='Registration' />
                        <HomeMenuLink path='/login' label='Login' />
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
                <MenuItem onClick={handleClose}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                        Home
                    </Link>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <Link to="/program" style={{ textDecoration: 'none', color: 'black' }}>
                        Program
                    </Link>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <Link to="/contact" style={{ textDecoration: 'none', color: 'black' }}>
                        Contact
                    </Link>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>
                        Login
                    </Link>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>
                        Registration
                    </Link>
                </MenuItem>
            </Menu>
            <ScrollTop ref={scrollRef} />
        </>
    )
}
