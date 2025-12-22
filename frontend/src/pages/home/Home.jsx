import { Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { ArrowForward } from '@mui/icons-material'
import WelcomeSection from './sections/WelcomeSection'
import VenueSection from './sections/VenueSection'
import CollaboratorsSection from './sections/CollaboratorsSection'
import NewsletterSection from './sections/NewsletterSection'
import { HomeHeroContent } from './components/HomeHeroContent'
import GenericCTASection from '../../components/GenericCTASection'
import { HeroSection } from '../../components/HeroSection'
import { Link } from 'react-router'

export const MainCTA = () => (
    <GenericCTASection>
        <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h3" fontWeight="bold">
                Be Part of WATOC 2028
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 600, opacity: 0.95 }}>
                Join leading researchers from around the world in advancing theoretical and computational chemistry
            </Typography>

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 3 }}
            >
                <Link to='/register'>
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{
                            bgcolor: 'white',
                            color: 'primary.main',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: 'grey.100',
                                transform: 'translateY(-2px)',
                                boxShadow: 4,
                            },
                            transition: 'all 0.3s',
                        }}
                    >
                        Register Now
                    </Button>
                </Link>
                <Link to='/abstract-submission'>
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{
                            borderColor: 'white',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            '&:hover': {
                                borderColor: 'white',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s',
                        }}
                    >
                        Submit Abstract
                    </Button>
                </Link>
            </Stack>
        </Stack>
    </GenericCTASection>

)

const CounterCard = () => {
    const [timeRemaining, setTimeRemaining] = useState({
        weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0
    });

    useEffect(() => {
        const targetDate = new Date("January 9, 2028 00:00:00").getTime();
        const updateTime = () => {
            const now = Date.now();
            const diff = targetDate - now;
            if (diff < 0) return;
            const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
            setTimeRemaining({
                weeks: Math.floor(totalDays / 7),
                // days: totalDays % 7,
                days: totalDays,
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000)
            });
        }
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const counterItem = (value, label) => (
        <Card
            elevation={6}
            sx={{
                textAlign: 'center',
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 2,
                px: 1
            }}
        >
            <CardContent>
                <Typography variant="h5" fontWeight="bold">{value}</Typography>
                <Typography variant="caption">{label}</Typography>
            </CardContent>
        </Card>
    );

    return (
        <Box
            sx={{
                mt: { xs: 2, sm: 4 },
                mb: { xs: 2, sm: 6 },
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 2, md: 3 },
                maxWidth: 800,
                mx: 'auto',
                //  minWidth: { xs: 60, sm: 80, md: 100 },
                textAlign: 'center',
                bgcolor: 'white',
                color: 'white',
                zIndex: 99999
            }}
        >
            {/* {counterItem(timeRemaining.weeks, 'weeks')} */}
            {counterItem(timeRemaining.days, 'days')}
            {counterItem(timeRemaining.hours, 'hours')}
            {counterItem(timeRemaining.minutes, 'minutes')}
            {counterItem(timeRemaining.seconds, 'seconds')}
        </Box>
    )
}

export default function Home() {
    return (
        <>
            <NavBar />
            <Box component='main'>
                <HeroSection
                    height="95vh"
                    enableParticles={true}
                    enableRadialGradient={true}
                    disableLinearGradient={false}
                    enableWave={true}
                >
                    <HomeHeroContent />
                </HeroSection>

                <WelcomeSection />
                <MainCTA />
                <Box component='section' justifyContent='center' textAlign='center' sx={{
                    px: { xs: 1, sm: 3, md: 10, lg: 15 },
                    py: { xs: 2, md: 3 },
                }}>
                    <Typography variant="h4" fontWeight="bold">
                        Countdown to WATOC 2028
                    </Typography>
                    <CounterCard />
                </Box>
                <VenueSection />
                {/* <NewsletterSection /> */}
                <CollaboratorsSection />
            </Box>
            <Footer />
        </>
    )
}
