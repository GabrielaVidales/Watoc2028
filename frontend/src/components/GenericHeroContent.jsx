import { Typography, Button, Stack, Chip, Box } from '@mui/material';
import { CalendarToday, LocationOn, ArrowDownward } from '@mui/icons-material';
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
            icon={<CalendarToday />}
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

export const GenericHeroContent = () => {
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
                <Box>
                    <Typography
                        variant="h1"
                        sx={{
                            color: 'white',
                            fontWeight: 800,
                            fontSize: { xs: '2.5rem', sm: '4rem', md: '6rem' },
                            letterSpacing: { xs: '3px', md: '5px' },
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            mb: 2,
                            background: 'linear-gradient(to right, #ffffff, #90caf9)',
                            backgroundClip: 'text',
                        }}
                    >
                        WATOC 2028
                    </Typography>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                        sx={{ mb: 2 }}
                    >
                        <Chip
                            icon={<LocationOn />}
                            label="Mérida, México"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                fontSize: { xs: '0.9rem', md: '1.1rem' },
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
                            icon={<CalendarToday />}
                            label="January 9-14, 2028"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                fontSize: { xs: '0.9rem', md: '1.1rem' },
                            }}
                        />
                    </Stack>
                </Box>
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
                        opacity: 0.7,
                        '&:hover': { opacity: 1 },
                    }}
                />
            </Box>
        </>
    );
};