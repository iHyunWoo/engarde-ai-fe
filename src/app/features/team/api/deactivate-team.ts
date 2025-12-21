import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';

export const deactivateTeam = async (teamId: number) => {
  return await apis.functional.admin.teams.deactivate.deactivateTeam(conn, String(teamId));
};

