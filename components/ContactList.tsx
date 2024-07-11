"use client"
import { useAuthUser } from "@/context/AuthUserContext"
import { useEffect, useRef, useState } from "react"
import Invite from "./Invite"
import { useSupabaseContext } from "@/context/SupabaseContext"
import { usePeerContext } from "@/context/PeerContext"

export default function ContactList() {
    const [toggle, setToggle] = useState(true)
    const auth = useAuthUser()
    const supabase = useSupabaseContext()
    const [contacts, setContacts] = useState<any[]>([])
    const intersectingRef = useRef<HTMLDivElement>(null)
    const { callTo } = usePeerContext()

    async function getContactList() {
        const lastIndex = contacts[contacts.length - 1]?.id ?? 0
        if (!auth.user?.id) { return }
        const response = await supabase.from("contacts").select(`*,contact:contact_id(fullname,email)`).eq("user_id", auth.user?.id).in("status", ["pending", "contact"]).gt("id", lastIndex).limit(10)
        if (response.error) { alert("Error Occurred"); console.log(response.error); return; }
        setContacts([...contacts, ...response?.data])
    }

    async function rsvp(id: number, answer: "accept" | "decline") {
        const response = await supabase.from("contacts").select("*").eq("id", id)
        if (response.error) { alert("Error Occurred"); console.log(response.error); return; }
        const contact = response.data[0]
        if (contact.isInitiated === true) { alert("Cannot Accept Own Request."); return }

        const job1 = supabase.from("contacts").update({
            status: answer === "accept" ? "contact" : "decline"
        }).eq("id", id).select()
        const job2 = supabase.from("contacts").update({
            status: answer === "accept" ? "contact" : "decline"
        }).eq("user_id", contact.contact_id).eq("contact_id", contact.user_id).select()
        await Promise.all([job1, job2])

        if (answer === "accept") {
            alert("Acccepted.")
        } else { alert("Rejected.") }
        getContactList()
    }

    useEffect(() => {
        let observer = new IntersectionObserver((entries, observer) => {
            entries.map(el => {
                if (el.isIntersecting) {
                    getContactList()
                }
            })

        }, { threshold: 0, rootMargin: "0px" });
        if (intersectingRef.current) {
            observer.observe(intersectingRef.current)
        }
    }, [auth.user])

    return (
        <div className={"transition-all absolute bg-white text-black h-full shadow-lg border-t-2 w-full sm:w-full md:w-[25rem] z-[99] " + (toggle ? "translate-x-[0%]" : "translate-x-[-100%]")}>
            <div onClick={() => { setToggle(!toggle) }} className={"py-4 px-1 absolute rounded-full top-[50%] translate-y-[-50%] animate-pulse " + (toggle ? "right-[5%] bg-green-500" : "right-[-5%] bg-white")}></div>

            <div className="p-5 border-b-2 flex justify-between items-center">
                <p>Welcome {auth.user?.user_metadata.fullname}</p>
                <Invite></Invite>
            </div>

            <div className="h-full overflow-auto">
                {
                    contacts.map((el: any, index: number) => {
                        return (
                            <div className="py-2 px-4 border-b flex items-center justify-between" key={index}>
                                <div>
                                    <h3>{el.contact?.fullname}</h3>
                                    <em>{el.contact?.email}</em>
                                    {
                                        (el.status == "pending" && el.isInitiated === true) &&
                                        <p>
                                            <span className="px-2 py-1 text-sm rounded bg-green-500 text-white">Pending</span>
                                        </p>
                                    }
                                    {
                                        (el.status == "pending" && el.isInitiated === false) &&
                                        <div className="flex gap-2 w-full mt-2">
                                            <button className="grow bg-green-500 text-white rounded py-2" onClick={() => { rsvp(el.id, "accept") }}>Accept</button>
                                            <button className="grow bg-red-500 text-white rounded py-2" onClick={() => { rsvp(el.id, "decline") }}>Decline</button>
                                        </div>
                                    }
                                </div>
                                <div>
                                    <button className="bg-green-500 text-white rounded px-2 py-1" onClick={() => { callTo(el.contact_id, el.contact?.fullname) }}>Call</button>
                                </div>

                            </div>
                        )
                    })
                }
                <div className="h-[10rem] spacer" ref={intersectingRef}></div>
            </div>
        </div>
    )
}