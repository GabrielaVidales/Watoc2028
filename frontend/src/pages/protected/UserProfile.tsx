import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth, type UserProfile } from '@/contexts/AuthContext'
import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {  Calendar, Mail, MapPin, UserRoundPen, House, Image, LockKeyhole, LogOut, Clock, FileText, CreditCard, Wallet } from "lucide-react";
import { formatDate } from '@/utils/formatDate';
import 'react-image-crop/dist/ReactCrop.css';
import { UserPictureForm } from '@/forms/UserPictureForm';
import {  NavLink } from 'react-router';
import ChangePasswordForm from '@/forms/ChangePasswordForm';
import EditUserForm from '@/forms/EditUserForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DinnerForm from '@/forms/DinnerForm';
import { urls } from '@/routes/routes';
import { useProfiles } from '@/hooks/use-profiles';
import { Badge } from '@/components/ui/badge';
import { InfoAlert } from '@/components/InfoAlert';


export default function UserProfile() {
	const { currentUser, handleLogout } = useAuth()
	const { profile } = useProfiles()

	return (
		<div className='w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-5 p-3 mx-auto'>
			<section className='col-span-1 mx-auto max-w-sm md:max-w-md w-full'>
				<Card className='shadow-md border-2 border-input/30'>
					<CardContent className='p-6'>
						<div className="flex flex-col items-center">
							<Avatar className="size-32 border-4 border-secondary shadow-sm mb-4">
								<AvatarImage src={currentUser.photo as string} alt="Profile" />
								<AvatarFallback className="text-2xl">JD</AvatarFallback>
							</Avatar>

							<div className="space-y-2 mb-6 text-center">
								<h1 className="text-2xl font-bold text-foreground">
									{currentUser.full_name}
								</h1>

								{profile?.participant && (
									<div className="flex flex-col text-sm leading-relaxed">
										<span className="font-medium text-primary">
											{profile.participant.job_title}
										</span>
										<span className="text-muted-foreground">
											{profile.participant.affiliation}
										</span>
										<span className="font-medium text-primary mt-2">
											Field of Study
										</span>
										<span className="text-muted-foreground">
											{profile.participant.field_of_study}
										</span>
									</div>
								)}
							</div>

							<div className='h-0.75 w-50 bg-primary-main' />

							<div className="w-full space-y-3 py-4 border-y border-muted/50 mb-6">
								<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
									<Mail className="size-4 shrink-0 text-primary/70" />
									<span className="truncate px-1">{currentUser.email}</span>
								</div>

								<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
									<MapPin className="size-4 shrink-0 text-primary/70" />
									<span>{currentUser.city}, {currentUser.nationality}</span>
								</div>

								<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
									<Calendar className="size-4 shrink-0 text-primary/70" />
									<span>Joined {formatDate(currentUser.date_joined)}</span>
								</div>
							</div>

							<Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto px-8 transition-transform active:scale-95">
								<LogOut />
								Logout
							</Button>
						</div>
					</CardContent>
				</Card>
			</section>

			<section className='col-span-1 lg:col-span-2 min-h-50 w-full flex gap-3 justify-center'>
				<div className='w-full bg-background border-2 p-3 rounded-lg shadow-lg flex flex-col gap-5'>
					<Tabs defaultValue="home">
						<TabsList variant='line' className='w-full justify-between overflow-x-auto overflow-y-hidden'>
							<TabsTrigger value="home" className="flex-1 gap-2">
								<House className="size-5" />
								<span className="hidden md:inline">Home</span>
							</TabsTrigger>

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
						<TabsContent value='home' className='w-full p-9 space-y-8 px-5 sm:px-9'>
							<section className="space-y-5">
								<h2 className='text-2xl font-semibold'>
									Welcome to the World Association of Theoretical and Computational Chemists Registration Portal
								</h2>
								<div className='h-0.75 w-20 mx-auto mb-6 mt-4 bg-primary-main' />
								<p className='text-sm'>
									You are now logged in to your personal congress account. From this page you can:
								</p>
								<ul className='list-disc text-sm pl-4 pr-8 space-y-2'>
									<li>
										<b>Register as a delegate:</b> complete your registration for the congress and select any additional options.
									</li>
									<li>
										<b>Submit an abstract</b>: start a new submission or continue working on an existing one.
									</li>
								</ul>
								<p className='text-sm'>
									Please note that submitting an abstract does not automatically register you for the congress.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className='text-2xl font-semibold text-primary-main'>Abstract submission</h2>
								<InfoAlert
									title="Abstract submission deadline: June 1, 2027"
									messages={[
										"Don't forget to review the submission guidelines before uploading",
										<NavLink to={urls.users.viewAbstracts}>
											<Button variant="link" className="h-auto p-0 text-blue-600 font-semibold">
												Read Guidelines
											</Button>
										</NavLink>
									]}
									icon={<Clock />}
								/>

								<div className='flex justify-end'>
									<Button className="w-full sm:w-auto font-bold" asChild>
										<NavLink to={urls.users.viewAbstracts}>
											<FileText className="mr-2 size-4" />
											View My Submissions
										</NavLink>
									</Button>
								</div>
							</section>

							{/* <section className="space-y-4">
								<div className="flex items-center justify-between">
									<h2 className='text-2xl font-semibold text-primary-main'>Congress Registration</h2>
								</div>

								<InfoAlert
									variant='warning'
									title="Early Bird Deadline: April 15, 2027"
									messages={[
										"Register now to take advantage of reduced fees and book social events.",
										"Your registration includes access to all scientific sessions and coffee breaks.",
									]}
									icon={<CreditCard className="size-5" />}
								/>

								<div className='flex flex-col sm:flex-row justify-end gap-3'>
									<Button className="w-full sm:w-auto font-bold bg-green-600 hover:bg-green-700 text-white" asChild>
										<NavLink to={'#'}>
											<Wallet className="mr-2 size-4" />
											Complete Registration & Pay
										</NavLink>
									</Button>
								</div>
							</section> */}

							{/* <section className="space-y-4">
								<h2 className='text-2xl font-semibold text-primary-main'>Dietary Survey</h2>
								<InfoAlert
									variant='warning'
									title="Attendance to Congress Dinner"
									messages={[
										<span className='text-slate-950'>
											<b>Time: </b>19:00 - 22:00.
										</span>,
										<span className='text-slate-950'>
											<b>Location: </b>Centro Internacional de Congresos, Mérida
										</span>,
									]}
								/>
								<DinnerForm />
							</section> */}
						</TabsContent>
						<TabsContent value="account" className='w-full py-9 pt-4 space-y-5 px-5 sm:px-9'>
							<h2 className='text-2xl font-semibold text-primary-main'>Edit your profile data</h2>
							{profile?.participant && (
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
							<h2 className='text-2xl font-semibold text-primary-main'>Change password</h2>
							<InfoAlert
								title="Password Requirements"
								messages={[
									'Minimum 8 characters.',
									'Include at least one uppercase letter.',
									'Include at least one number.',
									'Include at least one special character (e.g., !@#$%).',
								]}
							/>
							<ChangePasswordForm />
						</TabsContent>
					</Tabs>
				</div>
			</section>
		</div>
	)
}
