export interface createAppeal {
  startTime: bigint
  votingPeriod: bigint
  uri: string
  executionData: `0x${string}`
  target: `0x${string}`
  hookData: `0x${string}`
}

export interface casteVote {
  proposalId: bigint
  weight: bigint
  hookData: `0x${string}`
}

export interface executeAppeal {
  appealId: string

}
