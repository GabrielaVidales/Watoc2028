import React from 'react'
import axiosClient from '@/clients/axiosClient'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { CircleAlert, MailWarning, Pencil, Search, Send, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { urls } from '@/routes/routes'
import { useProfiles } from '@/hooks/use-profiles'
import { presentationTypes, type AbstractSchema } from '@/schemas/abstract-schemas'
import { isAxiosError } from 'axios'
import { Badge } from '@/components/ui/badge'
import { InfoAlert } from '@/components/InfoAlert'
import { useMutation } from '@/hooks/use-mutation'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Spinner } from '@/components/ui/spinner'


function ViewAbstracts() {
    const navigate = useNavigate()
    const { profile, fetchProfile } = useProfiles()
    const { loading, mutate } = useMutation()

    const handleCreate = async () => {
        try {
            const response = await axiosClient.post<AbstractSchema>('abstracts/')
            navigate(urls.users.editAbstract.build(response.data.id))
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await mutate<never>('delete', `/abstracts/${id}/`)
            await fetchProfile()
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    }



    return (
        <div className='w-full max-w-5xl gap-3 p-3 mx-auto'>
            <div className='min-h-50 w-full flex gap-3 justify-center'>
                <div className='w-full bg-background border-2 p-3 rounded-lg shadow-lg flex flex-col gap-5'>
                    <fieldset disabled={loading} className='w-full py-9 pt-4 space-y-5 px-5 sm:px-9'>
                        <h2 className='text-2xl font-semibold'>Abstract submission</h2>
                        <InfoAlert
                            title="Abstract submission deadline: June 10, 2026"
                            messages={[
                                'Read our Abstract Submission Guideline here',
                                <Link to={urls.users.submitAbstract}>
                                    <span className='font-semibold text-slate-950'>Ver detalles</span>,
                                </Link>
                            ]}
                        />

                        {profile?.participant?.abstracts.map(a => (
                            <div key={a.id} className='border rounded-md shadow p-3'>
                                <div className='flex gap-5'>
                                    <div className='size-20 flex flex-col items-center justify-center border-3 gap-1 p-3 rounded-md border-primary/20 bg-primary/5'>
                                        <MailWarning className='size-5' />
                                        <span className='uppercase text-xs font-semibold'>
                                            {a.status}
                                        </span>
                                    </div>

                                    <div className='w-full flex flex-col md:flex-row md:justify-between'>
                                        <div className='w-full'>
                                            <Badge variant='outline' className='uppercase text-muted-foreground'>
                                                Folio: {a.id}
                                            </Badge>
                                            <p className='text-lg tracking-wide mb-2'>
                                                {a.title || (
                                                    <span className='flex items-center gap-1 text-destructive'>
                                                        <CircleAlert className='size-5 shrink-0' />
                                                        No title set
                                                    </span>
                                                )}
                                            </p>
                                            <p className='mb-2 text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:gap-2'>
                                                Presentation type:
                                                <span>
                                                    {presentationTypes?.find(p => p.value === a.presentation_type)?.label || (
                                                        <span className='inline-flex items-center gap-1 text-destructive'>
                                                            <CircleAlert className='size-3 shrink-0' />
                                                            Not set
                                                        </span>
                                                    )}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
                                            <Button variant='outline' className="shadow-sm" title="Preview" onClick={() => {
                                                navigate(urls.users.previewAbstract.build(a.id))
                                            }}>
                                                <Search className="size-4" />
                                                <span className='max-sm:hidden'>Preview</span>
                                            </Button>
                                            <Button variant="outline" className="shadow-sm" title="Edit" onClick={() => {
                                                navigate(urls.users.editAbstract.build(a.id))
                                            }}>
                                                <Pencil className="size-4" />
                                                <span className='max-sm:hidden'>Edit</span>
                                            </Button>
                                            <Button variant="outline" title="Submit">
                                                <Send className="size-4" />
                                                <span className='max-sm:hidden'>Submit</span>
                                            </Button>
                                            <div className="w-px h-4 bg-border mx-1" />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon" title="Delete">
                                                        {loading ? <Spinner /> : <Trash2 className="size-4" />}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent size='sm'>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete your
                                                            account from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={async () => await handleDelete(a.id)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}


                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    Crear nuevo abstract
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Submit a new abstract?</DialogTitle>
                                    <DialogDescription>
                                        Do you want to continue with a new submission?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="sm:justify-between">
                                    <DialogClose asChild>
                                        <Button type="button">Close</Button>
                                    </DialogClose>
                                    <Button type="button" onClick={handleCreate} className='bg-primary-main hover:bg-primary-light active:bg-primary-dark'>
                                        New Submission
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </fieldset>
                </div>
            </div>
        </div>
    )
}

export default ViewAbstracts