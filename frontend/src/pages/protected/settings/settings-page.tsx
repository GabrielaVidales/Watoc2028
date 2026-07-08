import React from 'react'
import ChangePasswordForm from '@/forms/ChangePasswordForm';
import EditUserForm from '@/forms/EditUserForm';
import { useAuth } from '@/contexts/AuthContext'
import { UserRoundPen, Image, LockKeyhole, ShieldAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { ChangePhotoForm, } from './change-photo-form';
import { useProfiles } from '@/hooks/use-profiles';
import { InfoAlert } from '@/components/InfoAlert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Link } from 'react-router';
import { urls } from '@/routes/routes';
import { Spinner } from '@/components/ui/spinner';
import { GalleryUpload } from '@/components/ui/file-upload';
import { UserPictureForm } from '@/forms/UserPictureForm';
import { NotificationSettings } from './components/notifications-settings-component';

function SettingsPage() {
    const { currentUser } = useAuth()
    const { profile } = useProfiles()

    return (
        <div className='mx-auto w-full max-w-5xl flex flex-col gap-5'>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={urls.users.profile}>
                                Dashboard
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Settings</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className='space-y-3'>
                <h1 className='text-2xl font-medium'>Account Settings</h1>
            </div>

            <Tabs defaultValue="account" className='space-y-5'>
                <Card className='py-0'>
                    <TabsList className='w-full justify-between overflow-x-auto overflow-y-hidden'>
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
                </Card>
                <TabsContent value="account" className='w-full space-y-5'>
                    <Card className='pt-0'>
                        <CardHeader className='py-5 border-b'>
                            <CardTitle className='text-xl font-medium'>Edit your profile data</CardTitle>
                            <CardDescription>Update your personal details here</CardDescription>
                        </CardHeader>

                        <CardContent className='px-10'>
                            {profile ? (
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
                            ) : (
                                <div className='w-full mx-auto text-center text-muted-foreground/50 p-5'>
                                    <Spinner className='mx-auto size-10' />
                                    <span>Loading...</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="picture" className='w-full space-y-5'>
                    <Card className='pt-0'>
                        <CardHeader className='py-5 border-b'>
                            <CardTitle className='text-xl font-medium'>Notification Settings</CardTitle>
                            <CardDescription>Manage your notifications</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <NotificationSettings />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="password" className='w-full space-y-5'>
                    <Card className='pt-0'>
                        <CardHeader className='py-5 border-b'>
                            <CardTitle className='text-xl font-medium'>Change password</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                <ChangePasswordForm />
                                <div>
                                    <InfoAlert
                                        className='shrink'
                                        title='Password requirements'
                                        messages={[
                                            <ul className="relative list-disc list-inside space-y-0.5 w-full">
                                                <li>At least 8 characters long</li>
                                                <li>Contains uppercase and lowercase characters</li>
                                                <li>Contains at least one number</li>
                                                <li>Contains at least one special character</li>
                                                <ShieldAlert className='absolute right-0 -top-4 text-primary-main size-25 opacity-20 mx-auto' />
                                            </ul>
                                        ]}

                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default SettingsPage


