import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {VideoMergeRequest} from "@ihyunwoo/engarde-ai-api-sdk/structures";

export const requestVideoMerge = async (matchId: number, req: VideoMergeRequest) => {
  // return await apis.functional.matches.videos.requestVideoMerge(conn, matchId, req);
}