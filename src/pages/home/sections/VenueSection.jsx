import { Box, Button, Card, CardContent, Container, Grid, Paper, Stack, Typography, Chip } from '@mui/material';
import { Flight, Hotel, Room, ArrowForward, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import FeatureCard from '../../../components/FeatureCard';

export default function VenueSection() {
    const navigate = useNavigate();

    const features = [
        { icon: Room, text: 'Downtown Mérida', color: '#1976d2' },
        { icon: Flight, text: '20 min from airport', color: '#2e7d32' },
        { icon: Hotel, text: '2,000+ hotel rooms', color: '#ed6c02' },
    ];

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                px: { xs: 2, sm: 3, md: 4 },
                bgcolor: 'background.default',
            }}
        >
            <Container maxWidth="lg">
                <Stack alignItems="center" spacing={1} mb={5} textAlign="center">
                    <Chip
                        icon={<LocationOn />}
                        label="Event Location"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600, mb: 1 }}
                    />
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}
                    >
                        Centro Internacional de Congresos
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}
                    >
                        Yucatán, México
                    </Typography>
                </Stack>

                <Paper
                    elevation={8}
                    sx={{
                        maxWidth: 800,
                        mx: 'auto',
                        borderRadius: 4,
                        overflow: 'hidden',
                        position: 'relative',
                        mb: 4,
                    }}
                >
                    <Box
                        component="img"
                        src="/centroconvenciones.webp"
                        alt="Centro Internacional de Congresos de Yucatán"
                        sx={{
                            width: '100%',
                            height: { xs: 280, sm: 400, md: 480 },
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                            p: { xs: 2, md: 4 },
                        }}
                    >
                        <Typography
                            variant="h5"
                            color="white"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: '1.2rem', md: '1.8rem' } }}
                        >
                            World-Class Facilities
                        </Typography>
                        <Typography
                            variant="body2"
                            color="white"
                            sx={{ opacity: 0.9, mt: 0.5 }}
                        >
                            State-of-the-art convention center in the heart of Mérida
                        </Typography>
                    </Box>
                </Paper>

                <Grid container spacing={3} justifyContent='center' sx={{ maxWidth: 900, mx: 'auto', mb: 4 }} >
                    {features.map((feature, index) => (
                        <Grid size={{ sx: 12, sm: 3 }} key={index}>
                            <FeatureCard {...feature} />
                        </Grid>
                    ))}
                </Grid>

                <Box textAlign="center" maxWidth={700} mx="auto">
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            fontSize: { xs: '0.95rem', md: '1.05rem' },
                            lineHeight: 1.8,
                            mb: 3,
                        }}
                    >
                        A world-class convention center offering modern facilities, excellent
                        connectivity, and a unique cultural environment for international
                        scientific exchange in the beautiful city of Mérida.
                    </Typography>

                    <Button
                        onClick={() => {
                            navigate('/venue');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{
                            px: 5,
                            py: 1.5,
                            textTransform: 'none',
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            borderRadius: 3,
                            boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Explore the Venue
                    </Button>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 2, opacity: 0.7 }}
                    >
                        Learn more about accommodations, transportation, and nearby attractions
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}