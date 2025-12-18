import { Box, Container, Stack } from '@mui/material'
import React, { Children } from 'react'

const GenericCTASection = ({ maxWidth = "md", spacing=3, alignItems="center", textAlign="center", children }) => (
    <Box
        component="section"
        sx={{
            py: { xs: 6, md: 8 },
            px: { xs: 2, sm: 3, md: 10, lg: 15 },
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
        }}
    >
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.5,
                backgroundImage: 'url(/field.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        />

        <Container maxWidth={maxWidth} sx={{ position: 'relative', zIndex: 1 }}>
            <Stack spacing={spacing} alignItems={alignItems} textAlign={textAlign}>
                {children}
            </Stack>
        </Container>
    </Box>
)

export default GenericCTASection