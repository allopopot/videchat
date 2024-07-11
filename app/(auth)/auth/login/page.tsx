"use client"
import Link from "next/link"
import { FormEvent, useState } from "react"
import { useSupabaseContext } from "@/context/SupabaseContext";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";
import { useRouter } from "next/navigation"
import { LoginValidator } from "./validation"


export default function Login() {
    const router = useRouter()
    const [formErrors, setFormErrors] = useState<any>()
    const supabase = useSupabaseContext()

    async function handleLogin(ev: FormEvent) {
        const formTarget = ev.target as HTMLFormElement
        ev.preventDefault()
        setFormErrors(null)
        const formdata = new FormData(formTarget)

        var payload = LoginValidator.safeParse({
            email: formdata.get("email")?.toString() ?? "",
            password: formdata.get("password")?.toString() ?? "",
        })
        if (payload.error) {
            payload.error.flatten().fieldErrors
            setFormErrors(payload.error.flatten().fieldErrors)
            return;
        }
        formTarget.reset()
        const credentials: SignInWithPasswordCredentials = {
            email: payload.data.email,
            password: payload.data.password,
        }
        const response = await supabase.auth.signInWithPassword(credentials)
        if (response.error) {
            alert("Please check credentials")
            console.log(response.error)
            return;
        }
        router.push("/main")
    }

    return (
        <div className="w-full h-full overflow-auto grid place-items-center p-5">
            <div className="bg-white text-black rounded w-full lg:w-1/3 shadow-lg">
                <div className="p-5">
                    <p className="text-xl font-semibold">VideChat</p>
                    <p className="text-lg">Login</p>
                </div>
                <hr className="border border-gray-400" />
                <div className="p-5">
                    <form onSubmit={(ev) => { handleLogin(ev) }}>
                        <div className="mb-3">
                            <label className="mb-1 block" htmlFor="email">Email</label>
                            <input type="text" name="email" id="email" className="w-full border-2 rounded border-gray-500" />
                            <small className="text-sm text-red-500">{formErrors?.email?.join(", ")}</small>
                        </div>
                        <div className="mb-3">
                            <label className="mb-1 block" htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" className="w-full border-2 rounded border-gray-500" />
                            <small className="text-sm text-red-500">{formErrors?.password?.join(", ")}</small>
                        </div>
                        <div className="flex justify-between items-center mt-5">
                            <Link className="hover:underline" href={"/auth/register"}>Or Register</Link>
                            <input type="submit" value="Login" className="bg-green-500 text-white rounded px-2 py-1 font-semibold" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}