import { Autocomplete, Box, Grow, InputLabel, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'

export default function CustomSelect({
    name,
    id,
    control,
    options = [],
    label = '',
    defaultValue = '',
    placeholder = '',
    rules = null,
    getOptionLabel = (option) => option.label,
    optionRender = (option) => (`${option.code} (${option.label})`),
    boxProps = {}
}) {
    return (
        <Box {...boxProps}>
            {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
            <Controller
                name={name}
                control={control}
                rules={rules ? rules : {
                    required: 'Required *'
                }}
                defaultValue={defaultValue}
                render={({ field, fieldState }) => (
                    <Autocomplete
                        id={id}
                        options={options}
                        autoHighlight
                        getOptionLabel={getOptionLabel} //Este es lo que se muestra como elegido
                        value={
                            // Esto indica el valor que almacena el input para submit
                            options.find(c => c.code === field.value) || null
                        }
                        onChange={(_, option) => {
                            // Eleva el evento onChange al del Controller
                            field.onChange(option ? option.code : null)
                        }}
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            return (
                                <Box
                                    key={key}
                                    component="li"
                                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                    {...optionProps}
                                >
                                    {optionRender(option)}
                                </Box>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                placeholder={placeholder}
                                error={!!fieldState.error}
                                helperText={
                                    fieldState.error?.message &&
                                    <Grow in={!!fieldState.error} timeout={500}>
                                        <span>{fieldState.error?.message}</span>
                                    </Grow>
                                }
                                slotProps={{
                                    htmlInput: {
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                    },
                                }}
                            />
                        )}
                    />
                )}
            />
        </Box>
    );
}