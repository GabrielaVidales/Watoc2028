import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, Grow, InputLabel } from '@mui/material'
import { useEffect } from 'react'
import { Controller } from 'react-hook-form'

export default function RenderCheckbox({
    name,
    label,
    control,
    defaultValue = false,
    rules = null,
    error = false,
    helperText = '',
    boxProps = { flex: 1 },
    ...props
}) {
    useEffect(() => {
        console.log(helperText);
        console.log(error);
    }, [helperText, error])
    return (
        <Box {...boxProps}>
            {label && <InputLabel>­</InputLabel>}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                rules={rules}
                render={({ field: { value, onChange, ...field } }) => (
                    <FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...field}
                                    size='large'
                                    checked={value}
                                    onChange={(e) => onChange(e.target.checked)}
                                    color={error ? 'error' : 'primary'}
                                    {...props}
                                />
                            }
                            label={label}
                        />
                        {helperText && (
                            <FormHelperText error={error}>
                                <Grow in={error} timeout={500}>
                                    <span>{helperText}</span>
                                </Grow>
                            </FormHelperText>
                        )}
                    </FormControl>
                )}
            />
        </Box>
    )
}