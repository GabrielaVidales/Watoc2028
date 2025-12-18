import { Box, Stack, Typography, Divider, List, Container } from '@mui/material'

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
                            Abstracts
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
                            <Typography variant="body2" color="text.secondary" sx={{
                                maxWidth: 760,
                            }}>
                                Due to the expected high number of submitted abstracts, the review
                                process will be conducted in phases. Participants selected for oral
                                communications will be notified by email once the evaluation process
                                has concluded.
                            </Typography>
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

                    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 0 }, py: 8 }}>
                        <Stack spacing={5}>


                            <Stack spacing={1.5}>
                                <Typography variant="h6" fontWeight={600}>
                                    Important Deadlines
                                </Typography>

                                <Typography>
                                    <strong>Poster abstract submission deadline:</strong> 1 May 2028
                                </Typography>

                                <Typography>
                                    <strong>Oral communication abstract submission deadline:</strong>{' '}
                                    15 March 2028
                                </Typography>
                            </Stack>

                            <Stack spacing={2}>
                                <Typography variant="h6" fontWeight={600}>
                                    Call for Abstracts
                                </Typography>

                                <Typography>
                                    Researchers from all areas of theoretical and computational chemistry
                                    are invited to submit abstracts for oral communications and poster
                                    presentations at WATOC 2028.
                                </Typography>

                                <Typography>
                                    This is a unique opportunity to present your latest research to a
                                    global audience and to engage with experts and peers in the field.
                                </Typography>

                                <Typography>
                                    A total of <strong>150 oral communication slots</strong> are
                                    available. Submissions will be evaluated by members of the Local
                                    Scientific Committee and the International Advisory Board.
                                </Typography>
                            </Stack>

                            <Stack spacing={2}>
                                <Typography variant="h6" fontWeight={600}>
                                    Abstract Submission Process
                                </Typography>

                                <Typography>
                                    Prior registration for WATOC 2028 is required to submit an abstract.
                                    Upon registration, participants will receive a personal link to the
                                    abstract submission portal.
                                </Typography>

                                <Typography>
                                    If you are registered and cannot locate your submission link, please
                                    contact{' '}
                                    <strong>watoc@gyro.no</strong> to request that it be resent.
                                </Typography>

                                <Typography>
                                    Each participant may submit <strong>one abstract only</strong>.
                                </Typography>
                            </Stack>

                            <Stack spacing={2}>
                                <Typography variant="h6" fontWeight={600}>
                                    Abstract Submission Guidelines
                                </Typography>

                                <Typography>
                                    Abstracts must be written in plain text format. Figures, tables, and
                                    images are not permitted.
                                </Typography>

                                <Typography>
                                    <strong>Title:</strong> Maximum of 10 words.
                                </Typography>

                                <Typography>
                                    <strong>Abstract text:</strong> Maximum of 350 words, including
                                    references.
                                </Typography>

                                <Typography>
                                    The abstract should consist of a single text block. A short
                                    reference section may be included at the end.
                                </Typography>
                            </Stack>

                            <Stack spacing={2}>
                                <Typography variant="h6" fontWeight={600}>
                                    Presentation Types
                                </Typography>

                                <Typography>• Oral Presentation</Typography>
                                <Typography>
                                    • Oral Presentation (defaulting to poster)
                                </Typography>
                                <Typography>• Poster Presentation</Typography>
                                <Typography>• Young WATOC Oral Presentation</Typography>
                                <Typography>
                                    • Young WATOC Oral Presentation (defaulting to poster)
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Young WATOC presentations are available only to participants who
                                    defended their PhD thesis in 2020 or later.
                                </Typography>
                            </Stack>

                            <Stack spacing={2}>
                                <Typography variant="h6" fontWeight={600}>
                                    Author & Affiliation Information
                                </Typography>

                                <Typography>
                                    The submitting author’s name will be displayed as entered during
                                    registration.
                                </Typography>

                                <Typography>
                                    Multiple affiliations may be assigned using numeric references (for
                                    example, “1,3”).
                                </Typography>

                                <Typography>
                                    Co-authors may be added, and the presenting author must be clearly
                                    indicated. The presenting author will be highlighted in the book of
                                    abstracts.
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Container>
            </Box>

        </>
    )
}
