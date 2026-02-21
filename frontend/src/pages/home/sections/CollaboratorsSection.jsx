import { Box, Container, Stack, Typography, Paper } from '@mui/material';
import { UsersRound } from 'lucide-react';
import { Link } from 'react-router';
import watocLogo from '../../../assets/watocLogo.png'
import cinvestavLogo from '../../../assets/cinvestavlogo.png'
import uamLogo from '../../../assets/uam.png'
import theochem from '@/assets/theochemmid.jpg'
import { div } from 'motion/react-client';

const collaborators = [
    {
        name: 'WATOC',
        src: watocLogo,
        url: 'https://www.watoc.net/',
        title: 'Host Organization'
    },
    {
        name: 'Cinvestav',
        src: cinvestavLogo,
        url: 'https://www.cinvestav.mx/',
        title: 'Host Research Centre'
    },
    {
        name: 'TheoChemMerida',
        src: theochem,
        url: 'https://www.theochemmerida.org/',
        title: 'Host Group'
    },
];

export default function CollaboratorsSection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                px: { xs: 2, sm: 3 },
                borderTop: '1px solid',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Container maxWidth="md">
                <Stack alignItems="center" spacing={2} mb={6} textAlign="center">
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                        }}
                    >
                        <UsersRound size={32} color="white" />
                    </Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}
                    >
                        Organized In Collaboration With
                    </Typography>
                </Stack>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    {collaborators.map((c, index) => (
                        <Link to={c.url} key={index}>
                            <div className='flex flex-col gap-2'>
                                <span className='text-center text-xl font-semibold'>{c.title}</span>
                                <div className='w-auto h-30 border-2 border-gray-300 px-4 py-2 flex justify-center rounded-2xl
                                    transition-all duration-200 cursor-pointer
                                    hover:scale-105 hover:border-indigo-600 hover:shadow-xl'
                                >

                                    <img src={c.src} alt={c.name} className='h-full object-contain' />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </Box>
    );
}