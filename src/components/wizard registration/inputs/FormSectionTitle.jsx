import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'

export default function FormSectionTitle({icon, text}) {
    return (
        <Box display='flex' alignItems='center' gap={1.5}>
            <Avatar sx={{ bgcolor: 'primary.light', height: 'auto', width: 35, aspectRatio: '1 / 1' }}>
                {icon}
            </Avatar>
            <Typography variant='h6' fontWeight='bold'>
                {text}
            </Typography>
        </Box>
    )
}
