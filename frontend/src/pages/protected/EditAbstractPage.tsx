import { useFetch } from '@/hooks/use-fetch'
import { abstractSchema, type AbstractSchema, type AuthorAffiliationSchema, type AuthorSchema } from '@/schemas/abstract-schemas'
import React, { useCallback, useEffect, useEffectEvent, useState } from 'react'
import { useParams } from 'react-router'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InfoAlert } from './CreateAbstractPage'
import AbstractForm from '@/forms/AbstractForm'
import { ChevronsLeft, ChevronsRight, CircleX, GripVertical, Hand, Menu, Pen, PencilLine, Plus, Space, SquarePen, Trash } from 'lucide-react'
import AuthorForm from '@/forms/AuthorForm'
import { DataTable } from '@/components/ui/data-table'
import { authorColumns } from '@/data/authors-columns'
import AbstractDeclarations from '@/forms/AbstractDeclarationsForm'
import { StepperLabel } from '@/components/ui/stepper'
import { Reorder } from 'motion/react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axiosClient from '@/clients/axiosClient'
import { isAxiosError } from 'axios'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import BeforeSubmitPage from './BeforeSubmitPage'


function EditAbstractPage() {
    const { id } = useParams()
    const { data, fetchData } = useFetch<AbstractSchema>(`/abstracts/${id}/`)
    const { data: authors, setData: setAuthors, fetchData: fetchAuthors } = useFetch<AuthorSchema[]>(`/abstracts/${id}/authors/`)
    const { data: affiliations, } = useFetch<AuthorAffiliationSchema[]>(`/abstracts/${id}/affiliations/`)


    const [currStep, setCurrState] = useState(0)
    const nextStep = () => {
        if (currStep < 3) {
            setCurrState(prev => prev + 1)
        }
    }
    const previousStep = () => {
        if (currStep > 0) {
            setCurrState(prev => prev - 1)
        }
    }

    const onReorder = (data: AuthorSchema[]) => {
        setAuthors(data.map((item, i) => ({ ...item, order: i + 1 })))
        console.log(data.map((item, i) => ({ ...item, order: i + 1 })));
    }

    const onSaveAuthors = async () => {
        try {
            console.log(authors.map(item => ({ ...item, abstract_id: parseInt(id) })));

            const res = await axiosClient.patch(`/abstracts/${id}/authors/`, {
                authors: authors.map(item => ({ ...item, abstract_id: parseInt(id) }))
            })
            console.log(res);
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response);
                }
            }
        }
    }

    const renderAuthors = useCallback(() => {
        let affiliationsJSX = affiliations?.filter(aff =>
            authors.some(author => author.affiliation?.id === aff.id)
        )

        const authorsString = authors?.map(a => {
            const initial = a.first_name ? `${a.first_name[0]}. ` : "";
            return (
                <span>
                    {`${initial}${a.last_name}`}


                </span>
            )
        });


        const jsx = affiliationsJSX.map((aff, index) => (
            <span key={aff.id} className="text-xs font-bold align-top ml-0.5 text-primary">
                {index + 1}
            </span>
        )) || [];

        return {
            authorsText: authorsString,
            affiliationsNodes: jsx
        };
    }, [authors, affiliations]);

    const renderAffiliations = useCallback(() => {
        const affiliationsJSX = affiliations?.filter(aff =>
            authors.some(author => author.affiliation?.id === aff.id)
        ).map((aff, index) => (
            <span>
                <span key={aff.id} className="text-xs font-bold align-top ml-0.5 text-primary">
                    {index + 1}
                </span>
                {aff.institute}, {aff.department}, {aff.city}, {aff.nationality}
            </span>
        )) || [];

        return affiliationsJSX
    }, [authors, affiliations])



    const renderAuthorsAndAffiliations = useCallback(() => {
        if (!authors || authors.length === 0) return null;

        const uniqueAffiliations = [];
        authors.forEach(author => {
            const aff = author.affiliation;
            if (aff && !uniqueAffiliations.some(a => a.id === aff.id)) {
                uniqueAffiliations.push(aff);
            }
        });

        const authorsLine = authors.map((a, idx) => {
            const affIndex = uniqueAffiliations.findIndex(aff => aff.id === a.affiliation?.id);
            const initial = a.first_name ? `${a.first_name[0]}. ` : "";

            return (
                <span key={a.id}>
                    {initial}{a.last_name}
                    {affIndex !== -1 && (
                        <sup className="text-[10px] ml-0.5 text-primary font-bold">
                            {affIndex + 1}
                        </sup>
                    )}
                    {idx < authors.length - 1 && ", "}
                </span>
            );
        });

        const affiliationsList = uniqueAffiliations.map((aff, idx) => (
            <div key={aff.id} className="text-xs text-muted-foreground mt-1">
                <span className="font-bold mr-0.5">{idx + 1}</span>
                {aff.institute}{aff.department && `, ${aff.department}`}{aff.city && `, ${aff.city}`}{aff.nationality && `, ${aff.nationality}`}
            </div>
        ));

        return (
            <div className="flex flex-col gap-2">
                <div className="text-sm font-medium leading-relaxed">
                    {authorsLine}
                </div>
                <div className="flex flex-col">
                    {affiliationsList}
                </div>
            </div>
        );
    }, [authors]);


    const renderStep = useCallback((step: number) => {
        switch (step) {
            case 0:
                return (
                    <div className='w-full space-y-5 p-5'>
                        <h2 className='text-2xl font-semibold'>Abstract Submission</h2>
                        <AbstractForm abstract={data} onSubmit={async () => { await fetchData() }} />
                    </div>
                )
            case 1:
                return (
                    <div className='w-full space-y-5 p-5'>
                        <h2 className='text-2xl font-semibold'>Abstract Submission</h2>

                        <div className='flex flex-col gap-3'>
                            <InfoAlert
                                title={<span>Puedes reordenar la lista de autores arrastrando y cambiando el orden</span>}
                                messages={[]}
                                icon={<Hand />}
                            />
                            <Reorder.Group axis="y" values={authors} onReorder={onReorder}>
                                {authors.map((item, index) => (
                                    <Reorder.Item key={item.id} value={item}>
                                        <div className='border-2 bg-background rounded-sm flex justify-between items-start p-3 mb-2 gap-3'>
                                            <div className=' flex justify-center items-center'>
                                                <Menu className='stroke-3 size-5' />
                                            </div>

                                            <div className='font-semibold'>
                                                {index + 1}.
                                            </div>

                                            <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                                <div className='w-full'>
                                                    <p className='text-sm font-semibold'>{item.first_name} {item.last_name}</p>
                                                    <p className='text-xs text-muted-foreground'>{item.email}</p>
                                                </div>

                                                <div className="flex flex-col w-full gap-1">
                                                    <span className="font-medium leading-none">
                                                        {item.affiliation?.institute}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground truncate">
                                                        {item.affiliation?.department}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                        {item.affiliation?.city && item.affiliation?.nationality && (
                                                            <>
                                                                {item.affiliation.city}, {item.affiliation.nationality}
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className='flex flex-col sm:flex-row gap-3'>
                                                <Button variant='ghost' className='size-8 border-2 border-primary-main' onClick={() => {
                                                    setOpen(true)
                                                    setAuthorToEdit(item.id)
                                                    console.log(item);

                                                }}>
                                                    <PencilLine className='shrink-0 size-5 stroke-primary-main' />
                                                </Button>
                                                <Button variant='ghost' className='size-8 border-2 border-destructive' onClick={() => {
                                                    setOpenDeleteAuthor(true)
                                                    setAuthorToDelete(item.id)
                                                }}>
                                                    <Trash className='shrink-0 size-5 stroke-destructive' />
                                                </Button>
                                            </div>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>

                            <div>
                                <Button type='button' onClick={() => {
                                    setOpen(true)
                                    setAuthorToEdit(null)
                                }}>
                                    <Plus />Add Author
                                </Button>
                                <Button type='button' onClick={onSaveAuthors}>
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className='w-full space-y-5 p-5'>
                        <h2 className='text-2xl font-semibold'>Abstract Declarations</h2>

                        <AbstractDeclarations abstractId={data.id} />
                    </div>
                )
            case 3:
                return (<>
                    <div>
                        <BeforeSubmitPage/>
                     
                    </div>
                </>)
            default:
                return null
        }
    }, [data, authors])


    const stepData = [
        {
            step: 0,
            label: 'Abstract Content',
        },
        {
            step: 1,
            label: 'Authors',
        },
        {
            step: 2,
            label: 'Declarations',
        },
        {
            step: 3,
            label: 'Submit',
        },
    ]

    //#region DELETE AUTHOR
    const [openDeleteAuthor, setOpenDeleteAuthor] = useState(false)
    const [deletingAuthor, setDeletingAuthor] = useState(false)
    const [authorToDelete, setAuthorToDelete] = useState(0)
    const onDeleteAuthor = async () => {
        try {
            setDeletingAuthor(true)
            await axiosClient.delete(`/authors/${authorToDelete}/`)
            await fetchAuthors()
            setOpenDeleteAuthor(false)
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response);
                }
            }
        } finally {
            setDeletingAuthor(false)
            setAuthorToDelete(0)
        }
    }
    //  #endregion


    // #region EDIT AUTHOR
    const [open, setOpen] = useState(false)
    const [authorToEdit, setAuthorToEdit] = useState(0)
    // #endregion


    const [errors, setErrors] = useState(null)
    const validateAbstract = () => {
        const puta = abstractSchema.safeParse(data)
        console.log(puta);
        const marica = puta.error.issues.map(item => item.path.at(0))
        setErrors(marica)
        console.log(marica);

    }

    return (
        <div className='w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-3 p-3 mx-auto'>
            <div className='col-span-full w-full flex gap-3 justify-center'>
                <div className='w-full bg-background border-2 p-3 rounded-lg shadow-lg flex flex-col'>
                    <div className='flex flex-col sm:flex-row w-full'>
                        {stepData.map(step => (
                            <StepperLabel
                                key={step.step}
                                completed={currStep >= step.step}
                                label={step.label}
                                className='cursor-pointer'
                                onClick={() => setCurrState(step.step)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className='col-span-2 min-h-50 w-full flex gap-3 justify-center'>
                <div className='w-full bg-background border-2 p-3 rounded-lg shadow-lg flex flex-col'>
                    {renderStep(currStep)}
                </div>
            </div>

            <div className='col-span-1 flex flex-col gap-3'>
                <Card className='col-span-1 h-fit'>
                    <CardHeader className='items-start justify-start'>
                        <CardTitle>Estado de envío</CardTitle>
                        <CardAction>
                            <Badge>
                                Borrador
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className='text-balance'>
                            Envía tu resumen al proeso de revisión. Puedes modificar tu trabajo después de enviarlo, siempre que sea antes de la fecha límite de envío.
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <div className='w-full flex items-center justify-between'>
                            <Button type='button' onClick={previousStep}>
                                <ChevronsLeft />
                                Back
                            </Button>
                            <Button type='button' onClick={nextStep}>
                                Next
                                <ChevronsRight />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                <InfoAlert
                    variant='warning'
                    title='Testeo'
                    messages={[
                        'alskdja sldhas jldas hdjka hskdja shdka sdkj'
                    ]}
                />
            </div>

            {data && (<>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent className="sm:max-w-2xl!">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Add New Author</AlertDialogTitle>
                            <AlertDialogDescription>
                                Escribe los datos de contacto y de afiliación del autor.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 border-y-2">
                            <AuthorForm abstractId={data.id} author={authors?.find(x => x.id === authorToEdit)} onSubmit={() => {
                                setOpen(false)
                                fetchAuthors()
                            }} />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button type='submit' form='authors-form' onClick={() => {
                                console.log('QUEEE');

                            }}>Continue</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={openDeleteAuthor} onOpenChange={setOpenDeleteAuthor}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Author</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the author.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button type='submit' form='authors-form' onClick={onDeleteAuthor} disabled={deletingAuthor}>
                                {deletingAuthor && (
                                    <Spinner data-icon="inline-start" />
                                )}
                                Save
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>)}
        </div>
    )
}

export default EditAbstractPage