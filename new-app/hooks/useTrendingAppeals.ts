"use client";
import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";

const API_ENDPOINT = "http://localhost:42069";
const client = new GraphQLClient(API_ENDPOINT);

type AppealResponse = {
  appeals: {
    items: Array<{
      id: string;
      uri: string;
      startTime: string;
      endTime: string;
      forScore: string;
      againstScore: string;
      executed: boolean;
      appealer: { id: string };
      votes: { items: Array<{ voterId: string }> };
    }>;
  };
};

export type TrendingAppeal = {
  id: string;
  uri: string;
  startTime: number;
  endTime: number;
  forScore: number;
  againstScore: number;
  executed: boolean;
  proposerId: string;
  voters: string[];
};

export const useTrendingAppeals = () => {
  return useQuery<TrendingAppeal[], Error>({
    queryKey: ["trending-proposals"],
    queryFn: async () => {
      try {
        const result = await client.request<AppealResponse>(gql`
          query TrendingProposals {
            appeals(orderBy: "forScore", orderDirection: "desc") {
              items {
                id
                uri
                startTime
                endTime
                forScore
                againstScore
                executed
                appealer {
                  id
                }
                votes {
                  items {
                    voterId
                  }
                }
              }
            }
          }
        `);

        // Removed header and status logging since they're not accessible
        console.log("Full Response:", result);

        if (!result?.appeals?.items) {
          console.error("Invalid response structure - missing proposals items");
          return [];
        }

        return result.appeals.items.map((item) => ({
          id: item.id,
          uri: item.uri,
          startTime: parseInt(item.startTime, 10),
          endTime: parseInt(item.endTime, 10),
          forScore: parseInt(item.forScore, 10),
          againstScore: parseInt(item.againstScore, 10),
          executed: item.executed,
          proposerId: item.appealer.id,
          voters: item.votes.items.map((v) => v.voterId),
        }));
      } catch (error) {
        console.error("Full error context:", {
          error,
          requestConfig: {
            endpoint: API_ENDPOINT,
            // Removed headers from error logging
          },
        });
        throw new Error(`API request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    },
    staleTime: 3600000, // 1 hour
    refetchInterval: 3600000, // 1 hour
    retry: 2,
  });
};
