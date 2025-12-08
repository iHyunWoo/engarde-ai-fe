import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';
import { AssignCoachRequest } from '@ihyunwoo/engarde-ai-api-sdk/structures';

export const assignCoachToTeam = async (teamId: string, req: AssignCoachRequest) => {
  return await apis.functional.admin.teams.coach.assignCoachToTeam(conn, teamId, req);
};

