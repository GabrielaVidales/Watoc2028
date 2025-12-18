import { Box, Card, CardContent, Container, Grid, Icon, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'

export default function VisaMainSection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                px: { xs: 2, sm: 3, md: 4 },
                background: 'white',
            }}
        >
            <Container maxWidth="lg">
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

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }} >
                    <Stack spacing={4} textAlign="left" justifyContent='center' alignItems="center">
                        <Typography
                            sx={{
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                opacity: 0.95,
                                lineHeight: 1.7,
                            }}
                        >
                            Participants from countries outside Mexico may require a visa to enter Mexico to attend WATOC 2028.
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                opacity: 0.95,
                                lineHeight: 1.7,
                            }}
                        >
                            Please consult the <b>Mexican Ministry of Foreign Affairs</b> (<b>Secretaría de Relaciones Exteriores – SRE</b>) to verify whether you need a visa to enter Mexico, based on your nationality.
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                opacity: 0.95,
                                lineHeight: 1.7,
                            }}
                        >
                            Many participants may enter Mexico without a visa for short stays (tourism, academic events, or conferences). If a visa is required, we recommend applying for a <b>Visitor Visa</b> (<i>Visa de Visitante sin permiso para realizar actividades remuneradas</i>) and indicating that the purpose of travel is attendance at an international academic congress.
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                opacity: 0.95,
                                lineHeight: 1.7,
                            }}
                        >
                            Invitation letters for visa purposes can only be issued to participants who have completed the registration process.
                        </Typography>
                        <Link to={'https://embamex.sre.gob.mx/finlandia/index.php/traveling/visas'} target="_blank"  rel="noreferrer noopener">
                            <Typography
                                sx={{
                                    fontSize: { xs: '1rem', md: '1.15rem' },
                                    opacity: 0.95,
                                    lineHeight: 1.7,
                                }}
                            >
                                Further information regarding visa requirements can be found on the official SRE website.
                            </Typography>
                        </Link>
                    </Stack>
                </Container>
            </Container>
        </Box>
    )
}


