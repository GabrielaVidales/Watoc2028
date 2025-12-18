import React from 'react'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { Box } from '@mui/material'
import { HeroSection } from '../home/sections/HeroSection'
import AbstractsSection from './sections/AbstractsSection'
import { AbstractSubmissionHeroContent } from './components/AbstractSubmissionHeroContent'
import { GenericHeroContent } from '../../components/GenericHeroContent'
import ExampleSection from './sections/ExampleSection'

export default function AbstractSubmissionInfo() {
    return (
        <>
            <NavBar />
            <Box component='main'>
                <HeroSection
                    backgroundImgSrc="/field.png"
                    height="70vh"
                    enableParticles={true}
                    enableRadialGradient={true}
                    disableLinearGradient={false}
                    enableWave={true}
                >
                    <GenericHeroContent />
                </HeroSection>
                <AbstractsSection />
                <ExampleSection />
            </Box>
            <Footer />
        </>
    )
}
