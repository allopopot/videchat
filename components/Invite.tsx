import { useAuthUser } from "@/context/AuthUserContext"
import { useSupabaseContext } from "@/context/SupabaseContext"
import { FormEvent, useEffect, useRef, useState } from "react"

export default function Invite() {

    const [toggle, setToggle] = useState(false)
    const inviteRef = useRef<HTMLDialogElement>(null)
    const supabase = useSupabaseContext()
    const auth = useAuthUser()
    const [userFound, setUserFound] = useState<any>(null)

    useEffect(() => {
        inviteRef.current?.addEventListener("close", (ev) => {
            ev.preventDefault()
            closeDialog()
        })
        return () => {
            inviteRef.current?.removeEventListener("close", () => { })
        }
    }, [])

    useEffect(() => {
        if (toggle) {
            inviteRef.current?.showModal()
        } else {
            inviteRef.current?.close()
        }
    }, [toggle])

    function closeDialog() {
        setToggle(false)
        setUserFound(null)
    }

    async function handleSearchUser(ev: FormEvent) {
        ev.preventDefault()
        const formdata = new FormData(ev.target as HTMLFormElement)
        const searchEmail = formdata.get("email") ?? ""
        if (searchEmail === "") { setUserFound(null); return }
        const response = await supabase.from("users").select().like("email", `%${searchEmail}%`).neq("email", auth.user?.email).limit(10)
        if (response.error) { setUserFound(null); return }
        if (response.data.length === 0) {
            setUserFound([{ id: 1, fullname: "Not Found" }])
        } else {
            setUserFound(response.data)
        }
    }

    async function inviteUser(id: String) {
        const response = await supabase.from("contacts").insert([{
            user_id: auth.user?.id,
            contact_id: id,
            status: "pending",
            isInitiated: true
        },
        {
            user_id: id,
            contact_id: auth.user?.id,
            status: "pending",
            isInitiated: false
        }])
        if (response.error) {
            alert("Something went wrong")
            console.error(response.error)
            return;
        }
        alert("Invitation sent.")
        closeDialog()
    }

    return (
        <>
            <button onClick={() => { setToggle(!toggle) }} className="text-semibold text-white bg-green-500 rounded px-2 py-1">Invite</button>
            <dialog ref={inviteRef} open={false} className="bg-white text-black p-3 w-full md:w-2/5 shadow-lg rounded">
                <h1 className="text-lg font-semibold">Invite Users</h1>
                <hr className="border my-2" />
                <p>Enter Full Email Address</p>
                <form onSubmit={(ev) => { handleSearchUser(ev) }}>
                    <div className="border-black border-2 w-full flex gap-2 p-1 rounded">
                        <input type="text" name="email" className="px-2 py-1 rounded w-full" />
                        <input type="submit" value={"Search"} className="rounded px-2 py-1 bg-green-500 text-white shadow-lg" />
                        <button onClick={(ev) => { ev.preventDefault(); closeDialog() }} className="rounded px-2 py-1 shadow-lg bg-gray-500 text-white">Close</button>
                    </div>
                </form>
                <hr className="border my-2" />
                {
                    userFound && userFound.map((el: any) => {
                        return (
                            <div onClick={() => { inviteUser(el.id) }} key={el.id} className="shadow-lg rounded px-3 py-1 bg-green-500 text-white mb-2 last:mb-0">
                                <p className="font-semibold text-md">{el?.fullname}</p>
                                <p className="italic text-sm">{el?.email}</p>
                            </div>
                        )
                    })
                }
            </dialog>
        </>
    )
}