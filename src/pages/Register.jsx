import { Box, Container, Grid, Paper, Stack, Typography, Chip, Toolbar, Grow } from '@mui/material';
import { HowToReg, Science, Group, EmojiEvents } from '@mui/icons-material';
import NavBar from '../components/NavBar';
import RegisterForm from '../forms/RegisterForm';
import React, { useMemo } from 'react';
import Footer from '../components/Footer';

const FeatureBadge = React.memo(({ icon: Icon, title, description }) => (
    <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
            sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'rgba(25, 118, 210, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
        >
            <Icon sx={{ color: 'primary.main', fontSize: 24 }} />
        </Box>
        <Box>
            <Typography variant="subtitle1" fontWeight="600" color="white" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {description}
            </Typography>
        </Box>
    </Stack>
))

export default function Register() {
    const features = useMemo(() => [
        {
            icon: Science,
            title: 'Cutting-Edge Science',
            description: 'Access to latest research in theoretical and computational chemistry',
        },
        {
            icon: Group,
            title: 'Global Network',
            description: 'Connect with leading researchers from around the world',
        },
        {
            icon: EmojiEvents,
            title: 'World-Class Venue',
            description: 'Experience LEED Platinum certified facilities in beautiful Mérida',
        },
    ], [])

    return (
        <>
            <NavBar invertImg={true} />
            <Box
                component='main'
                sx={{
                    minHeight: '100vh',
                    bgcolor: '#0a0e27',
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
                        background: 'radial-gradient(circle at 20% 50%, rgba(25, 118, 210, 0.1) 0%, transparent 50%)',
                        pointerEvents: 'none',
                    }}
                />
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, mt: 15 }}>
                    <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                        <Box>
                            <Typography
                                variant="h2"
                                sx={{
                                    color: 'white',
                                    fontWeight: 700,
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

                        <Box
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                p: 3,
                                bgcolor: 'rgba(255,255,255,0.03)',
                                borderRadius: 3,
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'rgba(255,255,255,0.8)',
                                    lineHeight: 1.8,
                                    mb: 3,
                                }}
                            >
                                WATOC 2028 will bring together leading scientists, emerging researchers, and cutting-edge research in theoretical and computational chemistry.
                            </Typography>

                            <Stack spacing={3}>
                                {features.map((feature, index) => (
                                    <FeatureBadge key={index} {...feature} />
                                ))}
                            </Stack>
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                Stay tuned — registration will be available shortly.
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </>
    );
}