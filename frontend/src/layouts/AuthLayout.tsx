import logo from '@/assets/WatocPNGLogoBlank.png';
import mayaBackground from '@/assets/field.png';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { routes } from '@/routes/routes';
import { ChevronsLeft, ClipboardList, FileText, IdCard, LogIn } from 'lucide-react';
import { Link, Outlet } from 'react-router';

const guessRoutes = [
    {
        url: routes.auth.login,
        label: 'Login',
        icon: <LogIn className="size-5" />,
    },
    {
        url: routes.auth.register,
        label: 'Registration',
        icon: <ClipboardList className="size-5" />,
    },
]

const authRoutes = [
    {
        url: routes.users.profile,
        label: 'My Profile',
        icon: <IdCard className="size-5" />,
    },
    {
        url: routes.users.submissions.summary,
        label: 'My Submissions',
        icon: <FileText className="size-5" />,
    },
]

export default function AuthLayout() {
    const { user: user } = useAuth()

    return (
        <>
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <clipPath id="waveClip" clipPathUnits="objectBoundingBox">
                        <path d="M0 0 H1 V0.85 Q0.5 1.1, 0 0.85 Z" />
                    </clipPath>
                </defs>
            </svg>
            <header className='relative border-b-2 z-10 bg-primary-dark' style={{
                // clipPath: 'url(#waveClip)',
            }}>
                <div className="absolute inset-0 opacity-40 bg-cover bg-bottom bg-fixed pointer-events-none -z-10" style={{
                    backgroundImage: `url(${mayaBackground})`
                }} />

                <div className='max-w-7xl min-h-14 my-2 px-3 mx-auto flex flex-col sm:flex-row justify-between items-center gap-6'>
                    <div className='flex flex-col items-center sm:items-start gap-3 max-w-sm shrink-0'>
                        <Link to={routes.home.index} className="flex items-center h-full">
                            <img
                                alt="WATOC 2028 Logo"
                                src={logo}
                                className='h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform hover:scale-105'
                            />
                        </Link>
                    </div>

                    <div className='flex flex-col sm:flex-row items-center'>
                        <Link to={routes.home.index} className="sm:flex">
                            <Button variant='ghost' className='flex items-center gap-2 text-white sm:text-base lg:text-lg hover:bg-white/10 hover:text-white transition-all font-medium px-4'>
                                <ChevronsLeft className="size-6" />
                                <span>Home</span>
                            </Button>
                        </Link>

                        {(user ? authRoutes : guessRoutes).map(routes => (
                            <Link to={routes.url} key={routes.url} className="sm:flex">
                                <Button variant='ghost' className='flex items-center gap-2 text-white sm:text-base lg:text-lg hover:bg-white/10 hover:text-white transition-all font-medium px-4'>
                                    {routes.icon}
                                    <span>{routes.label}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* {title && (
                    <div className='space-y-3 mb-3 mt-3 text-primary-contrast px-4'>
                        <h1 className='text-center text-xl sm:text-2xl md:text-3xl font-semibold'>
                            {title}
                        </h1>
                        <div className='h-1 w-20 sm:w-32 mx-auto bg-primary-contrast rounded-full' />
                    </div>
                )} */}
            </header>
            <main className='bg-fixed bg-no-repeat'>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}
