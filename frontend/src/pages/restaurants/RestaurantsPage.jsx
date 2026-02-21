import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { Box, Card, CardContent, Container, Grid2 as Grid, Paper, Typography } from '@mui/material'
// Cambio a Lucide React
import { Utensils, MapPin, ChevronRight, Map as MapIcon } from 'lucide-react' 
import { RestaurantHeroContent } from './components/RestaurantsHeroContent'
import { HeroSection } from '../../components/HeroSection'
import apapacho from '../../assets/apapacho.jpg';
import avelino from '../../assets/avelino.jpg';
import katun from '../../assets/katun.jpg';
import peregrina from '../../assets/peregrina.jpg';
import pigua from '../../assets/pigua.jpg';
import platosrotos from '../../assets/platosrotos.jpg';
import siqueff from '../../assets/siqueff.jpg';
import terraza from '../../assets/terraza.jpg';
import tioricardo from '../../assets/tioricardo.jpg';
import tradicion from '../../assets/tradicion.jpg';

const RestaurantCard = ({ restaurant }) => (
    <Card
        sx={{
            height: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all .3s ease',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 10
            }
        }}
    >
        <Box
            sx={{
                height: 180,
                backgroundImage: `url(${restaurant.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        />

        <CardContent sx={{ flexGrow: 1 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Utensils size={16} color="#1976d2" />
                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}>
                    {restaurant.name}
                </Typography>
            </Box>

            <Typography
                variant="body2"
                sx={{ color: 'primary.main', fontWeight: 600, mb: 1, display: 'block' }}
            >
                {restaurant.type}
            </Typography>

            <Box display="flex" alignItems="center" gap={0.5}>
                <MapPin size={14} style={{ opacity: 0.6 }} />
                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    {restaurant.distance}
                </Typography>
            </Box>
        </CardContent>

        <Box sx={{ px: 2, pb: 2 }}>
            <Box
                component="a"
                href={restaurant.maps}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                }}
            >
                View on Google Maps <ChevronRight size={14} />
            </Box>
        </Box>
    </Card>
);

const restaurants = [
    { name: 'La Terraza Amarilla', type: 'Traditional Yucatecan Cuisine', distance: '2 min walk', image: terraza, maps: '#' },
    { name: 'La Pigua', type: 'Seafood & Contemporary Mexican', distance: '2 min walk', image: pigua, maps: '#' },
    { name: 'Katún Cocina Yucateca', type: 'Traditional Yucatecan Cuisine', distance: '3 min walk', image: katun, maps: '#' },
    { name: 'Peregrina Bistro', type: 'Mexican & International Bistro', distance: '4 min walk', image: peregrina, maps: '#' },
    { name: 'Avelino & María', type: 'Mexican Contemporary Cuisine', distance: '9 min walk', image: avelino, maps: '#' },
    { name: 'La Tradición', type: 'Yucatecan & Southern Mexican Specialties', distance: '6 min walk', image: tradicion, maps: '#' },
    { name: 'Los Platos Rotos', type: 'Traditional Mexican Cuisine', distance: '7 min walk', image: platosrotos, maps: '#' },
    { name: 'El Tío Ricardo', type: 'Traditional Mexican Cuisine', distance: '9 min walk', image: tioricardo, maps: '#' },
    { name: 'Siqueff', type: 'Yucatecan & Lebanese Fusion', distance: '8 min walk', image: siqueff, maps: '#' },
    { name: 'El Apapacho', type: 'Traditional Mexican Cuisine', distance: '11 min walk', image: apapacho, maps: '#' }
];

export default function RestaurantPage() {
    return (
        <>
            <NavBar />

            <Box component="main">
                <HeroSection
                    height="70dvh"
                    enableParticles={true}
                    enableRadialGradient={true}
                >
                    <RestaurantHeroContent />
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
                                sx={{ fontSize: '1rem', letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                            >
                                <Utensils size={20} /> Gastronomic Guide
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
                                Restaurants Near the Venue
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
                                Discover traditional Yucatecan cuisine and international flavors just
                                steps away from the conference location, carefully selected for
                                attendees seeking authentic local experiences.
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            {restaurants.map((restaurant, index) => (
                                <Grid key={index} size={{ xs: 12, sm: 6, md: 2.4 }}>
                                    <RestaurantCard restaurant={restaurant} />
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mt: 10 }}>
                            <Box textAlign="center" mb={5}>
                                <Typography
                                    variant="overline"
                                    color="primary"
                                    fontWeight="bold"
                                    sx={{ fontSize: '1rem', letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                                >
                                    <MapIcon size={20} /> Interactive Map
                                </Typography>

                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                    sx={{
                                        mt: 1,
                                        mb: 2,
                                        fontSize: { xs: '1.8rem', md: '2.3rem' },
                                    }}
                                >
                                    Explore Dining Options Around the Venue
                                </Typography>

                                <Box
                                    sx={{
                                        width: 80,
                                        height: 4,
                                        bgcolor: 'primary.main',
                                        mx: 'auto',
                                        borderRadius: 2,
                                    }}
                                />
                            </Box>

                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    height: { xs: 360, md: 480 },
                                    position: 'relative',
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                }}
                            >
                                <iframe
                                    src="about:blank" // Reemplazar con URL real
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    title="Google Maps"
                                />
                            </Paper>
                        </Box>
                    </Container>
                </Box>
            </Box>
            <Footer />
        </>
    );
}   