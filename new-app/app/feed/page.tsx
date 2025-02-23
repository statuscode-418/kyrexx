
"use client";
import { useHighestVotes } from "../../hooks/useAppeal";
import { useRouter } from "next/navigation";
import React from "react";
import { useSwipeable } from "react-swipeable";
import { casteVoteFunc } from "@/lib/functions/functions";

const AppealCard = ({
  appealId,
  name,
  startDate,
  duration,
  status,
  showActions,
  votes,
  onVoteYes,
  onVoteNo,
}: {
  appealId: string;
  name: string;
  startDate: string;
  duration: string;
  status: "upcoming" | "ongoing" | "past";
  showActions: boolean;
  votes?: { yes: number; no: number };
  onVoteYes?: () => void;
  onVoteNo?: () => void;
}) => {
  const statusColors = {
    upcoming: "bg-blue-500",
    ongoing: "bg-yellow-500",
    past: "bg-gray-500",
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:bg-gray-800 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white truncate">{name}</h3>
        <span className={`${statusColors[status]} text-xs px-2 py-1 rounded-full`}>
          {status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 text-gray-300">
        <p className="text-sm">Start Date: {startDate}</p>
        <p className="text-sm">Duration: {duration}</p>
      </div>

      {showActions && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={onVoteYes}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
            disabled={!onVoteYes}
          >
            Yes
          </button>
          <button
            onClick={onVoteNo}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
            disabled={!onVoteNo}
          >
            No
          </button>
        </div>
      )}

      {/* Display votes for ongoing and past events */}
      {votes && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex justify-between text-sm">
            <span className="text-green-400">Yes: {votes.yes}</span>
            <span className="text-red-400">No: {votes.no}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Page Component
export default function Page() {
  const router = useRouter();
  const { data: appeals, isLoading, error, refetch } = useHighestVotes();
  // State to track optimistic vote changes per appeal
  const [optimisticVotes, setOptimisticVotes] = React.useState<{ [key: string]: number }>({});

  const handleVote = async (appealId: string, weight: bigint) => {
    // Apply optimistic update immediately:
    setOptimisticVotes((prev) => ({
      ...prev,
      [appealId]: (prev[appealId] || 0) + Number(weight),
    }));

    try {
      await casteVoteFunc({
        proposalId: BigInt(appealId),
        weight,
        hookData: "0x",
      });
      // Transaction confirmed—refresh backend data
      await refetch();
      // Remove the optimistic update for this appeal
      setOptimisticVotes((prev) => {
        const newState = { ...prev };
        delete newState[appealId];
        return newState;
      });
    } catch (error) {
      console.error("Voting failed:", error);
      // Revert the optimistic update on error:
      setOptimisticVotes((prev) => ({
        ...prev,
        [appealId]: (prev[appealId] || 0) - Number(weight),
      }));
    }
  };

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

  // Render function for each event section.
  // For both ongoing and past events, we display votes.
  const renderEventSection = (title: string, eventList: any[], status: "upcoming" | "ongoing" | "past") => (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
        {title} Events
      </h2>
      {eventList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventList.map((appeal) => {
            // Get any optimistic vote change for this appeal
            const delta = optimisticVotes[String(appeal.id)] || 0;
            // Calculate new vote counts by combining backend scores with our optimistic delta.
            const yesVotes = Number(appeal.forScore) + (delta > 0 ? delta : 0);
            const noVotes = Number(appeal.againstScore) + (delta < 0 ? -delta : 0);

            return (
              <AppealCard
                key={String(appeal.id)}
                appealId={String(appeal.id)}
                name={appeal.uri}
                startDate={formatDate(appeal.startTime)}
                duration={getDuration(appeal.startTime, appeal.endTime)}
                status={status}
                showActions={status === "ongoing"}
                votes={(status === "ongoing" || status === "past")
                  ? { yes: yesVotes, no: noVotes }
                  : undefined}
                onVoteYes={status === "ongoing" ? () => handleVote(String(appeal.id), 1n) : undefined}
                onVoteNo={status === "ongoing" ? () => handleVote(String(appeal.id), -1n) : undefined}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400 italic">No {status} events available.</p>
      )}
    </section>
  );

  return (
    <div {...handlers} className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">All Events</h1>

        {/* Upcoming Events */}
        {renderEventSection("Upcoming", upcomingAppeals, "upcoming")}

        {/* Ongoing Events */}
        {renderEventSection("Ongoing", ongoingAppeals, "ongoing")}

        {/* Past Events */}
        {renderEventSection("Past", pastAppeals, "past")}
      </div>
    </div>
  );
}
