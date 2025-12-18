import { Avatar, Box, Button, InputAdornment, Toolbar, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { REGEX_EMAIL, REGEX_NAME } from '../../../utils/formRegex'
import { DriveFileRenameOutline, LocationCity, MailOutline, Person, Phone, Public, School } from '@mui/icons-material'
import { useEffect } from 'react'
import { countries } from '../../../utils/countriesInfo'
import CustomTextField from '../../CustomTextField'
import RenderInput from '../inputs/RenderInput'
import RenderCheckbox from '../inputs/RenderCheckbox'
import CustomSelect from '../inputs/CustomSelect'
import StepTemplate from './StepTemplate'

export default function BasicInfoStep({ data = {}, stepName = '_', onNext = null }) {
    const { handleSubmit, formState: { errors }, control, reset } = useForm()

    useEffect(() => {
        if (data.personalData) {
            reset(data.personalData)
        }
    }, [data.personalData, reset])

    const onValidData = (data) => {
        onNext?.(data, stepName)
    }

    const SectionTitle = ({ icon, text }) => (
        <Box display='flex' alignItems='center' gap={1.5}>
            <Avatar sx={{ bgcolor: 'primary.light', height: 'auto', width: 35, aspectRatio: '1 / 1' }}>
                {icon}
            </Avatar>
            <Typography variant='h6' fontWeight='bold'>
                {text}
            </Typography>
        </Box>
    )

    return (
        <StepTemplate onSubmit={handleSubmit(onValidData)} stepActions={(
            <>
                <Button type='submit' onClick={handleSubmit(onValidData)} variant='contained' sx={{ marginLeft: 'auto' }}>
                    Next
                </Button>
            </>
        )}>
            <SectionTitle
                icon={<Person fontSize='small' />}
                text='Personal data'
            />
            <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} justifyContent='space-between' gap={3}>
                <CustomSelect
                    name='title'
                    label='Título *'
                    control={control}
                    id='title'
                    options={[{
                        code: 'Dr.',
                        label: 'Doctor'
                    }]}
                    placeholder='I am...'
                    getOptionLabel={option => (option.code)}
                    defaultValue={data[stepName]?.title || ''}
                    boxProps={{
                        flex: 0.5
                    }}
                />
                <RenderInput
                    name='firstName'
                    label='First name *'
                    control={control}
                    rules={{
                        required: 'Please provide your first name',
                        pattern: {
                            value: REGEX_NAME,
                            message: 'Please provide a valid first name',
                        },
                        maxLength: {
                            value: 100,
                            message: 'No seas puta',
                        },
                    }}
                    defaultValue={data[stepName]?.firstName || ''}
                    id='firstNameInput'
                    placeholder='First name'
                    error={!!errors?.firstName}
                    helperText={errors?.firstName?.message}
                    InputComponent={CustomTextField}
                    maxLenght={100}
                    inputAdornment={(
                        <InputAdornment position="start">
                            <DriveFileRenameOutline />
                        </InputAdornment>
                    )}
                />
                <RenderInput
                    name='lastName'
                    label='Last name *'
                    control={control}
                    rules={{
                        required: 'Please provide your first name',
                        maxLength: {
                            value: 100,
                            message: 'No seas puta',
                        },
                        pattern: {
                            value: REGEX_NAME,
                            message: 'Please provide a valid first name',
                        },
                    }}
                    id='lastName'
                    placeholder='Last name'
                    defaultValue={data[stepName]?.lastName || ''}
                    error={!!errors?.lastName}
                    helperText={errors?.lastName?.message}
                    InputComponent={CustomTextField}
                    maxLenght={100}
                    inputAdornment={(
                        <InputAdornment position="start">
                            <DriveFileRenameOutline />
                        </InputAdornment>
                    )}
                />
            </Box>

            <Toolbar />

            <SectionTitle
                icon={<School fontSize='small' />}
                text='Proffesional Information'
            />
            <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} justifyContent='space-between' gap={3}>
                <RenderInput
                    id='institution'
                    name='institution'
                    label='Affiliation *'
                    control={control}
                    rules={{
                        required: 'Required *',
                    }}
                    placeholder='Ej. Universidad de la Antártida'
                    defaultValue={data[stepName]?.institution || ''}
                    error={!!errors?.institution}
                    helperText={errors?.institution?.message}
                />
                <RenderInput
                    id='department'
                    name='department'
                    label='Departamento / Facultad'
                    control={control}
                    placeholder='Ej. Depto. de Física Aplicada'
                    defaultValue={data[stepName]?.department || ''}
                    error={!!errors?.department}
                    helperText={errors?.department?.message}
                />
            </Box>
            <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} justifyContent='space-between' gap={3}>
                <RenderInput
                    id='cargo'
                    name='cargo'
                    label='Cargo / Posición'
                    control={control}
                    placeholder='Ej. Investigador Principal'
                    defaultValue={data[stepName]?.cargo || ''}
                    error={!!errors?.cargo}
                    helperText={errors?.cargo?.message}
                />
                <RenderCheckbox
                    name='student'
                    control={control}
                    label='Soy estudiante (Pregrado / Máster / Doctorado)'
                    defaultValue={data[stepName]?.student || ''}
                    boxProps={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                />
            </Box>

            <Toolbar />

            <SectionTitle
                icon={<Public fontSize='small' />}
                text='Contact Information'
            />
            <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} justifyContent='space-between' gap={2}>
                <RenderInput
                    id='email'
                    name='email'
                    label='Email *'
                    control={control}
                    rules={{
                        required: 'Please provide an email',
                        pattern: {
                            value: REGEX_EMAIL,
                            message: 'Please provide a valid email',
                        },
                    }}
                    placeholder='example@domain.com'
                    defaultValue={data[stepName]?.email || ''}
                    error={!!errors?.email}
                    helperText={errors?.email?.message}
                    inputAdornment={(
                        <InputAdornment position="start">
                            <MailOutline />
                        </InputAdornment>
                    )}
                />
                <RenderInput
                    id='phone'
                    name='phone'
                    label='Phone number *'
                    control={control}
                    rules={{
                        required: 'Please provide a phone number',
                    }}
                    placeholder='0000 000 000'
                    defaultValue={data[stepName]?.phone || ''}
                    error={!!errors?.phone}
                    helperText={errors?.phone?.message}
                    inputAdornment={(
                        <InputAdornment position="start">
                            <Phone />
                        </InputAdornment>
                    )}
                />
            </Box>
            <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} justifyContent='space-between' gap={2}>
                <CustomSelect
                    id='country'
                    name='country'
                    label='Country *'
                    control={control}
                    options={countries}
                    defaultValue={data[stepName]?.country || ''}
                    placeholder='Select your country'
                    boxProps={{ flex: 1 }}
                    optionRender={(option) => (<>
                        <img
                            loading="lazy"
                            width="20"
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            alt=""
                        />
                        {option.label} ({option.code})
                    </>)}
                    rules={{
                        required: 'Required *'
                    }}
                />
                <RenderInput
                    id='city'
                    name='city'
                    label='City *'
                    control={control}
                    rules={{
                        required: 'This field is required.',
                    }}
                    placeholder='I live in...'
                    defaultValue={data[stepName]?.city || ''}
                    error={!!errors?.city}
                    helperText={errors?.city?.message}
                    inputAdornment={(
                        <InputAdornment position="start">
                            <LocationCity />
                        </InputAdornment>
                    )}
                />
            </Box>
        </StepTemplate>
    )
}

