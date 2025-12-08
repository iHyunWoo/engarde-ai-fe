import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';

export const getStudentMatches = async (
  userId: string,
  cursor?: number,
  from?: string,
  to?: string
) => {
  return await apis.functional.coaches.users.matches.findMatchesByUserId(conn, userId, {
    cursor,
    from,
    to,
    limit: 10,
  });
};

