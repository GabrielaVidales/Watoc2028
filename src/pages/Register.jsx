import NavBar from '../components/NavBar'
import { Box, Card, CardContent, Grid, Toolbar } from '@mui/material'
import RegisterForm from '../forms/RegisterForm'

export default function Register() {
    return (
        <>
            <NavBar invertImg={true} />
            <Box
                component='main'
                position='relative'
                sx={{
                    width: '100%',
                    minHeight: '100dvh',
                    backgroundColor: '#050417ff',
                }}
            >
                <Grid container columns={{ sm: 1, md: 2 }}>
                    <Grid size={{ sm: 0, md: 1, }} display={{ sm: 'none', xs: 'none', md: 'block' }}>
                        <Box
                            component='main'
                            position='relative'
                            sx={{
                                width: '100%',
                                minHeight: '100dvh',
                                backgroundImage: 'url("/field.png")', // URL de la imagen
                                backgroundSize: 'cover',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <div className='container-fluid h-100'>
                                <div className='row d-flex justify-content-center align-items-center p-3 h-100'>
                                    <div className='col-12 col-sm-10 flex-column row-gap-3 h-100 justify-content-center align-items-center d-flex'>
                                        <h2 className='fw-bold'>World Association of Theoretical and Computational Chemists</h2>
                                        <span>Join the world's leading minds in theoretical chemistry. Acess exclusive content, manage your schedule, and connect with peers.</span>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Grid>
                    {/* <Grid size={{ sm: 2, md: 0 }} display={{ sm: 'block', xs: 'block', md: 'none' }}>
                        <Toolbar />
                    </Grid> */}
                    <Grid size={{ sm: 1, md: 1 }} width={'100%'}>
                        <Box
                            component='main'
                            position='relative'
                            sx={{
                                width: '100%',
                                minHeight: '100dvh',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <div className='container-fluid h-100 d-flex flex-column justify-content-center'>
                                <div className='row d-flex justify-content-center align-items-end p-3'>
                                    <div className='col-12 col-sm-8 justify-content-center align-items-center d-flex'>
                                        <RegisterForm />
                                    </div>
                                </div>
                            </div>

                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
