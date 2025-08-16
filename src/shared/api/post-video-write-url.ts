import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {PostSignedUrlRequestDto} from "@ihyunwoo/engarde-ai-api-sdk/structures";

export const postVideoWriteUrl = async (req: PostSignedUrlRequestDto) => {
  return await apis.functional.files.write.getWriteSignedUrl(conn, req)
}