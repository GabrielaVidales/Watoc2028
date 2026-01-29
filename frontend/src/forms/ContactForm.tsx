import { Button, Typography, Stack, Divider, Box, InputAdornment, Alert, Collapse, IconButton, AlertTitle, FormControl, useMediaQuery, useTheme } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { Close, ErrorOutline, MailOutline, Send } from '@mui/icons-material'
import { REGEX_EMAIL, REGEX_NAME } from '../utils/formRegex'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useEffect, useState } from 'react'
import axiosClient from '../clients/axiosClient'
import { BaseOption, ControlledDropdown, ControlledTextField } from './components/ControlledInputs'

interface ContactType extends BaseOption {
    label: string
}

const contactType: ContactType[] = [
    {
        value: 0,
        label: 'Posters'
    },
    {
        value: 1,
        label: 'Talks'
    },
    {
        value: 2,
        label: 'visa letters'
    },
    {
        value: 3,
        label: 'Payment'
    },
    {
        value: 4,
        label: 'Other'
    },
]

function StatusAlert({ isSuccess, error, onClose }: { isSuccess: boolean, error?: any, onClose: () => void }) {
    const [open, setOpen] = useState(true)
    function handleClose(): void {
        setOpen(false)
        setTimeout(onClose, 400)
    }

    useEffect(() => {
        if (isSuccess || !!error) {
            setOpen(true);
        }
    }, [isSuccess, error]);

    return <>
        <Collapse
            in={open && (isSuccess || !!error)} timeout={400} mountOnEnter unmountOnExit >
            <Alert
                severity={isSuccess ? 'success' : 'error'}
                variant='filled'
                action={(
                    <IconButton color="inherit" size="small" onClick={handleClose}>
                        <Close fontSize="inherit" />
                    </IconButton>
                )}
            >
                {isSuccess ? <>
                    <AlertTitle>Message sent successfully!</AlertTitle>
                    We've received your message and our team will get back to you shortly.
                </> : (error?.message)}
            </Alert>
        </Collapse>
    </>
}

export default function ContactForm() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const { formState: { } } = useForm()

    useEffect(() => {
        if (!import.meta.env.DEV) {
            methods.register('captcha', {
                required: 'Captcha required *'
            })
        }
    }, [])

    const validateOption = (value: any) => (value !== -1 || 'Required *')

    const methods = useForm()

    const onSubmit = methods.handleSubmit(async (data: any) => {
        delete data.captcha;
        try {
            const response = await axiosClient.post('contact/', data)
            if (response.status === 201) {
                methods.reset()
            } else {
                throw new Error('Bad response!')
            }
        } catch (error) {
            methods.setError('root', {
                type: 'root',
                message: 'Something went wrong. Try again later.',
            })
            throw error
        } finally {
            window.scroll({
                top: 420,
                behavior: 'smooth'
            })
        }
    })

    return (
        <FormProvider {...methods}>
            <Box component='fieldset' disabled={methods.formState.isSubmitting}>
                <Stack spacing={3}>
                    <Box textAlign="center" mb={6} >
                        <Typography
                            variant="overline"
                            color="primary"
                            fontWeight="bold"
                            sx={{ fontSize: '1rem', letterSpacing: 2 }}
                        >
                            Contact us
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
                            Send us a message
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

                    <Divider />

                    <StatusAlert
                        isSuccess={methods.formState.isSubmitSuccessful}
                        error={methods.formState.errors.root}
                        onClose={() => {
                            methods.clearErrors('root')
                            methods.reset()
                        }}
                    />


                    <Stack spacing={2}>
                        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                            <ControlledTextField
                                defaultValue=''
                                id='firstName'
                                name='firstName'
                                label='First name *'
                                placeholder="First name"
                                rules={{
                                    required: 'First name is required *',
                                    maxLength: { value: 64, message: 'Max length is 64 characters' },
                                    pattern: { value: REGEX_NAME, message: 'Invalid name' }
                                }}
                                maxLength={64}
                            />
                            <ControlledTextField
                                defaultValue=''
                                id='lastName'
                                name='lastName'
                                label='Last name *'
                                placeholder="Last name"
                                rules={{
                                    required: 'Last name is required *',
                                    maxLength: { value: 64, message: 'Max length is 64 characters' },
                                    pattern: { value: REGEX_NAME, message: 'Invalid name' }
                                }}
                                maxLength={64}
                            />
                        </Stack>
                        <ControlledTextField
                            id='email'
                            name="email"
                            label="Email *"
                            placeholder="example@domain.com"
                            defaultValue=''
                            rules={{
                                required: 'Required *',
                                maxLength: { value: 128, message: 'Max length is 128 characters' },
                                pattern: { value: REGEX_EMAIL, message: 'Invalid email' }
                            }}
                            maxLength={128}
                            inputAdornment={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MailOutline />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <ControlledDropdown
                            id='subject'
                            name='subject'
                            label='Subject *'
                            rules={{
                                required: 'Required *',
                                validate: validateOption
                            }}
                            options={contactType}
                            getOptionLabel={(option: ContactType) => option.label}
                            optionRender={(option: ContactType) => option.label}
                        />
                        <ControlledTextField
                            id="description"
                            name="description"
                            label="Description *"
                            multiline
                            minRows={4}
                            defaultValue=''
                            placeholder="Description"
                            rules={{
                                required: 'Required *',
                                maxLength: { value: 600, message: 'Max length is 600 characters' },
                            }}
                            maxLength={600}
                        />

                        {!import.meta.env.DEV && (
                            <Box display='flex' flexDirection='column' alignItems='center' >
                                <FormControl >
                                    <HCaptcha
                                        size={isMobile ? 'compact' : 'normal'}
                                        // sitekey="ad963da0-1c32-45a2-a4ae-409600422f34"
                                        sitekey="10000000-ffff-ffff-ffff-000000000001"
                                        onVerify={(token) => {
                                            methods.setValue('captcha', token, { shouldValidate: true })
                                            methods.clearErrors('captcha')
                                        }}
                                        onExpire={() => {
                                            if (!methods.formState.isSubmitSuccessful) {
                                                methods.setError('captcha', {
                                                    type: 'manual',
                                                    message: 'Captcha expired, please verify again'
                                                })
                                            }
                                        }}
                                    />
                                    {methods.formState.errors?.captcha && (
                                        <Typography color="error" variant="caption">
                                            <ErrorOutline fontSize='small' /> {methods.formState.errors?.captcha?.message?.toString()}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Box>
                        )}

                        <Button onClick={onSubmit} type='submit' variant='contained' loading={methods.formState.isSubmitting} disabled={methods.formState.isSubmitSuccessful} size='large' fullWidth endIcon={<Send />} >Submit</Button>
                    </Stack>
                </Stack>
            </Box>
        </FormProvider>
    )
}
