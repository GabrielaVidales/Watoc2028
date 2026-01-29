import { BorderStyle, Dehaze, DeleteOutline, DragHandle, DragIndicator, PersonOutline } from '@mui/icons-material'
import { Box, IconButton, InputAdornment, Paper, Stack, Tooltip } from '@mui/material'
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
            <Paper elevation={2} variant='outlined' sx={{
                mb: 2,
                borderRadius: 3,
                borderWidth: 'medium',
                borderStyle: 'dashed',
                backgroundColor: 'rgb(248, 249, 255)',
                ...style
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: { xs: 'start', sm: 'start' },
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'row', sm: 'row' },
                    transition: 'backgroundColor 0.2s ease-out, transform 0.2s ease-out',
                    pt: 2, pb: 1,
                }}>

                    <IconButton size='large' onPointerDown={handlePointerDown} sx={{
                        cursor: 'grab',
                        touchAction: 'none',
                    }}>
                        <DragIndicator fontSize='medium' />
                    </IconButton>

                    <Box display={'flex'} alignItems={'center'} flex={1} gap={{ xs: 0, sm: 1 }} flexDirection={{ xs: 'column', sm: 'row' }}>
                        {children}
                    </Box>
                    <Box display={'flex'} alignSelf={'center'}>
                        <Tooltip title={disableRemove && "At least one author is required"} disableInteractive>
                            {disableRemove ? (<span>
                                <IconButton size='large' onClick={() => { onRemove(index); console.log('000') }} color='black' disabled={disableRemove}>
                                    <DeleteOutline fontSize='medium' />
                                </IconButton>
                            </span>) : (
                                <IconButton size='large' onClick={() => { onRemove(index); console.log('010') }} color='black' disabled={disableRemove}>
                                    <DeleteOutline fontSize='medium' />
                                </IconButton>
                            )}
                        </Tooltip>
                    </Box>

                </Box>
            </Paper>
        </Reorder.Item >
    )
}
