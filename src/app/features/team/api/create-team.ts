import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';
import { CreateTeamRequest } from '@ihyunwoo/engarde-ai-api-sdk/structures';

export const createTeam = async (req: CreateTeamRequest) => {
  return await apis.functional.teams.create(conn, req);
};

