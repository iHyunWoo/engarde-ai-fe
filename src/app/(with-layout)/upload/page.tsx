'use client';

import React from 'react';
import VideoUploadSection from "@/widgets/Match/VideoUploadSection";
import MatchInfoForm from "@/widgets/Match/MatchInfoForm";
import {useMatchUpload} from "@/app/features/match/hooks/use-match-upload";

export default function Page() {
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
    // handleUploadWithCloudMerge,
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
          onUpdateMatchData={updateMatchData}
          onUpload={handleUpload}
        />
      </div>
    </div>
  );
}