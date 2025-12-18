import { Box, Card, CardContent, Container, Grid, Icon, Stack, Typography } from '@mui/material'
import { Hotel, LocationOn, Star } from '@mui/icons-material'
import FeatureCard from '../../../components/FeatureCard'

const stats = [
    {
        title: '2,000+',
        label: 'Hotel Rooms',
        text: 'Within 600 meters of the venue',
        icon: Hotel,
        color: '#1976d2',
    },
    {
        title: '3–5★',
        label: 'Hotel Category',
        text: 'Wide range of options',
        icon: Star,
        color: '#2e7d32',
    },
    {
        title: '6,000',
        label: 'Rooms in Mérida',
        text: 'City-wide capacity',
        icon: LocationOn,
        color: '#ed6c02',
    },
]

export default function HospitalitySection() {
    return (
        <>
            <Box
                component="section"
                sx={{
                    py: { xs: 6, md: 8 },
                    px: { xs: 2, sm: 3, md: 4 },
                    background: 'white',
                }}
            >
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={6}>

                        <Typography
                            variant="overline"
                            color="primary"
                            fontWeight="bold"
                            sx={{ fontSize: '1rem', letterSpacing: 2 }}
                        >
                            Hospitality District
                        </Typography>
                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            sx={{
                                mt: 1,
                                mb: 2,
                                fontSize: { xs: '2rem', md: '2.5rem' },
                            }}
                        >
                            Stay Steps Away from WATOC 2028
                        </Typography>
                        <Box
                            sx={{
                                width: 100,
                                height: 4,
                                bgcolor: 'primary.main',
                                mx: 'auto',
                                borderRadius: 2,
                            }}
                        />
                    </Box>

                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                        <Stack spacing={4} textAlign="center" alignItems="center">

                            <Typography
                                sx={{
                                    maxWidth: 760,
                                    fontSize: { xs: '1rem', md: '1.15rem' },
                                    opacity: 0.95,
                                    lineHeight: 1.7,
                                }}
                            >
                                The WATOC 2028 venue is surrounded by a dedicated hospitality
                                district, offering thousands of hotel rooms within walking distance,
                                ensuring comfort, accessibility, and a seamless congress experience.
                            </Typography>
                        </Stack>

                        <Box
                            sx={{
                                mt: { xs: 6, md: 8 },
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                },
                                gap: 4,
                            }}
                        >
                            {stats.map((item, index) => (
                                <FeatureCard key={index} {...item} />
                            ))}
                        </Box>
                    </Container>

                </Container>
            </Box>

        </>
    )
}
