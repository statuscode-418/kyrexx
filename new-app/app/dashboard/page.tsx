
"use client";

import React from "react";
import { useHighestVotes } from "@/hooks/useAppeal";
import { TopNav } from "@/components/top-nav";
import { BottomNav } from "@/components/bottom-nav";
import { useSwipeable } from "react-swipeable";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

export default function Dashboard() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const { data: appeals, isLoading, error } = useHighestVotes();

  const handlers = useSwipeable({
    onSwipedLeft: () => router.push("/profile"),
    onSwipedRight: () => router.push("/feed"),
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: true,
    delta: 50,
    swipeDuration: 500,
    touchEventOptions: { passive: false },
  });

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <p>Please connect your MetaMask wallet to view your appeals dashboard.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p>Loading appeals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const myAppeals = (appeals ?? []).filter(
    (appeal) => appeal.appealerId.toLowerCase() === address.toLowerCase()
  );

  const formatDate = (timestamp: bigint) =>
    new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div {...handlers} className="min-h-screen bg-gray-950 text-white pb-20">
      <div className="hidden md:block">
        <TopNav />
      </div>

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="bg-gray-800 rounded-lg p-6 shadow mb-8">
          <h2 className="text-xl font-semibold mb-2">My Appeals</h2>
          <p className="text-gray-300">
            You have created{" "}
            <span className="font-bold text-white">{myAppeals.length}</span>{" "}
            appeal{myAppeals.length !== 1 && "s"}.
          </p>
        </div>

        {myAppeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAppeals.map((appeal) => (
              <div
                key={String(appeal.id)}
                className="bg-gray-800 p-4 rounded shadow hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="font-bold text-lg">{appeal.uri}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Start: {formatDate(appeal.startTime)} <br />
                  End: {formatDate(appeal.endTime)}
                </p>
                <div className="mt-2 text-sm">
                  <span className="text-green-400">
                    For: {String(appeal.forScore)}
                  </span>{" "}
                  |{" "}
                  <span className="text-red-400">
                    Against: {String(appeal.againstScore)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">
            You haven't created any appeals yet.
          </p>
        )}
      </div>

      <div className="md:hidden fixed bottom-0 w-full">
        <BottomNav />
      </div>
    </div>
  );
}
