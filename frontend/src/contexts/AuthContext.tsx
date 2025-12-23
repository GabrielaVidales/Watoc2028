import { createContext, PropsWithChildren, useContext, useState } from "react";

interface Auth {
    login: (email: string, password: string) => Promise<any | null>,
    logout: () => Promise<any | null>,
    currentUser: string | null
}

const AuthContext = createContext<Auth | null>(null)

export const useAuth = () => {
    const currentCtx = useContext(AuthContext)
    if (!currentCtx) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return currentCtx;
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [currentUser, setCurrentUser] = useState(null)

    const login = (
        email: string,
        password: string
    ) => {
        return Promise.resolve()
    }

    const logout = () => {
        return Promise.resolve()
    }

    return (
        <AuthContext value={{ login, logout, currentUser }}>
            {children}
        </AuthContext>
    )
}
