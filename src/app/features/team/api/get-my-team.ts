import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';

export const getMyTeam = async () => {
  return await apis.functional.teams.my.getMyTeam(conn);
};

