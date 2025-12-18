import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react'

const FeatureCard = ({ icon: Icon, text, title = null, label = null, color }) => (
    <Card
        elevation={0}
        sx={{
            height: '100%',
            bgcolor: 'transparent',
            border: '2px solid',
            borderColor: 'divider',
            transition: 'all 0.3s ease',
            '&:hover': {
                borderColor: color || 'primary.main',
                transform: 'translateY(-4px)',
                bgcolor: `${color || 'primary.main'}08`,
                '& .feature-icon': {
                    transform: 'scale(1.15)',
                    color: color || 'primary.main',
                },
            },
        }}
    >
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Box
                className="feature-icon"
                sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: `${color || 'primary.main'}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    transition: 'all 0.3s ease',
                }}
            >
                {Icon && <Icon sx={{ fontSize: 28, color: color || 'primary.main' }} />}
            </Box>
            {title && <>
                <Typography variant="h5" fontWeight="600" color="text.primary">
                    {title}
                </Typography>
            </>}
            {label && <>
                <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
                    {label}
                </Typography>
            </>}
            <Typography variant="body2" fontWeight="600" color="text.primary">
                {text}
            </Typography>
        </CardContent>
    </Card>
);

export default FeatureCard