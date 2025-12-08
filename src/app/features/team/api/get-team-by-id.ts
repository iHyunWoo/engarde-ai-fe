import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';

export const getTeamById = async (teamId: string) => {
  return await apis.functional.teams.getTeamById(conn, teamId);
};

