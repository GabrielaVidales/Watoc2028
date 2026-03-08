import Footer from '@/components/Footer'
import React from 'react'
import { Outlet } from 'react-router'
import { Button } from '@/components/ui/button';
import { ChevronsLeft } from 'lucide-react';
import logo from '@/assets/WatocPNGLogoBlank.png';
import mayaBackground from '@/assets/field.png'
import mesh from '@/assets/mesh.png'

function AuthLayout() {
    return (
        <>
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <clipPath id="waveClip" clipPathUnits="objectBoundingBox">
                        <path d="M0 0 H1 V0.85 Q0.5 1.1, 0 0.85 Z" />
                    </clipPath>
                </defs>
            </svg>
            <header className='relative border-b-2 z-10 bg-primary-dark bg-fixed pt-4 pb-8'
            style={{
                clipPath: 'url(#waveClip)',
            }}
            >
                <div
                    className="absolute inset-0 opacity-50 bg-cover bg-bottom bg-fixed pointer-events-none -z-10"
                    style={{
                        backgroundImage: `url(${mayaBackground})`,
                    }}
                />
                <div className='max-w-4xl h-20 py-1 mx-auto flex justify-between items-center'>
                    <img
                        alt="WATOC 2028 Logo"
                        src={logo}
                        className='h-12 sm:h-full'
                    />

                    <Button variant='link' className='flex items-center gap-3 text-white'>
                        <ChevronsLeft />
                        Return to homepage
                    </Button>

                </div>
            </header>
            <main className='bg-fixed bg-no-repeat' style={{
                // backgroundImage: `url(${mesh})`,
            }} >
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default AuthLayout