import {Technique} from "@/entities/technique/technique";

export type MarkingResult = 'win' | 'lose' | 'attempt';

export type MarkingQuality = 'good' | 'bad' | 'lucky'

// 마킹 인터페이스
export interface Marking {
  id: number;
  timestamp: number;
  result: MarkingResult;
  myTechnique: Technique | null;
  opponentTechnique: Technique | null;
  quality: MarkingQuality;
  note: string;
  remainTime: number;
}