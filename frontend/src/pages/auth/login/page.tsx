import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { Link } from 'react-router'
import { ClipboardSignature, CheckCircle2, SquareUserRound } from 'lucide-react'
import { useHeader } from '@/contexts/HeaderContext'
import { useEffect } from 'react'
import { urls } from '@/routes/routes'
import LoginForm from '@/pages/auth/login/LoginForm'


export default function LoginPage() {
	const { setTitle } = useHeader()

	useEffect(() => {
		setTitle('Sign Up to Attend WATOC 2028')
	}, [setTitle])

	return (
		<section className='md:p-9 bg-fixed space-y-5'>
			<Card className='max-w-xl md:max-w-2xl: lg:max-w-6xl mx-auto shadow-xl border overflow-hidden gap-0 p-0'>
				<CardContent className='p-0'>
					<div className='flex flex-col lg:flex-row items-stretch'>
						<section className='flex-1 p-6 py-12 bg-white'>
							<div className='max-w-sm mx-auto space-y-6'>
								<div className='space-y-2 text-center flex flex-col items-center justify-center'>
									<div className="size-15 flex justify-center items-center rounded-full bg-primary-main">
										<SquareUserRound className='size-10 text-primary-contrast' />
									</div>
									<h2 className='text-2xl font-semibold'>Welcome back</h2>
									<div className='h-1 w-12 mx-auto bg-primary-main rounded-full' />
								</div>
								<LoginForm />
							</div>
						</section>

						<div className='w-full h-px lg:w-px lg:h-auto bg-slate-200 shrink-0' />

						<section className='flex-1 p-6 py-12 bg-indigo-50/50'>
							<div className='max-w-sm mx-auto h-full flex flex-col space-y-8'>
								<div className='space-y-6'>
									<div className='space-y-2 text-center flex flex-col items-center justify-center'>
										<div className="size-15 flex justify-center items-center rounded-full bg-primary-main">
											<ClipboardSignature className='size-10 text-primary-contrast' />
										</div>
										<h2 className='text-2xl font-semibold text-slate-900'>Not registered yet?</h2>
										<div className='h-1 w-12 mx-auto bg-primary-main rounded-full' />
										<p className='text-muted-foreground pt-2'>
											Register to attend the congress and manage your participation in WATOC 2028.
										</p>
									</div>

									<ul className='space-y-4'>
										<li className='flex items-start gap-3 text-slate-700'>
											<CheckCircle2 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
											<span className='text-sm font-medium'>Official registration and technical sessions</span>
										</li>
										<li className='flex items-start gap-3 text-slate-700'>
											<CheckCircle2 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
											<span className='text-sm font-medium'>Abstract submission for oral presentations and posters</span>
										</li>
										<li className='flex items-start gap-3 text-slate-700'>
											<CheckCircle2 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
											<span className='text-sm font-medium'>Certificates of attendance and participation</span>
										</li>
									</ul>
								</div>

								<Link to={urls.auth.register}>
									<Button variant='main' className='w-full py-5 text-xl font-bold gap-3 shadow-lg'>
										Join WATOC now
									</Button>
								</Link>
							</div>
						</section>
					</div>
				</CardContent>
			</Card>
		</section>
	)
}