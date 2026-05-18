import { Box, Grow, TextField, Typography } from '@mui/material'
import { AlertCircle } from 'lucide-react'


export default function CustomTextField({ value, label, onChange, maxLength = 64, hideLengthLabel = false, multiline = false, error = false, helperText, ref, ...props }) {
    const handleOnChange = (evt) => {
        if (evt.target.value.length <= maxLength) {
            onChange?.(evt)
        }
    }

    const setValueColor = () => (
        error ? 'error.main' : value.length === maxLength
            ? 'error.main' : value.length >= Math.floor(maxLength * 0.75)
                ? '#ff8800ff' : 'text.secondary'
    )

    return (
        <TextField
            inputRef={ref}
            value={value}
            onChange={handleOnChange}
            fullWidth
            label={label}
            hiddenLabel={!label}
            size='small'
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
                        {helperText && error && (
                            <Grow in={error} timeout={500}>
                                <small style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <AlertCircle sx={{ fontSize: '1rem' }} />
                                    {helperText}
                                </small>
                            </Grow>
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
