import {Opponent} from "@/entities/opponent";
import {TechniqueAttempt} from "@/entities/technique-attempt";

export interface Match {
  id: number;
  objectName: string;
  tournamentName: string;
  tournamentDate: string;
  opponent?: Opponent | undefined;
  myScore: number;
  opponentScore: number;
  techniqueAttempt: TechniqueAttempt[]
  createdAt: string;
}