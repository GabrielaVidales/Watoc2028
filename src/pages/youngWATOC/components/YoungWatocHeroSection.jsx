import { ArrowDownward, LocationOn } from '@mui/icons-material'
import { Box, Chip, Stack, Typography } from '@mui/material'

export default function YoungWatocHeroSection() {
    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight - 260,
            behavior: 'smooth',
        });
    };

    return (
        <>
            <Stack spacing={{ xs: 3, md: 4 }} alignItems="center">
                <Chip
                    icon={<LocationOn color='white' fontSize='0.8rem' />}
                    label="Mérida, México"
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                        '&>span': {
                            fontSize: { xs: '0.8rem', md: '0.9rem' },
                        }
                    }}
                />
                <Box>
                    <Typography
                        variant="h1"
                        sx={{
                            color: 'white',
                            fontWeight: 800,
                            fontSize: { xs: '2.2rem', sm: '4rem', md: '4.5rem' },
                            letterSpacing: { xs: '3px', md: '5px' },
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            mb: 2,
                            background: 'linear-gradient(to right, #ffffff, #90caf9)',
                            backgroundClip: 'text',
                        }}
                    >
                        Young WATOC 2028
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                        maxWidth: 700,
                        lineHeight: 1.6,
                        fontWeight: 300,
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}
                >
                    14th Triennial Congress of the World Association of Theoretical and
                    Computational Chemists
                </Typography>
                <Typography
                    sx={{
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' },
                        maxWidth: 700,
                        lineHeight: 1.6,
                        fontWeight: 300,
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}
                >
                    Preceded by Young WATOC on January 8th
                </Typography>
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
    )
}
