import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';
import { CreateCoachRequest } from '@ihyunwoo/engarde-ai-api-sdk/structures';

export const createCoach = async (req: CreateCoachRequest) => {
  return await apis.functional.admin.coaches.createCoach(conn, req);
};

