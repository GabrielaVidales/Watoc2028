import { Box, Card, CardContent, Container, Grid, Icon, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'

export default function VisaInvitationSection() {
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
                        VISA INFORMATION
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
                        Invitation Letters
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
                            If you require an <b>official invitation letter</b> for visa application purposes, please indicate this during the registration process.
                        </Typography>
                        {/* <Typography
                            sx={{
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                opacity: 0.95,
                                lineHeight: 1.7,
                            }}
                            >
                            For visa-related assistance, please contact:
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                opacity: 0.95,
                                lineHeight: 1.7,
                            }}
                            >
                            watoc@conference-organizer.mx
                        </Typography> */}
                    </Stack>
                </Container>
            </Container>
        </Box>
    )
}


