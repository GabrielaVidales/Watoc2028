import React from 'react';
import axiosClient from '../clients/axiosClient';

interface User {

}

interface APIContextValue {
    login: (input: { username: string, password: string }) => Promise<User | null>,
    post: (url: { url: string }) => any,
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
        login: async ({ username, password }) => {
            console.log(`Base URL=${axiosClient}`)
            const response = await axiosClient.post('/login', {
                username,
                password,
            })
            return response
        },
        post: async ({ url }) => {
            const response = await axiosClient.get(url)
            return response
        }
    }
    return (
        <APIContext value={value}>
            {children}
        </APIContext>
    )
}
