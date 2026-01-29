import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import axiosClient from "../clients/axiosClient";


export type UserData = {
    prefix: string
    firstName: string
    lastName: string
    phone: string
    country: string
    city: string
    affiliation: string
    department: string
    cargo: string
    emailConfirmed: boolean
}

export type User = {
    id: Number,
    email: string,
    role: 'admin' | 'user',
    data?: UserData

}

/*
Se usa optional (?) porque eso permite en los fetching a la API
esperar a que se esté autenticando. Optional se mapea a undefined,
de modo que, mientras authToken sea undefined, es que se está esperando
a la API para que retorne un valor: null si no está autenticado y string|User
cuando sí se autentique
*/
export type AuthContextValue = {
    currentUser?: User | null,
    handleLogin: (email: string, password: string) => Promise<void>
    handleLogout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context;
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [currentUser, setCurrentUser] = useState<User | null>()

    async function fetchUser() {
        try {
            const res = await axiosClient.get('/whoami');
            setCurrentUser({
                id: res.data.id,
                email: res.data.email,
                role: res.data.role,
                data: res.data.data,
            });
        } catch {
            setCurrentUser(null);
        }
    }

    async function handleLogin(email: string, password: string) {
        const res = await axiosClient.post('/login', { email, password })
        setCurrentUser(res.data)
    }
    
    async function handleLogout() {
        await axiosClient.post('/logout')
        setCurrentUser(null)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const value: AuthContextValue = {
        currentUser,
        handleLogin,
        handleLogout
    }

    return (
        <AuthContext value={value} >
            {children}
        </AuthContext>
    )
}
