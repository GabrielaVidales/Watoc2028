import React from 'react'
import Footer from '../../components/Footer'
import { Box } from '@mui/material'
import { GenericHeroContent } from '../../components/GenericHeroContent'
import AboutWATOCSection from './sections/AboutWATOCSection'
import { HeroSection } from '../../components/HeroSection'

export default function AboutWATOC() {

    return (
        <>
            <HeroSection >
                <AboutWATOCHero />
            </HeroSection>
            <AboutWATOCSection />
        </>
    )
}


export function AboutWATOCHero() {

    return (
        <div className='flex flex-col items-center gap-4 text-center'>
            <h1 className='max-w-4xl text-gray-200 text-4xl md:text-[72pt] text-shadow-2xl tracking-wide font-bold'>
                About WATOC
            </h1>
            <h2 className='max-w-xl text-gray-200 text-xl md:text-2xl text-shadow-2xl tracking-wide font-semibold'>
                Promoting Theoretical and Computational Chemistry since 1982
            </h2>
        </div>
    )
}