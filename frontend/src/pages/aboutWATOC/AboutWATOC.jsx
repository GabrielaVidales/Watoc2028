import React from 'react'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { Box } from '@mui/material'
import { GenericHeroContent } from '../../components/GenericHeroContent'
import AboutWATOCSection from './sections/AboutWATOCSection'
import { HeroSection } from '../../components/HeroSection'
import { MainLayout } from '../../components/MainLayout'

export default function AboutWATOC() {
    return (
        <>
            <MainLayout heroContent={<GenericHeroContent />}>
                <AboutWATOCSection />
            </MainLayout>
        </>
    )
}
