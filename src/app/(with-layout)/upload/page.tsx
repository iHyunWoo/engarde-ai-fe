'use client';

import { useMatchUpload } from '@/app/features/match/hooks/use-match-upload';
import React from 'react';
import VideoUploadSection from "@/widgets/Match/VideoUploadSection";
import MatchInfoForm from "@/widgets/Match/MatchInfoForm";

export default function MatchUploadPage() {
  const {
    files,
    matchData,
    uploading,
    inputRef,
    handleAddFile,
    handleRemove,
    handleMove,
    updateMatchData,
    handleUpload,
  } = useMatchUpload();

  return (
    <div className="min-h-screen w-full py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <VideoUploadSection
          files={files}
          inputRef={inputRef}
          onAddFile={handleAddFile}
          onRemove={handleRemove}
          onMove={handleMove}
        />

        <MatchInfoForm
          matchData={matchData}
          uploading={uploading}
          filesCount={files.length}
          onUpdateMatchData={updateMatchData}
          onUpload={handleUpload}
        />
      </div>
    </div>
  );
}