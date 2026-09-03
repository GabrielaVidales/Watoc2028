import logo from '@/assets/WatocPNGLogoBlank.png';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';
import { Mail, X } from 'lucide-react';
import { Link } from 'react-router';
import fieldPng from '../assets/field.png';
import { Button } from './ui/button';

const navigation = {
    congress: [
        { label: "What's WATOC?", href: '/watoc' },
        { label: 'Abstract Submission', href: '/abstract-submission' },
        { label: 'Visa Requirements', href: '/visa' },
        { label: 'Registration', href: routes.auth.register },
    ],
    venue: [
        { label: 'Venue Information', href: '/venue' },
        { label: 'Hotel Booking', href: '/hotel-booking' },
        { label: 'Restaurants', href: '/restaurants' },
        { label: 'Transportation', href: '/transportation' },
        { label: 'Mérida City Guide', href: 'https://visitmerida.mx/' },
    ],
};

const webmasters = [
    { name: 'Eduardo Escalante', },
    // { name: 'Brishel Acosta', },
    { name: 'Eduardo Bojórquez', },
    // { name: 'Gabriela Vidales', },
]

export default function Footer() {
    return (
        <footer className={cn(
            'pt-12 pb-4 text-white/80 bg-bottom',
            'relative bg-primary-main -z-10'
        )}>
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none -z-10"
                style={{ backgroundImage: `url(${fieldPng})` }}
            />
            
            <div className='max-w-6xl justify-self-center px-6'>
                <div className="grid grid-cols-1 lg:grid-cols-12 md:grid-cols-12 gap-5 mb-3">
                    <section className="lg:col-span-5 md:col-span-12 flex flex-col gap-3">
                        <div className="lg:static lg:left-auto lg:translate-x-0">
                            <Link to={'/'} className='flex gap-2 items-center group w-fit'>
                                <img
                                    src={logo}
                                    alt="TheoChemMerida"
                                    className="sm:max-w-xs hover:scale-105 transition-transform"
                                />
                            </Link>
                        </div>
                        <p>
                            14th Triennial Congress of the World Association of Theoretical
                            and Computational Chemists
                        </p>
                        <p className='text-sm'>
                            January 9-14, 2028
                        </p>
                        <div className={cn(
                            'flex items-center gap-2',
                            'text-sm transition-all',
                            'hover:pl-2 hover:text-primary-light hover:font-semibold'
                        )}>
                            <a className='text-sm' href="mailto:contact@watoc2028.org">
                                Email: contact@watoc2028.org
                            </a>
                            <Mail className='size-4 shrink-0' />
                        </div>
                        <p className='text-xs'>
                            Centro de Investigación y de Estudios Avanzados<br />
                            Instituto Politécnico Nacional<br />
                            Mérida, Yucatán
                        </p>
                    </section>

                    <section className="lg:col-span-2 md:col-span-4 flex flex-col gap-1 mt-10">
                        <p className='font-semibold text-primary-light mb-3'>
                            Congress
                        </p>
                        <div className='flex flex-col gap-2'>
                            {navigation.congress.map((item, index) => (
                                <Link key={index}
                                    to={item.href}
                                    target={item.href.startsWith('http') ? "_blank" : undefined}
                                    rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                                >
                                    <p className={cn(
                                        'text-sm  transition-all',
                                        'hover:pl-2 hover:text-primary-light hover:font-semibold'
                                    )}>
                                        {item.label}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="lg:col-span-2 md:col-span-4 flex flex-col gap-1 mt-10">
                        <p className='font-semibold text-primary-light mb-3'>
                            Venue & City
                        </p>
                        <div className='flex flex-col gap-2'>
                            {navigation.venue.map((item, index) => (
                                <Link key={index}
                                    to={item.href}
                                    target={item.href.startsWith('http') ? "_blank" : undefined}
                                    rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                                >
                                    <p className={cn(
                                        'text-sm  transition-all',
                                        'hover:pl-2 hover:text-primary-light hover:font-semibold'
                                    )}>
                                        {item.label}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="lg:col-span-2 md:col-span-12 flex flex-col gap-1 mt-10">
                        <p className='font-semibold text-primary-light mb-3'>
                            Webmasters
                        </p>
                        <div className='flex flex-col gap-2'>
                            {webmasters.map((item, index) => (
                                <Link key={index} to={(item as any).href}>
                                    <p className={cn(
                                        'text-sm  transition-all',
                                        'hover:pl-2 hover:text-primary-light hover:font-semibold'
                                    )}>
                                        {item.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>

                <section className='flex flex-row justify-end gap-2'>
                    <p className='text-sm align-bottom my-auto'>
                        Follow us:
                    </p>

                    {[
                        { icon: <InstagramIcon className='size-6' />, href: '#' },
                        { icon: <LinkedInIcon className='size-6' />, href: '#' },
                        { icon: <XIcon className='size-6' />, href: '#' },
                    ].map((social, index) => (
                        <Button
                            key={index}
                            size="icon"
                            variant='ghost'
                            className={cn(
                                'transition-all hover:bg-white/20 hover:text-white'
                            )}
                        >
                            {social.icon}
                        </Button>
                    ))}
                </section>
            </div>
            <p className='text-xs w-full text-center '>
                © {new Date().getFullYear()} WATOC 2028. All rights reserved.
            </p>
        </footer>
    );
}



export const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...props}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

export const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...props}>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

export const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);