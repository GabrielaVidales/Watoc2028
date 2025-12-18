import { ContactEmergency, MailOutline } from '@mui/icons-material'
import { Button, Grow, InputAdornment, InputLabel, Stack, TextField } from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from '../components/CustomTextField'
import { REGEX_EMAIL, REGEX_NAME } from '../utils/formRegex'
import { useNavigate } from 'react-router'

export default function RegisterForm() {
    const navigate = useNavigate()
    const { control, formState: { errors }, handleSubmit } = useForm()

    const onValidatedData = (data) => {
        console.log(data);
        navigate('/register/account', {
            state: {
                data
            }
        })
    }

    return (
        <form action="#" onSubmit={handleSubmit(onValidatedData)} className='w-100 p-3'>
            <Stack spacing={3}>
                <h3 className='text-center'>Join WATOC 2028</h3>
                <p className='text-center'>Create an account to access your dashboard and conference materials</p>
                <Stack spacing={1}>
                    <InputLabel htmlFor='emailInput'>Full name</InputLabel>
                    <Controller
                        name='firstName'
                        control={control}
                        defaultValue=''
                        rules={{
                            required: 'Please provide your first name',
                            pattern: {
                                value: REGEX_NAME,
                                message: 'Please provide a valid name',
                            },
                        }}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                id='firstNameInput'
                                fullWidth
                                placeholder='First name'
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ContactEmergency />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                error={!!errors?.firstName}
                                helperText={
                                    <Grow in={!!errors?.firstName} timeout={500} id='putajajajaja'>
                                        <span>{errors?.firstName?.message}</span>
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
                    <Controller
                        name='lastName'
                        control={control}
                        defaultValue=''
                        rules={{
                            required: 'Please provide your last name',
                            pattern: {
                                value: REGEX_NAME,
                                message: 'Please provide a valid last name',
                            },
                        }}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                id='lastNameInput'
                                fullWidth
                                placeholder='Last name'
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ContactEmergency />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                error={!!errors?.lastName}
                                helperText={
                                    <Grow in={!!errors?.lastName} timeout={500} id='putajajajaja'>
                                        <span>{errors?.lastName?.message}</span>
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

                <Stack spacing={1}>
                    <InputLabel htmlFor='emailInput'>Email</InputLabel>
                    <Controller
                        name='email'
                        control={control}
                        defaultValue=''
                        rules={{
                            required: 'Please provide an email',
                            pattern: {
                                value: REGEX_EMAIL,
                                message: 'Please provide a valid email',
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id='emailInput'
                                fullWidth
                                placeholder='example@domain.com'
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutline />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                error={!!errors?.email}
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


                <Button variant='contained' type='submit'>Create account</Button>
            </Stack>
        </form>
    )
}
