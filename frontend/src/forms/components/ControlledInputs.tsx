import * as React from 'react';
import { Autocomplete, Box, Checkbox, CheckboxProps, FormControl, FormControlLabel, FormGroup, FormHelperText, Grow, InputLabel, MenuItem, Select, TextField, TextFieldProps, Typography } from '@mui/material';
import { Controller, FieldValues, Path, RegisterOptions, useFormContext } from 'react-hook-form';
import CustomTextField from '../../components/CustomTextField';

//#region Controlled Inputs
export interface BaseControlledProps {
    name: Path<FieldValues>;
    id: string | React.ReactNode;
    label?: string;
    rules?: Omit<RegisterOptions<FieldValues, string>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs">;
    defaultValue?: any;
}

type IControlledTextFieldProps = BaseControlledProps & TextFieldProps & {
    inputAdornment?: {
        startAdornment?: React.ReactNode,
        endAdornment?: React.ReactNode
    };
    maxLength?: number;
    hideLengthLabel?: boolean;
};

export const ControlledTextField = ({ label, name, id, defaultValue='', placeholder, rules, inputAdornment, maxLength, hideLengthLabel, ...props }: IControlledTextFieldProps) => {
    const { control } = useFormContext()

    return <Box flex={1}>
        {label && <InputLabel htmlFor={id} >{label}</InputLabel>}
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules ?? {
                required: 'Required *'
            }}
            render={({ field, fieldState: { error } }) => (
                <CustomTextField
                    {...field}
                    id={id}
                    fullWidth
                    maxLength={maxLength}
                    hideLengthLabel={hideLengthLabel}
                    placeholder={placeholder}
                    error={!!error}
                    helperText={error ? (<Grow in={!!error} timeout={500}><span>{error.message}</span></Grow>) : null}
                    onBlur={(event: any) => {
                        field.onChange(event.target.value.trim())
                        field.onBlur()
                    }}
                    slotProps={{
                        input: inputAdornment ?? {},

                        formHelperText: {
                            component: 'div'
                        }
                    }}
                    {...props}
                />
            )}
        />
    </Box>
};


export interface BaseOption {
    value: string | number
}

type IControlledAutocompleteProps<T extends BaseOption> = BaseControlledProps & Omit<TextFieldProps, 'name'> & {
    options: T[];
    optionRender: (option: T) => React.ReactNode;
    getOptionLabel: (option: T) => string;
    boxProps?: object;
};

export const ControlledSelect = <T extends BaseOption>({ label, name, id, defaultValue, placeholder, rules, options, optionRender, getOptionLabel, boxProps }: IControlledAutocompleteProps<T>) => {
    const { control } = useFormContext();

    return (
        <Box {...boxProps}>
            {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
            <Controller
                name={name}
                control={control}
                rules={rules ? rules : { required: 'Required *' }}
                defaultValue={defaultValue}
                render={({ field, fieldState }) => (
                    <Autocomplete
                        id={id}
                        options={options}
                        autoHighlight
                        getOptionLabel={getOptionLabel} //Este es lo que se muestra como elegido
                        value={
                            // Esto indica el valor que almacena el input para submit
                            options.find((c) => c.value === field.value) || null
                        }
                        onChange={(_, option) => {
                            // Eleva el evento onChange al del Controller
                            field.onChange(option ? option.value : null)
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

export const ControlledDropdown = <T extends BaseOption>({ label, name, id, defaultValue='', placeholder, rules, options, optionRender, boxProps }: IControlledAutocompleteProps<T>) => {
    const { control } = useFormContext();

    return (
        <Box {...boxProps}>
            {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
            <Controller
                name={name}
                control={control}
                rules={rules ?? { required: 'Required *' }}
                defaultValue={defaultValue}
                render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                        <Select
                            {...field}
                            labelId={`${id}-label`}
                            id={id}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                <em>{placeholder || 'Choose an option'}</em>
                            </MenuItem>
                            {options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {optionRender(option)}
                                </MenuItem>
                            ))}
                        </Select>
                        {fieldState.error && (
                            <FormHelperText>{fieldState.error.message}</FormHelperText>
                        )}
                    </FormControl>
                )}
            />
        </Box>
    );
};

type IControlledCheckBox = BaseControlledProps & CheckboxProps & {
    small?: boolean
};

export const ControlledCheckBox = ({ name, id, label, rules, small }: IControlledCheckBox) => {
    const { control } = useFormContext()

    return <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                <FormControlLabel
                    label={small ? <small>{label}</small> : label}
                    control={
                        <Checkbox
                            {...field}
                            id={id}
                            checked={!!field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                        />
                    }
                />
                {error && (
                    <Grow in={!!error}>
                        <FormHelperText error>
                            <Typography variant='caption' display='flex' gap={1} alignItems='center'>
                                {error.message}
                            </Typography>
                        </FormHelperText>
                    </Grow>
                )}
            </FormGroup>
        )}

    />
}
//#endregion