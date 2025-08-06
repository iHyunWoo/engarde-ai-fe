import {MatchSummary} from "@/entities/match-summary";

export interface GetMatchListResponse{
  items: MatchSummary[];
  nextCursor?: number;
};