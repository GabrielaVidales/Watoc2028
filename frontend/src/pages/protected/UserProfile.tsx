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
import { Link } from 'react-router';
import ChangePasswordForm from '@/forms/ChangePasswordForm';
import EditUserForm from '@/forms/EditUserForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


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
		<div className='w-full grid grid-cols-1 sm:grid-cols-3 gap-5'>
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
			<div className='flex flex-col col-span-2 gap-5'>
				<Tabs defaultValue="home">
					<TabsList variant='line'>
						<TabsTrigger value="home">
							<House/>
							Profile
						</TabsTrigger>
						<TabsTrigger value="account">
							<UserRoundPen />
							Edit Account
						</TabsTrigger>
						<TabsTrigger value="picture">
							<Image/>
							Change Photo
						</TabsTrigger>
						<TabsTrigger value="password">
							<LockKeyhole/>
							Change Password
						</TabsTrigger>
					</TabsList>
					<TabsContent value='home'>
						<div className='w-full bg-background py-9 space-y-5 border-2 px-5 sm:px-9 rounded-lg shadow-md'>
							<h2 className='text-2xl font-semibold'>Abstract submission</h2>
							<InfoAlert
								title="Abstract submission deadline: June 10, 2026"
								messages={[
									'Read our Abstract Submission Guideline here',
									<span className='font-semibold text-slate-950'>Ver detalles</span>,
								]}
							/>
						</div>
					</TabsContent>
					<TabsContent value="account">
						<div className='w-full bg-background py-9 space-y-5 border-2 px-5 sm:px-9 rounded-lg shadow-md'>
							<h2 className='text-2xl font-semibold'>Edit your profile data</h2>
							{profile?.participant && (
								<EditUserForm defaultValues={{
									...currentUser,
									email: {
										value: currentUser.email,
										confirm: ''
									},
									participant: {
										affiliation: profile.participant.affiliation,
										job_title: profile.participant.job_title,
										field_of_study: profile.participant.field_of_study
									}
								}} />
							)}
						</div>
					</TabsContent>
					<TabsContent value="picture">
						<div className='w-full bg-background py-9 space-y-5 border-2 px-5 sm:px-9 rounded-lg shadow-md'>
							<h2 className='text-2xl font-semibold'>Edit Profile Picture</h2>
							<InfoAlert
								title="Profile Picture Guidelines"
								messages={[
									'Resolution: Square, 400x400px or higher.',
									'Max file size: 1.00 MB.',
									'Format: Use solid backgrounds (no transparency).',
								]}
							/>
							<UserPictureForm />
						</div>
					</TabsContent>
					<TabsContent value="password">
						<div className='w-full bg-background py-9 space-y-5 border-2 px-5 sm:px-9 rounded-lg shadow-md'>
							<h2 className='text-2xl font-semibold'>Change password</h2>
							<InfoAlert
								title="Password Requirements"
								messages={[
									'Minimum 8 characters.',
									'Include at least one uppercase letter.',
									'Include at least one number.',
									'Include at least one special character (e.g., !@#$%).',
									'Make sure your new password is different from the previous one.',
								]}
							/>
							<ChangePasswordForm />
						</div>

					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}

export function ParticipantTasks({ title, points, link }: { title: string, points: string[], link: string }) {
	return (
		<div className="w-full col-span-2 bg-background/95 backdrop-blur-sm p-8 space-y-6 border rounded-xl shadow-xl">
			<div className="space-y-1">
				<h2 className="text-2xl font-bold tracking-tight">Participant Tasks</h2>
				<p className="text-muted-foreground text-sm">Please complete the following actions to finalize your attendance.</p>
			</div>

			<div className="group border rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg border-primary/10">
				<div className="flex items-center gap-3 bg-primary px-6 py-4 text-primary-foreground font-semibold">
					<UtensilsCrossed className="w-5 h-5" />
					<span className="text-lg">{title}</span>
				</div>

				<div className="px-6 py-3 bg-card space-y-3">
					<ul className="space-y-2">
						{points.map(p => (
							<li className="flex items-start gap-3 text-sm text-foreground/80">
								<CheckCircle2 className="w-4 h-4 mt-0.5 text-muted-foreground" />
								<span>{p}</span>
							</li>
						))}
					</ul>

					<hr className="my-2 border-muted" />

					<Link to={'/'} className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline group-hover:pl-3 transition-all">
						{link}
						<ChevronRight className="w-4 h-4" />
					</Link>
				</div>
			</div>
		</div>
	);
}