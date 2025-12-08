import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const logout = async () => {
  return await apis.functional.auth.logout(conn)
}

