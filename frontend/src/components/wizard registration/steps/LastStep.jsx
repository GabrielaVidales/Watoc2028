import { Box, Button, Stack } from '@mui/material'
import React from 'react'

export default function LastStep({ stepName = 'lastStep', onBack = null, onReset = null }) {

    const handleOnBack = () => {
        onBack?.(null, stepName)
    }

    return (
        <>
            <Box sx={{ flex: 1 }} />
            <Stack spacing={3}>
                <Box className='d-flex justify-content-end gap-2 px-2 px-sm-4 border-top pt-3'>
                    <Button type='submit' variant='outlined' onClick={handleOnBack} >
                        Back
                    </Button>
                    <Button type='submit' variant='contained' onClick={onReset} >
                        Reset
                    </Button>
                </Box>
            </Stack>
        </>
    )
}
