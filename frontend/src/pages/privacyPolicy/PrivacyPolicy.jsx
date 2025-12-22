import React from 'react'
import Footer from '../../components/Footer'
import NavBar from '../../components/NavBar'
import { Box, Toolbar } from '@mui/material'

export default function PrivacyPolicy() {
    return (
        <>
            <NavBar invertImg={false}/>
            <Box component='main'>
                <Toolbar/>
                <Toolbar/>
                <Toolbar/>
            </Box>
            <Footer />
        </>
    )
}
