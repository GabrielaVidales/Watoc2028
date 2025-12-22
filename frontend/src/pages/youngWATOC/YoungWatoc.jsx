import React from 'react'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { Box } from '@mui/material'
import { HeroSection } from '../../components/HeroSection'
import AboutYoungWATOCSection from './sections/AboutYoungWATOCSection'
import YoungWatocHeroSection from './components/YoungWatocHeroSection'

export default function YoungWatoc() {
    return (
        <>
            <NavBar />
            <Box component='main'>
                <HeroSection
                    enableParticles
                    enableRadialGradient
                >
                    <YoungWatocHeroSection />
                </HeroSection>

                <AboutYoungWATOCSection />
            </Box>
            <Footer />
        </>
    )
}
