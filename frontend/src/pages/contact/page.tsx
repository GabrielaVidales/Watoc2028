import React from 'react'
import { Card, CardContent, CardTitle, } from "@/components/ui/card"
import ContactForm from './contact-form'
import { Mail, MapPin, Phone } from 'lucide-react'
import cinvestav from '@/assets/cinvestav.jpg'
import { HeroSection } from '@/components/HeroSection'
import { GenericHeroContent } from '@/components/GenericHeroContent'


function ContactPage() {
    return (
        <>
            <HeroSection>
                <GenericHeroContent />
            </HeroSection>
            <section className='md:p-9 bg-fixed space-y-5'>
                <Card className='p-0 max-w-xl md:max-w-2xl: lg:max-w-4xl xl:max-w-6xl mx-auto shadow-xl border overflow-hidden'>
                    <div className='flex flex-col lg:flex-row items-stretch'>
                        <CardContent className='flex-1 space-y-5 py-6'>
                            <div className='w-full mx-auto flex flex-col space-y-8 p-8'>
                                <CardTitle className='text-3xl'>
                                    Contact Us
                                </CardTitle>

                                <ContactForm />
                            </div>
                        </CardContent>

                        <div className='w-full h-px lg:w-px lg:h-auto bg-slate-200 shrink-0' />

                        <CardContent className='flex-1 space-y-5 py-6 bg-indigo-50/50'>
                            <div className='w-full mx-auto h-full flex flex-col space-y-8 p-8'>
                                <div className='space-y-5 text-center flex flex-col items-center justify-center'>

                                    <h2 className='text-2xl font-semibold text-slate-900'>Centro de Investigación y de Estudios Avanzados, Unidad Mérida</h2>
                                    <div className='h-1 w-12 mx-auto bg-primary-main rounded-full mb-5' />

                                    <ul className='space-y-3 w-fit mx-auto'>
                                        <li className='flex items-start gap-3 text-slate-700'>
                                            <Mail className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                                            <a href="mailto:contact@watoc2028.org" className='text-sm font-medium hover:text-indigo-600 hover:underline'>
                                                contact@watoc2028.org
                                            </a>
                                        </li>
                                        <li className='flex items-start gap-3 text-slate-700'>
                                            <Phone className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                                            <span className='text-sm font-medium'> (+52) 999 942 94 00 - Ext 2576</span>
                                        </li>
                                        <li className='flex items-start gap-3 text-slate-700'>
                                            <MapPin className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                                            <a className='text-sm font-medium hover:text-indigo-600 hover:underline' href="https://www.google.com/maps?cid=17660258230959601408&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYASAA&hl=es-ES&source=embed">
                                                Cinvestav Mérida on Google Maps
                                            </a>
                                        </li>
                                    </ul>

                                    <img
                                        className='rounded-sm object-cover aspect-video shadow-lg ring border-input'
                                        src={cinvestav}
                                        alt=""
                                    />

                                    <div className="w-full h-80 overflow-hidden ring rounded-sm">
                                        <iframe
                                            title="Map"
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.5781795818735!2d-89.6289685!3d21.0215404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f567429bfffffff%3A0xf515d74b0203f700!2sCinvestav%20M%C3%A9rida!5e0!3m2!1sen!2smx!4v1769739999999"
                                            width="100%"
                                            height="100%"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </section>
        </>
    )
}

export default ContactPage