import { useState } from 'react';
import {toast} from "sonner";
import {createMatch} from "@/app/features/match/api/create-match";
import {useMatchForm} from "@/app/features/match/hooks/use-match-form";

export function useMatchUpload() {
  const {
    matchData,
    updateMatchData,
    files,
    inputRef,
    handleAddFile,
    handleRemove,
    handleMove,
    mergeAndUpload
  } = useMatchForm();

  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const objectName = await mergeAndUpload()

      if (!objectName) {
        throw new Error('Failed to upload video');
      }

      const response = await createMatch(
        {
          objectName,
          opponentName: matchData.opponentName,
          opponentTeam: matchData.opponentTeam,
          opponentScore: matchData.opponentScore,
          myScore: matchData.myScore,
          tournamentDate: matchData.tournamentDate,
          tournamentName: matchData.tournamentName,
          stage: matchData.stage,
        }
      );

      if (!response) {
        throw new Error('Failed to upload match');
      }

      toast('Successfully uploaded');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Unexpected error');
    } finally {
      setUploading(false);
    }
  };

  return {
    files,
    matchData,
    uploading,
    inputRef,
    handleAddFile,
    handleRemove,
    handleMove,
    updateMatchData,
    handleUpload,
  };
}
