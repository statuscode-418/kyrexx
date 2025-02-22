"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import Image from "next/image";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {

  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/feed");
    }
  }, [isConnected, router]);

  return (
    <main className="flex min-h-screen bg-gray-950">
      <div className="m-auto max-w-md w-full px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              width={64}
              height={64}
              alt="Kyrex Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-white text-5xl font-bold text-center">
            Kyrex
          </h2>

          <p className="text-lg text-center text-gray-400 max-w-sm">
            Secure your Aadhaar data and participate in democratic voting
          </p>

          {isConnected ? (
            <p className="text-green-500 text-lg font-medium">Redirecting to feed...</p>
          ) : (
            <div className="w-full flex justify-center">
              <ConnectButton />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
