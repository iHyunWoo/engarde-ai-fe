import { useState } from 'react';
import {toast} from "sonner";
import {createMatch} from "@/app/features/match/api/create-match";
import {useMatchForm} from "@/app/features/match/hooks/use-match-form";
import {postWriteSignedUrlByMatch} from "@/app/features/match/api/post-write-signed-url-by-match";
// import {requestVideoMerge} from "@/app/features/match/api/request-video-merge";

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
    if (files.length === 0) {
      toast('Please upload a video file');
      return;
    }

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

  // const handleUploadWithCloudMerge = async () => {
  //   setUploading(true);
  //   try {
  //     // 1. match 생성
  //     const response = await createMatch({
  //       opponentName: matchData.opponentName,
  //       opponentTeam: matchData.opponentTeam,
  //       opponentScore: matchData.opponentScore,
  //       myScore: matchData.myScore,
  //       tournamentDate: matchData.tournamentDate,
  //       tournamentName: matchData.tournamentName,
  //       stage: matchData.stage,
  //     })

  //     if (!response.data?.id) {
  //       throw new Error('Failed to upload match');
  //     }

  //     const matchId = response.data.id;

  //     const objectNames: string[] = []
  //     // 2. 비디오 업로드 signed url 발급
  //     for (const file of files) {
  //       const signedUrlResponse = await postWriteSignedUrlByMatch(
  //         matchId,
  //         [{
  //           fileName: file.name,
  //           contentType: file.type,
  //         }]
  //       )

  //       if(!signedUrlResponse.data) {
  //         throw new Error('Failed to upload match');
  //       }

  //       // 3. 비디오 업로드
  //       const res = signedUrlResponse.data[0];
  //       await fetch(res.uploadUrl, {
  //         method: "PUT",
  //         headers: { "Content-Type": file.type },
  //         body: file,
  //       })
  //       objectNames.push(res.objectName)
  //     }

  //     // 4. 비디오 병합 요청
  //     await requestVideoMerge(matchId, {objectNames})

  //   } catch (error) {
  //     toast(error instanceof Error ? error.message : 'Unexpected error');
  //   } finally {
  //     setUploading(false);
  //   }
  // }

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
    // handleUploadWithCloudMerge,
  };
}
