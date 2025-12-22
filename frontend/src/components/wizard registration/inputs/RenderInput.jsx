import { Box, Grow, InputLabel, TextField } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'

export default function RenderInput({
    name,
    label,
    id,
    control,
    placeholder = '',
    defaultValue = '',
    rules = null,
    error,
    helperText = '',
    InputComponent = TextField,
    inputAdornment = null,
    ...props
}) {
    return (
        <Box flex={1}>
            {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                rules={rules}
                render={({ field }) => (
                    <InputComponent
                        {...field}
                        onBlur={(event) => {
                            // cuando se quita el focus se trimea el valor
                            field.onChange(event.currentTarget.value.trim())
                        }}
                        id={id}
                        fullWidth
                        placeholder={placeholder}
                        slotProps={inputAdornment && {
                            input: {
                                startAdornment: (
                                    inputAdornment
                                )
                            }
                        }}
                        error={error}
                        helperText={helperText &&
                            <Grow in={error} timeout={500}>
                                <span>{helperText}</span>
                            </Grow>
                        }
                        {...props}
                    />
                )}
            />
        </Box>
    )
}