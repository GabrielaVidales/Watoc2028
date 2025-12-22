import { Button, FormControl, Grid, Grow, InputLabel, Slide, Stack, TextField, InputAdornment } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import KeyIcon from '@mui/icons-material/Key';

export default function LoginForm() {
    const { control, handleSubmit, formState: { errors } } = useForm()

    const handleOnSubmit = (data) => {
        console.log(data)
    }

    return (
        <form action="#" onSubmit={handleSubmit(handleOnSubmit)} className='p-3'>
            <Stack spacing={3}>
                <h3 className='text-center'>Welcome back</h3>
                <p className='text-center'>Sign in to access your dashboard and conference materials</p>
                <Stack>
                    <InputLabel htmlFor='emailInput' sx={{ cursor: 'pointer' }}>Email</InputLabel>
                    <Controller
                        name='email'
                        control={control}
                        defaultValue=''
                        rules={{
                            required: 'Please provide your email',
                            maxLength: { value: 128, message: 'Max length is 64 characters' },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id='emailInput'
                                fullWidth
                                placeholder='example@domain.com'
                                error={!!errors?.email}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlineIcon />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                helperText={
                                    <Grow in={!!errors?.email} timeout={500}>
                                        <span>{errors?.email?.message}</span>
                                    </Grow>
                                }
                                sx={{
                                    [`& fieldset`]: {
                                        borderRadius: 5,
                                    },
                                }}
                            />
                        )}
                    />
                </Stack>
                <Stack>
                    <InputLabel htmlFor='passwordInput' sx={{ cursor: 'pointer' }}>Password</InputLabel>
                    <Controller
                        name='password'
                        control={control}
                        defaultValue=''
                        rules={{
                            required: 'Please provide your password',
                            maxLength: { value: 64, message: 'Max length is 64 characters' },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id='passwordInput'
                                type='password'
                                fullWidth
                                placeholder='my_secret_password'
                                error={!!errors?.password}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <KeyIcon />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                helperText={
                                    <Grow in={!!errors?.password} timeout={500}>
                                        <span>{errors?.password?.message}</span>
                                    </Grow>
                                }
                                sx={{
                                    [`& fieldset`]: {
                                        borderRadius: 5,
                                    },
                                }}
                            />
                        )}
                    />
                </Stack>
                <a href="#">Forgot password?</a>
                <Grid container justifyContent={'center'}>
                    <Grid size={12}>
                        <Button
                            type='submit'
                            variant='contained'
                            fullWidth
                            sx={{
                                borderRadius: 5,
                            }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
                <p>
                    Not registered for WATOC 2028 yet? <a href="#"> Create an account</a>
                </p>
            </Stack>
        </form>
    )
}
