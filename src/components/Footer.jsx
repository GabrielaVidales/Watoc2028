import { Box, Container, Grid, Stack, Typography, IconButton, Divider, Link as MUILink } from '@mui/material';
import { Email, Phone, LocationOn, Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import { Link } from 'react-router';

export default function Footer() {
    const navigation = {
        congress: [
            { label: 'About WATOC', href: '/about' },
            { label: 'Program', href: '/program' },
            { label: 'Speakers', href: '/speakers' },
            { label: 'Registration', href: '/registration' },
        ],
        venue: [
            { label: 'Venue Information', href: '/venue' },
            { label: 'Accommodations', href: '/hotels' },
            { label: 'Transportation', href: '/transportation' },
            { label: 'Mérida City Guide', href: '/guide' },
        ],
        participants: [
            { label: 'Abstract Submission', href: '/abstract' },
            { label: 'Important Dates', href: '/dates' },
            { label: 'Travel Grants', href: '/grants' },
            { label: 'FAQ', href: '/faq' },
        ],
    };

    const organizers = [
        { name: 'Dr. José Gabriel Merino Hernández', institution: 'Cinvestav Mérida' },
        { name: 'Dr. Annia Galano Jiménez', institution: 'UAM Iztapalapa' },
    ];

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#1a1a2e',
                color: 'white',
                pt: 6,
                pb: 3,
                background: `url(/field.png)`,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2}>
                            <Typography variant="h5" fontWeight="bold" color="primary.light">
                                WATOC 2028
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
                                14th Triennial Congress of the World Association of Theoretical
                                and Computational Chemists
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                January 9-14, 2028<br />
                                Mérida, Yucatán, México
                            </Typography>

                            <Stack direction="row" spacing={1} sx={{ pt: 2 }}>
                                {[
                                    { icon: <Facebook />, href: '#' },
                                    { icon: <Twitter />, href: '#' },
                                    { icon: <LinkedIn />, href: '#' },
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
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2} color="primary.light">
                            Congress
                        </Typography>
                        <Stack spacing={1}>
                            {navigation.congress.map((item, index) => (
                                <MUILink
                                    key={index}
                                    href={item.href}
                                    underline="none"
                                    sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            color: 'primary.light',
                                            pl: 1,
                                        },
                                    }}
                                >
                                    {item.label}
                                </MUILink>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2} color="primary.light">
                            Venue & City
                        </Typography>
                        <Stack spacing={1}>
                            {navigation.venue.map((item, index) => (
                                <MUILink
                                    key={index}
                                    href={item.href}
                                    underline="none"
                                    sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            color: 'primary.light',
                                            pl: 1,
                                        },
                                    }}
                                >
                                    {item.label}
                                </MUILink>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2} color="primary.light">
                            Participants
                        </Typography>
                        <Stack spacing={1}>
                            {navigation.participants.map((item, index) => (
                                <MUILink
                                    key={index}
                                    href={item.href}
                                    underline="none"
                                    sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            color: 'primary.light',
                                            pl: 1,
                                        },
                                    }}
                                >
                                    {item.label}
                                </MUILink>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2} color="primary.light">
                            Contact
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email sx={{ fontSize: 18, opacity: 0.7 }} />
                                <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.8 }}>
                                    info@watoc2028.org
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone sx={{ fontSize: 18, opacity: 0.7 }} />
                                <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.8 }}>
                                    +52 999 xxx xxxx
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <LocationOn sx={{ fontSize: 18, opacity: 0.7, mt: 0.3 }} />
                                <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.8 }}>
                                    Centro Internacional de Congresos<br />
                                    Mérida, Yucatán
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Box mb={4}>
                    <Typography variant="subtitle2" fontWeight="bold" mb={2} color="primary.light">
                        Organizing Committee Chairs
                    </Typography>
                    <Grid container spacing={2}>
                        {organizers.map((organizer, index) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        borderRadius: 2,
                                        borderLeft: '3px solid',
                                        borderColor: 'primary.main',
                                    }}
                                >
                                    <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
                                        {organizer.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                        {organizer.institution}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    sx={{ opacity: 0.7 }}
                >
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
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
}