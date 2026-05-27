import { useAuth } from '@/contexts/AuthContext'
import React from 'react'
import { UserRoundPen, House, Image, LockKeyhole, LogOut, Clock, FileText } from "lucide-react";
import { UserPictureForm } from '@/forms/UserPictureForm';
import ChangePasswordForm from '@/forms/ChangePasswordForm';
import EditUserForm from '@/forms/EditUserForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfiles } from '@/hooks/use-profiles';
import { InfoAlert } from '@/components/InfoAlert';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ImageUpload from '@/components/upload-file';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePhotoSchema } from '@/schemas/update-profile-photo-schema';
import { ChangePhotoForm, ProfilePictureForm } from './change-photo-form';
import { Separator } from '@/components/ui/separator';

function SettingsPage() {
    const { currentUser } = useAuth()
    const { profile } = useProfiles()

    if (!profile) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div className='w-full max-w-4xl flex flex-col gap-5'>

            <div className='space-y-3'>
                <h1 className='text-2xl font-medium'>Account Settings</h1>
                <p>Actualiza tu foto y tus datos personales aquí</p>
            </div>

            <Tabs defaultValue="account">
                <TabsList variant='line' className='w-full justify-between overflow-x-auto overflow-y-hidden'>
                    <TabsTrigger value="account" className="flex-1 gap-2">
                        <UserRoundPen className="size-5" />
                        <span className="hidden md:inline">Edit Account</span>
                    </TabsTrigger>

                    <TabsTrigger value="picture" className="flex-1 gap-2">
                        <Image className="size-5" />
                        <span className="hidden md:inline">Change Photo</span>
                    </TabsTrigger>

                    <TabsTrigger value="password" className="flex-1 gap-2">
                        <LockKeyhole className="size-5" />
                        <span className="hidden md:inline">Change Password</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="account" className='w-full '>

                    <Card className='pt-0'>
                        <CardHeader className='py-5 border-b'>
                            <CardTitle className='text-xl font-medium'>Edit your profile data</CardTitle>
                            <CardDescription>Update your personal details here</CardDescription>
                        </CardHeader>

                        <CardContent className='px-10'>
                            {profile.participant && (
                                <EditUserForm defaultValues={{
                                    ...currentUser,
                                    email: {
                                        value: '',
                                        confirm: ''
                                    },
                                    participant: {
                                        affiliation: profile.participant.affiliation,
                                        job_title: profile.participant.job_title,
                                        field_of_study: profile.participant.field_of_study
                                    }
                                }} />
                            )}

                        </CardContent>
                    </Card>

                    <Card className='pt-0'>
                        <CardHeader className='py-5 border-b'>
                            <CardTitle className='text-xl font-medium'>Change your profile picture</CardTitle>
                            <CardDescription>Upload a new image file</CardDescription>
                        </CardHeader>

                        <CardContent className='flex flex-row items-center px-10'>
                            <ChangePhotoForm
                                data={{
                                    profilePictureDeleted: false,
                                    profilePicture: null,
                                    profilePictureUrl: currentUser.photo as string
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Card className='pt-0'>
                        <CardHeader className='py-5 border-b'>
                            <CardTitle className='text-xl font-medium'>Security</CardTitle>
                            <CardDescription>Manage your password and account security</CardDescription>
                        </CardHeader>

                        <CardContent className='flex flex-col px-10'>
                            <ChangePasswordForm />
                        </CardContent>
                    </Card>

                </TabsContent>
                <TabsContent value="picture" className='w-full py-9 pt-4 space-y-5 px-5 sm:px-9'>
                    <h2 className='text-2xl font-semibold text-primary-main'>Edit Profile Picture</h2>
                    <InfoAlert
                        title="Profile Picture Guidelines"
                        messages={[
                            'Resolution: Square, 400x400px or higher.',
                            'Max file size: 1.00 MB.',
                            'Format: Use solid backgrounds (no transparency).',
                        ]}
                    />
                    <UserPictureForm />
                </TabsContent>
                <TabsContent value="password" className='w-full py-9 pt-4 space-y-5 px-5 sm:px-9'>
                    <Card className='pt-0'>
                        <CardHeader className='py-5 border-b'>
                            <CardTitle className='text-xl font-medium'>Change password</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="text-sm text-muted-foreground bg-muted/30 px-3 pb-3 rounded-lg">
                                <p className="font-medium mb-1">Password requirements:</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                    <li>At least 8 characters long</li>
                                    <li>Contains uppercase and lowercase letters</li>
                                    <li>Contains at least one number</li>
                                    <li>Contains at least one special character</li>
                                </ul>
                            </div>
                            <Separator className='my-4' />
                            <ChangePasswordForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default SettingsPage


