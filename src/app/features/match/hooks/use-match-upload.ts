import { useState, useRef } from 'react';
import {mergeVideos} from "@/app/features/match/lib/merge-videos";
import {uploadFileToFBStorage} from "@/app/features/match/lib/upload-video";
import {toast} from "sonner";
import {createMatch} from "@/app/features/match/api/create-match";
import {extractThumbnail} from "@/app/features/match/lib/extract-thumbnail";

interface MatchData {
  tournamentName: string;
  tournamentDate: string;
  opponentName: string;
  opponentTeam: string;
  myScore: number;
  opponentScore: number;
}

export function useMatchUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [matchData, setMatchData] = useState<MatchData>({
    tournamentName: '',
    tournamentDate: '',
    opponentName: '',
    opponentTeam: '',
    myScore: 0,
    opponentScore: 0,
  });
  const [uploading, setUploading] = useState(false);
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

  const updateMatchData = (field: keyof MatchData, value: unknown) => {
    setMatchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const mergedVideo = await mergeVideos(files);
      const videoLink = await uploadFileToFBStorage(mergedVideo, 'videos');

      const thumbnail = await extractThumbnail(files[0])
      const thumbnailLink = await uploadFileToFBStorage(thumbnail, 'images');

      if (!videoLink || !thumbnailLink ) {
        throw new Error('Failed to upload video');
      }

      const response = await createMatch({ videoLink, thumbnailLink, ...matchData });

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
