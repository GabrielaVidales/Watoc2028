import { Box, Container, Grid, Stack, Typography, Avatar, CardContent, CardMedia, Card, List, ListItem, ListItemIcon } from '@mui/material'
import { FormatQuote, ScatterPlot } from '@mui/icons-material';
import React from 'react'
import { Link } from 'react-router';

const Text = ({ isReversed = false }) => (
    <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        sx={{
            flexDirection: { xs: 'column', md: isReversed ? 'row-reverse' : 'row' },
        }}
    >
        <Grid size={{ xs: 12, md: 10 }}>
            <Box sx={{ position: 'relative', pl: { xs: 2, md: 4 }, pr: { xs: 2, md: 3 } }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                    Welcome to WATOC 2028
                </Typography>

                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        fontSize: '1.05rem',
                        lineHeight: 1.8,
                        textAlign: 'justify',
                    }}
                >
                    WATOC aims to:
                </Typography>
                <List>
                    {[{ text: 'Promote excellence in theoretical and computational chemistry.', },
                    { text: 'Encourage interaction and collaboration among scientists worldwide.', },
                    { text: 'Support both method development and practical applications across all chemical disciplines.', },
                    ].map((item, index) =>
                        <ListItem key={index}>
                            <ListItemIcon>
                                <Avatar sx={{ color: 'white', backgroundColor: 'primary.main' }}>
                                    <ScatterPlot />
                                </Avatar>
                            </ListItemIcon>
                            {item.text}
                        </ListItem>
                    )}
                </List>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        fontSize: '1.05rem',
                        lineHeight: 1.8,
                        textAlign: 'justify',
                    }}
                >
                    One of WATOC’s central activities is the organization of Triennial WATOC Congresses, which rank among the largest international meetings in the field of theoretical and computational chemistry. The congress in Mérida is the 14th in the WATOC series.
                    Although originally founded with a focus on theoretical organic chemistry, WATOC has continuously expanded its scope and now represents all areas of chemistry where theory and computation play a fundamental role.
                </Typography>
                <Box
                    sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: '3px solid',
                        borderColor: 'primary.main',
                        opacity: 0.3,
                    }}
                />
            </Box>
        </Grid>

    </Grid>
)

export default function AboutWATOCSection() {
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
                        About WATOC
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
                        World Association of Theoretical and Computational Chemists
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

                <Container maxWidth='lg'>
                    <Stack spacing={4} textAlign="left" alignItems="center">
                        <Typography
                            sx={{
                                maxWidth: 1000,
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                opacity: 0.95,
                                lineHeight: 1.7,
                            }}
                        >
                            The World Association of Theoretical and Computational Chemists (<Link to='https://www.watoc.net/index.html'>WATOC</Link>) is an international scientific organization dedicated to the promotion and advancement of theoretical and computational chemistry worldwide.
                        </Typography>
                        <Typography
                            sx={{
                                maxWidth: 1000,
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                opacity: 0.95,
                                lineHeight: 1.7,
                            }}
                        >
                            WATOC fosters global collaboration, scientific exchange, and the development of theoretical methods and computational tools that support research across all areas of chemistry.
                        </Typography>
                        <Text></Text>
                    </Stack>
                </Container>
            </Container>
        </Box>
    )
}
