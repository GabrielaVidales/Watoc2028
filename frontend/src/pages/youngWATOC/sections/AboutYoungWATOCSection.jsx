import { Box, Container, Stack, Typography } from '@mui/material'
import React from 'react'

export default function AboutYoungWATOCSection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                px: { xs: 2, sm: 3, md: 4 },
                bgcolor: 'white',
                borderBottom: '1px solid',
                borderColor: 'divider',
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
                        About
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
                        Young WATOC 2028
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
                            Young WATOC will take place on January 8th, 2028, as a special pre-conference event held prior to the WATOC 2028 Congress.
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                opacity: 0.95,
                                lineHeight: 1.7,
                            }}
                        >
                            Young WATOC is a one-day event dedicated to early-career researchers, providing selected young scientists the opportunity to present their work and engage with an international community of peers and senior researchers. The event is designed to highlight emerging research and foster scientific exchange in a focused and supportive environment.
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                opacity: 0.95,
                                lineHeight: 1.7,
                            }}
                        >
                            Further details regarding eligibility, abstract submission, and participation will be announced closer to the congress.
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                opacity: 0.6,
                                textAlign: 'center',
                                lineHeight: 1.7,
                            }}
                        >
                            Please note that registration and abstract submission for Young WATOC 2028 are not yet open.
                        </Typography>
                    </Stack>
                </Container>
            </Container>
        </Box>
    )
}
