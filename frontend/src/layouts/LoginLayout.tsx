import React from 'react'
import { Link, Outlet } from 'react-router'
import fieldPng from '../assets/field.png'
import watocLogo from '@/assets/WatocPNGLogoBlank.png'


function LoginLayout() {
    return (
        <div
            className='w-full min-h-screen flex flex-col items-center justify-start py-8 no-scrollbar overflow-y-auto'
            style={{
                backgroundImage: `url(${fieldPng})`,
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <Link to={''}>
                <img src={watocLogo} alt="WATOC Logo" className="h-14 mb-6 hover:scale-105 transition-all duration-300" />
            </Link>

            <main className='w-full mx-auto shrink-0'>
                <Outlet />
            </main>
        </div>
    )
}

export default LoginLayout