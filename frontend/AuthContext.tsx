import React, { createContext, useState, useContext, ReactNode } from 'react';

type AuthContextType = {
    username: string | null;
    setUsername: (name: string | null) => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({children} : {children: ReactNode}) => {
    const [username, setUsername] = useState<string | null>(null)

    return (
        <AuthContext.Provider value={{ username, setUsername }}>
        {children}
      </AuthContext.Provider>    );
};


export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};