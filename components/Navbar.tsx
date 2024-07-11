"use client"
import Link from "next/link";
import { useAuthUser } from "@/context/AuthUserContext";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

export default function () {
    const auth = useAuthUser()
    const router = useRouter()

    async function handleLogout(ev: MouseEvent) {
        ev.preventDefault()
        auth.logout()
        router.push("/")
    }
    return (
        <div className="bg-white text-black w-full h-full flex justify-between items-center flex-nowrap px-7 shadow-lg">
            <div className="">
                <Link href={"/"} className="text-xl font-bold italic w-auto">VideChat</Link>
            </div>
            <div className="flex items-center gap-2">
                {
                    auth?.user &&
                    <>
                        {/* <p>Welcome {auth.user?.user_metadata.fullname}</p> */}
                        <button onClick={(ev) => { handleLogout(ev) }} className="px-2 py-1 bg-red-500 text-white rounded">Logout</button>
                    </>
                }
            </div>
        </div>
    )
}