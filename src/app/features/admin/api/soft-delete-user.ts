import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';

export const softDeleteUser = async (userId: number) => {
  return await apis.functional.admin.users.softDeleteUser(conn, String(userId));
};

