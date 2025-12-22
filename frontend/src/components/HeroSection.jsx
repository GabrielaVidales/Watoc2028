import { Box, Container, Fade, Toolbar } from '@mui/material';
import { useState, useEffect, memo } from 'react';
import meridaWebp from './../assets/merida.webp'
import meridaJpg from './../assets/merida.jpg'
import hotel from './../assets/hotel.webp'
import congresoEntrada from './../assets/congresoEntrada.webp'

const FloatingParticles = memo(({ count = 20, color = 'rgba(255,255,255,0.3)' }) => (
    <Box
        sx={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
        }}
    >
        {[...Array(count)].map((_, i) => (
            <Box
                key={i}
                sx={{
                    position: 'absolute',
                    width: { xs: 3, md: 4 },
                    height: { xs: 3, md: 4 },
                    borderRadius: '50%',
                    bgcolor: color,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                    '@keyframes float': {
                        '0%, 100%': {
                            transform: 'translateY(0) translateX(0)',
                            opacity: 0.3,
                        },
                        '50%': {
                            transform: `translateY(${-50 - Math.random() * 50}px) translateX(${Math.random() * 40 - 20}px)`,
                            opacity: 0.8,
                        },
                    },
                }}
            />
        ))}
    </Box>
))

export const HeroSection = ({
    backgroundImgSrc = [meridaWebp, meridaJpg, hotel, congresoEntrada],
    height = '70vh',
    disableLinearGradient = false,
    enableParticles = false,
    enableRadialGradient = true,
    gradientColors = 'rgba(13, 27, 42, 0.5) 0%, rgba(27, 38, 59, 0.25) 50%, rgba(13, 27, 42, 0.5) 100%',
    enableWave = true,
    fadeTimeout = 1000,
    transitionDuration = 1000,
    slideshowInterval = 10000,
    children,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (backgroundImgSrc.length <= 1) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);

            setTimeout(() => {
                setCurrentImageIndex((prev) => (prev + 1) % backgroundImgSrc.length);
                setTimeout(() => setIsTransitioning(false), 100);
            }, transitionDuration / 2);
        }, slideshowInterval);

        return () => clearInterval(interval);
    }, [backgroundImgSrc.length, slideshowInterval, transitionDuration]);


    const getBackgroundStyle = (imageUrl) => ({
        background: `${disableLinearGradient ? '' : `linear-gradient(135deg, ${gradientColors}),`} url("${imageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
    })

    return (
        <>
            {enableWave && (
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                        <clipPath id="waveClip" clipPathUnits="objectBoundingBox">
                            <path>
                                <animate
                                    attributeName="d"
                                    dur="8s"
                                    repeatCount="indefinite"
                                    values="
                                        M0 0 H1 V0.96 C0.9 1.0 0.8 0.92 0.65 0.96 C0.5 1.0 0.35 0.92 0.2 0.96 C0.1 0.99 0.05 0.97 0 0.98 Z;
                                        M0 0 H1 V0.97 C0.9 0.92 0.8 1.0 0.65 0.97 C0.5 0.92 0.35 1.0 0.2 0.97 C0.1 0.95 0.05 0.96 0 0.97 Z;
                                        M0 0 H1 V0.96 C0.9 1.0 0.8 0.92 0.65 0.96 C0.5 1.0 0.35 0.92 0.2 0.96 C0.1 0.99 0.05 0.97 0 0.98 Z
                                    "
                                />
                            </path>
                        </clipPath>
                    </defs>
                </svg>
            )}

            <Box
                id="back-to-top-anchor"
                sx={{
                    position: 'relative',
                    width: '100%',
                    minHeight: height,
                    background: `url("/field.png")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    display: 'flex',
                    flexDirection: 'column',
                    clipPath: enableWave ? 'url(#waveClip)' : 'none',
                    overflow: 'hidden',
                }}
            >
                {backgroundImgSrc.map((img, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            ...getBackgroundStyle(img),
                            opacity: index === currentImageIndex ? (isTransitioning ? 0 : 1) : 0,
                            transition: `opacity ${transitionDuration}ms ease-in-out`,
                            zIndex: index === currentImageIndex ? 1 : 0,
                        }}
                    />
                ))}

                {enableParticles && <FloatingParticles />}

                {enableRadialGradient && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background:
                                'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.15) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        }}
                    />
                )}

                <Toolbar />

                <Container
                    maxWidth="lg"
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 2,
                        py: { xs: 4, md: 6 },
                    }}
                >
                    <Fade in={isVisible} timeout={fadeTimeout}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: { xs: 2, md: 3 },
                                width: '100%',
                            }}
                        >
                            {children}
                        </Box>
                    </Fade>
                </Container>
            </Box>
        </>
    );
};