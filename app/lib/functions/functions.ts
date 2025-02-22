import { AppealVote } from "@/config/abi/AppealVote";
import { address } from "@/config/contract/address";
import { writeContract } from "@wagmi/core";
import { createAppeal, casteVote, executeAppeal } from "@/config/types/types";
import { transactionConfig } from "../../wagmi.config"

export const createAppealFunc = async (params: createAppeal) => {
  try {
    const { startTime, votingPeriod, uri, executionData, hookData, target } = params
    const result = await writeContract(transactionConfig, {
      abi: AppealVote,
      address: address as `0x${string}`,
      functionName: "createAppeal",
      args: [{
        startTime: BigInt(startTime),
        votingPeriod: BigInt(votingPeriod),
        uri,
        executionData,
        target,
        hookData
      }]

    })
    console.log(result)
    return result
  }
  catch (error) {
    console.log("Error in createAppeal func", error)
  }

}
export const casteVoteFunc = async (params: casteVote) => {
  try {
    const { proposalId, weight, hookData } = params
    const result = await writeContract(transactionConfig, {
      abi: AppealVote,
      address: address as `0x${string}`,
      functionName: "castVote",
      args: [{
        appealId: BigInt(proposalId),
        weight: BigInt(weight),
        hookData: hookData
      }]
    })
    return result
  } catch (error) {
    console.log("Error in casteVote function", error)
  }
}


export const executeAppealfunc = async (params: executeAppeal) => {
  const { appealId } = params
  try {
    const result = await writeContract(transactionConfig, {
      abi: AppealVote,
      address: address as `0x${string}`,
      functionName: "executeAppeal",
      args: [BigInt(appealId)]
    })
    return result
  } catch (error) {
    console.error("Error in executeAppealfunc:", error)
    throw error
  }
}
