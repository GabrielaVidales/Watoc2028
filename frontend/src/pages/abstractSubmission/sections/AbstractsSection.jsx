import { Box, Stack, Typography, Divider, List, Container, Paper } from '@mui/material'

export default function AbstractsSection() {
    return (
        <>
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
                            Communications & Posters
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
                            Abstract Submission
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

                    <Paper
                        elevation={5}
                        sx={{
                            maxWidth: 760,
                            mx: 'auto',
                            mt: 4,
                            mb: 6,
                            px: 3,
                            py: 2,
                            borderLeft: '4px solid',
                            borderColor: 'primary.main',
                            backgroundColor: 'rgba(25, 118, 210, 0.04)',
                            borderRadius: 1,
                            transition: '0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-10px)'
                            }
                        }}
                    >
                        <Typography fontWeight={600} gutterBottom>
                            Important Notice on Abstract Submission
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                            Abstract submission for WATOC 2028 is available only to registered participants.
                            After logging in, participants may access the abstract submission portal.
                        </Typography>
                    </Paper>


                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                        <Stack spacing={4} textAlign="justify" alignItems="center">
                            <Typography
                                sx={{
                                    maxWidth: 760,
                                    fontSize: { xs: '1rem', md: '1.15rem' },
                                    opacity: 0.95,
                                    lineHeight: 1.7,
                                }}
                            >
                                Due to the expected high number of submitted abstracts, the review
                                process will be conducted in phases. Participants selected for oral
                                communications will be notified by email once the evaluation process
                                has concluded.
                            </Typography>
                        </Stack>
                    </Container>

                    <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: 8, justifyContent: 'center', display: 'flex' }}>
                        <Stack spacing={4} textAlign="justify">
                            <Stack spacing={2}>
                                <Typography variant="h6" fontWeight={600} >
                                    Call for Abstracts
                                </Typography>

                                <Typography sx={{
                                    maxWidth: 760,
                                    fontSize: { xs: '1rem', md: '1.15rem' },
                                    opacity: 0.95,
                                    lineHeight: 1.7,
                                }}>
                                    Researchers from all areas of theoretical and computational chemistry
                                    are invited to submit abstracts for oral communications and poster
                                    presentations at WATOC 2028.
                                </Typography>

                                <Typography sx={{
                                    maxWidth: 760,
                                    fontSize: { xs: '1rem', md: '1.15rem' },
                                    opacity: 0.95,
                                    lineHeight: 1.7,
                                }}>
                                    This is a unique opportunity to present your latest research to a
                                    global audience and to engage with experts and peers in the field.
                                </Typography>

                                <Typography sx={{
                                    maxWidth: 760,
                                    fontSize: { xs: '1rem', md: '1.15rem' },
                                    opacity: 0.95,
                                    lineHeight: 1.7,
                                }}>
                                    A total of <strong>150 oral communication slots</strong> are
                                    available. Submissions will be evaluated by members of the Local
                                    Scientific Committee and the International Advisory Board.
                                </Typography>
                            </Stack>

                            <Stack spacing={2}>
                                <Typography variant="h6" fontWeight={600}>
                                    Abstract Submission Process
                                </Typography>

                                <Typography sx={{
                                    maxWidth: 760,
                                    fontSize: { xs: '1rem', md: '1.15rem' },
                                    opacity: 0.95,
                                    lineHeight: 1.7,
                                }}>
                                    Prior registration for WATOC 2028 is required to submit an abstract.
                                    Upon registration, participants will receive a personal link to the
                                    abstract submission portal.
                                </Typography>

                                <Typography sx={{
                                    maxWidth: 760,
                                    fontSize: { xs: '1rem', md: '1.15rem' },
                                    opacity: 0.95,
                                    lineHeight: 1.7,
                                }}>
                                    Each participant may submit <strong>one abstract only</strong>.
                                </Typography>
                            </Stack>

                            <Stack spacing={2}>
                                <Typography variant="h6" fontWeight={600}>
                                    Abstract Submission Guidelines
                                </Typography>

                                <Typography
                                    sx={{
                                        maxWidth: 760,
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        opacity: 0.95,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    Abstracts must be written in plain text format. Figures, tables, and
                                    images will not be permitted.
                                </Typography>

                                <Typography
                                    sx={{
                                        maxWidth: 760,
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        opacity: 0.95,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    <strong>Title:</strong> Maximum of 10 words.
                                </Typography>

                                <Typography
                                    sx={{
                                        maxWidth: 760,
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        opacity: 0.95,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    <strong>Abstract text:</strong> Maximum of 350 words, including
                                    references.
                                </Typography>

                                <Typography
                                    sx={{
                                        maxWidth: 760,
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        opacity: 0.95,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    The abstract should consist of a single text block. A short
                                    reference section may be included at the end.
                                </Typography>
                            </Stack>

                            <Stack spacing={2} >
                                <Typography variant="h6" fontWeight={600}>
                                    Presentation Types
                                </Typography>

                                <Typography
                                    sx={{
                                        maxWidth: 760,
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        opacity: 0.95,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    • Oral Presentation</Typography>
                                <Typography
                                    sx={{
                                        maxWidth: 760,
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        opacity: 0.95,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    • Oral Presentation (defaulting to poster)
                                </Typography>
                                <Typography
                                    sx={{
                                        maxWidth: 760,
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        opacity: 0.95,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    • Poster Presentation
                                </Typography>
                                <Typography
                                    sx={{
                                        maxWidth: 760,
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        opacity: 0.95,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    • Young WATOC Oral Presentation</Typography>
                                <Typography
                                    sx={{
                                        maxWidth: 760,
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        opacity: 0.95,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    • Young WATOC Oral Presentation (defaulting to poster)
                                </Typography>
                            </Stack>

                            <Stack spacing={2}>
                                <Typography variant="h6" fontWeight={600}>
                                    Author & Affiliation Information
                                </Typography>

                                <Typography
                                    sx={{
                                        maxWidth: 760,
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        opacity: 0.95,
                                        lineHeight: 1.7,
                                    }}
                                >                                    The submitting author’s name will be displayed as entered during
                                    registration.
                                </Typography>

                                <Typography
                                    sx={{
                                        maxWidth: 760,
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        opacity: 0.95,
                                        lineHeight: 1.7,
                                    }}
                                >                                    Multiple affiliations may be assigned using numeric references (for
                                    example, “1,3”).
                                </Typography>

                                <Typography
                                    sx={{
                                        maxWidth: 760,
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        opacity: 0.95,
                                        lineHeight: 1.7,
                                    }}
                                >                                    Co-authors may be added, and the presenting author must be clearly
                                    indicated. The presenting author will be highlighted in the book of
                                    abstracts.
                                </Typography>
                            </Stack>
                        </Stack>
                    </Container>
                </Container>
            </Box>
        </>
    )
}
