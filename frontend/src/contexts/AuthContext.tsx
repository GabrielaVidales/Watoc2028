import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";
import api, { guestApi } from "../clients/api";
import type { ParticipantSchema, ReviewerSchema, UserSchema } from "@/schemas/user-schemas";


export type UserProfile = {
    participant?: ParticipantSchema
    reviewer?: ReviewerSchema
}

export type AuthContextValue = {
    user?: UserSchema | null,
    isLoading: boolean,
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
    const [user, setUser] = useState<UserSchema | null>()
    const [isLoading, setIsLoading] = useState(true);

    async function fetchUser() {
        setIsLoading(true);
        try {
            const res = await api.get('/users/session/');
            if (import.meta.env.DEV) {
                console.log(res.data);
            }
            setUser(res.data.anonymous ? null : res.data.user);
        } catch (error) {
            if (import.meta.env.DEV) {
                console.log(error.response);
            }
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLogin(email: string, password: string) {
        await guestApi.post('/auth/login/', { email, password })
        await fetchUser()
    }

    async function handleLogout() {
        await api.post('/auth/logout/')
        setUser(null)
    }

    async function getProfile() {
        try {
            const res = await api.get<UserProfile>('/users/profile/');
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
        user,
        isLoading,
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
