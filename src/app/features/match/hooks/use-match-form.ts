import {useRef, useState} from "react";
import {mergeVideos} from "@/shared/lib/merge-videos";
import {uploadToGCS} from "@/shared/lib/upload-file";
import {MatchStage} from "@/entities/match-stage";

export type MatchData = {
  tournamentName: string;
  tournamentDate: string;
  opponentName: string;
  opponentTeam: string;
  myScore: number;
  opponentScore: number;
  objectName?: string;
  stage: MatchStage;
};

export function useMatchForm(initial?: MatchData) {
  // 폼
  const [matchData, setMatchData] = useState<MatchData>({
    tournamentName: '',
    tournamentDate: '',
    opponentName: '',
    opponentTeam: '',
    myScore: 0,
    opponentScore: 0,
    objectName: undefined,
    stage: 'preliminary',
    ...initial,
  });
  const updateMatchData = (field: keyof MatchData, value: unknown) => {
    setMatchData((prev) => ({ ...prev, [field]: value }));
  };
  // 파일
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && files.length < 5) {
      setFiles((prev) => [...prev, file]);
    }
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMove = (from: number, to: number) => {
    if (to < 0 || to >= files.length) return;
    const newFiles = [...files];
    const moved = newFiles.splice(from, 1)[0];
    newFiles.splice(to, 0, moved);
    setFiles(newFiles);
  };

  const mergeAndUpload = async (): Promise<string | null> => {
    if (files.length === 0) return null;
    const merged = await mergeVideos(files);
    const objectName = await uploadToGCS(merged);
    if (!objectName) throw new Error('Failed to upload video');
    return objectName;
  };

  return {
    matchData,
    files,
    inputRef,
    setMatchData,
    setFiles,
    updateMatchData,
    handleAddFile,
    handleRemove,
    handleMove,
    mergeAndUpload
  };
}