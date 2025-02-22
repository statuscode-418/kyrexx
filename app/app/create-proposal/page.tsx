"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createAppealFunc } from "@/lib/functions/functions"
import { useAccount } from "wagmi"

export default function CreateProposalPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isConnected } = useAccount()

  const [formData, setFormData] = useState({
    uri: "",
    startTime: "",
    votingPeriod: "7",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!isConnected) {
      window.alert("Wallet not connected. Please connect your wallet to create a proposal.")
      return
    }

    try {
      setIsSubmitting(true)

      const startTimeDate = new Date(formData.startTime)
      const startTimeUnix = BigInt(Math.floor(startTimeDate.getTime() / 1000))

      const votingPeriodSeconds = BigInt(parseInt(formData.votingPeriod) * 24 * 60 * 60)

      const tx = await createAppealFunc({
        startTime: startTimeUnix,
        votingPeriod: votingPeriodSeconds,
        uri: formData.uri,
        executionData: "0x4d53646d" as `0x${string}`,
        target: "0x900730EA2C10d31f9C8311c0A661aBB9cA09214E" as `0x${string}`,
        hookData: "0x"
      })

      console.log(tx)
      window.alert("Proposal created successfully! Your proposal has been created and will start at the specified time.")

    } catch (err) {
      console.error("Error creating proposal:", err)
      let errorMessage = "An unexpected error occurred while creating the proposal"

      if (err instanceof Error) {
        if (err.message.includes("StartTimeInPast")) {
          errorMessage = "Start time must be in the future"
        } else if (err.message.includes("InvalidVotingPeriod")) {
          errorMessage = "Invalid voting period duration"
        } else {
          errorMessage = err.message
        }
      }

      window.alert(`Error creating proposal: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (

    <div className="min-h-screen bg-gray-950 pb-20">
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-2xl font-bold text-white">
              Create New Network State Proposal
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Proposal URI Field */}
              <div className="space-y-3">
                <Label htmlFor="uri" className="text-gray-300">
                  Proposal URI
                </Label>
                <Input
                  id="uri"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="ipfs://... or https://..."
                  value={formData.uri}
                  onChange={(e) => setFormData(prev => ({ ...prev, uri: e.target.value }))}
                  required
                />
              </div>

              {/* Start Time Field */}
              <div className="space-y-3">
                <Label htmlFor="startTime" className="text-gray-300">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  className="bg-gray-800 border-gray-700 text-white [color-scheme:dark] focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {/* Voting Period Field */}
              <div className="space-y-3">
                <Label htmlFor="votingPeriod" className="text-gray-300">
                  Voting Period (days)
                </Label>
                <Input
                  id="votingPeriod"
                  type="number"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  min="1"
                  max="30"
                  value={formData.votingPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, votingPeriod: e.target.value }))}
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-pink-500 text-pink-500 hover:bg-pink-500/10 hover:text-pink-500"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  disabled={isSubmitting || !isConnected}
                >
                  {isSubmitting ? "Creating..." : "Create Proposal"}
                </Button>
                <ConnectButton />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
