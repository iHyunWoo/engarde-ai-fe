import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {LoginRequest} from "@ihyunwoo/engarde-ai-api-sdk/structures";

export const login = async (req: LoginRequest) => {
  return await apis.functional.auth.login(conn, req)
}