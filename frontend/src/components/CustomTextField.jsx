import { ErrorOutline } from '@mui/icons-material'
import { Box, FormHelperText, InputAdornment, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

export default function CustomTextField({ value, onChange, maxLenght = 64, hideLengthLabel = false, multiline = false, error = false, helperText = null, ...props }) {
    const textFieldRef = useRef()

    const handleOnChange = (evt) => {
        if (evt.target.value.length <= maxLenght) {
            onChange?.(evt)
        }
    }

    const setValueColor = () => (
        value.length === maxLenght
            ? 'error.main'
            : value.length >= Math.floor(maxLenght * 0.75)
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
                    <Typography variant="caption">
                        {helperText && <>
                            <ErrorOutline fontSize='small' /> {helperText}
                        </>}
                    </Typography>

                    {!hideLengthLabel && (
                        <Typography
                            variant="caption"
                            sx={{ color: setValueColor() }}
                        >
                            {value.length}/{maxLenght}
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
