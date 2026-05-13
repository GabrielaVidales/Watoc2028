import { Box, Container, Typography, Collapse, ListItemButton, ListItemText } from '@mui/material';
import { Quote, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import mayaCalendar from '../../../assets/calendario_maya_rojo.png';
import drMerino from '../../../assets/drmerino.jpg';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';


const organizer = {
    url: drMerino,
    name: 'Professor Gabriel Merino',
    subtitle: 'Applied Physics Department',
    text: 'Cinvestav Mérida',
    paragraphs: [
        "On behalf of the local scientific and organizing committees, it is a great pleasure to invite you to the 14th Triennial Congress of the World Association of Theoretical and Computational Chemists (WATOC 2028), which will be held in January 2028 in Mérida.",
        "WATOC 2028 will once again bring together the global theoretical and computational chemistry community in what will be one of the major international scientific events of the year. The congress is expected to attract participants from all regions of the world, providing a forum for presenting frontier research, exchanging ideas, and strengthening collaborations across disciplines and career stages.",
        "The scientific program will maintain a structure similar to that of recent WATOC congresses, combining plenary lectures, invited contributions, oral communications, and poster sessions. A broad range of thematic sessions will cover the full spectrum of contemporary theoretical and computational chemistry, from fundamental electronic-structure theory and molecular dynamics to catalysis, spectroscopy, materials science, medicinal chemistry, machine learning, and quantum computing.",
        "Following its very successful debut in Oslo, Young WATOC will remain a central component of the meeting. Taking place immediately prior to the main congress, this event will highlight the work of early-career researchers who have recently completed their PhD studies. While presentations will be delivered exclusively by young scientists, Young WATOC will be open to all congress participants, fostering dialogue between generations.",
        "WATOC 2028 will be hosted in Mérida, the cultural and scientific hub of southeastern Mexico. Often referred to as the “White City,” Mérida is renowned for its strong Mayan heritage, elegant colonial architecture, and vibrant contemporary cultural life. The city offers excellent infrastructure, a safe and welcoming environment, and convenient access to world-class archaeological sites such as Uxmal and Chichén Itzá."
    ]
}

function WelcomeSection() {
    const [open, setOpen] = useState(false);

    return (
        <section className='py-12'>
            <Container maxWidth="md">
                <Box sx={{
                    textAlign: 'center',
                    mb: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div
                        className="absolute opacity-25 bg-no-repeat bg-contain bg-center bg-local h-52 w-52 md:h-60 md:w-60"
                        style={{ backgroundImage: `url(${mayaCalendar})` }}
                    />

                    <Typography
                        variant="overline"
                        color="primary"
                        fontWeight="bold"
                        sx={{ fontSize: '1rem', letterSpacing: 2, position: 'relative' }}
                    >
                        From the Congress Chair
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

                <Box sx={{
                    position: 'relative', px: { xs: 2, md: 4 }, mt: 4, pb: 2,
                }}>
                    <Quote className='absolute -top-4 left-6 text-primary-light opacity-20 size-14' />
                    <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom sx={{ ml: 2 }}>
                        Welcome to WATOC 2028
                    </Typography>

                    <p className='mb-6 leading-6 text-justify text-sm md:text-base md:leading-7'>
                        {organizer.paragraphs[0]}
                    </p>

                    <Collapse in={open} timeout={800} unmountOnExit>
                        {organizer.paragraphs.slice(1).map((text, index) => (
                            <p className='mb-6 leading-6 text-justify text-sm md:text-base md:leading-7' key={index}>
                                {text}
                            </p>
                        ))}
                    </Collapse>

                    <div className='flex w-full'>
                        <Button variant='ghost' className='w-full text-primary-main text-base' onClick={() => setOpen(!open)}>
                            {open ? (<>
                                Read less
                                <ChevronUp />
                            </>) : (<>
                                Read the full invitation
                                <ChevronDown />
                            </>)}
                        </Button>
                    </div>

                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar className='size-25 ring-2'>
                            <AvatarImage
                                src={organizer.url}
                                alt={organizer.name}
                                className='object-cover'
                            />
                        </Avatar>
                        <div>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {organizer.name}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                {organizer.subtitle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {organizer.text}
                            </Typography>
                        </div>
                    </Box>

                    <div className='border-t-2 mt-6 py-3 text-center'>
                        <div className='max-w-md mx-auto text-sm leading-6 text-muted-foreground'>
                            We look forward to welcoming you to Mérida for what promises to be a scientifically stimulating, intellectually enriching, and culturally memorable WATOC congress.
                        </div>
                    </div>
                </Box>
            </Container>
        </section>
    );
}

export default WelcomeSection;