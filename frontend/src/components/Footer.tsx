import { Link } from 'react-router';
import fieldPng from '../assets/field.png'
import { Facebook, Instagram, Linkedin, Mail, X } from 'lucide-react';
import { routes } from '@/routes/routes';
import logo from '@/assets/WatocPNGLogoBlank.png'
import { cn } from '@/lib/utils';
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
    { name: 'Brishel Acosta', },
    { name: 'Eduardo Bojórquez', },
    { name: 'Gabriela Vidales', },
]

export default function Footer() {
    return (
        <footer className={cn(
            'pt-12 pb-4 text-white bg-bottom',
            'relative bg-primary-main -z-10'
        )}>
            <div
                className="absolute inset-0 opacity-80 bg-cover bg-center bg-fixed pointer-events-none -z-10"
                style={{ backgroundImage: `url(${fieldPng})` }}
            />
            <div className='max-w-6xl justify-self-center px-6'>
                <div className="grid grid-cols-1 lg:grid-cols-12 md:grid-cols-12 gap-5 text-white mb-3">
                    <div className="lg:col-span-5 md:col-span-12 flex flex-col gap-3">
                        <div className="lg:static lg:left-auto lg:translate-x-0">
                            <Link to={'/'} className='flex gap-2 items-center group w-fit'>
                                <img
                                    src={logo}
                                    alt="TheoChemMerida"
                                    className="sm:max-w-sm hover:scale-105 transition-transform"
                                />
                            </Link>
                        </div>
                        <p className='opacity-80'>
                            14th Triennial Congress of the World Association of Theoretical
                            and Computational Chemists
                        </p>
                        <p className='text-sm opacity-80'>
                            January 9-14, 2028
                        </p>
                        <div className={cn(
                            'flex items-center gap-2',
                            'text-sm opacity-80 transition-all',
                            'hover:pl-2 hover:text-primary-light hover:font-semibold'
                        )}>
                            <a className='text-sm' href="mailto:contact@watoc2028.org">
                                Email: contact@watoc2028.org
                            </a>
                            <Mail className='size-4 shrink-0' />
                        </div>
                        <p className='text-xs opacity-80'>
                            Centro de Investigación y de Estudios Avanzados<br />
                            Instituto Politécnico Nacional<br />
                            Mérida, Yucatán
                        </p>
                    </div>

                    <div className="lg:col-span-2 md:col-span-4 flex flex-col gap-1 mt-10">
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
                                        'text-sm opacity-80 transition-all',
                                        'hover:pl-2 hover:text-primary-light hover:font-semibold'
                                    )}>
                                        {item.label}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 md:col-span-4 flex flex-col gap-1 mt-10">
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
                                        'text-sm opacity-80 transition-all',
                                        'hover:pl-2 hover:text-primary-light hover:font-semibold'
                                    )}>
                                        {item.label}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 md:col-span-12 flex flex-col gap-1 mt-10">
                        <p className='font-semibold text-primary-light mb-3'>
                            Webmasters
                        </p>
                        <div className='flex flex-col gap-2'>
                            {webmasters.map((item, index) => (
                                <Link key={index} to={(item as any).href}>
                                    <p className={cn(
                                        'text-sm opacity-80 transition-all',
                                        'hover:pl-2 hover:text-primary-light hover:font-semibold'
                                    )}>
                                        {item.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='flex flex-row gap-2'>
                    {[
                        { icon: <Facebook />, href: '#' },
                        { icon: <X />, href: '#' },
                        { icon: <Linkedin />, href: '#' },
                        { icon: <Instagram />, href: '#' },
                    ].map((social, index) => (
                        <Button
                            key={index}
                            size="icon-lg"
                            variant='ghost'
                            className={cn(
                                'rounded-full transition-all bg-primary-light/20',
                                'hover:bg-primary-light hover:text-white hover:scale-110'
                            )}
                        >
                            {social.icon}
                        </Button>
                    ))}
                </div>
            </div>
            <p className='text-xs w-full text-center opacity-80'>
                © {new Date().getFullYear()} WATOC 2028. All rights reserved.
            </p>
        </footer>
    );
}

