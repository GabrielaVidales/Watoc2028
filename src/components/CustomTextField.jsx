import { Box, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

export default function CustomTextField({ value, onChange, maxLenght = 64, multiline=false, error = false, helperText = null, ...props }) {
    const [height, setHeight] = useState(0)
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

    const helperTextHeight = error ? 25+8 : 3

    const calculateHeight = () => {
        if (textFieldRef.current) {
            const rows = Math.floor(textFieldRef.current.scrollHeight );
            setHeight(rows * lineHeight);
        }
    }

    useEffect(()=>{
        calculateHeight()
    }, [value, multiline])

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            <TextField
                ref={textFieldRef}
                value={value}
                onChange={handleOnChange}
                fullWidth
                multiline={multiline}
                error={error}
                helperText={helperText}
                sx={{ flex: 1 }}
                {...props}
            />
            <Typography
                position='relative'
                variant='caption'
                color={setValueColor()}
                sx={{
                    position: 'absolute',
                    transition: 'all 0.5s ease, bottom 0s',
                    bottom: height + helperTextHeight,
                    right: 18,
                }}
            >
                {`${value.length}/${maxLenght}`}
            </Typography>
        </Box >
    )
}
