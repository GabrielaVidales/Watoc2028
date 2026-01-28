import { Dehaze, DeleteOutline, DragHandle, PersonOutline } from '@mui/icons-material'
import { Box, IconButton, InputAdornment, Stack, Tooltip } from '@mui/material'
import { Reorder, transform, useDragControls } from 'motion/react'
import React, { useState } from 'react'
import RenderInput from '../components/wizard registration/inputs/RenderInput'
import CustomTextField from '../components/CustomTextField'

export default function ReorderableItem({ field, index, children, onRemove, disableRemove = false }) {
    const dragControls = useDragControls()
    const [style, setStyle] = useState({})

    const handlePointerUp = () => {
        dragControls.stop()
        setStyle({
            zIndex: 0,
            transform: 'translateY(0)',
            backgroundColor: '#fff',
        })
    }
    
    const handlePointerDown = (event) => {
        dragControls.start(event)
        setStyle({
            zIndex: 1,
            transform: 'translateY(-6px)',
            backgroundColor: '#eeefffff',
        })
    }

    return (
        <Reorder.Item
            key={field.id}
            value={field}

            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "tween", duration: 0.3, ease: 'easeOut' }}

            dragListener={false}
            dragControls={dragControls}
            onDragEnd={handlePointerUp}
            onPointerUp={handlePointerUp}
            style={{
                position: 'relative',
                listStyle: 'none',
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: { xs: 'start', sm: 'start' },
                justifyContent: 'space-between',
                flexDirection: { xs: 'row', sm: 'row' },
                gap: { xs: 2, sm: 2 },
                px: 2,
                py: 1,
                transition: 'backgroundColor 0.2s ease-out, transform 0.2s ease-out',
                ...style
            }}>

                <IconButton onPointerDown={handlePointerDown} sx={{
                    cursor: 'grab',
                    touchAction: 'none',
                }}>
                    <Dehaze fontSize='medium' />
                </IconButton>

                <Box display={'flex'} alignItems={'center'} flex={1} gap={{ xs: 0, sm: 2 }} flexDirection={{ xs: 'column', sm: 'row' }}>
                    {children}
                </Box>

                <Tooltip title={disableRemove && "At least one author is required"} disableInteractive>
                    {disableRemove ? (<span>
                        <IconButton onClick={() => onRemove(index)} color='black' disabled={disableRemove}>
                            <DeleteOutline fontSize='medium' />
                        </IconButton>
                    </span>) : (
                        <IconButton onClick={() => onRemove(index)} color='black' disabled={disableRemove}>
                            <DeleteOutline fontSize='medium' />
                        </IconButton>
                    )}
                </Tooltip>
            </Box>
        </Reorder.Item >
    )
}
