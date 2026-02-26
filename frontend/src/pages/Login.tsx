import NavBar from '../components/NavBar'
import { Box, Container, Toolbar } from '@mui/material'
import LoginForm from '../forms/LoginForm'
import Footer from '../components/Footer'

export default function Login() {
	return (
		<>
			<Box
				component='main'
				sx={{
					bgcolor: '#0a0e27',
					position: 'relative',
				}}>

				<Box sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'radial-gradient(circle at 50% 40%, rgba(25,118,210,0.15), transparent 60%)',
					pointerEvents: 'none',
				}} />

				<Toolbar />
				<Container maxWidth="sm" sx={{ position: 'relative', py: 5 }}>
					<LoginForm />
				</Container>
			</Box>
		</>
	)
}
