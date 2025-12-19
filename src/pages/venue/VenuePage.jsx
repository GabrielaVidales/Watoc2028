import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { Box, Card, CardContent, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import { EnergySavingsLeaf, Flight, Groups2, Hotel, Room, WifiTethering } from '@mui/icons-material'
import { VenueHeroContent } from './components/VenueHeroContent'
import GenericCTASection from '../../components/GenericCTASection'
import { HeroSection } from '../../components/HeroSection'

const FeatureCard = ({ icon, title, text }) => (
    <Paper elevation={5} sx={{
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: { xs: 3, sm: 4, md: 5 },
        height: '100%',
        transition: '.2s ease',
        '&:hover': {
            transform: 'translateY(-5%)',
            transition: '.2s ease'
        }
    }}>
        <Box
            sx={{
                height: 50,
                aspectRatio: '1 / 1',
                borderRadius: '50%',
                border: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#5e61ffff',
            }}
        >
            {icon}
        </Box>
        <Typography
            sx={{
                fontSize: { xs: '1.2rem ', sm: '1.2rem', md: '1.5rem' },
                fontWeight: 'bold',
                color: '#5e61ffff',
            }}
        >
            {title}
        </Typography>
        <Typography>
            {text}
        </Typography>
    </Paper>
)

const LocationItem = ({ icon, title, text }) => (
    <Box sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
    }}>
        <Box
            sx={{
                width: 40,
                height: 40,
                aspectRatio: '1 / 1',
                borderRadius: '50%',
                bgcolor: '#e3e3e3ff',
                color: '#dd0000ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {icon}
        </Box>
        <Box>
            <Typography fontWeight="bold">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {text}
            </Typography>
        </Box>
    </Box>
)

const ImageStatCard = ({ image, value, label }) => (
    <Card
        sx={{
            height: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            transition: 'all .35s ease',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 8
            }
        }}
    >
        <Box
            sx={{
                height: 240,
                backgroundImage: `
                    linear-gradient(
                        to top,
                        rgba(0,0,0,.7),
                        rgba(0,0,0,.2)
                    ),
                    url(${image}) `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        />
        <CardContent
            sx={{
                position: 'absolute',
                bottom: 0,
                color: 'white'
            }}
        >
            <Typography variant="h3" fontWeight="bold" lineHeight={1}>
                {value}
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                {label}
            </Typography>
        </CardContent>
    </Card>
)

export default function VenuePage() {
    return (
        <>
            <NavBar />
            <Box component='main'>
                <HeroSection
                    backgroundImgSrc="/congresoEntrada.webp"
                    height="90vh"
                    enableParticles={true}
                    enableRadialGradient={true}
                >
                    <VenueHeroContent />
                </HeroSection>

                <Box
                    component="section"
                    sx={{
                        py: { xs: 2, md: 3 },
                        px: { xs: 2, sm: 3, md: 4 },
                        bgcolor: 'background.default',
                    }}
                >
                    <Container maxWidth="lg">
                        <Stack alignItems="center" spacing={1} mb={5} textAlign="center">

                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}
                            >
                                Modernity & Sustainability
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}
                            >
                                Centro Internacional de Congresos de Yucatán
                            </Typography>

                            <Grid container spacing={3} sx={{
                                paddingTop: 4,
                                minHeight: 250
                            }}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FeatureCard
                                        icon={<Groups2 />}
                                        title='High Capacity'
                                        text='With a total event area of 10,000 m² and 26 meeting rooms, the venue can accommodate up to 10,000 attendees.'
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FeatureCard
                                        icon={<EnergySavingsLeaf />}
                                        title='LEED Certification'
                                        text='The first building in Mexico to receive LEED Platinum certification in its category, prioritizing energy efficiency and sustainable design.'
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FeatureCard
                                        icon={<WifiTethering />}
                                        title='Advanced Connectivity'
                                        text='State-of-the-art fiber-optic infrastructure and high-quality Wi-Fi designed to support thousands of simultaneous attendees.'
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                    </Container>
                </Box>

                <GenericCTASection maxWidth='lg' textAlign='left'>
                    <Paper elevation={5} sx={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        padding: { xs: 4, sm: 5, md: 6 },
                        height: '100%'
                    }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 5, md: 5 }}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    Strategic Location
                                </Typography>
                                <Typography variant="body1" color="text.secondary" mb={4}>
                                    Located in the heart of Yucatán's Convention District, surrounded by hotels, restaurants, and cultural venues.
                                </Typography>

                                <LocationItem
                                    icon={<Room />}
                                    title='Address'
                                    text='62 No. 294, between Av. Cupules and Av. Colón, Centro, Mérida, Yucatán, Mexico.'
                                />
                                <LocationItem
                                    icon={<Hotel />}
                                    title='Accommodation'
                                    text='More than 2,000 hotel rooms available within walking distance'
                                />
                                <LocationItem
                                    icon={<Flight />}
                                    title='Transportation'
                                    text='Approximately 20 minutes from Mérida International Airport (MID).'
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 7, md: 7 }}>
                                <Paper elevation={3} sx={{
                                    width: '100%',
                                    height: { xs: 350, sm: '100%' },
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                }}>
                                    <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1Nq4NPtYNPWUUEkhnz3JnCANa6bv83MM&amp;ehbc=2E312F" width="100%" height="100%"></iframe>
                                    {/* <iframe className='w-100 h-100' loading="lazy" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.1277479236255!2d-89.6214066!3d20.987515699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f56715767028947%3A0x754d8df3a5a5ba44!2sCentro%20Internacional%20de%20Congresos%20de%20Yucat%C3%A1n!5e0!3m2!1ses-419!2sar!4v1761691719116!5m2!1ses-419!2sar" style={{ border: 0 }} allowFullScreen="" referrerPolicy="no-referrer-when-downgrade"></iframe> */}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </GenericCTASection>

                <Box component='section' sx={{
                    px: { xs: 1, sm: 3, md: 10, lg: 15 },
                    py: { xs: 6, md: 10 }
                }}>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, sm: 7 }}>
                            <ImageStatCard
                                image="/centro1.jpg"
                                value="26"
                                label="Lounges"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 5 }}>
                            <ImageStatCard
                                image="/centro2.jpg"
                                value="10,000"
                                label="Capacity of assistants"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <ImageStatCard
                                image="/centro3.jpg"
                                value="9,430 m²"
                                label="Event area"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <ImageStatCard
                                image="/centroconvenciones.webp"
                                value="50,000 m²"
                                label="Total construction"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Footer />
        </>
    )
}
