export interface CreateMatchRequest {
  videoLink: string;
  tournamentName: string;
  tournamentDate: string;
  opponentName: string;
  opponentTeam: string;
  myScore: number;
  opponentScore: number;
}