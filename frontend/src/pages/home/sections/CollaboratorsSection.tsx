import { Typography } from '@mui/material';
import { UsersRound } from 'lucide-react';
import { Link } from 'react-router';
import watocLogo from '../../../assets/watocLogo.png'
import cinvestavLogo from '../../../assets/cinvestavlogo.png'
import theochem from '@/assets/TheoChemMeridaLogo.png'
import { cn } from '@/lib/utils';

const collaborators = [
    {
        name: 'WATOC',
        src: watocLogo,
        url: 'https://www.watoc.net/',
        title: 'Host Organization'
    },
    {
        name: 'Cinvestav',
        src: cinvestavLogo,
        url: 'https://www.cinvestav.mx/',
        title: 'Host Research Centre'
    },
    {
        name: 'TheoChemMerida',
        src: theochem,
        url: 'https://www.theochemmerida.org/',
        title: 'Host Group'
    },
];

export default function CollaboratorsSection() {
    return (
        <section className='max-w-4xl mx-auto py-6 md:py-12 px-2 md:px-4'>
            <div className='flex flex-col gap-1 items-center justify-center mb-12'>
                <div className='size-15 bg-primary-main flex justify-center items-center rounded-full'>
                    <UsersRound className='size-8' color="white" />
                </div>
                <h2 className='font-bold text-4xl text-primary-main'>
                    Organized In Collaboration With
                </h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                {collaborators.map((c, index) => (
                    <div key={index} className='flex flex-col gap-2'>
                        <Link to={c.url} key={index}>
                            <div className={cn(
                                'w-60 h-30 border-2 border-gray-300 px-4 py-2 flex justify-center',
                                'rounded-2xl transition-all duration-200 cursor-pointer',
                                'hover:scale-105 hover:border-indigo-600 hover:shadow-xl'
                            )}
                            >
                                <img src={c.src} alt={c.name} className='h-full object-contain' />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}