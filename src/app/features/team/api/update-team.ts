import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';
import { UpdateTeamMaxMembersRequest } from '@ihyunwoo/engarde-ai-api-sdk/structures';

export const updateTeamMaxMembers = async (teamId: string, req: UpdateTeamMaxMembersRequest) => {
  return await apis.functional.admin.teams.max_members.updateTeamMaxMembers(conn, teamId, req);
};

