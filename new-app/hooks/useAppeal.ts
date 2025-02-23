

import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";

const url = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:42069";
const client = new GraphQLClient(url);

export type Appeal = {
  id: bigint;
  appealerId: string;
  uri: string;
  startTime: bigint;
  endTime: bigint;
  forScore: bigint;
  againstScore: bigint;
  executed: boolean;
};

type AppealsListResponse = {
  appeals: {
    items: {
      id: string;
      appealerId: string;
      uri: string;
      startTime: string;
      endTime: string;
      forScore: string;
      againstScore: string;
      executed: boolean;
    }[];
  };
};

type AppealSingleResponse = {
  appeals: {
    id: string;
    appealerId: string;
    uri: string;
    startTime: string;
    endTime: string;
    forScore: string;
    againstScore: string;
    executed: boolean;
  };
};


export const useHighestVotes = () => {
  return useQuery<Appeal[], Error>({
    queryKey: ["highest-votes"],
    queryFn: async () => {
      try {
        const query = gql`
          query GetAppeal($id: BigInt!) {
            appeals(id: $id) {
              id
              appealerId
              uri
              startTime
              endTime
              forScore
              againstScore
              executed
            }
          }
        `;

        const appealIds = Array.from({ length: 15 }, (_, i) => i.toString());
        const results = await Promise.all(
          appealIds.map(async (id) => {
            try {
              const response = await client.request<AppealSingleResponse>(query, { id });
              console.log("Single appeal response:", response);
              return response.appeals;
            } catch (err) {
              return null;
            }
          })
        );

        // Filter out null responses and convert fields to appropriate types
        const appeals = results
          .filter((result): result is NonNullable<typeof result> => result !== null)
          .map((appeal) => ({
            id: BigInt(appeal.id),
            appealerId: appeal.appealerId,
            uri: appeal.uri,
            startTime: BigInt(appeal.startTime),
            endTime: BigInt(appeal.endTime),
            forScore: BigInt(appeal.forScore),
            againstScore: BigInt(appeal.againstScore),
            executed: appeal.executed,
          }));

        console.log("Processed appeals:", appeals);
        return appeals;
      } catch (error) {
        console.error("Error fetching appeals:", error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
