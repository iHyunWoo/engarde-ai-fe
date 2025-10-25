import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {SignupDto} from "@ihyunwoo/engarde-ai-api-sdk/structures";

export const signup = async (req: SignupDto) => {
  return await apis.functional.auth.signup(conn, req)
}
