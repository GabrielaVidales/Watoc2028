import React from 'react'
import { Box } from '@mui/material'
import AbstractsSection from './sections/AbstractsSection'
import { AbstractSubmissionHeroContent } from './components/AbstractSubmissionHeroContent'
import { GenericHeroContent } from '../../components/GenericHeroContent'
import ExampleSection from './sections/ExampleSection'
import { HeroSection } from '../../components/HeroSection'

export default function AbstractSubmissionInfo() {
    return (
        <>
            <HeroSection
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
        </>
    )
}
