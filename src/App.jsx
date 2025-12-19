import './App.css'
import { Routes } from 'react-router'
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

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});

const globalTheme = createTheme({
	palette: {
		primary: {
			light: '#757ce8',
			main: '#3f50b5',
			dark: '#002884',
			contrastText: '#fff',
		},
		secondary: {
			light: '#ff7961',
			main: '#f44336',
			dark: '#ba000d',
			contrastText: '#000',
		},
	},
	components: {
		MuiTextField: {
			styleOverrides: {
				root: {
					'& fieldset': {
						borderColor: '#a0a4aeff',
					},
					'& .MuiOutlinedInput-root': {
						borderRadius: 15,
						backgroundColor: '#f5f8ffff', // azul muy suave
					},
				},
			},
		},
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					scrollbarColor: '#b6b6b6ff transparent', // Firefox
					scrollbarWidth: 'thin',

					'&::-webkit-scrollbar': {
						width: 8,
						height: 8,
					},
					'&::-webkit-scrollbar-track': {
						background: 'transparent',
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: '#6b6b6b',
						borderRadius: 8,
						border: '2px solid transparent',
						backgroundClip: 'content-box',
					},
					'&::-webkit-scrollbar-thumb:hover': {
						backgroundColor: '#555',
					},
				},
			},
		},
	},
})

function App() {
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


					<Route path='/test' element={<Test />} />
					<Route path='/login' element={<>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							<Login />
						</ThemeProvider>
					</>} />
					<Route path='/register' element={<>
						{/* <ThemeProvider theme={darkTheme}> */}
							{/* <CssBaseline /> */}
							<Register />
						{/* </ThemeProvider> */}
					</>} />
				</Routes>
			</ThemeProvider>

		</>
	)
}

export default App
