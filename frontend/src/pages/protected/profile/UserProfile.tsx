import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth, type UserProfile } from '@/contexts/AuthContext'
import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Mail, MapPin, UserRoundPen, House, Image, LockKeyhole, LogOut, Clock, FileText, ArrowRight } from "lucide-react";
import { formatDate } from '@/utils/formatDate';
import { UserPictureForm } from '@/forms/UserPictureForm';
import { Link, NavLink } from 'react-router';
import ChangePasswordForm from '@/forms/ChangePasswordForm';
import EditUserForm from '@/forms/EditUserForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { urls } from '@/routes/routes';
import { useProfiles } from '@/hooks/use-profiles';
import { InfoAlert } from '@/components/InfoAlert';


export default function UserProfile() {
	const { currentUser: user, handleLogout } = useAuth()
	const { profile } = useProfiles()

	return (
		<>
			<div className='w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-5 p-3 mx-auto'>
				<section className='col-span-1 mx-auto max-w-sm md:max-w-md w-full'>
					<Card className='shadow-md border-2 border-input/30'>
						<CardContent className='p-6'>
							<div className="flex flex-col items-center">
								<Avatar className="size-32 border-4 border-secondary shadow-sm mb-4">
									<AvatarImage src={user.photo as string} alt="Profile" />
									<AvatarFallback className="text-2xl">JD</AvatarFallback>
								</Avatar>

								<div className="space-y-2 mb-6 text-center">
									<h1 className="text-2xl font-bold text-foreground">
										{user.full_name}
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
										<span className="truncate px-1">{user.email}</span>
									</div>

									<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
										<MapPin className="size-4 shrink-0 text-primary/70" />
										<span>{user.city}, {user.nationality}</span>
									</div>

									<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
										<Calendar className="size-4 shrink-0 text-primary/70" />
										<span>Joined {formatDate(user.date_joined)}</span>
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
								<section className="space-y-2">
									<h2 className="text-2xl font-semibold">
										Welcome back
									</h2>
									<p className="text-muted-foreground text-sm">
										Manage your registration and abstract submissions for WATOC 2028.
									</p>
								</section>

								{/* <section className='space-y-4'>
									<h2 className='text-2xl font-semibold text-primary-main'>Registration</h2>
									<p>
										<b>Confirm your assistance to WATOC 2028:</b> complete your registration for the congress and finish your payment.
									</p>
									<Button className="w-full px-5 sm:w-auto font-bold rounded-full" asChild>
										<NavLink to={urls.users.confirmAssistance.start}>
											Start Registration
										</NavLink>
									</Button>
								</section> */}

								<section className="space-y-4">
									<h2 className='text-2xl font-semibold text-primary-main'>Abstract submission</h2>
									<p>
										<b>Submit an abstract</b>: start a new submission or continue working on an existing one.
									</p>
									
									<InfoAlert
										title="Abstract submission deadline: To be announced"
										messages={[
											<p key="guideline-text">
												Please review our{" "}
												<Link to={urls.home.abstractSubmission} className="inline-flex items-center gap-1 font-medium hover:underline focus:underline focus:outline-none">
													Abstract Submission Guideline
												</Link>{" "}
												before submitting.
											</p>,
											<div key="guideline-link" className="mt-1">
												<Link to={urls.home.abstractSubmission} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus:underline focus:outline-none">
													<ArrowRight className="size-4" />
													View full guideline
												</Link>
											</div>,
										]}
									/>

									<Button className="w-full px-5 sm:w-auto font-bold rounded-full" asChild>
										<NavLink to={urls.users.viewAbstracts}>
											View My Submissions
										</NavLink>
									</Button>
								</section>

							</TabsContent>
							<TabsContent value="account" className='w-full py-9 pt-4 space-y-5 px-5 sm:px-9'>
								<h2 className='text-2xl font-semibold text-primary-main'>Edit your profile data</h2>
								{profile?.participant && (
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
								<div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
									<p className="font-medium mb-1">Password requirements:</p>
									<ul className="list-disc list-inside space-y-0.5">
										<li>At least 8 characters long</li>
										<li>Contains uppercase and lowercase letters</li>
										<li>Contains at least one number</li>
										<li>Contains at least one special character</li>
									</ul>
								</div>
								<ChangePasswordForm />
							</TabsContent>
						</Tabs>
					</div>
				</section>
			</div>
		</>
	)
}
