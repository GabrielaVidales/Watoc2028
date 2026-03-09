import { Box, Button, Divider, InputAdornment, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { Lock, Mail, Person } from '@mui/icons-material';
import FormSectionTitle from '../../components/wizard registration/inputs/FormSectionTitle';
import { REGEX_EMAIL, REGEX_NAME } from '../../utils/formRegex';
import { countries } from '../../utils/countriesInfo';
import axiosClient from '../../clients/axiosClient';
import { ControlledCheckBox, ControlledSelect, ControlledTextField } from '../components/ControlledInputs';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { AxiosError } from 'axios';

export interface IUserRegisterFormProps { }

export default function UserRegisterForm({ }: IUserRegisterFormProps) {
    const { handleLogin } = useAuth()
    const navigate = useNavigate()
    const methods = useForm({
        mode: 'onChange'
    })

    const debugData = {
        prefix: "Prof.",
        first_name: "José",
        middle_name: "Gabriel",
        last_name: "Merino",
        email: "gabrielmerino@gmail.com",
        nationality: "MX",
        city: "Mérida",
        affiliation: "Cinvestav",
        affiliation_department: "Física aplicada",
        password: "Admin123#",
        accept_terms: true,
        confirm_password: "Admin123#",
    }

    const handleDebugData = () => {
        methods.reset(debugData)
    }

    const onSubmit = methods.handleSubmit(async (data) => {
        const affiliation = data['affiliation']
        const affiliation_department = data['affiliation_department']
        const preparedData = {
            ...data,
            participant_profile: {
                affiliation,
                affiliation_department,
            }
        }
        if (import.meta.env.DEV) {
            console.log(preparedData);
        }
        try {
            const res = await axiosClient.post('register/', preparedData)
            console.log(res);
            
            await handleLogin(data.email, data.password)

            navigate('/success', { replace: true, })
        } catch (error) {
            const axiosErr = error as AxiosError
            const backendErrors: any = axiosErr?.response?.data

            Object.keys(backendErrors).forEach((field, index) => {
                methods.setError(field, {
                    type: "server",
                    message: backendErrors[field][0],
                });

                if (index === 0) {
                    setTimeout(() => {
                        methods.setFocus(field);
                    }, 10);
                }
            });

            if (import.meta.env.DEV) {
                console.error(error);
            }
        }
    })

    return (
        <FormProvider {...methods}>
            <Paper elevation={5} sx={{ py: 6, px: { xs: 3, sm: 6, md: 9 }, borderTop: 12, borderColor: 'primary.main', }}>
                <Box component='fieldset' disabled={methods.formState.isSubmitting}>

                    {import.meta.env.DEV && (
                        <Button fullWidth onClick={handleDebugData}>Debug data</Button>
                    )}

                    <TitleSection />
                    <hr />
                    <PersonalInfo />
                    <hr />
                    <ContactInfo />
                    <hr />
                    <AffiliationInfo />
                    <hr />
                    <PasswordInfo />
                    <hr />
                    <Box display='flex' flex={1} justifyContent='flex-end'>
                        <Button variant='contained' onClick={onSubmit} loading={methods.formState.isSubmitting} size='large' >
                            Create Account & Express Interest
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </FormProvider>
    );
}

const TitleSection = () => {
    return (<>
        <Box textAlign="center" mb={3} >
            <Typography variant="overline" color="primary" fontWeight="bold"
                sx={{ fontSize: '1rem', letterSpacing: 2 }}
            >
                Join us in Mérida!
            </Typography>
            <Typography variant="h3" fontWeight="bold"
                sx={{
                    mt: 1,
                    mb: 2,
                    fontSize: { xs: '1.7rem', md: '2.5rem' },
                }}
            >
                Express Your Interest for WATOC 2028
            </Typography>
            <Box sx={{
                width: 100,
                height: 4,
                bgcolor: 'primary.main',
                mx: 'auto',
                borderRadius: 2,
            }} />
        </Box>
        <Typography gutterBottom>
            We are thrilled to begin preparations for the <b>14th Triennial Congress of the WATOC 2028</b>.
            While the full registration system is not yet open, we invite you to sign up below to stay informed. By registering your interest, you will be the first to receive:
        </Typography>
        <Divider />
        <ul>
            <li>
                Important deadlines for abstract submission.
            </li>
            <li>
                Early-bird registration alerts.
            </li>
            <li>
                Updates on congress speakers and the scientific program.
            </li>
            <li>
                Travel and accommodation tips for visiting the Yucatán Peninsula.
            </li>
        </ul>
    </>)
}

const PersonalInfo = () => {
    const prefixOptions = [
        { value: 'Mr.', label: 'Mr.' },
        { value: 'Mrs.', label: 'Mrs.' },
        { value: 'Ms.', label: 'Ms.' },
        { value: 'Miss', label: 'Miss' },
        { value: 'Dr.', label: 'Doctor' },
        { value: 'Prof.', label: 'Professor' },
        { value: 'Mx.', label: 'Mx.' }
    ];

    return <>
        <Stack spacing={2} py={2}>
            <FormSectionTitle
                text='Personal Information'
                icon={<Person />}
            />
            <ControlledSelect
                id='prefix'
                name='prefix'
                label='Prefix *'
                defaultValue=''
                placeholder='Select your title'
                options={prefixOptions}
                rules={{ required: 'Required *' }}
                getOptionLabel={option => (`${option.value} (${option.label})`)}
                optionRender={option => (`${option.value} (${option.label})`)}
            />
            <Box display='flex' gap={2}>
                <ControlledTextField
                    id='first_name'
                    name='first_name'
                    label='First Name *'
                    rules={{
                        required: 'Required *',
                        pattern: { value: REGEX_NAME, message: 'Invalid name', },
                        maxLength: { value: 50, message: 'Too long' }
                    }}
                    maxLength={50}
                    hideLengthLabel
                />

                <ControlledTextField
                    id='middle_name'
                    name='middle_name'
                    label='Middle Name'
                    rules={{
                        pattern: { value: REGEX_NAME, message: 'Invalid name', },
                        maxLength: { value: 50, message: 'Too long' }
                    }}
                    maxLength={50}
                    hideLengthLabel
                />
            </Box>
            <ControlledTextField
                id='last_name'
                name='last_name'
                label='Last Name *'
                rules={{
                    required: 'Required *',
                    pattern: { value: REGEX_NAME, message: 'Invalid name', },
                    maxLength: { value: 50, message: 'Too long' }
                }}
                maxLength={50}
                hideLengthLabel
            />
        </Stack>
    </>
}

const ContactInfo = () => {
    ['email', 'country', 'city']

    return <>
        <Stack spacing={2} py={2}>
            <FormSectionTitle
                text='Contact Information'
                icon={<Person />}
            />

            <ControlledTextField
                defaultValue=''
                id='email'
                name='email'
                label='Email *'
                rules={{
                    required: 'Please provide an email',
                    pattern: {
                        value: REGEX_EMAIL,
                        message: 'Please provide a valid email',
                    },
                }}
                inputAdornment={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <Mail />
                        </InputAdornment>
                    )
                }}
                hideLengthLabel
                maxLength={50}
            />
            <ControlledSelect
                id='nationality'
                name='nationality'
                label='Select your country *'
                options={countries}
                rules={{ required: 'Required *' }}
                getOptionLabel={option => (`${option.label} (${option.value})`)}
                optionRender={(option) => (<>
                    <img
                        loading="lazy"
                        width="20"
                        srcSet={`https://flagcdn.com/w40/${option.value.toString().toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.value.toString().toLowerCase()}.png`}
                        alt=""
                    />
                    {option.label} ({option.value})
                </>)}
            />
            <ControlledTextField
                defaultValue=''
                id='city'
                name='city'
                label='City *'
                rules={{ required: 'Required *' }}
                hideLengthLabel
            />
        </Stack>
    </>
}

const AffiliationInfo = () => {
    return <>
        <Stack spacing={2} py={2}>
            <FormSectionTitle
                text='Affiliation Information'
                icon={<Lock />}
            />
            <ControlledTextField
                id='affiliation'
                name='affiliation'
                label='Affiliation *'
                rules={{ required: 'Required *', }}
                maxLength={128}
                hideLengthLabel
            />
            <ControlledTextField
                id='affiliation_department'
                name='affiliation_department'
                label='Department *'
                rules={{ required: 'Required *', }}
                maxLength={128}
                hideLengthLabel
            />

        </Stack>
    </>
}

const PasswordInfo = () => {
    const { control, getValues } = useFormContext()

    return <>
        <Stack spacing={2} py={2}>
            <FormSectionTitle
                text='Security'
                icon={<Lock />}
            />
            <PasswordStrengthMeter control={control} />
            <ControlledTextField
                id='password'
                name='password'
                label='Password *'
                placeholder='Create password'
                rules={{
                    required: 'Required *',
                    validate: (value) => getPasswordStrength(value) > 3 || 'At least 10 characters, including an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&)'
                }}
                maxLength={128}
                hideLengthLabel
                type='password'
                inputAdornment={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <Lock />
                        </InputAdornment>
                    )
                }}
            />
            <ControlledTextField
                id='confirm_password'
                name='confirm_password'
                label='Confirm password *'
                placeholder='Confirm password'
                rules={{
                    required: 'Required *',
                    validate: (value) => (value === getValues("password") || "The passwords does not match")
                }}
                maxLength={128}
                hideLengthLabel
                type='password'
                inputAdornment={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <Lock />
                        </InputAdornment>
                    )
                }}
            />
            <Box>
                <ControlledCheckBox
                    id='acceptTerms'
                    name='acceptTerms'
                    rules={{ required: 'Required *' }}
                    label='I accept the Terms and Conditions *'
                    small
                />
            </Box>
        </Stack>
    </>
}

const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
};

const PasswordStrengthMeter = ({ control }: { control: any }) => {
    const password = useWatch({ control, name: "password", defaultValue: "" });
    const score = getPasswordStrength(password);

    const config = [
        { color: 'error', label: 'Very weak', value: 20 },
        { color: 'error', label: 'Weak', value: 40 },
        { color: 'warning', label: 'Medium', value: 60 },
        { color: 'info', label: 'Strong', value: 80 },
        { color: 'success', label: 'Very strong', value: 100 },
    ];

    const current = config[score - 1] || { color: 'inherit', label: '', value: 0 };

    return (
        <Box sx={{ mt: 1, mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption">Password Strength</Typography>
                <Typography variant="caption" fontWeight="bold" color={`${current.color}.main`}>
                    {current.label}
                </Typography>
            </Stack>
            <LinearProgress
                variant="determinate"
                value={current.value}
                color={current.color as any}
                sx={{ height: 6, borderRadius: 3 }}
            />
        </Box>
    );
};