export interface Match {
  id: number;
  video_url: string;
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