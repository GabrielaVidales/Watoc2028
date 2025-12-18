import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Box, Fade, Paper } from '@mui/material';

const steps = [
    {
        src: '/centro1.jpg',
        label: 'Select campaign settings',
        description: `For each ad campaign that you create, you can control how much
        you're willing to spend on clicks and conversions, which networks
        and geographical locations you want your ads to show on, and more.`,
    },
    {
        src: '/centro2.jpg',
        label: 'Create an ad group',
        description:
            'An ad group contains one or more ads which target a shared set of keywords.',
    },
    {
        src: '/centro3.jpg',
        label: 'Create an ad',
        description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
    },
];

export default function VenueCarousel() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    React.useEffect(() => {
        console.log(activeStep);

    }, [activeStep])

    const handleNext = () => {
        if (activeStep <= 3) {
            console.log('puta')
            setActiveStep((prevActiveStep) => (prevActiveStep + 1) % 3);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep === 0 ? 2 : (prevActiveStep - 1) % 3);
    };

    return (
        <Paper
            className='bg-secondary'
            elevation={5} sx={{
                position: 'relative',
                width: '100%',
                borderRadius: '25px 25px 0 0',
                overflow: 'hidden'
            }}>
            <Fade key={activeStep} in timeout={900}>
                <Box
                    component="img"
                    src={steps[activeStep].src}
                    alt={steps[activeStep].label}
                    sx={{
                        width: '100%',
                        height: { xs: 200, sm: 300, md: 400 }, // ajusta según tu layout
                        objectFit: 'cover',
                    }}
                />
            </Fade>

            <MobileStepper
                variant="dots"
                steps={3}
                position="static"
                activeStep={activeStep}
                sx={{ flexGrow: 1 }}
                nextButton={
                    <Button size="small" onClick={handleNext}>
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Back
                    </Button>
                }
            />
        </Paper>

    );
}
