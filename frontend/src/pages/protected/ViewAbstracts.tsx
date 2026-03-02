import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth, type UserProfile } from '@/contexts/AuthContext'
import { formatDate } from '@/utils/formatDate'
import { Calendar, Camera, LockOpen, Mail, MapPin } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { InfoAlert } from './CreateAbstractPage'
import { Link, NavLink, useNavigate } from 'react-router'
import AuthorForm from '@/forms/AuthorForm'
import { urls } from '@/routes/routes'
import { useFetch } from '@/hooks/use-fetch'
import { useProfiles } from '@/hooks/use-profiles'
import axiosClient from '@/clients/axiosClient'
import type { AbstractSchema } from '@/schemas/abstract-schemas'
import { isAxiosError } from 'axios'


function ViewAbstracts() {
    const navigate = useNavigate()
    const { currentUser, getProfile } = useAuth()
    const { profile } = useProfiles()

    const handleCreate = async () => {
        try {
            const response = await axiosClient.post<AbstractSchema>('abstracts/')
            navigate(urls.users.editAbstract.build(response.data.id))            
        } catch (error) {
            if (import.meta.env.DEV){
                if (isAxiosError(error)){
                    console.log(error.response.data);
                }
            }
        }
    }

    return (
        <div className='w-full max-w-5xl gap-3 p-3 mx-auto'>
            <div className='min-h-50 w-full flex gap-3 justify-center'>
                <div className='w-full bg-background border-2 p-3 rounded-lg shadow-lg flex flex-col gap-5'>
                    <div className='w-full py-9 pt-4 space-y-5 px-5 sm:px-9'>
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
                            <div key={a.id}>
                                {a.title}
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


                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewAbstracts