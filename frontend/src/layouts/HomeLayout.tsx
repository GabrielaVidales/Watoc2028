import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import { Outlet } from 'react-router'

function HomeLayout() {
    return (<>
        <NavBar />
        <main  style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <Outlet />
        </main>
        <Footer />
    </>
    )
}

export default HomeLayout