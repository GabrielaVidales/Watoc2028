import { Box } from "@mui/material";
import NavBar from "./NavBar";
import { HeroSection } from "./HeroSection";
import Footer from "./Footer";

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