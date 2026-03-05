import NavBar from '../../components/NavBar'
import { Box, Container, Grid, Typography, Divider, Button, Paper } from '@mui/material'
import Footer from '../../components/Footer'
import { GenericHeroContent } from '../../components/GenericHeroContent'
import VisaMainSection from './sections/VisaMainSection'
import VisaInvitationSection from './sections/VisaInvitationSection'
import { HeroSection } from '../../components/HeroSection'
import { ExternalLink, Info } from 'lucide-react'

export default function VisaRequirements() {
    return (
        <>
            <HeroSection
                enableParticles={true}
                enableRadialGradient={true}
                height='70dvh'
            >
                <GenericHeroContent />
            </HeroSection>
            <VisaContent />
            {/* <VisaMainSection /> */}
            {/* <VisaInvitationSection /> */}
        </>
    )
}

export function VisaContent() {
    return (
        <Box component="section" sx={{ pb: { xs: 8, md: 8 }, bgcolor: '#fdfdfd' }}>
            <Box textAlign="center" mb={6}>
                <Typography
                    variant="overline"
                    color="primary"
                    fontWeight="bold"
                    sx={{ fontSize: '1rem', letterSpacing: 2 }}
                >
                    VISA
                </Typography>
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                        mt: 1,
                        mb: 2,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                >
                    Visa Requirements
                </Typography>
                <Box
                    sx={{
                        width: 100,
                        height: 4,
                        bgcolor: 'primary.main',
                        mx: 'auto',
                        borderRadius: 2,
                    }}
                />
            </Box>

            <Container maxWidth="md">
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 7 }} sx={{ mb:2 }}>
                        <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', color: 'text.secondary' }}>
                            Participants from countries outside Mexico may require a visa to enter the country for <b>WATOC 2028</b>.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Typography variant='body1' sx={{ lineHeight: 1.8, }} >
                                Please consult the <b>Mexican Ministry of Foreign Affairs</b> (<b>Secretaría de Relaciones Exteriores – SRE</b>) to verify whether you need a visa to enter Mexico, based on your nationality.
                            </Typography>

                            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                Many participants may enter Mexico without a visa for short stays (tourism, academic events, or conferences). If a visa is required, we recommend applying for a <b>Visitor Visa</b> (<i>Visa de Visitante sin permiso para realizar actividades remuneradas</i>) and indicating that the purpose of travel is attendance at an international academic congress.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }} sx={{ height: 'fit-content' }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                borderRadius: 4,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            <div className='inline-flex items-center gap-2 mb-4'>
                                <Info className='size-6 stroke-3' />
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    Invitation Letters
                                </Typography>
                            </div>
                            <Typography sx={{ mb: 3, opacity: 0.9 }}>
                                Need an official letter for your visa application? You can request one directly during the <b>registration process</b>.
                            </Typography>
                            <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.8 }}>
                                Note: Letters can only be issued once registration is fully completed.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Divider />

                <Box textAlign={'center'}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Official Consultations
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Please verify requirements based on your nationality via the Mexican Ministry of Foreign Affairs (SRE).
                    </Typography>
                    <Button
                        variant="outlined"
                        href="https://embamex.sre.gob.mx/finlandia/index.php/traveling/visas"
                        target="_blank"
                        endIcon={<ExternalLink />}
                    >
                        Check Official SRE Website
                    </Button>
                </Box>
            </Container>
        </Box>
    )
}