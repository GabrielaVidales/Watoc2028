import React from 'react'
import { Box } from '@mui/material'
import { HeroSection } from '../../components/HeroSection'
import AboutYoungWATOCSection from './sections/AboutYoungWATOCSection'
import YoungWatocHeroSection from './components/YoungWatocHeroSection'

export default function YoungWatoc() {
    return (
        <>
            <HeroSection>
                <div className='flex flex-col items-center gap-4 text-center'>
                    <h1 className='max-w-4xl text-gray-200 text-4xl md:text-[62pt] text-shadow-2xl tracking-wide font-bold'>
                        Young WATOC 2028
                    </h1>
                    <h2 className='max-w-2xl text-gray-200 text-xl md:text-2xl text-shadow-2xl tracking-wide font-medium'>
                        A dedicated program for the next generation of researchers, featuring specialized workshops, mentoring sessions, and poster awards.
                    </h2>
                </div>
            </HeroSection>
            <AboutYoungWATOCSection />
        </>
    )
}
