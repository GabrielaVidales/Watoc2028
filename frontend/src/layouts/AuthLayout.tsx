import Footer from '@/components/Footer'
import React from 'react'
import { Outlet } from 'react-router'
import logo from '@/assets/WatocPNGLogo.png';
import { Button } from '@/components/ui/button';
import { ChevronsLeft } from 'lucide-react';


function AuthLayout() {
    return (
        <>
            <header className='border-b-2 sticky top-0 z-10 bg-background shadow-lg'>
                <div className='max-w-4xl h-20 py-1 mx-auto flex justify-between items-center'>
                    <img
                        alt="WATOC 2028 Logo"
                        src={logo}
                        className='h-12 sm:h-full'
                    />

                    <Button className='flex items-center gap-3'>
                        <ChevronsLeft/>
                        Return to homepage
                    </Button>

                </div>
            </header>
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default AuthLayout