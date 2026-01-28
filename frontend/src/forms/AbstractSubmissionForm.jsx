import { Autocomplete, Box, Button, Chip, Divider, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import RenderInput from '../components/wizard registration/inputs/RenderInput'
import CustomTextField from '../components/CustomTextField'
import { Article, Clear, Delete, DeleteOutline, DragHandle, DriveFileRenameOutline, FormatQuote, People, PersonOutline } from '@mui/icons-material'
import FormSectionTitle from '../components/wizard registration/inputs/FormSectionTitle'
import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react"
import AuthorInfoInputs from './ReorderableItem'
import ReorderableItem from './ReorderableItem'

function createRemoveGuard(removeFn, delay = 500) {
    let locked = false;

    return (value) => {
        if (locked) return;

        locked = true;
        removeFn(value);

        setTimeout(() => {
            locked = false;
        }, delay);
    };
}

export default function AbstractSubmissionForm() {
    const { handleSubmit, formState: { errors }, control } = useForm({
        defaultValues: {
            authors: [
                {
                    name: '',
                    affiliation: '',
                }
            ],
            references: [
                {
                    text: ''
                }
            ]
        }
    })

    const onValidData = (data) => {
        console.log(data)
    }

    const onInvalidData = (data) => {
        console.log(data)
        console.log(errors);

    }

    //#region useArrayField para los autores
    const { append, remove, fields, swap } = useFieldArray({
        control,
        name: 'authors',
        rules: {
            required: 'At least one author is required',
        }
    })

    const onRemove = useMemo(() => createRemoveGuard((data) => {
        if (fields.length > 1) {
            remove(data)
        }
    }, 500), [remove, fields])

    const onReorder = (newFields) => {
        const firstDiffIndex = fields.findIndex(
            (field, index) => field.id !== newFields[index].id,
        );
        if (firstDiffIndex !== -1) {
            const newIndex = newFields.findIndex(
                (field) => field.id === fields[firstDiffIndex].id,
            );
            swap(firstDiffIndex, newIndex);
        }
    }
    //#endregion

    //#region useArrayField para almacenar las referencias
    const referencesArray = useFieldArray({
        control,
        name: 'references',
        rules: {
            required: 'At least one reference is required',
        }
    })

    const onReorderReference = (newFields) => {
        const firstDiffIndex = referencesArray.fields.findIndex(
            (field, index) => field.id !== newFields[index].id,
        );
        if (firstDiffIndex !== -1) {
            const newIndex = newFields.findIndex(
                (field) => field.id === referencesArray.fields[firstDiffIndex].id,
            );
            referencesArray.swap(firstDiffIndex, newIndex);
        }
    }

    const onRemoveReference = useMemo(() => createRemoveGuard((data) => {
        if (referencesArray.fields.length > 1) {
            referencesArray.remove(data)
        }
    }, 500), [referencesArray.fields, referencesArray.remove])
    // #endregion

    return (
        // <Paper className='d-flex flex-column h-100' elevation={7} sx={{ height: 630, borderTop: 12, borderColor: 'primary.main', padding: { xs: 2, sm: 3, md: 5 } }}>
            <Stack spacing={2} component='form' onSubmit={handleSubmit(onValidData, onInvalidData)}>
                <Button type='submit' >
                    botón para testear funcioamiento
                </Button>

                <FormSectionTitle
                    icon={<FormatQuote fontSize='small' />}
                    text='Title'
                />

                <RenderInput
                    control={control}
                    name={'title'}
                    id={`title`}
                    label="Author's name *"
                    placeholder='Max ten words'
                    rules={{
                        required: 'Required *',
                        maxLength: {
                            value: 64,
                            message: 'Too long',
                        },
                    }}
                    error={!!errors?.title}
                    helperText={errors?.title?.message}
                    InputComponent={CustomTextField}
                    maxLenght={64}
                />

                <Divider />

                <FormSectionTitle
                    icon={<FormatQuote fontSize='small' />}
                    text='Authors'
                />

                <Typography align='left' sx={{ px: 2, py: 1, }}>
                    List all authors, including yourself. You can add multiple authors and reorder them as needed.
                </Typography>

                <Paper elevation={2}>
                    <Reorder.Group values={fields} onReorder={onReorder} style={{
                        padding: 0,
                        overflow: 'hidden',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            px: 2, pb: 1,
                        }}>
                            <Button variant='contained' startIcon={<People />} sx={{ mt: 2 }} onClick={() => append({ name: '' })}>
                                Add author
                            </Button>
                        </Box>
                        <AnimatePresence>
                            {fields.map((field, index) => (
                                <ReorderableItem
                                    key={field.id}
                                    field={field}
                                    index={index}
                                    onRemove={onRemove}
                                    disableRemove={fields.length <= 1}
                                >
                                    <RenderInput
                                        size='small'
                                        control={control}
                                        name={`authors.${index}.name`}
                                        id={`authors.${index}.name`}
                                        placeholder="Full name"
                                        rules={{
                                            required: 'Required *',
                                            maxLength: {
                                                value: 64,
                                                message: 'Too long',
                                            },
                                        }}
                                        error={!!errors?.authors?.[index]?.name}
                                        helperText={errors?.authors?.[index]?.name?.message}
                                        InputComponent={CustomTextField}
                                        maxLenght={64}
                                        inputAdornment={(
                                            <InputAdornment position="start">
                                                <PersonOutline />
                                            </InputAdornment>
                                        )}
                                    >
                                    </RenderInput>
                                    <RenderInput
                                        size='small'
                                        control={control}
                                        name={`authors.${index}.affiliation`}
                                        id={`authors.${index}.affiliation`}
                                        placeholder='Affiliation'
                                        rules={{
                                            required: 'Required *',
                                            maxLength: {
                                                value: 100,
                                                message: 'Too long',
                                            },
                                        }}
                                        error={!!errors?.authors?.[index]?.affiliation}
                                        helperText={errors?.authors?.[index]?.affiliation?.message}
                                        InputComponent={CustomTextField}
                                        maxLenght={40}
                                    />
                                </ReorderableItem>
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                </Paper>

                <Divider />

                <FormSectionTitle
                    text='Abstract text'
                    icon={<Article fontSize='small' />}
                />

                <RenderInput
                    control={control}
                    name={'text'}
                    id={`text`}
                    placeholder={loremIpsum}
                    rules={{
                        required: 'Required *',
                        maxLength: {
                            value: 2000,
                            message: 'Too long',
                        },
                    }}
                    error={!!errors?.text}
                    helperText={errors?.text?.message}
                    InputComponent={CustomTextField}
                    maxLenght={2000}
                    multiline
                    minRows={5}
                    maxRows={20}
                    autoComplete='off'
                    spellCheck={false}
                >
                </RenderInput>

                <Divider />

                <FormSectionTitle
                    text='References'
                    icon={<Article fontSize='small' />}
                />

                <Paper elevation={2}>
                    <Reorder.Group values={referencesArray.fields} onReorder={onReorderReference} style={{
                        padding: 0,
                        overflow: 'hidden',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            px: 2, pb: 1,
                        }}>
                            <Button variant='contained' startIcon={<FormatQuote />} sx={{ mt: 2 }} onClick={() => referencesArray.append({ text: '' })}>
                                Add reference
                            </Button>
                        </Box>
                        <AnimatePresence>
                            {referencesArray.fields.map((field, index) => (
                                <ReorderableItem
                                    key={field.id}
                                    field={field}
                                    index={index}
                                    onRemove={onRemoveReference}
                                    disableRemove={referencesArray.fields.length <= 1}
                                >
                                    <RenderInput
                                        size='small'
                                        control={control}
                                        name={`references.${index}.text`}
                                        id={`references.${index}.text`}
                                        placeholder="Full reference"
                                        rules={{
                                            required: 'Required *',
                                            maxLength: {
                                                value: 128,
                                                message: 'Too long',
                                            },
                                        }}
                                        error={!!errors?.references?.[index]?.text}
                                        helperText={errors?.references?.[index]?.text?.message}
                                        InputComponent={CustomTextField}
                                        maxLenght={128}
                                        multiline
                                        minRows={1}
                                        maxRows={2}
                                        autoComplete='off'
                                        spellCheck={false}
                                    >
                                    </RenderInput>
                                </ReorderableItem>
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                </Paper>
            </Stack>
        // </Paper>
    )
}


const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel mauris ultrices, commodo dolor at, malesuada nisl. Proin quis augue eu magna venenatis convallis ut ac eros. Vivamus sit amet bibendum arcu. Nam quis ultrices turpis. Praesent tincidunt molestie urna, nec euismod nisi ultricies quis. Aliquam feugiat turpis tellus. Sed ornare aliquam imperdiet. Vivamus elit urna, rutrum in congue a, sagittis at lectus.'
