import {useMatchForm} from "@/app/features/match/hooks/use-match-form";
import {useEffect, useState} from "react";
import {getMatch} from "@/app/features/match/api/get-match";
import {toast} from "sonner";
import {updateMatch} from "@/app/features/match/api/update-match";
import {deleteMatch} from "@/app/features/match/api/delete-match";

export function useMatchUpdate(matchId: number) {
  const {
    matchData,
    setMatchData,
    updateMatchData,
    files,
    setFiles,
    inputRef,
    handleAddFile,
    handleRemove,
    handleMove,
    mergeAndUpload
  } = useMatchForm();

  // 초기 로딩
  const [initialLoading, setInitialLoading] = useState(true);
  // 저장 로딩
  const [saving, setSaving] = useState(false);

  // 초기 로드
  useEffect(() => {
    fetchMatch()
  }, []);

  const fetchMatch = async () => {
    const response = await getMatch(matchId);
    const match = response?.data;

    if (!match) {
      toast('Failed to load match');
      setInitialLoading(false);
      return;
    };

    setMatchData({
      tournamentName: match.tournamentName,
      tournamentDate: match.tournamentDate,
      opponentName: match.opponentName,
      opponentTeam: match.opponentTeam ?? '',
      myScore: match.myScore ?? 0,
      opponentScore: match.opponentScore ?? 0,
      objectName: match.objectName,
    });
    setInitialLoading(false);
  }

  const submit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      // ★ 수정: 파일 없으면 기존 objectName 유지
      let newObjectName = matchData.objectName
      if (files) {
        const uploadResult = await mergeAndUpload()
        if (uploadResult) newObjectName = uploadResult
      }

      await updateMatch(matchId, { ...matchData, objectName: newObjectName ?? "" });
      toast('Saved');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Unexpected error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    return await deleteMatch(matchId);
  }

  return {
    initialLoading,
    saving,

    matchData,
    setMatchData,
    updateMatchData,

    files,
    setFiles,
    inputRef,
    handleAddFile,
    handleRemove,
    handleMove,

    submit,
    handleDelete
  };
}