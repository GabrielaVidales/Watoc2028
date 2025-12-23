import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { Box, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material'
import { DirectionsBus, ElectricBolt, LocalTaxi, DirectionsWalk } from '@mui/icons-material'
import { TransportationHeroContent } from './components/TransportationHeroContent'
import { HeroSection } from '../../components/HeroSection'
import vayvenImg from '../../assets/vayven.png'
import ietranImg from '../../assets/ietram.jpg'

const TransportCard = ({ icon, title, text, image }) => (
    <Card
        sx={{
            height: '100%',
            borderRadius: 6,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all .35s ease',
            '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            }
        }}
    >
        <Box
            sx={{
                height: 260,
                position: 'relative',
                backgroundImage: `
                    linear-gradient(
                        to bottom,
                        rgba(0,0,0,0.15),
                        rgba(0,0,0,0.65)
                    ),
                    url(${image})
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -36,
                    left: 32,
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                }}
            >
                {icon}
            </Box>
        </Box>

        <CardContent sx={{ pt: 8, px: 4, pb: 4 }}>
            <Typography
                variant="h5"
                fontWeight={800}
                gutterBottom
            >
                {title}
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                lineHeight={1.85}
                sx={{ fontSize: '1.05rem',
                      lineHeight: 1.85,
                      textAlign: 'justify',
                      textJustify: 'inter-word' }}
            >
                {text}
            </Typography>
        </CardContent>
    </Card>
);

const TransportHighlight = ({ icon, title, text }) => (
    <Box
        sx={{
            display: 'flex',
            gap: 3,
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            background: 'linear-gradient(135deg, rgba(25,118,210,0.06), rgba(25,118,210,0.02))',
            border: '1px solid rgba(25,118,210,0.15)',
            transition: 'all .3s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 16px 40px rgba(25,118,210,0.2)',
            },
        }}
    >
        <Box
            sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
        >
            {icon}
        </Box>

        <Box>
            <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 0.5 }}
            >
                {title}
            </Typography>

            <Typography
                sx={{
                    color: 'text.secondary',
                    lineHeight: 1.75,
                    textAlign: 'justify',
                }}
            >
                {text}
            </Typography>
        </Box>
    </Box>
);

export default function TransportationPage() {
    return (
        <>
            <NavBar />
            <Box component="main">
                <HeroSection
                    height="70dvh"
                    enableParticles
                    enableRadialGradient
                > <TransportationHeroContent />
                </HeroSection>

                <Box
                    component="section"
                    sx={{
                        py: { xs: 6, md: 8 },
                        px: { xs: 2, sm: 3, md: 4 },
                        bgcolor: 'background.default',
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
                                TRANSPORTATION OPTIONS
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
                                Getting Here & Around
                            </Typography>
                            <Box
                                sx={{
                                    width: 100,
                                    height: 4,
                                    bgcolor: 'primary.main',
                                    mx: 'auto',
                                    borderRadius: 2,
                                    mb: 6,
                                }}
                            />
                            <Typography
                                sx={{
                                    maxWidth: 760,
                                    mx: 'auto',
                                    fontSize: { xs: '1rem', md: '1.15rem' },
                                    opacity: 0.95,
                                    lineHeight: 1.7,
                                }}
                            >
                                Mérida offers safe, modern, and convenient transportation options,
                                making it easy for attendees to move around the city during WATOC 2028.
                            </Typography>
                        </Box>
                        <Stack spacing={4} mb={8} maxWidth={900} mx="auto">
                            <TransportHighlight
                                icon={<LocalTaxi />}
                                title="Taxis & Ride-Sharing"
                                text="Uber, Didi, and local taxis are widely available for convenient travel throughout the city."
                            />
                            <TransportHighlight
                                icon={<DirectionsWalk />}
                                title="Walking"
                                text="The congress center is within comfortable walking distance of numerous hotels, restaurants, and attractions along Paseo de Montejo."
                            />
                        </Stack>
                        <Box textAlign="center" mb={5}>
                            <Typography
                                variant="overline"
                                color="primary"
                                fontWeight="bold"
                                sx={{ fontSize: '1rem', letterSpacing: 2 }}
                            >
                                PUBLIC TRANSPORTATION DETAILS
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
                                Modern & Sustainable Options
                            </Typography>
                            <Box
                                sx={{
                                    width: 100,
                                    height: 4,
                                    bgcolor: 'primary.main',
                                    mx: 'auto',
                                    borderRadius: 2,
                                    mb: 6,
                                }}
                            />
                        </Box>
                        <Grid container spacing={4}>
                            <Grid item size={{ xs: 12, sm: 6}}>
                                <TransportCard
                                    icon={<DirectionsBus />}
                                    title="Va-y-Ven System"
                                    image={vayvenImg}
                                    text='The main public transport system with modern, air-conditioned buses.
                                    The "Ruta Centro–Hoteles–CIC" connects the historic center, major hotels
                                    along Paseo de Montejo, and the Congress Center. Payment is made using
                                    a rechargeable smart card.'
                                />
                            </Grid>

                            <Grid item size={{ xs: 12, sm: 6}}>
                                <TransportCard
                                    icon={<ElectricBolt />}
                                    title="IE-TRAM Yucatán"
                                    image={ietranImg}
                                    text='A 100% electric, tram-like bus system connecting Mérida with nearby
                                    towns such as Kanasín and Umán. The "Ruta La Plancha–Facultad de Ingeniería"
                                    is useful for reaching the Teya train station (Tren Maya) from the city center.'
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
            <Footer />
        </>
    )
}