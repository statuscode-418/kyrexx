
"use client"

import { AppealCard } from "@/components/appeal-card"
import { BottomNav } from "@/components/bottom-nav"
import { useRouter } from "next/navigation" 
import { useSwipeable } from 'react-swipeable'

export default function Page() {
      const router = useRouter()
  
      const handlers = useSwipeable({
  
          onSwipedLeft: () => {
              router.push('/feed')
          },
          preventScrollOnSwipe: true,
          trackTouch: true,       
          trackMouse: true,          
          delta: 50,                 
          swipeDuration: 500,       
          touchEventOptions: { passive: false }
      })
  return (
    <div{...handlers} className="min-h-screen bg-gray-950 pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-6">My Events</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Upcoming Events</h2>
          <AppealCard name="General Election" startDate="20th February 2025" duration="2 days" status="upcoming" />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Ongoing Events</h2>
          <AppealCard
            name="General Election"
            startDate="20th February 2025"
            duration="2 days"
            status="ongoing"
            showActions
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Past Events</h2>
          <AppealCard
            name="General Election"
            startDate="20th February 2025"
            duration="2 days"
            status="end"
            votes={{ yes: 1345, no: 564 }}
          />
        </section>
      </div>

      <BottomNav />
    </div>
  )
}

