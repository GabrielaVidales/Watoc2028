import './App.css'
import { Routes, useLocation } from 'react-router'
import { Route } from 'react-router'
import { ProtectedRoute } from './contexts/ProtectedRoute'
import { GuestRoute } from './contexts/GuestRoute'

// import { ThemeProvider } from '@mui/material/styles';
import RegisterPage from './pages/auth/register/RegisterPage'
import Home from './pages/home/Home'
import VenuePage from './pages/venue/VenuePage'
import HotelBooking from './pages/hotelBooking/HotelBooking'
import AbstractSubmissionInfo from './pages/abstractSubmission/AbstractSubmissionInfo'
import AboutWATOC from './pages/aboutWATOC/AboutWATOC'
import NotFound from './pages/404/NotFound';
import YoungWatoc from './pages/youngWATOC/YoungWatoc';
import Restaurants from './pages/restaurants/RestaurantsPage';
import Transportation from './pages/transportation/TransportationPage';
import { useEffect } from 'react';
import HomeLayout from './layouts/HomeLayout'
import VisaRequirements from '@/pages/visa/VisaRequirements'
import AuthLayout from './layouts/AuthLayout'
import CreateAbstractPage from './pages/protected/CreateAbstractPage'
import { urls } from './routes/routes'
import EditAbstractPage from './pages/protected/EditAbstractPage'
import AbstractPreview from './pages/protected/AbstractPreview'
import ConfirmationPage from './pages/protected/confirmation-assistance/page'
import { SelectFeePage } from './pages/protected/confirmation-assistance/fee/page'
import { SelectTourPage } from './pages/protected/confirmation-assistance/tour/page'
import { DinnerPage } from './pages/protected/confirmation-assistance/dinner/page'
import ConfirmPaymentPage from './pages/protected/confirmation-assistance/payment/page'
import LoginPage from './pages/auth/login/page'
import ContactPage from './pages/contact/page'
import DashboardLayout from './layouts/DashboardLayout'
import VerifyEmailPage from './pages/auth/verify/page'
import SettingsPage from './pages/protected/settings/settings-page'
import ForgotPasswordPage from './pages/auth/reset_password/forgot-password-page'
import CreatePasswordPage from './pages/auth/create_new_password/create-new-password'
import AbstractSubmissionsPage from './pages/protected/abstract-submissions/page'
import UserDashboardPage from './pages/protected/dashboard/page'
import TestPage from './pages/test'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationsPage from './pages/protected/notifications/page'
import ManageUsersPage from './pages/protected/administration/manage-users/manage_users'
import ReviewsList from './pages/protected/reviews/list/page'
import ReviewAbstract from './pages/protected/reviews/view/page'
import ManageReviewsPage from './pages/protected/administration/manage-reviews/manage-reviews'

function App() {
	const queryClient = new QueryClient()

	const { pathname } = useLocation()

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
	}, [pathname])

	return (
		<QueryClientProvider client={queryClient}>
			<Routes>
				<Route path='/' element={<HomeLayout />}>
					<Route index element={<Home />} />
					<Route path='/watoc' element={<AboutWATOC />} />
					<Route path='/venue' element={<VenuePage />} />
					<Route path='/hotel-booking' element={<HotelBooking />} />
					<Route path='/abstract-submission' element={<AbstractSubmissionInfo />} />
					<Route path='/young-watoc' element={<YoungWatoc />} />
					<Route path='/visa' element={<VisaRequirements />} />
					<Route path='/restaurants' element={<Restaurants />} />
					<Route path='/transportation' element={<Transportation />} />
					<Route path='/contact' element={<ContactPage />} />
				</Route>


				{/* Rutas sólo para usuarios no loggeados */}
				<Route element={<GuestRoute redirectTo={urls.users.profile} />}>
					<Route element={<AuthLayout />}>
						<Route path={urls.auth.login} element={<LoginPage />} />
						<Route path={urls.auth.register} element={<RegisterPage />} />
						<Route path={urls.auth.forgotPassword} element={<ForgotPasswordPage />} />
						<Route path={urls.auth.resetPassword} element={<CreatePasswordPage />} />
					</Route>
				</Route>

				{/* Rutas protegidas van aquí */}
				<Route element={<AuthLayout />}>

					{/* 
						DEPRECAR ESTAS RUTAS POCO A POCO
					*/}
					<Route element={<ProtectedRoute allowedRoles={['admin', 'participant']} />} >

						<Route path={urls.users.submitAbstract} element={<CreateAbstractPage />} />
						<Route path={urls.users.previewAbstract.url} element={<AbstractPreview />} />

						<Route path={urls.users.confirmAssistance.start} element={<ConfirmationPage />} />
						<Route path={urls.users.confirmAssistance.fee} element={<SelectFeePage />} />
						<Route path={urls.users.confirmAssistance.dinner} element={<DinnerPage />} />
						<Route path={urls.users.confirmAssistance.tour} element={<SelectTourPage />} />
						<Route path={urls.users.confirmAssistance.payment} element={<ConfirmPaymentPage />} />

						{/* Confirmar pagos en stripe */}
						{/* <Route path={urls.payments.success} element={<PaymentSuccess />} /> */}
					</Route>
				</Route>

				<Route element={<ProtectedRoute allowedRoles={['admin', 'participant', 'reviewer']} />} >
					<Route element={<DashboardLayout />}>

						<Route element={<ProtectedRoute allowedRoles={['admin']} />} >
							<Route path={urls.users.administration.manageUsers} element={<ManageUsersPage />} />
							<Route path={urls.users.administration.manageReviewers} element={<ManageReviewsPage />} />
						</Route>

						<Route element={<ProtectedRoute allowedRoles={['reviewer']} />} >
							<Route path={urls.users.reviews.list} element={<ReviewsList />} />
							<Route path={urls.users.reviews.view.url} element={<ReviewAbstract />} />
						</Route>

						<Route path={urls.users.profile} element={<UserDashboardPage />} />
						<Route path={urls.users.settings} element={<SettingsPage />} />
						<Route path={urls.users.viewAbstracts} element={<AbstractSubmissionsPage />} />
						<Route path={urls.users.editAbstract.url} element={<EditAbstractPage />} />
						<Route path={urls.users.notifications} element={<NotificationsPage />} />
					</Route>
					<Route path={'/test'} element={<TestPage />} />
				</Route>

				<Route path={urls.auth.verify} element={<VerifyEmailPage />} />

				{/* Para rutas diferentes */}
				<Route path='*' element={<NotFound />} />
			</Routes>
		</QueryClientProvider>
	)
}

export default App
