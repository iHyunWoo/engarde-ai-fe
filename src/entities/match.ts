export interface Match {
  id: number;
  videoUrl: string;
  tournamentName: string;
  tournamentDate: string;
  opponentName: string;
  opponentTeam: string;
  myScore: number;
  opponentScore: number;
  attackAttemptCount: number;
  parryAttemptCount: number;
  counterAttackAttemptCount: number;
  createdAt: string;
}