import React from 'react';
import axiosClient from '../clients/axiosClient';
import { User } from '../domain/User';

interface APIContextValue {
    login: (input: { email: string, password: string }) => Promise<User | null>,
    post: (url: string, body: {}) => any,
}

const APIContext = React.createContext<APIContextValue | null>(null)

export const useAPI = () => {
    const currentCtx = React.useContext(APIContext)
    if (!currentCtx) {
        throw new Error('useAPI must be used within an APIProvider')
    }
    return currentCtx;
}

export const APIProvider: React.FC = ({ children }: React.PropsWithChildren) => {
    const value: APIContextValue = {
        login: async ({ email, password }) => {
            console.log(`Base URL=${axiosClient}`)
            const response = await axiosClient.post<User>('/login', {
                email,
                password
            })
            return response.data
        },
        post: async (url: string, body = {}) => {
            const response = await axiosClient.post(url, body)
            return response
        }
    }
    
    return (
        <APIContext value={value}>
            {children}
        </APIContext>
    )
}
