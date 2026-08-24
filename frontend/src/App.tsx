import VisaRequirements from '@/pages/visa/VisaRequirements'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import './App.css'
import { GuestRoute } from './contexts/guards/GuestRoute'
import { ProtectedRoute } from './contexts/guards/ProtectedRoute'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import HomeLayout from './layouts/HomeLayout'
import LoginLayout from './layouts/LoginLayout'
import { DEBUG } from './lib/constants'
import NotFound from './pages/404/NotFound'
import AboutWATOC from './pages/aboutWATOC/AboutWATOC'
import AbstractSubmissionInfo from './pages/abstractSubmission/AbstractSubmissionInfo'
import CreatePasswordPage from './pages/auth/create_new_password/create-new-password'
import ForgotPasswordPage from './pages/auth/forgot_password/forgot-password-page'
import LoginPage from './pages/auth/login/page'
import RegisterPage from './pages/auth/register/RegisterPage'
import VerifyEmailPage from './pages/auth/verify/page'
import ContactPage from './pages/contact/page'
import Home from './pages/home/Home'
import HotelBooking from './pages/hotelBooking/HotelBooking'
import ManageReviewsPage from './pages/protected/administration/manage-reviews/manage-reviews'
import ManageUsersPage from './pages/protected/administration/manage-users/manage_users'
import { DinnerPage } from './pages/protected/confirmation-assistance/dinner/page'
import { SelectFeePage } from './pages/protected/confirmation-assistance/fee/page'
import ConfirmationPage from './pages/protected/confirmation-assistance/page'
import ConfirmPaymentPage from './pages/protected/confirmation-assistance/payment/page'
import { SelectTourPage } from './pages/protected/confirmation-assistance/tour/page'
import UserDashboardPage from './pages/protected/dashboard/page'
import NotificationsPage from './pages/protected/notifications/notifications-page'
import ReviewsList from './pages/protected/reviews/list/page'
import ReviewAbstract from './pages/protected/reviews/view/page'
import SettingsPage from './pages/protected/settings/settings-page'
import EditAbstractPage from './pages/protected/submissions/edit/edit-submission-page'
import AbstractSubmissionsPage from './pages/protected/submissions/summary/submission-summary-page'
import Restaurants from './pages/restaurants/RestaurantsPage'
import TestPage from './pages/test'
import TestAbstractFeaturePage from './pages/test/test-abstract-feature-page'
import Transportation from './pages/transportation/TransportationPage'
import VenuePage from './pages/venue/VenuePage'
import YoungWatoc from './pages/youngWATOC/YoungWatoc'
import { routes } from './routes/routes'

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
			<Route element={<GuestRoute redirectTo={routes.users.profile} />}>
				<Route element={<LoginLayout />}>
					<Route path={routes.auth.login} element={<LoginPage />} />
					<Route path={routes.auth.register} element={<RegisterPage />} />
					<Route path={routes.auth.forgotPassword} element={<ForgotPasswordPage />} />
					<Route path={routes.auth.resetPassword} element={<CreatePasswordPage />} />
				</Route>
			</Route>

			{DEBUG && (
				<Route element={<ProtectedRoute allowedRoles={['admin', 'participant', 'reviewer']} />} >
					<Route element={<AuthLayout />}>
						{/*  DEPRECAR ESTAS RUTAS POCO A POCO  */}
						<Route element={<ProtectedRoute allowedRoles={['admin', 'participant']} />} >
							<Route path={routes.users.confirmAssistance.start} element={<ConfirmationPage />} />
							<Route path={routes.users.confirmAssistance.fee} element={<SelectFeePage />} />
							<Route path={routes.users.confirmAssistance.dinner} element={<DinnerPage />} />
							<Route path={routes.users.confirmAssistance.tour} element={<SelectTourPage />} />
							<Route path={routes.users.confirmAssistance.payment} element={<ConfirmPaymentPage />} />
						</Route>
					</Route>
				</Route>
			)}

			<Route element={<ProtectedRoute allowedRoles={['admin', 'participant', 'reviewer']} />} >
				<Route element={<DashboardLayout />}>

					<Route element={<ProtectedRoute allowedRoles={['admin']} />} >
						<Route path={routes.users.administration.manageUsers} element={<ManageUsersPage />} />
						<Route path={routes.users.administration.manageReviewers} element={<ManageReviewsPage />} />
					</Route>

					<Route element={<ProtectedRoute allowedRoles={['reviewer']} />} >
						<Route path={routes.users.reviews.list} element={<ReviewsList />} />
						<Route path={routes.users.reviews.view.url} element={<ReviewAbstract />} />
					</Route>

					<Route element={<ProtectedRoute allowedRoles={['participant']} />} >
						<Route path={routes.users.submissions.summary} element={<AbstractSubmissionsPage />} />
						<Route path={routes.users.submissions.edit.url} element={<EditAbstractPage />} />
					</Route>


					{/* Rutas para todos los usuarios */}
					<Route path={routes.users.profile} element={<UserDashboardPage />} />
					<Route path={routes.users.settings} element={<SettingsPage />} />
					<Route path={routes.users.notifications} element={<NotificationsPage />} />
				</Route>
			</Route>

			<Route path={'/test'} element={<TestPage />} />
			<Route path={'/test/abstract-submission'} element={<TestAbstractFeaturePage />} />
			<Route path={routes.auth.verify} element={<VerifyEmailPage />} />

			{/* Para rutas diferentes */}
			<Route path='*' element={<NotFound />} />
		</Routes>
	)
}

export default App
