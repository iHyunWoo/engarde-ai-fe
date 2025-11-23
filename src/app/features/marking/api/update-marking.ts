import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const updateMarkingCoachNote = async (markingId: number, coachNote: string) => {
  return await apis.functional.coaches.markings.note.updateMarkingCoachNote(conn, String(markingId), {
    coachNote: coachNote,
  })
}

