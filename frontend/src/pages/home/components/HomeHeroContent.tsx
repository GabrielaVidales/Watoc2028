import { Typography, Stack, Chip, Box } from '@mui/material';
import { CalendarDays, MapPin, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const QuickCountdown = () => {
    const [days, setDays] = useState(0);

    useEffect(() => {
        const target = new Date('January 9, 2028 00:00:00').getTime();
        const updateDays = () => {
            const now = Date.now();
            const diff = target - now;
            setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
        };
        updateDays();
        const interval = setInterval(updateDays, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Chip
            icon={<CalendarDays size={16} color='white' />}
            label={`${days} days until WATOC 2028`}
            sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
                fontSize: { xs: '0.85rem', md: '1rem' },
                px: 1,
                border: '1px solid rgba(255,255,255,0.2)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 0.9 },
                    '50%': { transform: 'scale(1.03)', opacity: 1 },
                },
            }}
        />
    );
};

export const HomeHeroContent = () => {
    return (
        <div className='flex flex-col gap-4 text-center'>
            <div>
                <Chip
                    icon={<CalendarDays size={16} color='white' />}
                    label={`WATOC 2028: January 9-14, Mérida, México`}
                    sx={{
                        bgcolor: 'primary.main',
                        width: 'fit-content',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: { xs: '0.85rem', md: '1rem' },
                        px: 1,
                        border: '1px solid rgba(255,255,255,0.2)',
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%, 100%': { transform: 'scale(1)', opacity: 0.9 },
                            '50%': { transform: 'scale(1.03)', opacity: 1 },
                        },
                    }}
                />
            </div>
            <h1 className='max-w-2xl text-gray-200 text-4xl md:text-[72pt] text-shadow-2xl tracking-wide font-bold'>
                <span className='text-indigo-200'>WATOC</span> 2028
            </h1>
            <h2 className='max-w-2xl text-gray-200 text-xl md:text-2xl text-shadow-2xl tracking-wide font-semibold'>
                14th Triennial Congress of the World Association of Theoretical and Computational Chemists
            </h2>
            <h2 className='max-w-2xl text-gray-200 text-xl md:text-2xl text-shadow-xl tracking-wide font-medium'>
                Preceded by Young WATOC on January 8th
            </h2>
        </div>
    );
};