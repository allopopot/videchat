"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { MediaConnection, Peer } from "peerjs"
import { useAuthUser } from "./AuthUserContext"
import { useSupabaseContext } from "./SupabaseContext"

type PeerContext = {
    peer: Peer | undefined,
    callTo: Function,
    myVideoStream: MediaStream | undefined,
    remoteVideoStream: MediaStream | undefined,
    answer: Function,
    close: Function,
    isReceivingCall: boolean,
    isCalling: boolean,
    name: string
}

export const PeerContext = createContext<PeerContext | null>(null)

export function PeerProvider({ children }: any) {
    const auth = useAuthUser()
    const supabase = useSupabaseContext()
    const [peer, setPeer] = useState<Peer>()
    const [myVideoStream, setMyVideoStream] = useState<MediaStream>()
    const [remoteVideoStream, setRemoteVideoStream] = useState<MediaStream>()
    const [mediaConnection, setMediaConnection] = useState<MediaConnection>()
    const [isReceivingCall, setIsReceivingCall] = useState<boolean>(false)
    const [isCalling, setIsCalling] = useState<boolean>(false)
    const [name, setName] = useState("")
    const [timeout, settimeout] = useState(false)

    function reset() {
        setName("")
        setIsCalling(false)
        setIsReceivingCall(false)
        settimeout(false)
    }

    function callTo(id: string, name: string) {
        setName(name)
        if (!peer) { console.log("Peer Undefined"); return }
        if (!myVideoStream) { console.log("myVideoStream Undefined"); return }
        try {
            const conn = peer.call(id, myVideoStream)
            setMediaConnection(conn)
        } catch (error) {
            console.log(error)
        }
        console.log(`calling peer ${id}`)
        setIsCalling(true)
        settimeout(true)
    }

    function answer() {
        if (!mediaConnection) { console.log("mediaConnection Undefined"); return }
        mediaConnection.answer(myVideoStream)
    }

    function close() {
        if (!mediaConnection) { console.log("mediaConnection Undefined"); return }
        mediaConnection.close()
        reset()
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            close()
            clearTimeout(timeout)
        }, 30000);
    }, [timeout])

    useEffect(() => {
        if (!auth?.user?.id) { return; }
        if (peer !== undefined) { return; }
        const peerInstance = new Peer(auth?.user?.id)
        setPeer(peerInstance)
    }, [auth])

    useEffect(() => {
        peer?.on("open", (id) => {
            console.log(`Peer ID connected as: ${id}`)
            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => setMyVideoStream(stream))
        })

        peer?.on("call", (conn) => {
            console.log("recieving call", conn)
            settimeout(true)
            supabase.from("users").select().eq("id", conn.peer).then(response => {
                if (response.error) { return; }
                setName(response.data[0].fullname)
            })
            setIsReceivingCall(true)
            setMediaConnection(conn)
        })

        peer?.on("error", (error) => {
            console.log("Peer Error: ", error)
            reset()
        })

        peer?.on("close", () => {
            console.log("Peer closed: ")
            reset()
        })

        peer?.on("disconnected", (conn) => {
            console.log("Peer disconnected: ", conn)
            reset()
        })

    }, [peer])

    useEffect(() => {
        mediaConnection?.on("stream", (stream) => {
            setRemoteVideoStream(stream)
            reset()
        })

        mediaConnection?.on("close", () => {
            console.log("mediaConnection closed:")
            reset()
            setRemoteVideoStream(undefined)
        })

        mediaConnection?.on("willCloseOnRemote", () => {
            console.log("close on remote")
        })
    }, [mediaConnection])

    const value: PeerContext = { peer, callTo, myVideoStream, remoteVideoStream, close, answer, isReceivingCall, isCalling, name }

    return (
        <PeerContext.Provider value={value} >{children}</PeerContext.Provider>
    )
}

export function usePeerContext() {
    const peerContext = useContext(PeerContext)
    if (!peerContext) { throw new Error("PeerContext is not set") }
    return peerContext
}