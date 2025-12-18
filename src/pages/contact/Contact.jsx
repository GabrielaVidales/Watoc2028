import { Box, Fade, Grow, Paper, Slide, Toolbar, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import ContactForm from '../../forms/ContactForm'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { GenericHeroContent } from '../../components/GenericHeroContent'
import GenericCTASection from '../../components/GenericCTASection'
import TitleSection from './sections/TitleSection'
import { HeroSection } from '../../components/HeroSection'

export default function Contact() {
    return (
        <>
            <NavBar />
            <Box component='main'>
                <HeroSection
                    backgroundImgSrc='/field.png'
                    enableParticles
                >
                    <GenericHeroContent />
                </HeroSection>

                <TitleSection />
                <GenericCTASection>
                    <Grow in={true} timeout={700}>
                        <Paper elevation={5} sx={{
                            borderTop: 12,
                            borderColor: '#6a45ffff',
                            padding: 4,
                            zIndex: 1000,
                            maxWidth: 600,
                        }}>
                            <Typography
                                variant='h3'
                                marginBottom={5}
                            >
                                Información de contacto
                            </Typography>
                            <ContactForm />
                        </Paper>
                    </Grow>
                </GenericCTASection>
            </Box>
            <Footer />
        </>
    )
}
