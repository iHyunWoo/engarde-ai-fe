import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const getMatch = async (id: number) => {
  return await apis.functional.matches.findOne(conn, id)
}