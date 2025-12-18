import { Box, Container, Stack, Typography, Paper } from '@mui/material';
import { Diversity3 } from '@mui/icons-material';
import { Link } from 'react-router';

const collaborators = [
    { name: 'WATOC', src: '/watocLogo.png', url: 'https://www.watoc.net/' },
    { name: 'Cinvestav', src: '/cinvestavlogo.png', url: 'https://www.cinvestav.mx/' },
    { name: 'UAM', src: '/uam.png', url: 'http://www.iztapalapa.uam.mx/' },
];

export default function CollaboratorsSection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                px: { xs: 2, sm: 3 },
                bgcolor: 'grey.50',
                borderTop: '1px solid',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Container maxWidth="lg">
                <Stack alignItems="center" spacing={2} mb={6} textAlign="center">
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                        }}
                    >
                        <Diversity3 sx={{ fontSize: 32, color: 'white' }} />
                    </Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}
                    >
                        Organized In Collaboration With
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                        Leading institutions committed to advancing theoretical and computational chemistry
                    </Typography>
                </Stack>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={4}
                    justifyContent="center"
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{ gap: { xs: 3, md: 5 } }}
                >
                    {collaborators.map((collab, index) => (
                        <Link to={collab.url} key={index}>
                            <Box
                                sx={{
                                    transition: 'all 0.4s ease',
                                    '&:hover': {
                                        transform: 'scale(1.08)',
                                        '& .logo-box': {
                                            borderColor: 'primary.main',
                                            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                                        },
                                    },
                                }}
                            >
                                <Paper
                                    className="logo-box"
                                    elevation={0}
                                    sx={{
                                        width: { xs: 140, sm: 160, md: 180 },
                                        height: { xs: 140, sm: 160, md: 180 },
                                        borderRadius: 4,
                                        border: '2px solid',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: 3,
                                        bgcolor: 'white',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={collab.src}
                                        alt={collab.name}
                                        sx={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                            filter: 'grayscale(20%)',
                                            transition: 'filter 0.3s ease',
                                            '&:hover': {
                                                filter: 'grayscale(0%)',
                                            },
                                        }}
                                    />
                                </Paper>
                            </Box>
                        </Link>
                    ))}
                </Stack>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ display: 'block', mt: 5, opacity: 0.7 }}
                >
                    Proud to partner with world-renowned research institutions
                </Typography>
            </Container>
        </Box>
    );
}