import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';

export const getDeactivatedTeams = async (cursor?: number) => {
  return await apis.functional.admin.teams.deactivated.getDeactivatedTeams(conn, {
    cursor,
    limit: 10,
  });
};

