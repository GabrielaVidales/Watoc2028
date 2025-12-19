import React from 'react'
import NavBar from '../../components/NavBar'
import { Box, Divider } from '@mui/material'
import Footer from '../../components/Footer'
import { Link } from 'react-router'
import { GenericHeroContent } from '../../components/GenericHeroContent'
import VisaMainSection from './sections/VisaMainSection'
import GenericCTASection from '../../components/GenericCTASection'
import VisaInvitationSection from './sections/VisaInvitationSection'
import { HeroSection } from '../../components/HeroSection'

export default function VisaRequirements() {
    return (
        <>
            <NavBar />
            <Box component='main'>
                <HeroSection
                    enableParticles={true}
                    enableRadialGradient={true}
                    height='70dvh'
                >
                    <GenericHeroContent />
                </HeroSection>
                <VisaMainSection/>
                <VisaInvitationSection/>
            </Box>
            <Footer />
        </>
    )
}
