"use client"
import { usePeerContext } from "@/context/PeerContext"
import { useEffect, useRef } from "react"
export default function Main() {
    const myvideoRef = useRef<HTMLVideoElement>(null)
    const remotevideoRef = useRef<HTMLVideoElement>(null)
    const { myVideoStream, remoteVideoStream } = usePeerContext()

    useEffect(() => {
        if (myvideoRef?.current !== null) {
            myvideoRef.current.srcObject = myVideoStream as MediaProvider
            myvideoRef.current.play()
        }
    }, [myVideoStream])

    useEffect(() => {
        if (remotevideoRef?.current !== null) {
            remotevideoRef.current.srcObject = remoteVideoStream as MediaProvider
            remotevideoRef.current.play()
        }
    }, [remoteVideoStream])

    return (
        <div className="w-full h-full overflow-hidden grid place-items-center grid-rows-2 sm:grid-rows-2 md:grid-cols-2 md:grid-rows-none p-3 gap-2">
            <CallNotification></CallNotification>
            <video muted={true} ref={myvideoRef} className="rounded-lg h-full w-auto object-cover object-center"></video>
            <video muted={false} ref={remotevideoRef} className="rounded-lg h-full w-auto object-cover object-center"></video>
            <ActionBar></ActionBar>
        </div>
    )
}

function CallNotification() {
    const { isReceivingCall, name, answer, close, isCalling } = usePeerContext()

    return (
        <div className={"z-[99] overflow-hidden transition-all flex flex-row items-center justify-between w-11/12 sm:w-11/12 md:w-1/3 py-2 px-3 shadow-lg rounded bg-white text-black fixed left-[50%] translate-x-[-50%] " + (isReceivingCall || isCalling ? "top-[15%]" : "top-[-100%]")}>
            <div>
                <p className="text-md font-bold">{name}</p>
                <em className="text-xs">Video Call</em>
            </div>
            <div className="flex items-center gap-1">
                {!isCalling &&
                    <button onClick={() => { answer() }} className="rounded-full px-2 py-1 text-sm bg-green-500 text-white">Answer</button>
                }
                <button onClick={() => { close() }} className="rounded-full px-2 py-1 text-sm bg-red-500 text-white">Discard</button>
            </div>

        </div>
    )
}

function ActionBar() {
    const { close, isOnCall } = usePeerContext()

    return (
        <div className={"bg-gray-900/50 rounded-lg p-3 fixed left-[50%] translate-x-[-50%] w-11/12 sm:w-11/12 md:w-1/3 flex justify-center items-center  " + (isOnCall ? "bottom-[2%]" : "bottom-[100%]")}>
            <button onClick={() => { close() }} className="rounded-full px-2 py-1 text-sm bg-red-500 text-white">End Call</button>
        </div>
    )
}