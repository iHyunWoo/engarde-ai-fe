import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';
import { GenerateInviteCodeRequest } from '@ihyunwoo/engarde-ai-api-sdk/structures';

export const regenerateInviteCode = async (
  teamId: string,
  req?: GenerateInviteCodeRequest
) => {
  return await apis.functional.teams.invite_code.generateInviteCode(conn, teamId, req || {});
};

