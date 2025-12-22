import { Box, Button, Grow, InputAdornment, InputLabel, Stack, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from '../../CustomTextField'
import { REGEX_EMAIL, REGEX_NAME } from '../../../utils/formRegex'
import { ContactEmergency, MailOutline } from '@mui/icons-material'

export default function StepTemplate({ children = null, onSubmit = null, onBack = null, stepActions = null }) {
    return (
        <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
        }}
        >
            <Box
                component="form"
                onSubmit={onSubmit}
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    minHeight: 0,
                    p: 3,
                }}
            >
                <Stack spacing={2}>
                    {children}
                </Stack>
            </Box>
            <Box sx={{
                p: 3,
                mt: 'auto',
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
            }}
            >
                {stepActions ?? (
                    <>
                        <Button variant="outlined" onClick={onBack}>Back</Button>
                        <Button variant="contained" onClick={onSubmit}>Next</Button>
                    </>
                )}
            </Box>
        </Box>
    )
}
