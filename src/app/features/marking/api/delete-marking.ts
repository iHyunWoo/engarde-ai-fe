import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";


export const deleteMarking = async (markingId: number) => {
  return await apis.functional.markings.remove(conn, String(markingId))
}