import { Box, FormControl, FormControlLabel, FormHelperText, Grow, InputAdornment, InputLabel, Paper, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { MailOutline, School } from '@mui/icons-material'
import StepTemplate from './StepTemplate'
import RenderInput from '../inputs/RenderInput'
import FormSectionTitle from '../inputs/FormSectionTitle'
import RenderCheckbox from '../inputs/RenderCheckbox'

export default function SecondStep({ data = {}, stepName = '_', onNext = null, onBack = null }) {
    const { handleSubmit, formState: { errors }, control, getValues } = useForm()

    const onValidData = (data) => {
        onNext?.(data, stepName)
    }

    const onCurrentData = () => {
        console.log('Get values');
        console.log(getValues());
        onBack?.(getValues(), stepName)
    }

    return (
        <StepTemplate onBack={onCurrentData} onSubmit={handleSubmit(onValidData)}>
            <FormSectionTitle
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
        </StepTemplate>
    )
}
