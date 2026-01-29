import { Container } from '@mui/material'
import fieldPng from '../assets/field.png'

const LoadingPage = () => {
    return (
        <>
            <Container maxWidth="xl" sx={{
                backgroundColor: 'black',
                flex: 1,
                backgroundImage: `url(${fieldPng})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            />
        </>
    )
}

export default LoadingPage