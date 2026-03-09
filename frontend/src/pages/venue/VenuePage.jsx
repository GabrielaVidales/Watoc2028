import { Box, Button, Card, CardContent, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import { VenueHeroContent } from './components/VenueHeroContent'
import GenericCTASection from '../../components/GenericCTASection'
import CountUp from 'react-countup';
import centro1 from '../../assets/centro1.jpg'
import centro2 from '../../assets/centro2.jpg'
import centro3 from '../../assets/centro3.jpg'
import centroConvenciones from '../../assets/centroconvenciones.webp'
import { Bed, Leaf, MapPin, Plane, UsersRound, Wifi } from 'lucide-react'
import { Link } from 'react-router';
import { HeroSection } from '@/components/HeroSection';

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

const ImageStatCard = ({ image, value, unit = null, label }) => (
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
                <CountUp
                    end={value}
                    duration={2}
                    separator=","
                    enableScrollSpy
                    scrollSpyOnce={false}
                    style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
                />
                {unit && ` ${unit}`}
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
            <HeroSection>
                <div className='flex flex-col items-center gap-4 text-center'>
                    <h2 className='max-w-xl text-gray-200 text-xl md:text-3xl text-shadow-2xl tracking-wide font-semibold'>
                        The Venue
                    </h2>
                    <h1 className='max-w-4xl text-gray-200 text-4xl md:text-[48pt] text-shadow-2xl tracking-wide font-bold'>
                        Centro Internacional de Congresos de Yucatán
                    </h1>

                    <div className='flex gap-10 pt-5'>
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
                    </div>
                    {/* <h3 className='max-w-xl text-gray-200 text-xl md:text-2xl text-shadow-2xl tracking-wide font-medium'>
                        The most modern and sustainable venue in the region, ready to inspire
                        the international scientific community
                    </h3> */}
                </div>
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
                                    icon={<UsersRound />}
                                    title='High Capacity'
                                    text='With a total event area of 10,000 m² and 26 meeting rooms, the venue can accommodate up to 10,000 attendees.'
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <FeatureCard
                                    icon={<Leaf />}
                                    title='LEED Certification'
                                    text='The first building in Mexico to receive LEED Platinum certification in its category, prioritizing energy efficiency and sustainable design.'
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <FeatureCard
                                    icon={<Wifi />}
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
                                icon={<MapPin />}
                                title='Address'
                                text='62 No. 294, between Av. Cupules and Av. Colón, Centro, Mérida, Yucatán, Mexico.'
                            />
                            <LocationItem
                                icon={<Bed />}
                                title='Accommodation'
                                text='More than 2,000 hotel rooms available within walking distance'
                            />
                            <LocationItem
                                icon={<Plane />}
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
                            image={centro1}
                            value={26}
                            label="Lounges"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <ImageStatCard
                            image={centro2}
                            value={10000}
                            label="Capacity of assistants"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <ImageStatCard
                            image={centro3}
                            value={9430}
                            unit="m²"
                            label="Event area"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <ImageStatCard
                            image={centroConvenciones}
                            value={50000}
                            unit="m²"
                            label="Total construction"
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}