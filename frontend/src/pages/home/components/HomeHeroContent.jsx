import { Typography, Stack, Chip, Box } from '@mui/material';
import { CalendarDays, MapPin, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const QuickCountdown = () => {
    const [days, setDays] = useState(0);

    useEffect(() => {
        const target = new Date('January 9, 2028 00:00:00').getTime();
        const updateDays = () => {
            const now = Date.now();
            const diff = target - now;
            setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
        };
        updateDays();
        const interval = setInterval(updateDays, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Chip
            icon={<CalendarDays size={16} color='white' />}
            label={`${days} days until WATOC 2028`}
            sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
                fontSize: { xs: '0.85rem', md: '1rem' },
                px: 1,
                py: 2.5,
                border: '1px solid rgba(255,255,255,0.2)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 0.9 },
                    '50%': { transform: 'scale(1.03)', opacity: 1 },
                },
            }}
        />
    );
};

export const HomeHeroContent = () => {
    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight - 100,
            behavior: 'smooth',
        });
    };

    return (
        <>
            <Stack spacing={{ xs: 3, md: 4 }} alignItems="center">
                <QuickCountdown />
                <Box textAlign="center">
                    <Typography
                        variant="h1"
                        sx={{
                            color: 'white',
                            fontWeight: 800,
                            fontSize: { xs: '2.5rem', sm: '4rem', md: '6rem' },
                            letterSpacing: { xs: '3px', md: '5px' },
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            background: 'linear-gradient(to right, #ffffff, #90caf9)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                        }}
                    >
                        WATOC 2028
                    </Typography>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                        sx={{ mb: 1 }}
                    >
                        <Chip
                            icon={<MapPin size={16} color='white' />}
                            label="Mérida, México"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                fontSize: { xs: '0.9rem', md: '1.1rem' },
                                '& .MuiChip-label': {
                                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                                }
                            }}
                        />
                        <Typography
                            sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: { xs: '0.9rem', md: '1.1rem' },
                                display: { xs: 'none', sm: 'block' },
                            }}
                        >
                            •
                        </Typography>
                        <Chip
                            icon={<CalendarDays size={16} color='white' />}
                            label="January 9-14, 2028"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                fontSize: { xs: '0.9rem', md: '1.1rem' },
                                '& .MuiChip-label': {
                                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                                }
                            }}
                        />
                    </Stack>
                </Box>

                <Stack spacing={1} textAlign="center">
                    <Typography
                        sx={{
                            color: 'rgba(255,255,255,0.95)',
                            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                            maxWidth: 700,
                            lineHeight: 1.6,
                            fontWeight: 700,
                            letterSpacing: '0.4px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                        }}
                    >
                        14th Triennial Congress of the World Association of Theoretical and
                        Computational Chemists
                    </Typography>
                    <Typography
                        sx={{
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.2rem' },
                            maxWidth: 700,
                            lineHeight: 1.6,
                            fontWeight: 500,
                            letterSpacing: '0.4px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                        }}
                    >
                        Preceded by Young WATOC on January 8th
                    </Typography>
                </Stack>
            </Stack>

            <Box
                onClick={scrollToContent}
                sx={{
                    mt: 8,
                    cursor: 'pointer',
                    animation: 'bounce 2s ease-in-out infinite',
                    display: 'flex',
                    justifyContent: 'center',
                    '@keyframes bounce': {
                        '0%, 100%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(-10px)' },
                    },
                }}
            >
                <ChevronDown
                    size={40}
                    color="white"
                    style={{
                        opacity: 0.7,
                        transition: 'opacity 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                />
            </Box>
        </>
    );
};