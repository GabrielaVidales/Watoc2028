import './App.css'
import { Routes, useLocation } from 'react-router'
import { Route } from 'react-router'
import { GuestRoute, ProtectedRoute } from './contexts/ProtectedRoute'

import Login from './pages/Login'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Register from './pages/Register'
import Home from './pages/home/Home'
import VenuePage from './pages/venue/VenuePage'
import HotelBooking from './pages/hotelBooking/HotelBooking'
import AbstractSubmissionInfo from './pages/abstractSubmission/AbstractSubmissionInfo'
import AboutWATOC from './pages/aboutWATOC/AboutWATOC'
import Contact from './pages/contact/Contact';
import NotFound from './pages/error/NotFound';
import YoungWatoc from './pages/youngWATOC/YoungWatoc';
import Restaurants from './pages/restaurants/RestaurantsPage';
import Transportation from './pages/transportation/TransportationPage';
import { useEffect } from 'react';
import globalTheme from './themes/Themes';
import { SuccessRegisterPage } from './pages/protected/SuccessRegisterPage'
import HomeLayout from './layouts/HomeLayout'
import Test from './pages/Test'
import VisaRequirements from '@/pages/visa/VisaRequirements'

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
					<Route path='/' element={<HomeLayout />}>
						<Route index element={<Home />} />
					</Route>

					<Route path='/venue' element={<VenuePage />} />
					<Route path='/hotel-booking' element={<HotelBooking />} />
					<Route path='/abstract-submission' element={<AbstractSubmissionInfo />} />
					<Route path='/watoc' element={<AboutWATOC />} />
					<Route path='/young-watoc' element={<YoungWatoc />} />
					<Route path='/visa' element={<VisaRequirements />} />
					<Route path='/restaurants' element={<Restaurants />} />
					<Route path='/transportation' element={<Transportation />} />
					<Route path='/contact' element={<Contact />} />

					{/* Rutas sólo para usuarios no loggeados */}
					<Route element={<GuestRoute />}>
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
					</Route>

					{/* Rutas protegidas van aquí */}
					<Route element={<ProtectedRoute />} >
						<Route path='/success' element={<SuccessRegisterPage />} />
					</Route>

					<Route element={<HomeLayout />}>
						<Route path='/test' element={<Test />} />
					</Route>

					{/* Para rutas diferentes */}
					<Route path='*' element={<NotFound />} />
				</Routes>
			</ThemeProvider>
		</>
	)
}

export default App
