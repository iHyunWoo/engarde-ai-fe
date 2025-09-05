import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {PostSignedUrlRequestDto} from "@ihyunwoo/engarde-ai-api-sdk/structures";

export const postWriteSignedUrlByMatch = async (matchId: number, req: PostSignedUrlRequestDto[]) => {
  return await apis.functional.matches.videos.upload.postWriteSignedUrl(conn, matchId, req)
}