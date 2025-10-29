import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const getTeamList = async (
  cursor?: number,
  q?: string
) => {
  return await apis.functional.teams.getAllTeams(conn, {
    cursor,
    q,
    limit: 10
  })
}