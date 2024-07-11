"use client"
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

const SupabaseContext = createContext<SupabaseClient | null>(null)

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function SupabaseProvider({ children }: any) {
    return (
        <SupabaseContext.Provider value={supabase}>
            {children}
        </SupabaseContext.Provider >
    );
}

export function useSupabaseContext() {
    const supabaseContext = useContext(SupabaseContext)
    if (!supabaseContext) { throw new Error("SupabaseContext is not set") }
    return supabaseContext
}   