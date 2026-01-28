import React from 'react'
import NavBar from '../../components/NavBar'
import { Box } from '@mui/material'
import Footer from '../../components/Footer'
import { HeroSection } from '../../components/HeroSection'
import { GenericHeroContent } from '../../components/GenericHeroContent'
import GenericCTASection from '../../components/GenericCTASection'
import RegistrationSteper from '../../components/wizard registration/RegistrationSteper'

export default function RegistrationPage() {
    return (
        <>
            <NavBar />
            <Box component='main'>
                <HeroSection>
                    <GenericHeroContent />
                </HeroSection>
                <GenericCTASection maxWidth='xl'>
                    <RegistrationSteper />
                </GenericCTASection>
            </Box>
            <Footer />
        </>
    )
}
