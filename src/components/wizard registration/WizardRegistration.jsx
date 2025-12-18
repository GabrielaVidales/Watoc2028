import { Box, Button, Grow, Paper, Step, StepLabel, Stepper } from '@mui/material'
import { useEffect, useState } from 'react'
import BasicInfoStep from './steps/BasicInfoStep'
import SecondStep from './steps/SecondStep'
import LastStep from './steps/LastStep'

export default function WizardRegistration() {
    const [activeStep, setActiveStep] = useState(0)
    const [orientation, _] = useState('horizontal')
    const [formData, setFormData] = useState({})

    useEffect(() => {
        console.log('Current form data:');
        console.log(formData);
    }, [formData])

    const onDebugData = () => {
        setFormData({
            "title": "Dr.",
            "firstName": "Eduardo",
            "lastName": "Escalante Pacheco",
            "email": "eduardo1582000@gmail.com",
            "phone": "9993914295",
            "country": "MX",
            "city": "Mérida",
            "institution": "TecNM",
            "department": "Dirección Académica",
            "cargo": "Director General",
            "student": false
        })
    }

    const handleNext = (data = null, stepName) => {
        if (activeStep < 3) {
            if (data) {
                setFormData(prev => ({
                    ...prev,
                    [stepName]: data
                }))
            }
            setActiveStep(prev => prev + 1)
        }
    }

    const handleBack = (uncleanedData = null, stepName) => {
        console.log(uncleanedData, stepName)
        if (activeStep > 0) {
            if (uncleanedData) {
                setFormData(prev => ({
                    ...prev,
                    [stepName]: uncleanedData
                }))
            }
            setActiveStep(prev => prev - 1)
        }
    }

    const handleReset = () => {
        setActiveStep(0)
        setFormData({})
    }

    const renderStep = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return (<BasicInfoStep data={formData} stepName='personalData' onNext={handleNext} />)
            case 1:
                return (<SecondStep data={formData} stepName='next' onNext={handleNext} onBack={handleBack} />)
            case 2:
                return (<LastStep onReset={handleReset} onBack={handleBack} />)
            case 3:
                return (<LastStep onReset={handleReset} onBack={handleBack} />)
            default:
                return null
        }
    }

    return (
        <Grow in timeout={800}>
            {/* {debug ? null : null} */}
            <Paper className='d-flex flex-column p-3 h-100' elevation={7} sx={{ height: 630, borderTop: 12, borderColor: '#6a45ffff', }}>
                <Button onClick={onDebugData}>Debug data</Button>
                <Stepper
                    className='p-3'
                    orientation={orientation}
                    activeStep={activeStep}
                    {...(orientation === 'vertical' && { sx: { display: 'flex', flexDirection: 'column', alignItems: 'start', rowGap: 1 } })}
                >
                    <Step completed={activeStep > 0}>
                        <StepLabel optional={false}>Primer paso</StepLabel>
                    </Step>
                    <Step completed={activeStep > 1} >
                        <StepLabel optional={false}>Segundo paso</StepLabel>
                    </Step>
                    <Step completed={activeStep > 2} >
                        <StepLabel optional={false}>Tercer paso</StepLabel>
                    </Step>
                </Stepper>
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        minHeight: 0,
                    }}
                >
                    {renderStep(activeStep)}
                </Box>
            </Paper >
        </Grow>
    )
}
