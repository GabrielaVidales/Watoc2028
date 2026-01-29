import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { AddBox, Article, FormatQuote } from '@mui/icons-material'
import FormSectionTitle from '../components/wizard registration/inputs/FormSectionTitle'
import { AnimatePresence, Reorder } from "motion/react"
import ReorderableItem from './ReorderableItem'
import { ControlledTextField } from './components/ControlledInputs'
import { useCallback, useMemo } from 'react'

// Este closure es para que al eliminar un elemento se bloquee por 500 ms
function createRemoveGuard(removeFn: (value: any) => void, delay = 500) {
    let locked = false;
    return (value: any) => {
        if (locked) return;
        locked = true;
        removeFn(value);
        setTimeout(() => {
            locked = false;
        }, delay);
    };
}

type Author = {
    name: string
    affiliation: string
}

type Reference = {
    text: string
}

type AbstractSubmissionInputs = {
    authors: Author[]
    references: Reference[]
}

export default function AbstractSubmissionForm() {
    const methods = useForm<AbstractSubmissionInputs>({
        defaultValues: {
            authors: [{
                name: '',
                affiliation: '',
            }],
            references: [{
                text: ''
            }]
        }
    })

    const handleOnSubmit = methods.handleSubmit(async (data) => {
        console.log(data)
    })

    //#region useArrayField para los autores
    const authorMethods = useFieldArray({
        control: methods.control,
        name: 'authors',
        rules: {
            required: 'At least one author is required',
        }
    })

    const onReorder = (newFields: FieldArrayWithId<AbstractSubmissionInputs, 'authors', 'id'>[]) => {
        const firstDiffIndex = authorMethods.fields.findIndex(
            (field, index) => field.id !== newFields[index].id,
        );
        if (firstDiffIndex !== -1) {
            const newIndex = newFields.findIndex(
                (field) => field.id === authorMethods.fields[firstDiffIndex].id,
            );
            authorMethods.swap(firstDiffIndex, newIndex);
        }
    }

    const onRemove = useMemo(() => createRemoveGuard((data) => {
        console.log(data);

        if (authorMethods.fields.length > 1) {
            authorMethods.remove(data)
        }
    }, 500), [authorMethods.remove, authorMethods.fields])
    //#endregion

    //#region useArrayField para almacenar las referencias
    const referencesArray = useFieldArray({
        control: methods.control,
        name: 'references',
        rules: { required: 'At least one reference is required', }
    })

    const onReorderReference = (newFields: FieldArrayWithId<AbstractSubmissionInputs, 'references', 'id'>[]) => {
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
    }, 500), [referencesArray.remove, referencesArray.fields])
    // #endregion

    return (
        <FormProvider {...methods}>
            <Stack spacing={2} component='form' onSubmit={handleOnSubmit}>
                <Button type='submit' > botón para testear funcioamiento</Button>

                <FormSectionTitle icon={<FormatQuote fontSize='small' />} text='Title' />

                <ControlledTextField
                    id='title' name='title'
                    label="Author's name *" maxLength={80}
                    rules={{
                        required: 'Required *',
                        maxLength: {
                            value: 64,
                            message: 'Too long',
                        },
                    }}
                />

                <Divider />

                <FormSectionTitle icon={<FormatQuote fontSize='small' />} text='Authors' />

                <Typography align='left'>
                    List all authors, including yourself. You can add multiple authors and reorder them as needed.
                </Typography>

                <Reorder.Group values={authorMethods.fields} onReorder={onReorder} style={{ padding: 0, }}>
                    <Box sx={{ pb: 2, display: 'flex', justifyContent: 'end', }}>
                        <Button variant='text' size='large' startIcon={<AddBox />} onClick={() => authorMethods.append({ name: '', affiliation: '' })}>
                            Add author
                        </Button>
                    </Box>
                    <AnimatePresence>
                        {authorMethods.fields.map((field, index) => (
                            <ReorderableItem
                                key={field.id} field={field}
                                index={index} onRemove={onRemove}
                                disableRemove={authorMethods.fields.length <= 1}
                            >
                                <ControlledTextField
                                    name={`authors.${index}.name`}
                                    id={`authors.${index}.name`}
                                    size='small' label={'Full name'}
                                    placeholder="Full name" maxLength={64}
                                    rules={{
                                        required: 'Required *',
                                        maxLength: {
                                            value: 64,
                                            message: 'Too long',
                                        },
                                    }}
                                />
                                <ControlledTextField
                                    id={`authors.${index}.affiliation`}
                                    name={`authors.${index}.affiliation`}
                                    size='small' label={'Affiliation'}
                                    placeholder="Affiliation" maxLength={40}
                                    rules={{
                                        required: 'Required *',
                                        maxLength: {
                                            value: 100,
                                            message: 'Too long',
                                        },
                                    }}
                                />
                            </ReorderableItem>
                        ))}
                    </AnimatePresence>
                </Reorder.Group>

                <Divider />

                <FormSectionTitle text='Abstract text' icon={<Article fontSize='small' />} />

                <ControlledTextField
                    id={`text`} name={'text'}
                    placeholder={loremIpsum} maxLength={2000}
                    multiline minRows={5} maxRows={20}
                    autoComplete='off' spellCheck={false}
                    rules={{
                        required: 'Required *',
                        maxLength: {
                            value: 2000,
                            message: 'Too long',
                        },
                    }}
                />


                <Divider />

                <FormSectionTitle text='References' icon={<Article fontSize='small' />} />

                <ControlledTextField
                    id={`ref`} name={'ref'}
                    maxLength={500}
                    multiline minRows={2} maxRows={20}
                    autoComplete='off' spellCheck={false}
                    rules={{
                        required: 'Required *',
                        maxLength: {
                            value: 2000,
                            message: 'Too long',
                        },
                    }}
                />
                {/*
                <Reorder.Group values={referencesArray.fields} onReorder={onReorderReference} style={{ padding: 0, }}>
                    <Box sx={{ pb: 2, display: 'flex', justifyContent: 'end', }}>
                        <Button variant='text' size='large' startIcon={<FormatQuote />} onClick={() => referencesArray.append({ text: '' })}>
                            Add reference
                        </Button>
                    </Box>
                    <AnimatePresence>
                        {referencesArray.fields.map((field, index) => (
                            <ReorderableItem
                                key={field.id} field={field}
                                index={index} onRemove={onRemoveReference}
                                disableRemove={referencesArray.fields.length <= 1}
                            >
                                <ControlledTextField
                                    id={`references.${index}.text`}
                                    name={`references.${index}.text`}
                                    size='small' placeholder="Full reference"
                                    rules={{
                                        required: 'Required *',
                                        maxLength: {
                                            value: 128,
                                            message: 'Too long',
                                        },
                                    }}
                                    maxLength={128} multiline
                                    minRows={1} maxRows={5}
                                    autoComplete='off' spellCheck={false}
                                />
                            </ReorderableItem>
                        ))}
                    </AnimatePresence>
                </Reorder.Group>
                */}
            </Stack>
        </FormProvider>
    )
}

const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel mauris ultrices, commodo dolor at, malesuada nisl.'
