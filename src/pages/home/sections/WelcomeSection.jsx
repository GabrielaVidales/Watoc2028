import { Box, Container, Grid, Stack, Typography, Avatar, CardContent, CardMedia, Card } from '@mui/material'
import { FormatQuote } from '@mui/icons-material';

const CongressCard = ({ url, name, subtitle, text }) => (
    <Card
        elevation={8}
        sx={{
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            transition: 'all 0.4s ease',
            // height: '100%',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            },
        }}
    >
        <Box
            sx={{
                height: 320,
                backgroundImage: `
                            linear-gradient(
                                to top,
                                rgba(0,0,0,.3),
                                rgba(0,0,0,.1)
                            ),
                            url(${url}) `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        />
        <CardContent sx={{
            position: 'absolute',
            bottom: 0,
            color: 'white'
        }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom lineHeight={1.3}>
                {name}
            </Typography>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom lineHeight={1.3}>
                {subtitle}
            </Typography>
            <Typography variant="caption" lineHeight={1}>
                {text}
            </Typography>
        </CardContent>
    </Card>
);

const WelcomeMessage = ({ organizer, isReversed = false }) => (
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
                <FormatQuote
                    sx={{
                        position: 'absolute',
                        top: -20,
                        left: { xs: 0, md: 10 },
                        fontSize: 64,
                        color: 'primary.main',
                        opacity: 0.2,
                    }}
                />

                <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom marginLeft={2}>
                    Welcome to WATOC 2028
                </Typography>

                {organizer.paragraphs.map(text => (
                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{
                            fontSize: '1.05rem',
                            lineHeight: 1.8,
                            textAlign: 'justify',
                        }}
                    >
                        {text}
                    </Typography>
                ))}

                <Box
                    sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: '3px solid',
                        borderColor: 'primary.main',
                        opacity: 0.3,
                    }}
                />

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        src={organizer.url}
                        alt={organizer.name}
                        sx={{
                            width: 120,
                            height: 120,
                            border: '3px solid',
                            borderColor: 'primary.main',
                        }}
                    />
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.3} gutterBottom>
                            {organizer.name}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            {organizer.subtitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {organizer.text}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Grid>
    </Grid>
);

function WelcomeSection() {
    const organizers = [
        {
            url: '/drmerino.jpg',
            name: 'Prof. José Gabriel Merino Hernández',
            subtitle: 'Physical & Theoretical Chemistry',
            text: 'Chair of WATOC 2028',
            paragraphs: [
                'It is with great pleasure that we invite you to participate in the 14th Triennial Congress of the World Association of Theoretical and Computational Chemists (WATOC 2028), to be held in the beautiful city of Mérida, Yucatán, Mexico.',
                'This congress will bring together leading researchers from around the world to share groundbreaking advances in theoretical and computational chemistry, fostering collaboration and innovation in our field.',
            ]
        },
        // {
        //     url: '/galano.jpg',
        //     name: 'Prof. Annia Galano Jiménez',
        //     subtitle: 'Theoretical Chemistry',
        //     text: 'Chair of WATOC 2028',
        // },
    ];

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
                        From the Organizers
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
                        Words of Welcome
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

                <Stack spacing={8}>
                    {organizers.map((organizer, index) => (
                        <WelcomeMessage
                            key={index}
                            organizer={organizer}
                            isReversed={index % 2 !== 0}
                        />
                    ))}
                </Stack>

                <Box
                    sx={{
                        mt: 8,
                        pt: 4,
                        textAlign: 'center',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic', maxWidth: 600, mx: 'auto' }}
                    >
                        "We look forward to welcoming you to Mérida and sharing an
                        unforgettable scientific experience together."
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default WelcomeSection