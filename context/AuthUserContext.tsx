"use client"
import { User } from "@supabase/supabase-js";
import { createContext, useState, useContext, useEffect, Dispatch, SetStateAction } from "react";
import { useSupabaseContext } from "./SupabaseContext";

type AuthUserContext = {
    user: User | null | undefined,
    setUser: Dispatch<SetStateAction<User | null | undefined>>,
    logout: Function
}

const AuthUserContext = createContext<AuthUserContext | null>(null)

export function AuthUserProvider({ children }: any) {
    const supabase = useSupabaseContext()
    const [user, setUser] = useState<User | null | undefined>()
    function logout() {
        setUser(null)
        supabase.auth.signOut()
    }
    useEffect(() => {
        supabase.auth.getUser().then(response => {
            if (response?.data?.user) {
                setUser(response?.data?.user)
            }
        })
    }, [])
    return (
        <AuthUserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthUserContext.Provider >
    );
}

export function useAuthUser() {
    const AuthContext = useContext(AuthUserContext)
    if (!AuthContext) { throw new Error("AuthContext is not set") }
    return AuthContext
}