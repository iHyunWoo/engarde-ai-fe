import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const getVideoReadUrl = async (objectName: string) => {
  return await apis.functional.files.read.getReadSignedUrl(conn, {object: objectName})
}