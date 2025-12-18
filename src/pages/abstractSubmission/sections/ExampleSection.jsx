import React from 'react'
import { GenericHeroContent } from '../../../components/GenericHeroContent'
import GenericCTASection from '../../../components/GenericCTASection'
import { Box, Paper, Stack, Typography } from '@mui/material'

export default function ExampleSection() {
    return (
        <>
            <GenericCTASection textAlign='left'>
                <Paper sx={{
                    borderRadius: 5,
                    p: 4,
                }}>
                    <Box textAlign="center" mb={6}>
                        <Typography
                            variant="overline"
                            color="primary"
                            fontWeight="bold"
                            sx={{ fontSize: '1rem', letterSpacing: 2 }}
                        >
                            Example
                        </Typography>
                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            sx={{
                                mt: 1,
                                mb: 2,
                                fontSize: { xs: '1.4rem', md: '2rem' },
                            }}
                        >
                            Abstract Submission Example
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

                    <Stack spacing={2}>
                        <Stack spacing={1}>
                            <Typography fontWeight={600}>
                                Example Title
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Physical and computational aspects of the geometric phase
                            </Typography>
                        </Stack>

                        <Stack spacing={1}>
                            <Typography fontWeight={600}>
                                Example Abstract
                            </Typography>

                            <Typography variant="body2">
                                A geometric phase appears when the joint nuclear–electron wave function is
                                factorized into an electronic and a nuclear part, with the former depending
                                parametrically on the nuclear positions (1). The non-uniqueness of this
                                factorization—a geometry-dependent phase factor can be included in the
                                nuclear wave function as long as the opposite phase factor is included in
                                the electronic wave function—gives rise to contributions that are important
                                to track, for example, when the nuclei are treated as classical particles,
                                effectively eliminating the nuclear wave function from explicit
                                consideration.
                            </Typography>

                            <Typography variant="body2">
                                Although partly a gauge effect, the geometric phase has physical
                                consequences near conical intersections (2,3) and for velocity-dependent
                                forces on nuclei in the presence of magnetic fields. In this work, we review
                                theoretical and computational aspects of the geometric phase.
                            </Typography>
                        </Stack>

                        <Stack spacing={0.5}>
                            <Typography fontWeight={600}>
                                References
                            </Typography>

                            <Typography variant="body2">
                                1. Berry, M. V. Proc. Royal Soc. A. 1984, 392, 45.
                            </Typography>
                            <Typography variant="body2">
                                2. Longuet-Higgins, H. C., et al. Proc. Royal Soc. A. 1958, 244, 1.
                            </Typography>
                            <Typography variant="body2">
                                3. Herzberg, G.; Longuet-Higgins, H. C. Discussions Faraday Soc. 1963, 35, 77.
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
            </GenericCTASection>
        </>
    )
}
