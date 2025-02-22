"use client";
import { AppealCard } from "../../components/appeal-card";
import { BottomNav } from "../../components/bottom-nav";
import { useHighestVotes } from "../../hooks/useAppeal";
import { useRouter } from "next/navigation";
import React from "react";
import { useSwipeable } from "react-swipeable";
import { TopNav } from "@/components/top-nav";

export default function Page() {
  const router = useRouter();
  const { data: appeals, isLoading, error } = useHighestVotes();

  const handlers = useSwipeable({
    onSwipedLeft: () => router.push("/profile"),
    onSwipedRight: () => router.push("/dashboard"),
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: true,
    delta: 50,
    swipeDuration: 500,
    touchEventOptions: { passive: false },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 p-4 text-white flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-4 text-white flex items-center justify-center">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const now = BigInt(Math.floor(Date.now() / 1000));

  const upcomingAppeals = (appeals ?? [])
    .filter((a) => a.startTime > now)
    .sort((a, b) => Number(a.startTime - b.startTime));

  const ongoingAppeals = (appeals ?? [])
    .filter((a) => a.startTime <= now && a.endTime > now)
    .sort((a, b) => Number(a.startTime - b.startTime));

  const pastAppeals = (appeals ?? [])
    .filter((a) => a.endTime <= now)
    .sort((a, b) => Number(b.endTime - a.endTime));

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDuration = (start: bigint, end: bigint) => {
    const days = (Number(end - start) * 1000) / (1000 * 60 * 60 * 24);
    return `${Math.ceil(days)} days`;
  };

  // Helper to render a section of events
  const renderEventSection = (title: string, eventList: any[], status: string) => (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
        {title} Events
      </h2>
      {eventList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventList.map((appeal) => (
            <AppealCard
              key={String(appeal.id)}
              appealId={String(appeal.id)}
              name={appeal.uri}
              startDate={formatDate(appeal.startTime)}
              duration={getDuration(appeal.startTime, appeal.endTime)}
              status={status}
              showActions={status === "ongoing"}
              votes={
                status === "past"
                  ? {
                    yes: Number(appeal.forScore),
                    no: Number(appeal.againstScore),
                  }
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">No {status} events available.</p>
      )}
    </section>
  );

  return (
    <div {...handlers} className="min-h-screen bg-gray-950">
      <div className="hidden md:block">
        <TopNav />
      </div>

      {/* Main container */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">All Events</h1>

        {/* Upcoming Events */}
        {renderEventSection("Upcoming", upcomingAppeals, "upcoming")}

        {/* Ongoing Events */}
        {renderEventSection("Ongoing", ongoingAppeals, "ongoing")}

        {/* Past Events */}
        {renderEventSection("Past", pastAppeals, "past")}
      </div>

      {/* Bottom Navigation for mobile */}
      <div className="md:hidden fixed bottom-0 w-full">
        <BottomNav />
      </div>
    </div>
  );
}
