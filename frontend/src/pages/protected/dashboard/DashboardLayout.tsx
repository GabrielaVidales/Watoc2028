import { CardTravel, Description, Help, Logout, Menu, MenuOpen, Payment, Person, Person2 } from '@mui/icons-material';
import { AppBar, Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SxProps, Theme, Toolbar } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router';
import logo from '../../../assets/WatocPNGLogo.png';
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const MAX_DRAWER_WIDTH = 230;
const lateralBtns = [
    {
        label: 'Profile',
        icon: <Person />,
        id: 'profile',
        url: '/user/my-profile'
    },
    {
        label: 'Abstract',
        icon: <Description />,
        id: 'abstract',
        url: '/user/my-abstract'
    },
    {
        label: 'Visa',
        icon: <CardTravel />,
        id: 'visa',
        url: '/user/my-visa'
    },
    {
        label: 'Payment',
        icon: <Payment />,
        id: 'payment',
        url: '/user/my-payment'
    },
    {
        label: 'Help',
        icon: <Help />,
        id: 'help',
        url: '/user/help'
    },
]

interface IDashboardLayoutProps { }

const DashboardLayout = ({ }: IDashboardLayoutProps) => {
    const [openDrawer, setOpenDrawer] = useState(true)
    const [drawerWidth, setDrawerWidth] = useState(MAX_DRAWER_WIDTH);

    const handleBtnMenu = () => {
        setOpenDrawer(!openDrawer)
        setDrawerWidth(openDrawer ? 0 : MAX_DRAWER_WIDTH)
    }

    const sliderStyles: SxProps<Theme> = {
        borderRadius: 3,
        '& .MuiListItemIcon-root': {
            color: 'inherit',
        },
        '&:hover': {
            color: 'primary.light',
        },
        '&.Mui-disabled': {
            opacity: 1, // evita que MUI lo apague
            pointerEvents: 'none',
            backgroundColor: '#ebefff',
            color: 'primary.light',
        },
    };

    const navigate = useNavigate()
    const { handleLogout } = useAuth()
    async function onLogout() {
        try {
            await handleLogout()
            navigate('/')
        } catch (error) {
            console.error("Eldritch error");
        }
    }

    return <>
        <AppBar position="fixed" sx={{
            backgroundColor: 'white',
            zIndex: 1300,
        }} >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton onClick={handleBtnMenu}>
                    {openDrawer ? <MenuOpen /> : <Menu />}
                </IconButton>
                <Box sx={{
                    mx: 2,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Link to='/'>
                        <Box
                            component="img"
                            alt="WATOC 2028 Logo"
                            src={logo}
                            sx={{
                                maxHeight: { xs: 30, sm: 50, md: 50 },
                                padding: { xs: 0, sm: 1, md: 0 },
                                width: 'auto'
                            }}
                        />
                    </Link>
                </Box>

                <IconButton color='primary'>
                    <Avatar sx={{ bgcolor: 'rgb(131, 131, 131)' }}>
                        <Person2 />
                    </Avatar>
                </IconButton>
            </Toolbar>
        </AppBar>
        <Toolbar />
        <Box sx={{ display: 'flex', backgroundColor: '#dcebff', flexGrow: 1 }}>
            <Drawer
                variant="permanent"
                sx={{
                    flexShrink: 0,
                    width: drawerWidth,
                    transition: 'width 0.2s ease',
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        transition: 'width 0.2s ease',
                    },
                }}
            >
                <Toolbar />

                <Box sx={{
                    mx: 2,
                    p: 3,
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
                                maxHeight: { xs: 30, sm: 50, md: 50 }, width: 'auto'
                            }}
                        />
                    </Link>
                </Box>

                <Divider />

                <Box sx={{ overflow: 'hidden', p: 0.5 }}>
                    <List >
                        {lateralBtns.map((item, index) => (
                            <ListItem key={item.id} id={item.id} disablePadding>
                                <ListItemButton sx={sliderStyles} disabled={index === 0}>
                                    <ListItemIcon color='primary'>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box sx={{ overflow: 'hidden', marginTop: 'auto', marginBottom: 3 }}>
                    <List>
                        <ListItem>
                            <Button onClick={onLogout} fullWidth variant='contained' color='error' startIcon={<Logout />} >
                                Logout
                            </Button>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Box component="main" sx={{ width: '100%' }}>
                <Outlet />
            </Box>
        </Box>
    </>
};

export default DashboardLayout;
