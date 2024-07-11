"use client"
import Link from "next/link"
import z from "zod"
import { FormEvent, useState } from "react"
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { useSupabaseContext } from "@/context/SupabaseContext";

const RegisterValidator = z.object({
    fullname: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
})

export type RegisterValidator = z.infer<typeof RegisterValidator>;

export default function Register() {
    const supabase = useSupabaseContext()
    const [formErrors, setFormErrors] = useState<any>()

    async function register(ev: FormEvent) {
        const formTarget = ev.target as HTMLFormElement
        ev.preventDefault()
        setFormErrors(null)
        const formdata = new FormData(formTarget)

        var payload = RegisterValidator.safeParse({
            fullname: formdata.get("fullname")?.toString() ?? "",
            email: formdata.get("email")?.toString() ?? "",
            password: formdata.get("password")?.toString() ?? "",
        })
        if (payload.error) {
            payload.error.flatten().fieldErrors
            setFormErrors(payload.error.flatten().fieldErrors)
            return;
        }
        formTarget.reset()
        const credentials: SignUpWithPasswordCredentials = {
            email: payload.data.email,
            password: payload.data.password,
            options: {
                data: {
                    fullname: payload.data.fullname
                }
            }
        }
        const response = await supabase.auth.signUp(credentials)

        if (response.error) {
            alert("Account Creation Error")
            console.log(response.error)
            return;
        }
        alert("Check Email for verification link")

    }
    return (
        <div className="w-full h-full overflow-auto grid place-items-center p-5">
            <div className="bg-white text-black rounded w-full lg:w-1/3 shadow-lg">
                <div className="p-5">
                    <p className="text-xl font-semibold">VideChat</p>
                    <p className="text-lg">Register</p>
                </div>
                <hr className="border border-gray-400" />
                <div className="p-5">
                    <form onSubmit={(ev) => { register(ev) }}>
                        <div className="mb-3">
                            <label className="mb-1 block" htmlFor="fullname">Full Name</label>
                            <input type="text" name="fullname" id="fullname" className="w-full border-2 rounded border-gray-500" />
                            <small className="text-sm text-red-500">{formErrors?.fullname?.join(", ")}</small>
                        </div>
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
                            <Link className="hover:underline" href={"/auth/login"}>Or Login</Link>
                            <input type="submit" value="Register" className="bg-green-500 text-white rounded px-2 py-1 font-semibold" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}