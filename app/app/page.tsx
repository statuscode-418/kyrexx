"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import Image from "next/image";
import React from "react";

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
    <main className="flex flex-col min-h-[75vh] mx-auto justify-center items-center w-full p-4 bg-gray-950">
      <div className="max-w-4xl w-full">
      <div className="flex items-center justify-center pt-8 pb-6">
      <div className="w-40 h-40 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                <Image 
                    src="/logo.png" 
                    width={69}
                    height={69}
                    alt="Kyrex Logo" 
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
        <h2 className="text-white text-4xl text-center">
          Kyrex
        </h2>

        <div className="text-md mt-4 mb-8 text-[#717686]">
          Keep your AAdhaar Data secured and use vote anyone you want
        </div>

        <div className="flex w-full gap-8 mb-8">
          {isConnected ? (
            <p className="text-green-500 font-rajdhani">Redirecting to feed...</p>
          ) : (
            <button
              className="bg-[#009A08] rounded-lg text-white px-6 py-1 font-rajdhani font-medium"
              onClick={() =>
                connectors[0] && connect({ connector: connectors[0] })
              }
            >
              CONNECT WALLET
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
