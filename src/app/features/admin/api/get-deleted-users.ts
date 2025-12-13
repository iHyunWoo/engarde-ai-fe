import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';
import { GetOrphanedUsersQuery } from '@ihyunwoo/engarde-ai-api-sdk/structures';

export const getDeletedUsers = async (query: GetOrphanedUsersQuery) => {
  return await apis.functional.admin.deleted_users.getDeletedUsers(conn, query);
};

