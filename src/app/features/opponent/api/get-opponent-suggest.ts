import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const getOpponentSuggest = async (
  query: string,
) => {
  return await apis.functional.opponents.suggest(conn, {
    query: query
  })
}