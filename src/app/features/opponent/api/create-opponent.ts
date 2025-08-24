import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const createOpponent = async (
  name: string,
  team: string,
) => {
  return await apis.functional.opponents.create(conn, {
    name,
    team
  })
}