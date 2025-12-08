import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';
import { GetAllUsersQuery } from '@ihyunwoo/engarde-ai-api-sdk/structures';

export const getAllUsers = async (query: GetAllUsersQuery) => {
  return await apis.functional.admin.users.getAllUsers(conn, query);
};

