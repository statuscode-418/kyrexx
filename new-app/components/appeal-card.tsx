"use client"
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"
import React from 'react'
import { casteVoteFunc } from '@/lib/functions/functions'
import { getAccount } from '@wagmi/core'
import { useQueryClient } from "@tanstack/react-query";
import { config } from '@/lib/wagmi'
import { toast } from "sonner"




interface AppealCardProps {
  appealId: string; 
  name: string
  startDate: string
  duration: string
  status: "ongoing" | "end" | "upcoming"
  showActions?: boolean
  votes?: {
    yes: number
    no: number
  }
}



export function AppealCard({ appealId, name, startDate, duration, status, showActions = false, votes }: AppealCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "text-green-500"
      case "end":
        return "text-red-500"
      case "upcoming":
        return "text-orange-500"
      default:
        return "text-gray-500"
    }
  }

  const [selected, setSelected] = useState<'yes' | 'no' | null>(null)
  const [tempSelection, setTempSelection] = useState<'yes' | 'no' | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null);
  const queryClient = useQueryClient();


  const handleSelect = (choice: 'yes' | 'no') => {
    setTempSelection(choice) // Temporarily store the choice
    setDialogOpen(true) // Open the dialog
  }

  // const handleConfirm : React.MouseEventHandler<HTMLButtonElement>= async (proposalId: string, weight: 1n | -1n) => {
  //   const accountInfo = getAccount(config);
  //   if (!accountInfo.address) {
  //     toast.error("Please connect your wallet to vote");
  //     return;
  //   }

  //   setVotingInProgress(proposalId);
  //   try {
  //     await casteVoteFunc({
  //       proposalId: BigInt(proposalId), // ✅ Fixed type conversion
  //       weight,
  //       hookData: "0x",
  //     });

  //     toast.success("Vote cast successfully!");
  //     alert('Vote cast successfully!')
  //     queryClient.invalidateQueries({ queryKey: ["trendingProposals"] });
  //   } catch (error) {
  //     console.error("Voting failed:", error);
  //     // toast.error("Failed to cast vote");
  //   } finally {
  //     setVotingInProgress(null);
  //   }
  // };

  // Update handleConfirm to accept the event parameter and use tempSelection
const handleConfirm: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
  const accountInfo = getAccount(config);
  if (!accountInfo.address) {
    toast.error("Please connect your wallet to vote");
    return;
  }

  // Convert selection to weight
  const weight = tempSelection === 'yes' ? BigInt(1) : BigInt(-1);
  
  setVotingInProgress(appealId); 
  try {
    await casteVoteFunc({
      proposalId: BigInt(appealId),
      weight,
      hookData: "0x",
    });

    toast.success("Vote cast successfully!");
    setSelected(tempSelection); // Update the final selection
    queryClient.invalidateQueries({ queryKey: ["trendingProposals"] });
  } catch (error) {
    console.error("Voting failed:", error);
    toast.error("Failed to cast vote");
  } finally {
    setVotingInProgress(null);
    setDialogOpen(false); // Close the dialog after voting
  }
};
  

  const handleCancel = () => {
    setTempSelection(null) // Reset temporary selection
    setDialogOpen(false) // Close the dialog
  }

  return (
    <div className="rounded-lg bg-gray-900 p-4 mb-4 shadow-lg ">
      <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
      <div className="space-y-1 mb-4">
        <div className="flex items-center text-gray-400">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span className="text-l">{startDate}</span>
        </div>
        <div className="flex items-center text-gray-400">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span className="text-l">Duration: {duration}</span>
        </div>
        <div className="flex items-center">
          <span className="text-l mr-2 text-white">Status:</span>
          <span className={`text-sm capitalize ${getStatusColor(status)}`}>{status}</span>
        </div>
      </div>

      {showActions ? (
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleSelect('yes')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 flex-1
              ${selected === 'yes' 
                ? 'bg-gradient-to-r from-pink-500 to-fuchsia-800 text-white' 
                : 'bg-gradient-to-r from-pink-500 to-fuchsia-800  text-white hover:bg-gray-300'}
              ${selected === 'no' && 'opacity-50 cursor-not-allowed'}`}
          >
            Yes
          </button>
          <button
            onClick={() => handleSelect('no')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 flex-1
              ${selected === 'no' 
                ? 'bg-gradient-to-r from-pink-500 to-fuchsia-800 text-white' 
                : 'bg-gradient-to-r from-pink-500 to-fuchsia-800 text-white hover:bg-gray-300'}
              ${selected === 'yes' && 'opacity-50 cursor-not-allowed'}`}
          >
            No
          </button>
        </div>
      ) : votes ? (
        <div className="flex gap-4">
          <div className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-800 text-white rounded-md py-2 text-center">{votes.yes}</div>
          <div className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-800 text-white rounded-md py-2 text-center">{votes.no}</div>
        </div>
      ) : null}

      {/* Alert Dialog */}
      <div className='mx-7'>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen} >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Choice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to vote <span className="font-bold">{tempSelection?.toUpperCase()}</span> for this appeal?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='text-black py-2' onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  )
}