'deprecar'

import { Box, Typography, Button, Container, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import fieldPng from '../../assets/field.png'
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import watocLogo from '../../assets/WatocPNGLogo.png'

const AnimatedBox = motion.create(Container)

export const SuccessRegisterPage = () => {
    const { handleLogout, currentUser: user } = useAuth()
    const navigate = useNavigate();

    return (
        <Container maxWidth="xl" sx={{
            backgroundColor: 'black',
            flex: 1,
            backgroundImage: `url(${fieldPng})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <AnimatedBox
                maxWidth='sm'
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.5 }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        p: { xs: 3, md: 6 },
                        textAlign: 'center',
                        borderRadius: 4,
                    }}
                >
                    <Stack spacing={3} alignItems="center">
                        <Box component="img" alt="WATOC 2028 Logo." src={watocLogo} sx={{
                            width: '90%',
                        }} />

                        <Typography variant="h5" component="h1" fontWeight="700" color="primary">
                            Thank You for Registering!
                        </Typography>

                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem', fontStyle: 'italic', bgcolor: '#f0f4f8', p: 2, borderRadius: 2 }}>
                            We have successfully received your information for <strong>WATOC 2028</strong>. We will send updates to <strong>{user?.email}</strong> about call for abstracts, early bird registration, and keynote speakers to your email soon.
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() => navigate('/')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 8,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}
                        >
                            Back to Homepage
                        </Button>
                        <Button
                            variant="outlined"
                            color='error'
                            onClick={() => handleLogout()}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 8,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}
                        >
                            Make a New Registration
                        </Button>
                    </Stack>
                </Paper>
            </AnimatedBox>
        </Container>
    );
};

