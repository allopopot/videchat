"use client"
import { useAuthUser } from "@/context/AuthUserContext"
import Link from "next/link"
export default function Index() {
  const auth = useAuthUser()
  return (
    <div className="w-full h-full overflow-auto grid place-items-center">
      <div className="text-center">
        {
          auth?.user ?
            <p className="text-lg italic font-semibold">Welcome {auth.user.user_metadata.fullname}</p>
            :
            <p className="text-lg italic font-semibold">Welcome to VideChat</p>
        }
        {
          !auth?.user
            ?
            <div>
              <Link href={"/auth/login"} className="inline-block px-3 py-1 rounded bg-white text-green-500 font-semibold shadow mr-2">Login</Link>
              <Link href={"/auth/register"} className="inline-block px-3 py-1 rounded bg-white text-green-500 font-semibold shadow mr-2">Register</Link>
            </div>
            :
            <div>
              <Link href={"/main"} className="inline-block px-3 py-1 rounded bg-white text-green-500 font-semibold shadow mr-2">Go to App</Link>
            </div>
        }
      </div>
    </div>
  )
}
