import { Box, Container, Stack, Typography } from '@mui/material'
import React from 'react'

export default function TitleSection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 3, md: 4 },
                px: { xs: 2, sm: 3, md: 4 },
                background: 'white',
            }}
        >
            <Container maxWidth="lg">
                <Box textAlign="center" mb={6} >
                    <Typography
                        variant="overline"
                        color="primary"
                        fontWeight="bold"
                        sx={{ fontSize: '1rem', letterSpacing: 2 }}
                    >
                        questions & inquiries
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
                        Contact
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

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack spacing={4} textAlign="center" alignItems="center">

                        <Typography
                            sx={{
                                maxWidth: 1000,
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                opacity: 0.95,
                                lineHeight: 1.5,
                            }}
                        >
                            For general inquiries regarding WATOC and its activities, including membership,
                            congress information, awards, or organizational matters, please use the contact details provided below.
                        </Typography>
                    </Stack>
                </Container>
            </Container>
        </Box>
    )
}
