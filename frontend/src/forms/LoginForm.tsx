import { Button, Stack, InputAdornment, Paper, Box, IconButton, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'; // Íconos de Lucide
import { ControlledTextField } from './components/ControlledInputs';
import React from 'react';
import { Link, useNavigate } from 'react-router';
import { REGEX_EMAIL } from '../utils/formRegex';
import { useAuth } from '../contexts/AuthContext';

export default function LoginForm() {
    const { handleLogin } = useAuth()
    const navigate = useNavigate()
    const methods = useForm()
    const onSubmit = methods.handleSubmit(async (data) => {
        try {
            await handleLogin(data.email, data.password)
            navigate('/success')
        } catch (error) {
            console.error("...");
        }
    })
    
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <FormProvider {...methods}>
            <Paper component='form' onSubmit={onSubmit} elevation={5} sx={{ py: 6, px: { xs: 3, sm: 6, md: 9 }, borderTop: 12, borderColor: 'primary.main', }}>
                <Box component='fieldset' disabled={methods.formState.isSubmitting} sx={{ border: 'none', p: 0, m: 0 }}>
                    <Stack spacing={2} py={2}>
                        <Typography variant='h4' fontWeight={500} textAlign='center'>
                            Welcome back
                        </Typography>
                        <Typography textAlign='center'>
                            Sign in to access your dashboard and conference materials
                        </Typography>

                        <ControlledTextField
                            id='email'
                            name='email'
                            label='Email'
                            defaultValue=''
                            placeholder='example@domain.com'
                            rules={{
                                required: 'Please provide your email',
                                maxLength: { value: 128, message: 'Max length is 128 characters' },
                                pattern: { value: REGEX_EMAIL, message: 'Invalid email' }
                            }}
                            maxLength={50}
                            hideLengthLabel
                            inputAdornment={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <Mail size={20} />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <ControlledTextField
                            id='password'
                            name='password'
                            label='Password'
                            defaultValue=''
                            placeholder='**********'
                            rules={{
                                required: 'Please provide your password',
                                maxLength: { value: 128, message: 'Max length is 64 characters' },
                            }}
                            type={showPassword ? 'text' : 'password'}
                            maxLength={50}
                            hideLengthLabel
                            inputAdornment={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <Lock size={20} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPassword ? 'hide the password' : 'display the password'}
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Link to='#' style={{ width: 'fit-content', marginLeft: 'auto', marginBottom: 15 }}>
                            Forgot password?
                        </Link>

                        <Button type='submit' variant='contained' loading={methods.formState.isSubmitting} sx={{ borderRadius: 5, width: '70%', alignSelf: 'center' }} >
                            Submit
                        </Button>

                        <Typography textAlign='center'>
                            Not registered yet? <Link to='/register'> Create an account</Link>
                        </Typography>
                    </Stack>
                </Box>
            </Paper>
        </FormProvider>
    )
}