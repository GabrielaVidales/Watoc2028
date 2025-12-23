import NavBar from '../../components/NavBar'
import { Box } from '@mui/material'
import Footer from '../../components/Footer'
import { GenericHeroContent } from '../../components/GenericHeroContent'
import VisaMainSection from './sections/VisaMainSection'
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
