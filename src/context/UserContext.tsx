"use client"

import { createContext, useContext, ReactNode } from "react";
import { useUser } from "@/hooks/useUser";
import { UserProfile } from "@/app/home/interfaces/UserProfile";

interface UserContextType{
    user: UserProfile | null;
    loading: boolean;
    updateProfilePhoto: (newProfilePhoto: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const { user, loading, setUser } = useUser();

    const updateProfilePhoto = (newProfilePhoto: string) => {
        if(user) {
            setUser({...user, fotoPerfil: newProfilePhoto})
        }
    }

    return (
        <>
            <UserContext.Provider value={{user, loading, updateProfilePhoto}}>
                {children}
            </UserContext.Provider>
        </>
    )
}

// Hook para acceder al contexto
export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);

    if(!context) {
        throw new Error("useUserContext debe usarse dentro de un UserProvider");
    }

    return context;
}