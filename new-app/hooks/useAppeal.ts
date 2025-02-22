import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:42069", {
  credentials: 'include',
  mode: 'cors',
});

export type Appeal = {
  id: bigint;
  appealerId: string;
  uri: string;
  startTime: string;  // Changed to string
  endTime: string;    // Changed to string
  forScore: bigint;
  againstScore: bigint;
  executed: boolean;
};

type AppealResponse = {
  appealss: {
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

export const useAppeals = () => {
  return useQuery<Appeal[], Error>({
    queryKey: ["appeals"],
    queryFn: async () => {
      try {
        const response = await client.request<AppealResponse>(
          gql`
            query GetAppeals {
              appealss {
                items {
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
            }
          `
        );

        console.log("GraphQL Response:", response);

        if (!response?.appealss?.items || !Array.isArray(response.appealss.items)) {
          console.log("No appeals found or invalid response:", response);
          return [];
        }

        return response.appealss.items.map((appeal) => ({
          id: BigInt(appeal.id || "0"),
          appealerId: appeal.appealerId || "",
          uri: appeal.uri || "",
          startTime: appeal.startTime,     // Remove BigInt conversion
          endTime: appeal.endTime,         // Remove BigInt conversion
          forScore: BigInt(appeal.forScore || "0"),
          againstScore: BigInt(appeal.againstScore || "0"),
          executed: appeal.executed || false,
        }));
      } catch (error) {
        console.error("GraphQL query error:", error);
        throw error;
      }
    },
    staleTime: 30000,
    refetchInterval: 30000,
    initialData: [],
  });
};

export const useHighestVotes = () => {
  return useQuery<Appeal[], Error>({
    queryKey: ["highest-votes"],
    queryFn: async () => {
      try {
        const query = gql`
          query GetAppeals($id: BigInt!) {
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

        // Fetch each appeal individually and combine results
        const appealIds = Array.from({ length: 15 }, (_, i) => i.toString());
        const results = await Promise.all(
          appealIds.map(async (id) => {
            try {
              const response: AppealResponse = await client.request(query, { id });
              return response.appealss;
            } catch {
              return null;
            }
          })
        );

        // Filter out null responses and flatten the array
        const appeals = results
          .filter((result): result is NonNullable<typeof result> => result !== null)
          .flat()
          .map((appeal: any) => ({
            ...appeal,
            id: BigInt(appeal.id),
            startTime: BigInt(appeal.startTime),
            endTime: BigInt(appeal.endTime),
            forScore: BigInt(appeal.forScore),
            againstScore: BigInt(appeal.againstScore),
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
