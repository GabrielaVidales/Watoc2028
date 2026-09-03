import { AnimatePresence, motion } from 'motion/react';
import { memo, useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react';

import meridaWebp from '@/assets/merida.webp';
import meridaJpg from '@/assets/merida.jpg';
import hotel from '@/assets/hotel.webp';
import congresoEntrada from '@/assets/congresoEntrada.webp';
import mayaBackground from '@/assets/chichen itza night.png';


const DEFAULT_BACKGROUNDS: readonly string[] = [
    meridaWebp,
    meridaJpg,
    congresoEntrada,
    hotel,
    mayaBackground,
];

const DEFAULT_GRADIENT_COLORS = 'rgba(13, 27, 42, 0.5) 0%, rgba(27, 38, 59, 0.25) 50%, rgba(13, 27, 42, 0.5) 100%';

const RADIAL_OVERLAY = 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.15) 0%, transparent 70%)';

const WAVE_PATH_VALUES = `
    M0 0 H1 V0.95 C0.80 1.00 0.65 0.90 0.50 0.95 C0.35 1.00 0.20 0.90 0 0.95 Z;
    M0 0 H1 V0.95 C0.80 0.90 0.65 1.00 0.50 0.95 C0.35 0.90 0.20 1.00 0 0.95 Z;
    M0 0 H1 V0.95 C0.80 1.00 0.65 0.90 0.50 0.95 C0.35 1.00 0.20 0.90 0 0.95 Z
`;

const SLIDE_TRANSITION = { delay: 3, duration: 1 } as const;
const CONTENT_TRANSITION = { duration: 1, delay: 0.5 } as const;

const PARTICLE_ANIMATION_NAME = 'heroParticleFloat';
const PARTICLE_COUNT = 20;
const PARTICLE_COLOR = 'rgba(255,255,255,0.3)';

const WaveClipPath = memo(({ id }: { id: string }) => (
    <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
            <clipPath id={id} clipPathUnits="objectBoundingBox">
                <path>
                    <animate
                        attributeName="d"
                        dur="8s"
                        repeatCount="indefinite"
                        values={WAVE_PATH_VALUES}
                    />
                </path>
            </clipPath>
        </defs>
    </svg>
));

WaveClipPath.displayName = 'WaveClipPath';

const PARTICLE_KEYFRAMES = `
@keyframes ${PARTICLE_ANIMATION_NAME} {
    0%, 100% {
        transform: translate3d(0, 0, 0);
        opacity: 0.3;
    }
    50% {
        transform: translate3d(var(--particle-x), var(--particle-y), 0);
        opacity: 0.8;
    }
}
`;

interface Particle {
    id: number;
    left: number;
    top: number;
    duration: number;
    delay: number;
    offsetX: number;
    offsetY: number;
}

const createParticles = (count: number): Particle[] =>
    Array.from({ length: count }, (_, id) => ({
        id,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 5 + Math.random() * 10,
        delay: Math.random() * 5,
        offsetX: Math.random() * 40 - 20,
        offsetY: -50 - Math.random() * 50,
    }));

interface FloatingParticlesProps {
    count?: number;
    color?: string;
}

const FloatingParticles = memo(
    ({ count = PARTICLE_COUNT, color = PARTICLE_COLOR }: FloatingParticlesProps) => {
        const particles = useMemo(() => createParticles(count), [count]);

        return (
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <style>{PARTICLE_KEYFRAMES}</style>

                {particles.map(({ id, left, top, duration, delay, offsetX, offsetY }) => (
                    <span
                        key={id}
                        className="absolute block h-0.75 w-0.75 rounded-full will-change-[transform,opacity] min-[900px]:h-1 min-[900px]:w-1"
                        style={
                            {
                                left: `${left}%`,
                                top: `${top}%`,
                                backgroundColor: color,
                                animation: `${PARTICLE_ANIMATION_NAME} ${duration}s ease-in-out ${delay}s infinite`,
                                '--particle-x': `${offsetX}px`,
                                '--particle-y': `${offsetY}px`,
                            } as CSSProperties
                        }
                    />
                ))}
            </div>
        );
    },
);

FloatingParticles.displayName = 'FloatingParticles';


interface BackgroundSlideshowProps {
    images: readonly string[];
    index: number;
    gradient: string | null;
}

const BackgroundSlideshow = memo(({ images, index, gradient }: BackgroundSlideshowProps) => (
    <AnimatePresence mode="sync">
        <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={SLIDE_TRANSITION}
            className="absolute inset-0 bg-position-[50%_50%] bg-cover bg-fixed"
            style={{
                zIndex: -1,
                backgroundImage: `${gradient ? `${gradient}, ` : ''}url("${images[index]}")`,
            }}
        />
    </AnimatePresence>
));

BackgroundSlideshow.displayName = 'BackgroundSlideshow';

const useImageRotation = (length: number, delay: number, offset = 0) => {
    const [index, setIndex] = useState(() => (length > 0 ? offset % length : 0));

    useEffect(() => {
        if (length <= 1) return;

        const timeoutId = setTimeout(() => {
            setIndex(prev => (prev + 1) % length);
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [index, length, delay]);

    return index;
};

export interface HeroSectionProps {
    backgroundImgSrc?: readonly string[];
    height?: string;
    disableLinearGradient?: boolean;
    enableParticles?: boolean;
    enableRadialGradient?: boolean;
    gradientColors?: string;
    enableWave?: boolean;
    timeBetweenImages?: number;
    offset?: number;
    className?: string;
    children?: ReactNode;
}

export const HeroSection = ({
    backgroundImgSrc = DEFAULT_BACKGROUNDS,
    height = '85vh',
    disableLinearGradient = false,
    enableParticles = false,
    enableRadialGradient = true,
    gradientColors = DEFAULT_GRADIENT_COLORS,
    enableWave = true,
    timeBetweenImages = 5000,
    offset = 0,
    className = '',
    children,
}: HeroSectionProps) => {
    const waveClipId = `waveClip-${useId().replace(/:/g, '')}`;

    const currentImageIndex = useImageRotation(
        backgroundImgSrc.length,
        timeBetweenImages,
        offset,
    );

    const gradient = disableLinearGradient
        ? null
        : `linear-gradient(135deg, ${gradientColors})`;

    return (
        <>
            {enableWave && <WaveClipPath id={waveClipId} />}

            <div
                id="back-to-top-anchor"
                className={`relative flex w-full flex-col overflow-hidden bg-black bg-center bg-cover bg-fixed ${className}`}
                style={{
                    height,
                    clipPath: enableWave ? `url(#${waveClipId})` : 'none',
                }}
            >
                <BackgroundSlideshow
                    images={backgroundImgSrc}
                    index={currentImageIndex}
                    gradient={gradient}
                />

                {enableParticles && <FloatingParticles />}

                {enableRadialGradient && (
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{ background: RADIAL_OVERLAY }}
                    />
                )}

                <div className={`relative z-2 flex flex-1 flex-col items-center justify-center py-8 text-center min-[900px]:py-12 w-full mx-auto max-w-300 px-4 min-[600px]:px-6`}>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={CONTENT_TRANSITION}
                        className="flex w-full flex-col items-center gap-4 min-[900px]:gap-6"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </>
    );
};