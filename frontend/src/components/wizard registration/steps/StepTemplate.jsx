import { Box, Button, Stack } from '@mui/material'

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
