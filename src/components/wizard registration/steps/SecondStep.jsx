import { Box, FormControl, FormControlLabel, FormHelperText, Grow, InputAdornment, InputLabel, Paper, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { MailOutline } from '@mui/icons-material'
import StepTemplate from './StepTemplate'
import RenderInput from '../inputs/RenderInput'

const Category = ({ data, control, errors }) => {
    return (
        <FormControl component='fieldset'>
            <Controller
                name="category"
                control={control}
                defaultValue={data?.category || ''}
                rules={{
                    required: 'Please choose one option.'
                }}
                render={({ field }) => (
                    <>
                        <FormControl error={!!errors?.category} >
                            <RadioGroup {...field} >
                                <FormControlLabel
                                    value='participant'
                                    control={<Radio />}
                                    label={
                                        <Typography>Participant</Typography>
                                    }
                                />
                                <FormControlLabel
                                    value='student'
                                    control={<Radio />}
                                    label={
                                        <Typography>Student</Typography>
                                    }
                                />
                            </RadioGroup>
                            <FormHelperText>
                                <Grow in={!!errors?.category} timeout={500}>
                                    <span>
                                        {errors?.category?.message}
                                    </span>
                                </Grow>
                            </FormHelperText>
                        </FormControl>
                    </>
                )}
            />
        </FormControl>
    )
}

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
            <Typography variant='h5'>
                Category
            </Typography>

            <Category control={control} errors={errors} data={data[stepName]} />
        </StepTemplate>
    )
}
