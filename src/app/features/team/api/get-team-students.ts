import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';
import { GetTeamStudentsQuery } from '@ihyunwoo/engarde-ai-api-sdk/structures';

export const getTeamStudents = async (query?: GetTeamStudentsQuery) => {
  return await apis.functional.teams.my.students.getTeamStudents(conn, query || {});
};

