import { Box, Container, Grid, Stack, Typography, Avatar, CardContent, Card, Collapse, ListItemButton, ListItemText } from '@mui/material'
import { ExpandLess, ExpandMore, FormatQuote } from '@mui/icons-material';
import { useState } from 'react';
import mayaCalendar from '../../../assets/calendario_maya_rojo.png'
import drMerino from '../../../assets/drmerino.jpg'

const WelcomeMessage = ({ organizer, isReversed = false }) => {
    const [open, setOpen] = useState(false)

    return <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        sx={{
            flexDirection: { xs: 'column', md: isReversed ? 'row-reverse' : 'row' },
        }}
    >
        <Grid size={{ xs: 12, md: 10 }}>
            <Box sx={{ position: 'relative', px: { xs: 2, md: 4 } }}>
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
                {organizer.paragraphs.length > 0 && (
                    <Typography
                        gutterBottom
                        marginBottom={3}
                        sx={{
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            textAlign: 'justify',
                            wordSpacing: '6px',
                        }}
                    >
                        {organizer.paragraphs[0]}
                    </Typography>
                )}

                {/* Caja colapsable para texto */}
                <Box position='relative'>
                    <Collapse in={open} timeout={1000} unmountOnExit>
                        {organizer.paragraphs.length > 1 && organizer.paragraphs.map((text, index) => {
                            if (index === 0) return null
                            return (
                                <Typography
                                    key={index}
                                    gutterBottom
                                    marginBottom={3}
                                    sx={{
                                        fontSize: '1rem',
                                        lineHeight: 1.6,
                                        textAlign: 'justify',
                                        wordSpacing: '6px'
                                    }}
                                >
                                    {text}
                                </Typography>
                            )
                        })}
                    </Collapse>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 1,
                        }}
                    >
                        <ListItemButton onClick={() => setOpen(!open)} sx={{ borderRadius: 3 }}>
                            <ListItemText primary={open ? "Show less..." : "Show more..."} />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </Box>
                </Box>

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
                            borderColor: 'primary.light',
                        }}
                    />
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {organizer.name}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {organizer.subtitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {organizer.text}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Grid>
    </Grid>
}

function WelcomeSection() {
    const organizers = [
        {
            url: drMerino,
            name: 'Professor Gabriel Merino',
            subtitle: 'Applied Physics Department',
            text: 'Cinvestav Mérida',
            paragraphs: [
                "On behalf of the local scientific and organizing committees, it is a great pleasure to invite you to the 14th Triennial Congress of the World Association of Theoretical and Computational Chemists (WATOC 2028), which will be held in January 2028 in Mérida.",
                "WATOC 2028 will once again bring together the global theoretical and computational chemistry community in what will be one of the major international scientific events of the year. The congress is expected to attract participants from all regions of the world, providing a forum for presenting frontier research, exchanging ideas, and strengthening collaborations across disciplines and career stages.",
                "The scientific program will maintain a structure similar to that of recent WATOC congresses, combining plenary lectures, invited contributions, oral communications, and poster sessions. A broad range of thematic sessions will cover the full spectrum of contemporary theoretical and computational chemistry, from fundamental electronic-structure theory and molecular dynamics to catalysis, spectroscopy, materials science, medicinal chemistry, machine learning, and quantum computing. This format is designed to balance depth and breadth while encouraging interaction across subfields.",
                "Following its very successful debut in Oslo, Young WATOC will remain a central component of the meeting. Taking place immediately prior to the main congress, this event will highlight the work of early-career researchers who have recently completed their PhD studies. While presentations will be delivered exclusively by young scientists, Young WATOC will be open to all congress participants, fostering dialogue between generations and reinforcing WATOC’s long-standing commitment to nurturing emerging leaders in the field.",
                "WATOC 2028 will be hosted in Mérida, the cultural and scientific hub of southeastern Mexico. Often referred to as the “White City,” Mérida is renowned for its strong Mayan heritage, elegant colonial architecture, and vibrant contemporary cultural life. The city offers excellent infrastructure, a safe and welcoming environment, and convenient access to world-class archaeological sites such as Uxmal and Chichén Itzá, as well as to the Gulf of Mexico coastline. The congress venue, a modern convention center, will provide an ideal setting for scientific exchange, networking, and collaboration.",
            ]
        },
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
                <Box sx={{
                    textAlign: 'center',
                    mb: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            opacity: 0.25,
                            height: '12rem',
                            width: '12rem',
                            backgroundImage: `url(${mayaCalendar})`,
                            backgroundPosition: '50% 50%',
                            backgroundAttachment: 'local',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />

                    <Typography
                        variant="overline"
                        color="primary"
                        fontWeight="bold"
                        sx={{ fontSize: '1rem', letterSpacing: 2, position: 'relative' }}
                    >
                        From the Organizer
                    </Typography>
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                            mt: 1,
                            mb: 2,
                            fontSize: { xs: '2rem', md: '2.5rem', position: 'relative' },
                        }}
                    >
                        Words of Welcome
                    </Typography>
                    <Box
                        sx={{
                            position: 'relative',
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
                            key={organizer.url}
                            organizer={organizer}
                            isReversed={index % 2 !== 0}
                        />
                    ))}
                </Stack>

                <Box
                    sx={{
                        mt: 4,
                        textAlign: 'center',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic', maxWidth: 700, mx: 'auto' }}
                    >
                        "We look forward to welcoming you to Mérida for what promises to be a scientifically stimulating, intellectually enriching, and culturally memorable WATOC congress."
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default WelcomeSection