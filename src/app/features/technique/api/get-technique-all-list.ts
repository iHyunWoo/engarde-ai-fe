import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const getTechniqueAllList = async (
) => {
  return await apis.functional.techniques.all.findAll(conn)
}