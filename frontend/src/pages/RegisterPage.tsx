import { Box, Container, Stack, Typography, Toolbar } from '@mui/material';
import Lottie from 'lottie-react';
import comingSoonAnimation from '../assets/under-maintenance.json';
import RegisterForm from '@/forms/RegisterForm';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ClipboardSignature, SquareUserRound } from 'lucide-react';
import handwriting from '@/assets/handwritting.png'
import { useHeader } from '@/contexts/HeaderContext';
import { useEffect } from 'react';

export default function RegisterPage() {
    const { setTitle } = useHeader()

    useEffect(() => {
        setTitle('Create your Profile for WATOC 2028')
    }, [setTitle])

    return (
        <>
            {import.meta.env.DEV && (
                <section className='md:p-9 bg-fixed space-y-5'>
                    <Card className='max-w-xl md:max-w-2xl: lg:max-w-4xl xl:max-w-6xl mx-auto shadow-xl border overflow-hidden gap-0 p-0'>
                        <CardContent className='p-0'>
                            <div className='flex flex-col lg:flex-row items-stretch'>
                                <section className='flex-1 p-6 sm:p-12 bg-white'>
                                    <div className='max-w-md mx-auto space-y-6'>
                                        <div className='max-w-sm mx-auto space-y-2 text-center flex flex-col items-center justify-center'>
                                            <div className="size-15 flex justify-center items-center rounded-full bg-primary-main">
                                                <SquareUserRound className='size-10 text-primary-contrast' />
                                            </div>
                                            <h2 className='text-2xl font-semibold'>Welcome back</h2>
                                            <div className='h-1 w-12 mx-auto bg-primary-main rounded-full' />
                                            <p className='text-muted-foreground pt-2'>
                                                Login with your credentials to complete your registration or submit an abstract for WATOC 2028.
                                            </p>
                                        </div>
                                        <RegisterForm />
                                    </div>
                                </section>

                                <div className='w-full h-px lg:w-px lg:h-auto bg-slate-200 shrink-0' />

                                <section className='flex-1 p-12 bg-indigo-50/50'>
                                    <div className='max-w-sm mx-auto h-full flex flex-col justify-between space-y-8'>
                                        <div className='space-y-6'>
                                            <div className='space-y-2 text-center flex flex-col items-center justify-center'>
                                                <div className="size-15 flex justify-center items-center rounded-full bg-primary-main">
                                                    <ClipboardSignature className='size-10 text-primary-contrast' />
                                                </div>
                                                <h2 className='text-xl text-center font-semibold mb-5 text-primary-main'>
                                                    Create an account in order to register for WATOC and/or submit an abstract for oral/poster presentation:

                                                </h2>
                                                <div className='h-1 w-12 mx-auto bg-primary-main rounded-full' />

                                                <p className='text-muted-foreground pt-2'>
                                                    Register to attend the congress and manage your participation in WATOC 2028.
                                                </p>
                                            </div>

                                            <img src={handwriting} alt="" className='rounded-full object-cover aspect-square shadow-lg border-2 border-input' />

                                            <ul className='space-y-4'>
                                                <li className='flex items-start gap-3 text-slate-700'>
                                                    <CheckCircle2 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                                                    <span className='text-sm font-medium'>Official registration and technical sessions</span>
                                                </li>
                                                <li className='flex items-start gap-3 text-slate-700'>
                                                    <CheckCircle2 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                                                    <span className='text-sm font-medium'>Abstract submission for oral presentations and posters</span>
                                                </li>
                                                <li className='flex items-start gap-3 text-slate-700'>
                                                    <CheckCircle2 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                                                    <span className='text-sm font-medium'>Certificates of attendance and participation</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}

            {import.meta.env.PROD && (
                <Container maxWidth="md" sx={{ position: 'relative', py: 6 }}>
                    <Toolbar />
                    <Stack spacing={4} alignItems="center" textAlign="center" sx={{ position: 'relative', py: 3, zIndex: 1 }}>
                        <Box>
                            <Typography
                                variant="h2"
                                sx={{
                                    color: 'white',
                                    fontWeight: 800,
                                    fontSize: { xs: '2rem', md: '3rem' },
                                    mb: 2,
                                    lineHeight: 1.2,
                                }}
                            >
                                Registration is coming soon.
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'rgba(255,255,255,0.7)',
                                    fontWeight: 300,
                                    mb: 1,
                                }}
                            >
                                World Association of Theoretical and Computational Chemists
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'rgba(255,255,255,0.6)',
                                    lineHeight: 1.7,
                                }}
                            >
                                January 9-14, 2028 • Mérida, México
                            </Typography>
                        </Box>

                        <Box sx={{ width: { xs: '50%', sm: '50%', md: '100%' }, maxWidth: 320, mt: 2 }}>
                            <Lottie
                                animationData={comingSoonAnimation}
                                loop
                            />
                        </Box>

                        <Box sx={{ display: { xs: 'block', md: 'block' } }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                Stay tuned — registration will be available shortly.
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            )}
        </>
    );
}