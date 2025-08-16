import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";


export const getNoteSuggestion = async (query: string) => {
  return await apis.functional.notes.suggest(conn, {query})
}