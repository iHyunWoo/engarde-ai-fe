import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import { UserRole, UserInfo } from '@/entities/user-role';

export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const response = await apis.functional.users.me.getMyProfile(conn);
    
    if (!response || response.code !== 200 || !response.data) {
      return null;
    }

    return {
      id: response.data.id,
      email: response.data.email,
      name: response.data.name,
      role: response.data.role as UserRole,
    };
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return null;
  }
};
