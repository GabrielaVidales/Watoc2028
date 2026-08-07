import React from 'react'
import { Outlet } from 'react-router'
import fieldPng from '../assets/field.png'


function LoginLayout() {
    return (
        <div className='w-full h-svw' style={{
            backgroundImage: `url(${fieldPng})`
        }}>
            <h1>asdasd</h1>

            <Outlet />
        </div>
    )
}

export default LoginLayout