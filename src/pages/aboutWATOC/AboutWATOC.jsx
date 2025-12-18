import React from 'react'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { Box } from '@mui/material'
import { GenericHeroContent } from '../../components/GenericHeroContent'
import AboutWATOCSection from './sections/AboutWATOCSection'
import { HeroSection } from '../../components/HeroSection'

export default function AboutWATOC() {
    return (
        <>
            <NavBar />
            <Box component='main'>
                <HeroSection>
                    <GenericHeroContent />
                </HeroSection>

                <AboutWATOCSection />
            </Box>
            <Footer />
        </>
    )
}
