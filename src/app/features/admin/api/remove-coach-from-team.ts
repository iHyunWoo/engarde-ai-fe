import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';

export const removeCoachFromTeam = async (teamId: string) => {
  return await apis.functional.admin.teams.coach.removeCoachFromTeam(conn, teamId);
};

