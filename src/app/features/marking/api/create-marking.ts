import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {CreateMarkingRequest} from "@ihyunwoo/engarde-ai-api-sdk/structures";


export const createMarking = async (req: CreateMarkingRequest) => {
  return await apis.functional.markings.create(conn, req)
}