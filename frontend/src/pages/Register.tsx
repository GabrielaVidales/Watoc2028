import { Box, Container, Stack, Typography, Toolbar, Card } from '@mui/material';
import Footer from '../components/Footer';
import Lottie from 'lottie-react';
import comingSoonAnimation from '../assets/under-maintenance.json';
import RegisterForm from '@/forms/RegisterForm';
import NavBar from '@/components/NavBar';
import UserRegisterForm from '@/forms/registration/UserRegisterForm';

export default function Register() {

    return (
        <>
            <div className='max-w-2xl mx-auto p-9'>
                {import.meta.env.DEV && (
                    <RegisterForm />
                )}
            </div>
            <Container maxWidth="md" sx={{ position: 'relative', py: 6 }}>
                <Toolbar />
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
            </Container>

        </>
    );
}