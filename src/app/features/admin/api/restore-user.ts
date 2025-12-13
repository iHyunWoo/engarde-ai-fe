import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';

export const restoreUser = async (userId: number) => {
  return await apis.functional.admin.users.restore.restoreUser(conn, String(userId));
};

