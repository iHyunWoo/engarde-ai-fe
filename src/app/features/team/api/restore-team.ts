import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';

export const restoreTeam = async (teamId: number) => {
  return await apis.functional.admin.teams.restore.restoreTeam(conn, String(teamId));
};

