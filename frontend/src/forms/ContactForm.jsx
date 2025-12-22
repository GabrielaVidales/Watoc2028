import { Button, TextField, Grid, MenuItem, Typography, Stack, Divider, Box, InputAdornment, FormLabel, Alert, Snackbar, Fade, Collapse, IconButton, AlertTitle, FormControl, useMediaQuery, useTheme } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { Close, ErrorOutline, MailOutline, Send } from '@mui/icons-material'
import CustomTextField from '../components/CustomTextField'
import { useAPI } from '../contexts/APIContext'
import { REGEX_EMAIL, REGEX_NAME } from '../utils/formRegex'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useEffect } from 'react'

function RenderControlledInput({
    name,
    label,
    control,
    rules,
    errors,
    defaultValue = '',
    placeholder = '',
    error = false,
    helperText = '',
    ...props
}) {

    return <>
        {label &&
            <FormLabel htmlFor={name}>
                {label}
            </FormLabel>
        }
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field }) => (
                <CustomTextField {...field}
                    onBlur={(event) => {
                        field.onChange(event.currentTarget.value.trim())
                    }}
                    id={name}
                    placeholder={placeholder}
                    error={error}
                    helperText={helperText}
                    {...props}
                />
            )}
        />
    </>
}

export default function ContactForm() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const { control, handleSubmit, reset, setError, register, setValue, clearErrors, formState: { errors, isSubmitSuccessful, isSubmitting } } = useForm()
    const api = useAPI()

    useEffect(() => {
        register('captcha', {
            required: 'Please complete the captcha.'
        })
    }, [register])

    const validateOption = (value) => (value !== -1 || 'Required *')

    const onSubmit = async (data) => {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // console.log(data);
        await sleep(1000)

        try {
            const response = await api.post('/contact', data)
            if (response.status === 201) {
                // console.log(response);
                reset()
            } else {
                throw new Error('Bad response!')
            }
        } catch (error) {
            setError('root', {
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
    }

    const contactType = [
        {
            id: 0,
            label: 'Posters'
        },
        {
            id: 1,
            label: 'Talks'
        },
        {
            id: 2,
            label: 'Invitation letter'
        },
        {
            id: 3,
            label: 'Payment'
        },
        {
            id: 4,
            label: 'Other'
        },
    ]

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isSubmitSuccessful}>
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

                    <Collapse
                        in={isSubmitSuccessful}
                        timeout={400}
                        mountOnEnter
                        unmountOnExit
                    >
                        <Alert
                            severity='success'
                            variant='filled'
                        >
                            <AlertTitle>Message sent successfully!</AlertTitle>
                            We've received your message and our team will get back to you shortly.
                        </Alert>
                    </ Collapse>

                    <Collapse
                        in={!!errors.root}
                        timeout={400}
                        mountOnEnter
                        unmountOnExit
                    >
                        <Alert
                            severity='error'
                            variant='filled'
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        clearErrors('root')
                                    }}
                                >
                                    <Close fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {errors?.root?.message}
                        </Alert>
                    </Collapse>

                    <Grid container spacing={2} display={'flex'} justifyContent={'space-between'}>
                        <Grid size={{ lg: 6, md: 12, sm: 12, xs: 12 }}>
                            <RenderControlledInput
                                name="firstName"
                                label="First name *"
                                control={control}
                                error={!!errors.firstName}
                                helperText={errors?.firstName?.message}
                                maxLenght={64}
                                placeholder="First name"
                                rules={{
                                    required: 'First name is required',
                                    maxLength: { value: 64, message: 'Max length is 64 characters' },
                                    pattern: { value: REGEX_NAME, message: 'Invalid name' }
                                }}
                            />
                        </Grid>
                        <Grid size={{ lg: 6, md: 12, sm: 12, xs: 12 }} >
                            <RenderControlledInput
                                name="lastName"
                                label="Last name *"
                                control={control}
                                error={!!errors.lastName}
                                helperText={errors?.lastName?.message}
                                maxLenght={64}
                                placeholder="Last name"
                                rules={{
                                    required: 'Last name is required',
                                    maxLength: { value: 64, message: 'Max length is 64 characters' },
                                    pattern: { value: REGEX_NAME, message: 'Invalid name' }
                                }}
                            />
                        </Grid>
                        <Grid size={12} >
                            <RenderControlledInput
                                name="email"
                                label="Email *"
                                control={control}
                                maxLenght={128}
                                placeholder="example@domain.com"
                                rules={{
                                    required: 'Required',
                                    maxLength: { value: 128, message: 'Max length is 128 characters' },
                                    pattern: { value: REGEX_EMAIL, message: 'Invalid email' }
                                }}
                                error={!!errors.email}
                                helperText={errors?.email?.message}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <MailOutline />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={12} >
                            <FormLabel htmlFor='subject'>
                                Subject *
                            </FormLabel>
                            <Controller
                                name="subject"
                                control={control}
                                defaultValue={-1}
                                disabled={isSubmitSuccessful}
                                rules={{
                                    required: 'Este campo es obligatorio',
                                    validate: validateOption
                                }}
                                render={({ field }) => (
                                    <TextField  {...field}
                                        id='subject'
                                        fullWidth
                                        select
                                        defaultValue={-1}
                                        error={!!errors.subject}
                                        helperText={
                                            <Typography variant="caption">
                                                {!!errors.subject && <>
                                                    <ErrorOutline fontSize='small' /> {errors.subject?.message}
                                                </>}
                                            </Typography>
                                        }
                                    >
                                        <MenuItem value={-1} disabled>Choose an option</MenuItem>
                                        {contactType.map(item => (
                                            <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid size={12} >
                            <RenderControlledInput
                                name="description"
                                label="Description *"
                                control={control}
                                error={!!errors.description}
                                helperText={errors?.description?.message}
                                maxLenght={600}
                                placeholder="Description"
                                rules={{
                                    required: 'Required',
                                    maxLength: { value: 600, message: 'Max length is 600 characters' },
                                }}
                                multiline
                                minRows={4}
                            />
                        </Grid>
                        <Grid size={12} sx={{ display: 'flex', justifyContent: 'center' }} >
                            <FormControl>
                                <HCaptcha
                                    size={isMobile ? 'compact' : 'normal'}
                                    sitekey="ad963da0-1c32-45a2-a4ae-409600422f34"
                                    onVerify={(token) => {
                                        setValue('captcha', token, { shouldValidate: true })
                                        clearErrors('captcha')
                                    }}
                                    onExpire={() => {
                                        setError('captcha', {
                                            type: 'manual',
                                            message: 'Captcha expired, please verify again'
                                        })
                                    }}
                                />
                                {errors?.captcha && (
                                    <Typography color="error" variant="caption">
                                        <ErrorOutline fontSize='small' /> {errors?.captcha?.message}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid size={12} display='flex' justifyContent='end'>
                            <Button type='submit' variant='contained' loading={isSubmitting} disabled={isSubmitSuccessful} size='large' endIcon={<Send />} >Submit</Button>
                        </Grid>
                    </Grid>
                </Stack>
            </fieldset>
        </form >
    )
}
