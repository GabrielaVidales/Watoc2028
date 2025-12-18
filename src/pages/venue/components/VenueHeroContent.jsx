import { Box, Typography, Stack, Chip, Button } from '@mui/material';
import { LocationOn, EmojiEvents, Verified, ArrowDownward } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router';

export const VenueHeroContent = () => {
    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight - 100,
            behavior: 'smooth',
        });
    };

    return (
        <>
            <Stack spacing={{ xs: 3, md: 4 }} alignItems="center" sx={{ width: '100%' }}>
                <Chip
                    icon={<LocationOn />}
                    label="MÉRIDA, YUCATÁN"
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255,255,255,0.3)',
                        fontWeight: 700,
                        fontSize: { xs: '0.85rem', md: '1rem' },
                        px: 2,
                        py: 2.5,
                        letterSpacing: '1.5px',
                    }}
                />

                <Typography
                    component="h1"
                    sx={{
                        fontSize: { xs: '2rem', sm: '3.5rem', md: '4rem' },
                        color: 'white',
                        fontWeight: 800,
                        textAlign: 'center',
                        textShadow: '0 4px 30px rgba(0,0,0,0.7)',
                        letterSpacing: '1px',
                        lineHeight: 1.1,
                        maxWidth: 1000,
                        background: 'linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.9))',
                        backgroundClip: 'text',
                    }}
                >
                    Centro Internacional de Congresos de Yucatán
                </Typography>


                <Typography
                    component="h2"
                    sx={{
                        fontSize: { xs: '1rem', sm: '1.3rem', md: '1.5rem' },
                        color: 'rgba(255,255,255,0.95)',
                        fontWeight: 300,
                        textAlign: 'center',
                        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                        letterSpacing: '0.5px',
                        lineHeight: 1.6,
                        maxWidth: 800,
                        px: { xs: 2, md: 0 },
                    }}
                >
                    The most modern and sustainable venue in the region, ready to inspire
                    the international scientific community
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                    <Link to={'https://cicyucatan.com/espacios-y-auditorios'}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: 'white',
                                color: 'primary.main',
                                px: 4,
                                py: 1.5,
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 3,
                                boxShadow: '0 8px 24px rgba(255, 255, 255, 0.3)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.95)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 32px rgba(255, 255, 255, 0.4)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Explore Facilities
                        </Button>
                    </Link>
                    <Link to={'https://recorrido.cicyucatan.com/'}>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                px: 4,
                                py: 1.5,
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 3,
                                borderWidth: 2,
                                backdropFilter: 'blur(10px)',
                                bgcolor: 'rgba(255,255,255,0.08)',
                                '&:hover': {
                                    borderColor: 'white',
                                    bgcolor: 'rgba(255,255,255,0.18)',
                                    borderWidth: 2,
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Virtual Tour
                        </Button>
                    </Link>
                </Stack>
            </Stack>

            <Box
                onClick={scrollToContent}
                sx={{
                    position: 'absolute',
                    bottom: 30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    cursor: 'pointer',
                    animation: 'bounce 2s ease-in-out infinite',
                    '@keyframes bounce': {
                        '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
                        '50%': { transform: 'translateX(-50%) translateY(-10px)' },
                    },
                }}
            >
                <ArrowDownward
                    sx={{
                        color: 'white',
                        fontSize: 40,
                        opacity: 0.8,
                        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
                        transition: 'opacity 0.3s',
                        '&:hover': { opacity: 1 },
                    }}
                />
            </Box>
        </>
    );
};