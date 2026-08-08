import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Link, useLocation } from 'react-router'
import { ClipboardSignature, CheckCircle2, SquareUserRound } from 'lucide-react'
import { routes } from '@/routes/routes'
import LoginForm from '@/pages/auth/login/LoginForm'
import { AnimatePresence, motion } from 'motion/react';
import { InfoAlert } from '@/components/InfoAlert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from '@/components/ui/separator'


export default function LoginPage() {
	return (
		<Tabs defaultValue="login" className='mx-auto w-full h-full flex justify-center items-start'>
			<Card className='max-w-md w-full mx-auto shadow-xl pb-12'>
				<CardHeader>
					<TabsList variant="line" defaultValue='login' defaultChecked>
						<TabsTrigger value="login">Login</TabsTrigger>
						<TabsTrigger value="register">Register</TabsTrigger>
					</TabsList>
				</CardHeader>

				<CardContent className='flex flex-col items-stretch'>
					<TabsContent value="login" className='w-full'>
						<div className='w-full max-w-xs mx-auto space-y-6'>

							<div className='space-y-2 text-center flex flex-col items-center justify-center'>
								<div className="size-14 flex justify-center items-center rounded-full bg-primary-main">
									<SquareUserRound className='size-8 text-primary-contrast' />
								</div>
								<h2 className='text-2xl font-semibold'>Welcome back to</h2>

								<div className='h-1 w-12 mx-auto bg-primary-main rounded-full' />
							</div>

							<LoginForm />
						</div>
					</TabsContent>

					<TabsContent value="register" className='w-full'>
						<div className='w-full max-w-sm mx-auto space-y-6'>

							<div className='space-y-2 text-center flex flex-col items-center justify-center'>
								<div className="size-14 flex justify-center items-center rounded-full bg-primary-main">
									<ClipboardSignature className='size-8 text-primary-contrast' />
								</div>
								<h2 className='text-2xl font-semibold text-foreground'>Not registered yet?</h2>
								<div className='h-1 w-12 mx-auto bg-primary-main rounded-full' />
								<p className='text-muted-foreground pt-2 text-sm'>
									Register to attend the congress and manage your participation in WATOC 2028.
								</p>
							</div>

							<ul className='space-y-3 text-sm'>
								<li className='flex items-center gap-3 text-foreground'>
									<CheckCircle2 className='w-5 h-5 text-primary shrink-0' />
									<span className='font-medium'>Official registration and technical sessions</span>
								</li>
								<li className='flex items-center gap-3 text-foreground'>
									<CheckCircle2 className='w-5 h-5 text-primary shrink-0' />
									<span className='font-medium'>Abstract submission for oral presentations and posters</span>
								</li>
								<li className='flex items-center gap-3 text-foreground'>
									<CheckCircle2 className='w-5 h-5 text-primary shrink-0' />
									<span className='font-medium'>Certificates of attendance and participation</span>
								</li>
							</ul>

							<Link to={routes.auth.register}>
								<Button variant='main' className='w-full py-5 text-xl font-bold gap-3 shadow-lg'>
									Join WATOC now
								</Button>
							</Link>
						</div>
					</TabsContent>
				</CardContent>

				<Separator />

				<CardFooter>
					<p className='max-w-xs mx-auto text-center text-xs text-muted-foreground'>
						By creating an account or logging in, you agree to the current Terms of Service and Privacy Policy
					</p>
				</CardFooter>
			</Card>
		</Tabs>
	)
}