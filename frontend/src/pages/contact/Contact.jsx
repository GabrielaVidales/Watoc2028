import { Box, Container, Fade, Grow, Paper, Slide, Toolbar, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import ContactForm from '../../forms/ContactForm'
import { GenericHeroContent } from '../../components/GenericHeroContent'
import GenericCTASection from '../../components/GenericCTASection'
import TitleSection from './sections/TitleSection'
import { HeroSection } from '../../components/HeroSection'

export default function Contact() {
    return (
        <>
            <HeroSection>
                <div className='flex flex-col items-center gap-4 text-center'>
                    <h1 className='max-w-4xl text-gray-200 text-4xl md:text-[72pt] text-shadow-2xl tracking-wide font-bold'>
                        Contact Us
                    </h1>
                    {/* <h2 className='max-w-xl text-gray-200 text-xl md:text-2xl text-shadow-2xl tracking-wide font-semibold'>
                    Promoting Theoretical and Computational Chemistry since 1982
                </h2> */}
                    <h3 className='max-w-xl text-gray-200 text-xl md:text-2xl text-shadow-2xl tracking-wide font-medium'>
                        For inquiries regarding registration, abstract submission, or logistics, please contact the secretariat at contact@watoc2028.org.
                    </h3>
                </div>
            </HeroSection>
            <Box
                component="section"
                sx={{
                    py: { xs: 6, md: 8 },
                    px: { xs: 0, sm: 2 },
                    bgcolor: 'grey.50',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Grow in={true} timeout={700}>
                        <Paper elevation={5} sx={{
                            borderTop: 12,
                            borderColor: '#6a45ffff',
                            padding: 4,
                            maxWidth: 700,
                            width: '100%',
                            minWidth: 300,
                        }}>
                            <ContactForm />
                        </Paper>
                    </Grow>
                </Container>
            </Box>
        </>
    )
}
