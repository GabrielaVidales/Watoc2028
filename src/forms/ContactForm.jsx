import { Button, FormControl, FormHelperText, Grid, MenuItem, Paper, Select } from '@mui/material'
import CustomTextField from '../components/CustomTextField'
import { Controller, useForm } from 'react-hook-form'

const regexName = /^([a-zA-ZÀ-ú]{2,})([ \-]?[a-zA-ZÀ-ú]{2,})*$/
const regexEmail = /^([a-zA-Z].[\w]+(?:\.\w+)?)+@([\w]+(?:\.[a-z]{2,10})+)$/

export default function ContactForm({ action = '#' }) {
    const { control, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (data) => {
        data = {
            ...data,
            date: new Date().getTime(),
        }
        console.log(data);
    };

    return (
        <form action={action} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} display={'flex'} justifyContent={'space-between'}>
                <Grid size={{ lg: 6, md: 12, sm: 12, xs: 12 }}>
                    <Controller
                        name='firstName'
                        control={control}
                        defaultValue={''}
                        rules={{
                            required: 'First name is required',
                            maxLength: { value: 64, message: 'Max length is 64 characters' },
                            pattern: { value: regexName, message: 'Invalid name' }
                        }}
                        render={({ field }) => (
                            <CustomTextField {...field}
                                maxLenght={64}
                                placeholder={'First name'}
                                error={!!errors.firstName}
                                helperText={errors?.firstName?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ lg: 6, md: 12, sm: 12, xs: 12 }} >
                    <Controller
                        name='lastName'
                        control={control}
                        defaultValue={''}
                        rules={{
                            required: 'Last name is required',
                            maxLength: { value: 64, message: 'Max length is 64 characters' },
                        }}
                        render={({ field }) => (
                            <CustomTextField {...field}
                                maxLenght={64}
                                placeholder={'Last name'}
                                error={!!errors.lastName}
                                helperText={errors?.lastName?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid size={12} >
                    <Controller
                        name='email'
                        control={control}
                        defaultValue={''}
                        rules={{
                            required: 'Email is required',
                            maxLength: { value: 64, message: 'Max length is 255 characters' },
                            pattern: { value: regexEmail, message: 'Invalid email' }

                        }}
                        render={({ field }) => (
                            <CustomTextField {...field}
                                maxLenght={255}
                                placeholder={'Email'}
                                error={!!errors.email}
                                helperText={errors?.email?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid size={12} >
                    <Controller
                        name="select"
                        control={control}
                        defaultValue={-1}
                        rules={{
                            required: 'Este campo es obligatorio',
                        }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                fullWidth
                                defaultValue={-1}
                                error={!!errors.select}
                                sx={{ minWidth: '100%' }}
                            >
                                <MenuItem value={-1} >Select an option</MenuItem>
                                <MenuItem value="opcion1">Opción 1</MenuItem>
                                <MenuItem value="opcion2">Opción 2</MenuItem>
                                <MenuItem value="opcion3">Opción 3</MenuItem>
                            </Select>
                        )}
                    />
                    {errors.select && <FormHelperText fullWidth error>{errors.select.message}</FormHelperText>}  {/* Mostrar mensaje de error */}
                </Grid>
                <Grid size={12} >
                    <Controller
                        name='description'
                        control={control}
                        defaultValue={''}
                        rules={{
                            required: 'Description is required',
                            maxLength: { value: 255, message: 'Max length is 255 characters' },
                            pattern: { value: regexName, message: 'Invalid name' }

                        }}
                        render={({ field }) => (
                            <CustomTextField {...field}
                                maxLenght={255}
                                placeholder={'Descripción'}
                                error={!!errors.description}
                                helperText={errors?.description?.message}
                                multiline
                                rows={2}
                            />
                        )}
                    />
                </Grid>
                <Button type='submit' variant='contained'>Submit</Button>
            </Grid>
        </form>
    )
}
