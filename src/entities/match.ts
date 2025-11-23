import {Opponent} from "@/entities/opponent";
import {TechniqueAttempt} from "@/entities/technique/technique-attempt";
import {MatchStage} from "@/entities/match-stage";

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
  stage: MatchStage;
  coachFeedback?: string | null;
}
