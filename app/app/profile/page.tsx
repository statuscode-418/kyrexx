"use client"

import { BottomNav } from "../../components/bottom-nav"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { useSwipeable } from "react-swipeable"
import { useAccount, useDisconnect } from "wagmi"

export default function ProfilePage() {
    const router = useRouter()
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()

    // Redirect to login if wallet is disconnected
    useEffect(() => {
        if (!isConnected) {
            router.push("/")
        }
    }, [isConnected, router])

    const handlers = useSwipeable({
        onSwipedRight: () => {
            router.push("/feed")
        },
        preventScrollOnSwipe: true,
        trackTouch: true,
        trackMouse: true,
        delta: 50,
        swipeDuration: 500,
        touchEventOptions: { passive: false }
    })

    return (
        <div {...handlers}>
            <div className="min-h-screen bg-gray-950 flex flex-col text-white p-6 pb-20">
                <h1 className="text-2xl font-bold mb-6 text-left">User Profile</h1>

                <div className="mb-6">
                    <p className="text-lg text-green-500">Verified</p>
                    <p className="text-sm text-gray-400">
                        MetaMask ID: {address ? address : "Not Connected"}
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="text-lg font-semibold">
                        Appeals Created: <span className="font-normal">10</span>
                    </p>
                    <p className="text-lg font-semibold">
                        Appeals Voted: <span className="font-normal">23</span>
                    </p>
                </div>

                {isConnected ? (
                    <button
                        className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg w-full"
                        onClick={() => disconnect()}
                    >
                        Disconnect Wallet
                    </button>
                ) : (
                    <button
                        className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg w-full"
                        onClick={() => router.push("/")}
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
            <BottomNav />
        </div>
    )
}
