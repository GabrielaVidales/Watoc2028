import { Quote, } from 'lucide-react';
import mayaCalendar from '@/assets/calendario_maya_rojo.png';
import drMerino from '@/assets/drmerino.jpg';
import { Avatar, AvatarImage } from '@/components/ui/avatar';


const organizer = {
    url: drMerino,
    name: 'Gabriel Merino',
    subtitle: 'Chair',
    text: 'On behalf of the local scientific and organizing committees',
    paragraphs: [
        "On behalf of the local scientific and organizing committees, it is our great pleasure to invite you to the 14th Triennial Congress of the World Association of Theoretical and Computational Chemists (WATOC 2028), which will be held in January 2028 in Mérida, Mexico.",

        "WATOC 2028 will once again bring together the global theoretical and computational chemistry community in what will be one of the major international scientific events of the year. The congress is expected to attract participants from all regions of the world, providing a vibrant forum for presenting frontier research, exchanging ideas, and strengthening collaborations across disciplines and career stages.",

        "The scientific program will maintain a structure similar to that of recent WATOC congresses, combining plenary lectures, invited contributions, oral communications, and poster sessions. A broad range of thematic sessions will cover the full spectrum of contemporary theoretical and computational chemistry, from fundamental electronic-structure theory and molecular dynamics to catalysis, spectroscopy, materials science, medicinal chemistry, machine learning, and quantum computing.",

        "Following its highly successful debut in Oslo, Young WATOC will remain a central component of the meeting. Taking place immediately prior to the main congress, this event will highlight the work of early-career researchers who have recently completed their PhD studies. While presentations will be delivered exclusively by young scientists, Young WATOC will be open to all congress participants, fostering dialogue between generations.",

        "WATOC 2028 will be hosted in Mérida, the cultural and scientific hub of southeastern Mexico. Often referred to as the “White City,” Mérida is renowned for its strong Mayan heritage, elegant colonial architecture, and vibrant contemporary cultural life. The city offers excellent infrastructure, a safe and welcoming environment, and convenient access to world-class archaeological sites such as Uxmal and Chichén Itzá.",
    ]
}

function WelcomeSection() {
    return (
        <section className='py-12'>
            <div className="mx-auto w-full max-w-3xl">
                <div className='text-center mb-14 flex flex-col justify-center items-center'>
                    <div
                        className="absolute opacity-25 bg-no-repeat bg-contain bg-center bg-local size-40 md:size-50"
                        style={{ backgroundImage: `url(${mayaCalendar})` }}
                    />

                    <p className='font-semibold text-3xl relative'>
                        Welcome to the 14th Triennial Congress of the World Association of Theoretical and Computational Chemists
                    </p>

                    <div className='relative w-25 h-1.25 bg-primary-main mx-auto rounded-full mt-2' />
                </div>

                <div className="relative mt-4 px-2 pb-2 md:px-4">
                    <Quote className='absolute -top-1.5 left-4 text-primary-light opacity-30 size-6 fill-primary-light' />

                    <p className='font-bold text-xl text-primary-main ml-4 mb-4'>
                        Welcome to WATOC 2028
                    </p>

                    {organizer.paragraphs.map((text, index) => (
                        <p className='mb-6 leading-6 text-justify text-sm md:text-base md:leading-7' key={index}>
                            {text}
                        </p>
                    ))}

                    <div className="mt-2 flex items-center gap-5">
                        <Avatar className='size-25 shadow-lg'>
                            <AvatarImage
                                src={organizer.url}
                                alt={organizer.name}
                                className='object-cover'
                            />
                        </Avatar>
                        <div>
                            <p className='font-bold text-lg'>
                                {organizer.name}
                            </p>
                            <p className='font-medium italic text-base tracking-widest text-muted-foreground'>
                                {organizer.subtitle}
                            </p>
                            <p className='text-sm italic tracking-wider text-muted-foreground'>
                                {organizer.text}
                            </p>
                        </div>
                    </div>

                    <div className='border-t-2 mt-6 py-3 text-center'>
                        <div className='max-w-md mx-auto text-sm leading-6 text-muted-foreground'>
                            We look forward to welcoming you to Mérida for what promises to be a scientifically stimulating, intellectually enriching, and culturally memorable WATOC congress.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WelcomeSection;