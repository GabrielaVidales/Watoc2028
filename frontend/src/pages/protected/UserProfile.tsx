import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth, type UserProfile } from '@/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Calendar, Mail, MapPin, UtensilsCrossed, CheckCircle2, ChevronRight, UserRoundPen, House, Image, LockKeyhole } from "lucide-react";
import { formatDate } from '@/utils/formatDate';
import 'react-image-crop/dist/ReactCrop.css';
import { InfoAlert } from './CreateAbstractPage';
import { UserPictureForm } from '@/forms/UserPictureForm';
import { Link, NavLink } from 'react-router';
import ChangePasswordForm from '@/forms/ChangePasswordForm';
import EditUserForm from '@/forms/EditUserForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DinnerForm from '@/forms/DinnerForm';
import { urls } from '@/routes/routes';
import AuthorForm from '@/forms/AuthorForm';


export default function UserProfile() {
	const { currentUser, getProfile } = useAuth()
	const [profile, setProfile] = useState<UserProfile>(null)

	const fetchProfile = async () => {
		const profile = await getProfile()
		setProfile(profile)
	}

	useEffect(() => {
		fetchProfile()
	}, [])

	return (
		<div className='w-full max-w-5xl grid grid-cols-3 gap-3 p-3 mx-auto'>

			<div className='col-span-1 w-full'>
				<Card>
					<CardContent>
						<div className="flex flex-col items-center gap-6">
							<div className="relative">
								<Avatar className="size-32 border-2 shadow">
									<AvatarImage src={currentUser.photo as string} alt="Profile" />
									<AvatarFallback className="text-2xl">JD</AvatarFallback>
								</Avatar>
								<Button
									size="icon"
									variant="outline"
									className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full">
									<Camera />
								</Button>
							</div>
							<div className="flex-1 space-y-2">
								<div className="flex flex-col gap-2 md:flex-row md:items-center">
									<h1 className="text-2xl font-bold">{currentUser.full_name}</h1>
								</div>

								{profile && (
									<div className='flex flex-col'>
										<span className="text-muted-foreground">{profile.participant?.job_title}</span>
										<span className="text-muted-foreground">{profile.participant?.affiliation}</span>
									</div>
								)}

								<div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
									<div className="flex items-center gap-1">
										<Mail className="size-4" />
										{currentUser.email}
									</div>
									<div className="flex items-center gap-1">
										<MapPin className="size-4" />
										{currentUser.city}, {currentUser.nationality}
									</div>
									<div className="flex items-center gap-1">
										<Calendar className="size-4" />
										Joined {formatDate(currentUser.date_joined)}
									</div>
								</div>
							</div>
							<Button variant="default">Edit Profile</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='col-span-2 min-h-50 w-full flex gap-3 justify-center'>
				<div className='w-full bg-background border-2 p-3 rounded-lg shadow-lg flex flex-col gap-5'>
					<Tabs defaultValue="home">
						<TabsList variant='line' className='w-full'>
							<TabsTrigger value="home">
								<House />
								Profile
							</TabsTrigger>
							<TabsTrigger value="account">
								<UserRoundPen />
								Edit Account
							</TabsTrigger>
							<TabsTrigger value="picture">
								<Image />
								Change Photo
							</TabsTrigger>
							<TabsTrigger value="password">
								<LockKeyhole />
								Change Password
							</TabsTrigger>
						</TabsList>
						<TabsContent value='home' className='w-full py-9 pt-4 space-y-5 px-5 sm:px-9'>
					
							<h2 className='text-2xl font-semibold'>Abstract submission</h2>
							<InfoAlert
								title="Abstract submission deadline: June 10, 2026"
								messages={[
									'Read our Abstract Submission Guideline here',
									<NavLink to={urls.users.viewAbstracts}>
										<span className='font-semibold text-slate-950'>Ver detalles</span>,
									</NavLink>
								]}
							/>
							<br />
							<br />

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
			</div>
		</div>
	)
}
