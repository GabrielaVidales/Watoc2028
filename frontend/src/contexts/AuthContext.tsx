import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";
import axiosClient from "../clients/axiosClient";
import type { ParticipantSchema, ReviewerSchema, UserSchema } from "@/schemas/user-schemas";


export type UserProfile = {
    participant?: ParticipantSchema
    reviewer?: ReviewerSchema
}

export type AuthContextValue = {
    currentUser?: UserSchema | null,
    handleLogin: (email: string, password: string) => Promise<void>
    handleLogout: () => Promise<void>
    fetchUser: () => Promise<void>
    getProfile: () => Promise<UserProfile>
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
    const [currentUser, setCurrentUser] = useState<UserSchema | null>()

    async function fetchUser() {
        try {
            const res = await axiosClient.get('/users/session/');
            console.log(res.data);
            
            if (res.data.anonymous) {
                setCurrentUser(null);
            } else setCurrentUser(res.data.user)
        } catch (error) {
            if (import.meta.env.DEV) {
                console.log(error.response);
            }
            setCurrentUser(null);
        }
    }

    async function handleLogin(email: string, password: string) {
        await axiosClient.post('/login/', { email, password })
        await fetchUser()
    }

    async function handleLogout() {
        await axiosClient.post('/logout/')
        setCurrentUser(null)
    }

    async function getProfile() {
        try {
            const res = await axiosClient.get<UserProfile>('/users/profile/');
            return res.data
        } catch (error) {
            if (import.meta.env.DEV) {
                console.log(error.response);
            }
            return {}
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const value: AuthContextValue = {
        currentUser,
        handleLogin,
        handleLogout,
        fetchUser,
        getProfile,
    }

    return (
        <AuthContext value={value} >
            {children}
        </AuthContext>
    )
}
