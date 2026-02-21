import { Autocomplete, Box, Button, Divider, FormControl, Grid, Grow, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from '../components/CustomTextField'
import { useNavigate } from 'react-router'
import { zodResolver } from '@hookform/resolvers/zod';
import { prefixes, registrationSchema } from '@/schemas/user-registration-schema'
import { countries, type Country } from '@/utils/countriesInfo'

// DEPRECADO
export default function RegisterForm() {
    const navigate = useNavigate()
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(registrationSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
    })

    const onSubmit = handleSubmit(async (data) => {

    })

    return (
        <form action="#" onSubmit={onSubmit}>
            <Stack spacing={3}>
                <div className='grid grid-cols-2 gap-5'>
                    <Controller
                        name='prefix'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                            <FormControl fullWidth size='small'>
                                <InputLabel id={`${field.name}-label`}>Choose your prefix</InputLabel>
                                <Select
                                    {...field}
                                    labelId={`${field.name}-label`}
                                    id={field.name}
                                    label='Choose your prefix'
                                >
                                    {prefixes.map(value => (
                                        <MenuItem value={value} key={value}>{value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name='pronouns'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <CustomTextField
                                {...field}
                                id={field.name}
                                label='Pronouns'
                                hideLengthLabel
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        name='first_name'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <CustomTextField
                                {...field}
                                id={field.name}
                                label='First name'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        name='middle_name'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <CustomTextField
                                {...field}
                                id={field.name}
                                label='Middle name'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        name='last_name'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <CustomTextField
                                {...field}
                                id={field.name}
                                label='Last name'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                </div>

                <div className='grid grid-cols-2 gap-5'>
                    <Controller
                        name='nationality'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <Autocomplete
                                id={field.name}
                                options={countries}
                                autoHighlight
                                size='small'
                                getOptionLabel={(c: Country) => c.label}
                                value={countries.find((c) => c.value === field.value) || null}
                                onChange={(_, option) => { field.onChange(option ? option.value : null) }}
                                renderOption={(props, option) => {
                                    const { key, ...optionProps } = props;
                                    return (
                                        <Box
                                            key={key}
                                            component="li"
                                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                            {...optionProps}
                                        >
                                            <img
                                                loading="lazy"
                                                width="20"
                                                srcSet={`https://flagcdn.com/w40/${option.value.toString().toLowerCase()}.png 2x`}
                                                src={`https://flagcdn.com/w20/${option.value.toString().toLowerCase()}.png`}
                                                alt=""
                                            />
                                            {option.label}
                                        </Box>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label='Country'
                                        error={!!fieldState.error}
                                        helperText={
                                            fieldState.error?.message &&
                                            <Grow in={!!fieldState.error} timeout={500}>
                                                <span>{fieldState.error?.message}</span>
                                            </Grow>
                                        }
                                        slotProps={{
                                            htmlInput: {
                                                ...params.inputProps,
                                                autoComplete: 'new-password',
                                            },
                                        }}
                                    />
                                )}
                            />
                        )}
                    />
                    <Controller
                        name='city'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <CustomTextField
                                {...field}
                                id={field.name}
                                label='City'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                </div>

                <div className='grid grid-cols-2 gap-5'>
                    <Controller
                        name='affiliation'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <CustomTextField
                                {...field}
                                id={field.name}
                                label='Affiliation'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                hideLengthLabel
                                maxLength={101}
                            />
                        )}
                    />
                    <Controller
                        name='job_title'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <CustomTextField
                                {...field}
                                id={field.name}
                                label='Job title'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                hideLengthLabel
                                maxLength={101}
                            />
                        )}
                    />
                    <Controller
                        name='field_of_study'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <CustomTextField
                                {...field}
                                id={field.name}
                                label='Field of study'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                hideLengthLabel
                                maxLength={101}
                            />
                        )}
                    />
                </div>

                <div className='grid grid-cols-2 gap-5'>
                    <Controller
                        name='email.value'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <CustomTextField
                                {...field}
                                id={field.name}
                                label='Email'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                hideLengthLabel
                            />
                        )}
                    />
                    <Controller
                        name='email.confirm'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <CustomTextField
                                {...field}
                                id={field.name}
                                label='Confirm your email'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                maxLength={101}
                                hideLengthLabel
                            />
                        )}
                    />

                    <Controller
                        name='password.value'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <CustomTextField
                                {...field}
                                id={field.name}
                                label='Password'
                                type='password'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                maxLength={101}
                                hideLengthLabel
                            />
                        )}
                    />
                    <Controller
                        name='password.confirm'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <CustomTextField
                                {...field}
                                id={field.name}
                                label='Confirm your password'
                                type='password'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                maxLength={101}
                                hideLengthLabel
                            />
                        )}
                    />
                </div>

                <Button variant='contained' type='submit'>Create account</Button>
            </Stack>
        </form>
    )
}
