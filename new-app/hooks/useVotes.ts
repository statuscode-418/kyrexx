import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";
import { useAccount } from "wagmi";

var url = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:42069";
const client = new GraphQLClient(url);

type UserVote = {
  appealId: bigint;
  weight: bigint;
  proposal: {
    uri: string;
    startTime: bigint;
    endTime: bigint;
    forScore: bigint;
    againstScore: bigint;
  };
};

type UserVotesResponse = {
  votes: {
    appealId: string;
    weight: string;
    proposal: {
      uri: string;
      startTime: string;
      endTime: string;
      forScore: string;
      againstScore: string;
    };
  }[];
};

const GET_USER_VOTES = gql`
  query GetUserVotes($voterId: String!) {
    votes(voterId: $voterId) {
      appealId
      weight
      proposal {
        uri
        startTime
        endTime
        forScore
        againstScore
      }
    }
  }
`;

export const useUserVotes = () => {
  const { address } = useAccount();

  return useQuery<UserVote[], Error>({
    queryKey: ["user-votes", address],
    queryFn: async () => {
      if (!address) throw new Error("Wallet not connected");

      try {
        const response = await client.request<UserVotesResponse>(GET_USER_VOTES, {
          voterId: address,
        });

        if (!response?.votes || !Array.isArray(response.votes)) {
            return [];
          }

        const votes = response.votes!.map((vote) => ({
          appealId: BigInt(vote.appealId),
          weight: BigInt(vote.weight),
          proposal: {
            uri: vote.proposal.uri,
            startTime: BigInt(vote.proposal.startTime),
            endTime: BigInt(vote.proposal.endTime),
            forScore: BigInt(vote.proposal.forScore),
            againstScore: BigInt(vote.proposal.againstScore),
          },
        }));

        return votes;
      } catch (error) {
        console.error("Error fetching user votes:", error);
        throw error;
      }
    },
    enabled: !!address,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};