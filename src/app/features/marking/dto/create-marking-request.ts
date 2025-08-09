import {MarkingType, MarkingQuality, MarkingResult} from "@/entities/marking";

export interface CreateMarkingRequest {
  matchId: number;
  timestamp: number;
  result: MarkingResult;
  myType: MarkingType;
  opponentType: MarkingType;
  quality: MarkingQuality;
  note: string;
  remainTime: number;
}