import { InfoAlert } from '@/components/InfoAlert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import ChangePasswordForm from '@/forms/ChangePasswordForm';
import EditUserForm from '@/forms/EditUserForm';
import { useProfiles } from '@/hooks/use-profiles';
import { Image, LockKeyhole, Settings, Settings2Icon, ShieldAlert, UserRoundKey, UserRoundPen } from "lucide-react";
import { NotificationSettings } from './components/notifications-settings-component';

function SettingsPage() {
    const { user: user } = useAuth()
    const { profile } = useProfiles()

    return (
        <div className='p-2 sm:p-4 md:p-6 lg:p-8 space-y-8'>
            <div className='bg-background max-w-6xl mx-auto space-y-4 mb-8'>
                <div className='flex flex-col md:flex-row md:justify-between gap-5'>
                    <div className="flex items-start gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-2 border-primary-main/20 text-primary">
                            <Settings className="text-primary-main stroke-2 size-8" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold">
                                Account Settings
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Manage your personal settings
                            </p>
                        </div>
                    </div>

                    <Button variant="outline">
                        <Settings2Icon />
                        Preferences
                    </Button>
                </div>
            </div>

            <div className='max-w-2xl mx-auto'>
                <Tabs defaultValue="account" className='space-y-4'>
                    <TabsList>
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
                    <TabsContent value="account" className='w-full space-y-5'>
                        <Card>
                            <CardContent>
                                {profile ? (
                                    <EditUserForm defaultValues={{
                                        ...user,
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
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex gap-3 items-center">
                                    <UserRoundKey className='text-primary-main' />
                                    <h2 className='text-xl font-semibold'>Change Password</h2>
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className='grid grid-cols-1 gap-5'>
                                    <div className='space-y-8'>
                                        <InfoAlert
                                            className='shrink'
                                            title='Password requirements'
                                            messages={[
                                                <ul className="relative list-disc list-inside space-y-0.5 w-full text-xs">
                                                    <li>At least 8 characters long</li>
                                                    <li>Contains uppercase and lowercase characters</li>
                                                    <li>Contains at least one number</li>
                                                    <li>Contains at least one special character</li>
                                                    <ShieldAlert className='absolute right-0 -top-4 text-primary-main size-20 opacity-20' />
                                                </ul>
                                            ]}
                                        />
                                        <ChangePasswordForm />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default SettingsPage
