import { Box } from "@mui/material";
import { HeroSection } from "./HeroSection";
import Footer from "./Footer";
import NavBar from "./NavBar";

export function MainLayout({ heroContent = null, heroProps = {}, children }) {
    return <>
        <NavBar />
        <Box component='main'>
            <HeroSection enableParticles={true} enableRadialGradient={true} disableLinearGradient={false} enableWave={true} {...heroProps} >
                {heroContent}
            </HeroSection>
            {children}
        </Box>
        <Footer />
    </>
}