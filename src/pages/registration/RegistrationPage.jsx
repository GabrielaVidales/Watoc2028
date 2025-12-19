import React from 'react'
import NavBar from '../../components/NavBar'
import { Box } from '@mui/material'
import Footer from '../../components/Footer'
import { HeroSection } from '../../components/HeroSection'
import { GenericHeroContent } from '../../components/GenericHeroContent'
import GenericCTASection from '../../components/GenericCTASection'
import WizardRegistration from '../../components/wizard registration/WizardRegistration'

export default function RegistrationPage() {
    return (
        <>
            <NavBar />
            <Box component='main'>
                <HeroSection>
                    <GenericHeroContent />
                </HeroSection>
                <GenericCTASection maxWidth='xl'>
                    <WizardRegistration/>
                </GenericCTASection>
            </Box>
            <Footer />
        </>
    )
}
