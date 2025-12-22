import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Home, ArrowBack, Explore } from '@mui/icons-material';
import { useNavigate } from 'react-router';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            {[...Array(50)].map((_, i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        width: 2,
                        height: 2,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.3)',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 3}s`,
                        '@keyframes twinkle': {
                            '0%, 100%': { opacity: 0.3 },
                            '50%': { opacity: 1 },
                        },
                    }}
                />
            ))}

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Stack spacing={4} alignItems="center" textAlign="center">
                    <Box
                        sx={{
                            position: 'relative',
                            display: 'inline-block',
                        }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '8rem', md: '12rem' },
                                fontWeight: 900,
                                color: 'transparent',
                                WebkitTextStroke: '2px rgba(255,255,255,0.3)',
                                lineHeight: 1,
                                mb: -2,
                            }}
                        >
                            404
                        </Typography>
                    </Box>

                    <Stack spacing={2}>
                        <Typography
                            variant="h2"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                fontSize: { xs: '2rem', md: '3rem' },
                            }}
                        >
                            Did You Get Lost?
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: 300,
                                maxWidth: 500,
                                mx: 'auto',
                            }}
                        >
                            The page you're looking for doesn't exist or has been moved.
                            Let's get you back on track!
                        </Typography>
                    </Stack>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ mt: 2 }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Home />}
                            onClick={() => navigate('/')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 3,
                                boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
                                '&:hover': {
                                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.5)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Go to Home
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<ArrowBack />}
                            onClick={() => navigate(-1)}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 3,
                                borderWidth: 2,
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: 'white',
                                '&:hover': {
                                    borderWidth: 2,
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Go Back
                        </Button>
                    </Stack>

                    <Box
                        sx={{
                            mt: 4,
                            p: 3,
                            borderRadius: 2,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            Need help? Contact us at{' '}
                            <Box
                                component="span"
                                sx={{ color: 'primary.light', fontWeight: 600 }}
                            >
                                info@watoc2028.org
                            </Box>
                        </Typography>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}