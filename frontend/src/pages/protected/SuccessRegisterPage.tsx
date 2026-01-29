import { Box, Typography, Button, Container, Paper, Stack, CircularProgress } from '@mui/material';
import { CheckCircleOutline as CheckCircleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import fieldPng from '../../assets/field.png'
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

const AnimatedBox = motion.create(Container)

export const SuccessRegisterPage = () => {
    const { handleLogout } = useAuth()
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
                transition={{ delay: 0.5 }}
            >
                <Box
                    sx={{
                        minHeight: '80vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Paper
                        elevation={4}
                        sx={{
                            p: { xs: 4, md: 6 },
                            textAlign: 'center',
                            borderRadius: 4,
                        }}
                    >
                        <Stack spacing={3} alignItems="center">
                            <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />

                            <Typography variant="h5" component="h1" fontWeight="700" color="primary">
                                Thank You for Registering!
                            </Typography>

                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                                We have successfully received your information for <strong>WATOC 2028</strong>.
                                Our team is working hard to prepare an unforgettable scientific experience.
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', bgcolor: '#f0f4f8', p: 2, borderRadius: 2 }}>
                                Stay tuned! We will send updates about call for abstracts, early bird registration, and keynote speakers to your email soon.
                            </Typography>

                            <Button
                                variant="contained"
                                size="large"
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
                                size="large"
                                onClick={() => handleLogout() }
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 8,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: '600'
                                }}
                            >
                                Logout
                            </Button>
                        </Stack>
                    </Paper>
                </Box>
            </AnimatedBox>
        </Container>
    );
};

