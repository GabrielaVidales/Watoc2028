import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Link } from 'react-router'
import { ClipboardSignature, CheckCircle2, SquareUserRound } from 'lucide-react'
import { routes } from '@/routes/routes'
import LoginForm from '@/features/auth/forms/LoginForm'
import { AnimatePresence, motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from '@/components/ui/separator'


export default function LoginPage() {
	return (
		<Tabs defaultValue="login" className='mx-auto w-full h-full flex justify-center items-start p-2 sm:p-4 md:p-6 pt-0'>
			<Card className='max-w-md w-full mx-auto shadow-xl pb-12'>
				<CardHeader>
					<TabsList variant="line" defaultValue='login' defaultChecked>
						<TabsTrigger value="login">Login</TabsTrigger>
						<TabsTrigger value="register">Register</TabsTrigger>
					</TabsList>
				</CardHeader>

				<CardContent className='flex flex-col items-stretch'>
					<AnimatePresence>
						<TabsContent key={1} value="login" className='w-full'>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.3, ease: 'backOut' }}
								className='w-full max-w-xs mx-auto space-y-6'
							>
								<div className='space-y-2 text-center flex flex-col items-center justify-center'>
									<div className="size-14 flex justify-center items-center rounded-full bg-primary-main">
										<SquareUserRound className='size-8 text-primary-contrast' />
									</div>
									<h2 className='text-2xl font-semibold'>Welcome back</h2>

									<div className='h-1 w-12 mx-auto bg-primary-main rounded-full' />
								</div>
								<LoginForm />
							</motion.div>
						</TabsContent>

						<TabsContent  key={2} value="register" className='w-full'>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.3, ease: 'backOut' }}
								className='w-full max-w-xs mx-auto space-y-6'
							>
								<div className='space-y-2 text-center flex flex-col items-center justify-center'>
									<div className="size-14 flex justify-center items-center rounded-full bg-primary-main">
										<ClipboardSignature className='size-8 text-primary-contrast' />
									</div>
									<h2 className='text-2xl font-semibold text-foreground'>Not registered yet?</h2>
									<div className='h-1 w-12 mx-auto bg-primary-main rounded-full' />
									<p className='text-muted-foreground pt-2 text-xs sm:text-sm'>
										Register to attend the congress and manage your participation in WATOC 2028.
									</p>
								</div>

								<ul className='space-y-3 text-xs sm:text-sm'>
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

								<div className='w-full flex justify-center'>
									<Link to={routes.auth.register} >
										<Button variant='main' className='font-bold shadow-lg'>
											Join WATOC now
										</Button>
									</Link>
								</div>
							</motion.div>
						</TabsContent>
					</AnimatePresence>
				</CardContent>

				<Separator />

				<CardFooter>
					<p className='max-w-xs mx-auto text-center text-[10px] sm:text-xs text-muted-foreground'>
						By creating an account or logging in, you agree to the current Terms of Service and Privacy Policy
					</p>
				</CardFooter>
			</Card>
		</Tabs>
	)
}