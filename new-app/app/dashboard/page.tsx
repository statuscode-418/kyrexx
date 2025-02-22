
"use client"
import { AppealCard } from "../../components/appeal-card"
import { BottomNav } from "../../components/bottom-nav"
import { useHighestVotes } from "../../hooks/useAppeal"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { useSwipeable } from 'react-swipeable'
import { casteVoteFunc } from "@/lib/functions/functions"
import { TopNav } from "@/components/top-nav"

export default function Page() {
  const router = useRouter()
  const { data: appeals, isLoading, error } = useHighestVotes()

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      router.push('/profile')
    },
    onSwipedRight: () => {
      router.push('/dashboard')
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: true,
    delta: 50,
    swipeDuration: 500,
    touchEventOptions: { passive: false }
  })



  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 p-4 text-white">Loading...</div>
  }

  if (error) {
    return <div className="min-h-screen bg-gray-950 p-4 text-white">Error: {error.message}</div>
  }

  const now = BigInt(Date.now())

  const upcomingAppeals = (appeals ?? []).filter(a => a.startTime > now)
  const ongoingAppeals = (appeals ?? []).filter(a => a.startTime <= now && a.endTime > now)
  const pastAppeals = (appeals ?? []).filter(a => a.endTime <= now)

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getDuration = (start: bigint, end: bigint) => {
    const days = Number(end - start) / (1000 * 60 * 60 * 24)
    return `${Math.ceil(days)} days`
  }

  

  return (
    
    <div {...handlers} className="min-h-screen bg-gray-950 pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-6">All Events</h1>
      <div className="hidden md:block">
        <TopNav />
      </div>
        {/* Upcoming Events */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Upcoming Events</h2>
          {upcomingAppeals.length > 0 ? (
            upcomingAppeals.map((appeal) => (
              <AppealCard
                appealId={String(appeal.id)}
                name={appeal.uri}
                startDate={formatDate(appeal.startTime)}
                duration={getDuration(appeal.startTime, appeal.endTime)}
                status="upcoming"
              />
            ))
          ) : (
            <p className="text-gray-400">No upcoming events created yet.</p>
          )}
        </section>

        {/* Ongoing Events */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Ongoing Events</h2>
          {ongoingAppeals.length > 0 ? (
            ongoingAppeals.map((appeal) => (
              <AppealCard
                appealId={String(appeal.id)}
                name={appeal.uri}
                startDate={formatDate(appeal.startTime)}
                duration={getDuration(appeal.startTime, appeal.endTime)}
                status="ongoing"
                showActions
              />
            ))
          ) : (
            <p className="text-gray-400">No ongoing events at the moment.</p>
          )}
        </section>

        {/* Past Events */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Past Events</h2>
          {pastAppeals.length > 0 ? (
            pastAppeals.map((appeal) => (
              <AppealCard
                appealId={String(appeal.id)}
                name={appeal.uri}
                startDate={formatDate(appeal.startTime)}
                duration={getDuration(appeal.startTime, appeal.endTime)}
                status="end"
                votes={{
                  yes: Number(appeal.forScore),
                  no: Number(appeal.againstScore)
                }}
              />
            ))
          ) : (
            <p className="text-gray-400">No past events recorded.</p>
          )}
        </section>
      </div>
      <button
        className="fixed bottom-36 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-800 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-105"
        onClick={() => router.push('/scanning-page')}
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Floating Add Button */}
      <button
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-pink-500 to-fuchsia-800 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-105"
        onClick={() => router.push('/create-proposal')}
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

            <div className="md:hidden">
              <BottomNav />
            </div>
    </div>
  )
}
