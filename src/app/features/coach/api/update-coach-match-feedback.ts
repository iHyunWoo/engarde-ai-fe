import * as apis from '@ihyunwoo/engarde-ai-api-sdk';
import { conn } from '@/shared/lib/api-client';
import { UpdateMatchFeedbackRequest } from '@ihyunwoo/engarde-ai-api-sdk/structures';

export const updateCoachMatchFeedback = async (
  matchId: string,
  payload: UpdateMatchFeedbackRequest
) => {
  return await apis.functional.coaches.matches.feedback.updateMatchFeedback(
    conn,
    matchId,
    payload
  );
};
