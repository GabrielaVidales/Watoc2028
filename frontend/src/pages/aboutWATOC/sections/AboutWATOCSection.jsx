import { Box, Container, Grid, Stack, Typography, Avatar, List, ListItem, ListItemIcon } from '@mui/material'
import { Microscope } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router';


export default function AboutWATOCSection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                px: { xs: 2, md: 4 },
            }}
        >
            <Container maxWidth={'md'}>
                <Box textAlign="center" mb={6}>
                    <Container maxWidth='sm'>
                        <Typography
                            variant="overline"
                            color="primary"
                            fontWeight="bold"
                            sx={{ fontSize: '1rem', letterSpacing: 2, lineHeight: 0 }}
                        >
                            About
                        </Typography>
                    </Container>
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                            mt: 1,
                            mb: 2,
                            fontSize: { xs: '2rem', md: '2.5rem', },
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

                <Stack spacing={4} textAlign="left" alignItems="center">
                    <p className='mb-6 leading-6 text-justify text-sm md:text-lg md:leading-7'>
                        The World Association of Theoretical and Computational Chemists (<Link to='https://www.watoc.net/index.html' className='text-primary-light'>WATOC</Link>) is an international scientific organization dedicated to the promotion and advancement of theoretical and computational chemistry worldwide.
                    </p>
                    <p className='mb-6 leading-6 text-justify text-sm md:text-lg md:leading-7'>
                        WATOC fosters global collaboration, scientific exchange, and the development of theoretical methods and computational tools that support research across all areas of chemistry.
                    </p>
                    <p className='mb-6 leading-6 text-justify text-sm md:text-lg md:leading-7'>
                        One of WATOC's central activities is the organization of Triennial WATOC Congresses, which rank among the largest international meetings in the field of theoretical and computational chemistry. The congress in Mérida is the 14th in the WATOC series.
                        Although originally founded with a focus on theoretical organic chemistry, WATOC has continuously expanded its scope and now represents all areas of chemistry where theory and computation play a fundamental role.
                    </p>
                </Stack>
            </Container>
        </Box>
    )
}