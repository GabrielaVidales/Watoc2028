import { Box, Container, Stack, Typography, Toolbar, Card } from '@mui/material';
import Footer from '../components/Footer';
import Lottie from 'lottie-react';
import comingSoonAnimation from '../assets/under-maintenance.json';
import RegisterForm from '@/forms/RegisterForm';
import NavBar from '@/components/NavBar';

export default function Register() {

    return (
        <>
            <NavBar invertImg={true} />
            <Box
                component='main'
                sx={{
                    bgcolor: '#0a0e27',
                    position: 'relative',
                }}>

                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 40%, rgba(25,118,210,0.15), transparent 60%)',
                    pointerEvents: 'none',
                }} />

                <Container maxWidth="sm" sx={{ position: 'relative', py: 6, zIndex: 1 }}>
                    <Toolbar />
                    <Card sx={{ padding: 3 }}>

                        {import.meta.env.DEV && (
                            <RegisterForm />
                        )}

                        {import.meta.env.PROD && (
                            <Stack spacing={4} alignItems="center" textAlign="center" sx={{ position: 'relative', py: 3, zIndex: 1 }}>
                                <Box>
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 800,
                                            fontSize: { xs: '2rem', md: '3rem' },
                                            mb: 2,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Registration is coming soon.
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: 'rgba(255,255,255,0.7)',
                                            fontWeight: 300,
                                            mb: 1,
                                        }}
                                    >
                                        World Association of Theoretical and Computational Chemists
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'rgba(255,255,255,0.6)',
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        January 9-14, 2028 • Mérida, México
                                    </Typography>
                                </Box>

                                <Box sx={{ width: { xs: '50%', sm: '50%', md: '100%' }, maxWidth: 320, mt: 2 }}>
                                    <Lottie
                                        animationData={comingSoonAnimation}
                                        loop
                                    />
                                </Box>

                                <Box sx={{ display: { xs: 'block', md: 'block' } }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                        Stay tuned — registration will be available shortly.
                                    </Typography>
                                </Box>
                            </Stack>
                        )}

                    </Card>
                </Container>

            </Box>
            <Footer />
        </>
    );
}