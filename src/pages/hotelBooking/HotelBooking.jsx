import React from 'react'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { Box, Container, Grid, Paper, Typography } from '@mui/material'
import HospitalitySection from './sections/HospitalitySection'
import { HotelBookingHeroContent } from './components/HotelBookingHeroContent'
import GenericCTASection from '../../components/GenericCTASection'
import { Flight, Hotel, Room } from '@mui/icons-material'
import { HeroSection } from '../../components/HeroSection'


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

export default function HotelBooking() {
    return (
        <>
            <NavBar />
            <Box component='main'>
                <HeroSection
                    backgroundImgSrc='/hotel.webp'
                    enableRadialGradient
                    height='70dvh'
                    enableParticles={true}
                    enableWave={true}
                >
                    <HotelBookingHeroContent />

                </HeroSection>

                <HospitalitySection />

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
                                    height: { xs: 350, sm: '300' },
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
            </Box>
            <Footer />
        </>
    )
}
