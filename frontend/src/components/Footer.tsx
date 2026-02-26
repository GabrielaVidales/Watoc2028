import { Box, Stack, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router';
import fieldPng from '../assets/field.png'
import { Facebook, Instagram, Linkedin, Mail, MapPin, X } from 'lucide-react';
import { urls } from '@/routes/routes';

const navigation = {
    congress: [
        { label: "What's WATOC?", href: '/watoc' },
        { label: 'Abstract Submission', href: '/abstract-submission' },
        { label: 'Visa Requirements', href: '/visa' },
        { label: 'Registration', href: '/register' },
    ],
    venue: [
        { label: 'Venue Information', href: '/venue' },
        { label: 'Hotel Booking', href: '/hotel-booking' },
        { label: 'Restaurants', href: '/restaurants' },
        { label: 'Transportation', href: '/transportation' },
        { label: 'Mérida City Guide', href: 'https://visitmerida.mx/' },
    ],
};

const webmasters = [
    { name: 'Brishel Acosta', },
    { name: 'Eduardo Bojórquez', },
    { name: 'Eduardo Escalante', },
    { name: 'Gabriela Vidales', },
]

export default function Footer() {
    return (
        <footer className='pt-12 pb-6 text-white bg-bottom relative bg-[#2a2a50] -z-10'>
            <div
                className="absolute inset-0 opacity-50 bg-cover bg-center bg-fixed pointer-events-none -z-10"
                style={{ backgroundImage: `url(${fieldPng})` }}
            />
            <div className='max-w-6xl justify-self-center px-6'>
                <div className="grid grid-cols-1 lg:grid-cols-12 md:grid-cols-12 gap-5 text-white mb-3">
                    <div className="lg:col-span-5 md:col-span-12 flex flex-col gap-3">
                        <Link to={urls.home.index}>
                            <Typography variant="h5" fontWeight="bold" color="primary.light">
                                WATOC 2028
                            </Typography>
                        </Link>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9, lineHeight: 1.25 }}>
                            14th Triennial Congress of the World Association of Theoretical
                            and Computational Chemists
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            January 9-14, 2028
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Mérida, Yucatán, México
                        </Typography>
                    </div>
                    <div className="lg:col-span-2 md:col-span-4 flex flex-col gap-1">
                        <Typography variant="subtitle1" fontWeight="bold" color="primary.light">
                            Congress
                        </Typography>
                        <Stack spacing={1} width={{ xs: '50%', md: '100%' }}>
                            {navigation.congress.map((item, index) => (
                                <Link key={index}
                                    to={item.href}
                                    target={item.href.startsWith('http') ? "_blank" : undefined}
                                    rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                                >
                                    <Typography sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            color: 'primary.light',
                                            pl: 1,
                                        },
                                    }}>
                                        {item.label}
                                    </Typography>
                                </Link>
                            ))}
                        </Stack>
                    </div>
                    <div className="lg:col-span-2 md:col-span-4 flex flex-col gap-1">
                        <Typography variant="subtitle1" fontWeight="bold" color="primary.light">
                            Venue & City
                        </Typography>
                        <Stack spacing={1} width={{ xs: '50%', md: '100%' }}>
                            {navigation.venue.map((item, index) => (
                                <Link key={index}
                                    to={item.href}
                                    target={item.href.startsWith('http') ? "_blank" : undefined}
                                    rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                                >
                                    <Typography sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            color: 'primary.light',
                                            pl: 1,
                                        },
                                    }}>
                                        {item.label}
                                    </Typography>
                                </Link>
                            ))}
                        </Stack>
                    </div>
                    <div className="lg:col-span-3 md:col-span-4 flex flex-col gap-1">
                        <Typography variant="subtitle1" fontWeight="bold" color="primary.light">
                            Contact
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Mail className='size-5 shrink-0' />
                                <a href="mailto:contact@watoc2028.org">
                                    <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.8 }}>
                                        contact@watoc2028.org

                                    </Typography>
                                </a>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <MapPin className='size-5 shrink-0' />
                                <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.8 }}>
                                    Centro de Investigación y de Estudios Avanzados<br />
                                    Instituto Politécnico Nacional<br />
                                    Mérida, Yucatán
                                </Typography>
                            </Box>
                        </Stack>
                    </div>
                    <div className="lg:col-span-12 md:col-span-12 flex flex-col gap-1">
                        <Typography variant="subtitle1" fontWeight="bold" color="primary.light">
                            Webmasters
                        </Typography>
                        <Stack spacing={{ xs: 1, sm: 3 }} width={{ xs: '50%', sm: '100%' }} direction={{ xs: 'column', sm: 'row' }}>
                            {webmasters.map((item, index) => (
                                <Link key={index} to={(item as any).href}>
                                    <Typography sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '0.875rem',
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s',
                                    }}>
                                        {item.name}
                                    </Typography>
                                </Link>
                            ))}
                        </Stack>
                    </div>
                </div>
                <div className='flex flex-col md:flex-row items-center justify-between gap-3'>
                    <Stack direction="row" spacing={1} sx={{ pt: 2 }}>
                        {[
                            { icon: <Facebook />, href: '#' },
                            { icon: <X />, href: '#' },
                            { icon: <Linkedin />, href: '#' },
                            { icon: <Instagram />, href: '#' },
                        ].map((social, index) => (
                            <IconButton
                                key={index}
                                size="small"
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '&:hover': {
                                        bgcolor: 'primary.main',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s',
                                }}
                            >
                                {social.icon}
                            </IconButton>
                        ))}
                    </Stack>

                    <Typography variant="caption">
                        © 2025 WATOC 2028. All rights reserved.
                    </Typography>

                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Powered by
                        <Link to='https://www.cinvestav.mx/'>
                            <Box component="span" sx={{ color: 'primary.light', fontWeight: 600 }}>
                                Cinvestav
                            </Box>
                        </Link>
                        ©
                    </Typography>
                </div>
            </div>
        </footer>

    );
}