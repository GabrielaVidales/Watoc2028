import React, { createContext, useContext, useState } from 'react';

const HeaderContext = createContext({
    title: '',
    setTitle: (title: string) => {},
});

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
    const [title, setTitle] = useState('');
    return (
        <HeaderContext.Provider value={{ title, setTitle }}>
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => useContext(HeaderContext);