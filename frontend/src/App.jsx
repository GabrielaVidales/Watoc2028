import './App.css'
import { Routes, useLocation } from 'react-router'
import { Route } from 'react-router'
import Login from './pages/Login'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Register from './pages/Register'
import Test from './pages/Test'
import Home from './pages/home/Home'
import VenuePage from './pages/venue/VenuePage'
import HotelBooking from './pages/hotelBooking/HotelBooking'
import AbstractSubmissionInfo from './pages/abstractSubmission/AbstractSubmissionInfo'
import VisaRequirements from './pages/visa/VisaRequirements'
import AboutWATOC from './pages/aboutWATOC/AboutWATOC'
import Contact from './pages/contact/Contact';
import RegistrationPage from './pages/registration/RegistrationPage';
import NotFound from './pages/error/NotFound';
import YoungWatoc from './pages/youngWATOC/YoungWatoc';
import { useEffect } from 'react';
import globalTheme from './themes/Themes';
import PrivacyPolicy from './pages/privacyPolicy/PrivacyPolicy';

function App() {
	const { pathname } = useLocation()

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
	}, [pathname])

	return (
		<>
			<ThemeProvider theme={globalTheme}>
				<CssBaseline />
				<Routes>
					<Route path='' element={<Home />} />
					<Route path='*' element={<NotFound />} />
					<Route path='/venue' element={<VenuePage />} />
					<Route path='/hotel-booking' element={<HotelBooking />} />
					<Route path='/abstract-submission' element={<AbstractSubmissionInfo />} />
					<Route path='/watoc' element={<AboutWATOC />} />
					<Route path='/young-watoc' element={<YoungWatoc />} />
					<Route path='/visa' element={<VisaRequirements />} />
					<Route path='/contact' element={<Contact />} />
					<Route path='/register/account' element={<RegistrationPage />} />
					{/* <Route path='/privacy-policy' element={<PrivacyPolicy />} /> */}

					<Route path='/test' element={<Test />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
				</Routes>
			</ThemeProvider>
		</>
	)
}

export default App
