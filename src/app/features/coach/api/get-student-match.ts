import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';

export const getStudentMatch = async (userId: string, matchId: string) => {
  return await apis.functional.coaches.users.matches.findMatchById(conn, userId, matchId);
};
