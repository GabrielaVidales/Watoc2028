import { Avatar, Box, Divider, Typography } from '@mui/material'
import React from 'react'

export default function FormSectionTitle({ icon, text }) {
    return (
        <Box display='flex' alignItems='center' gap={1.5} sx={{ border: 2, borderColor: '#adadad', borderTop:0, borderLeft:0, borderRight:0, pb:1}}>
            <Avatar sx={{ bgcolor: 'primary.main', height: 'auto', width: 35, aspectRatio: '1 / 1' }}>
                {icon}
            </Avatar>
            <Typography variant='h6' fontWeight='bold'>
                {text}
            </Typography>
        </Box>
    )
}
