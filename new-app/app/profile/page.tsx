"use client"

import { BottomNav } from "../../components/bottom-nav"
import { TopNav } from "../../components/top-nav"
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
        <>
            <TopNav />
            <div {...handlers}>
                <div className="min-h-screen bg-gray-950 flex flex-col text-white p-6 md:pt-20 pb-20 md:pb-6">
                    <div className="max-w-2xl mx-auto w-full">
                        <h1 className="text-2xl font-bold mb-8 text-left">User Profile</h1>

                        <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800 w-full">
                            <div className="mb-6 border-b border-gray-800 pb-6">
                                <p className="text-lg text-green-500 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Verified
                                </p>
                                <p className="text-sm text-gray-400 mt-2 break-all">
                                    MetaMask ID: {address ? address : "Not Connected"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                                    <p className="text-sm text-gray-400">Appeals Created</p>
                                    <p className="text-2xl font-semibold">10</p>
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                                    <p className="text-sm text-gray-400">Appeals Voted</p>
                                    <p className="text-2xl font-semibold">23</p>
                                </div>
                            </div>
                        </div>

                        {isConnected ? (
                            <div className="flex justify-center">
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg max-w-xs w-full"
                                    onClick={() => disconnect()}
                                >
                                    Disconnect Wallet
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-center mt-10">
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg max-w-xs w-full"
                                    onClick={() => router.push("/")}
                                >
                                    Connect Wallet
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <BottomNav />
        </>
    )
}
