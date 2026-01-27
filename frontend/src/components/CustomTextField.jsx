import { ErrorOutline } from '@mui/icons-material'
import { Box, TextField, Typography } from '@mui/material'
import { useRef } from 'react'

export default function CustomTextField({ value, onChange, maxLength = 64, hideLengthLabel = false, multiline = false, error = false, helperText, ...props }) {
    const textFieldRef = useRef()

    const handleOnChange = (evt) => {
        if (evt.target.value.length <= maxLength) {
            onChange?.(evt)
        }
    }

    const setValueColor = () => (
        value.length === maxLength
            ? 'error.main'
            : value.length >= Math.floor(maxLength * 0.75)
                ? '#ff8800ff'
                : 'text.secondary'
    )

    return (
        <TextField
            ref={textFieldRef}
            value={value}
            onChange={handleOnChange}
            fullWidth
            multiline={multiline}
            error={error}
            helperText={
                <Box
                    component='span'
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="small" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {helperText && (
                            <>
                                <ErrorOutline sx={{ fontSize: 'inherit' }} />
                                {helperText}
                            </>
                        )}
                    </Typography>

                    {!hideLengthLabel && (
                        <Typography
                            variant="caption"
                            sx={{ color: setValueColor() }}
                        >
                            {value.length}/{maxLength}
                        </Typography>
                    )}
                </Box>
            }
            slotProps={{
                formHelperText: {
                    component: 'div'
                }
            }}
            sx={{ flex: 1 }}
            {...props}
        />
    )
}
