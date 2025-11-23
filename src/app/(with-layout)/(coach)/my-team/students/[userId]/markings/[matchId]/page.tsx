'use client';

import {useState} from 'react';
import {ChevronDown, ChevronUp} from 'lucide-react';
import {Button} from '@/widgets/common/Button';
import {useParams} from "next/navigation";
import {MarkingList} from "@/widgets/marking/MarkingList";
import {VideoPlayer} from "@/widgets/common/VideoPlayer";
import Seekbar from "@/widgets/common/VideoPlayer/Seekbar";
import {useStudentMatchDetail} from "@/app/features/coach/hooks/use-student-match-detail";
import {useStudentMatchVideo} from "@/app/features/coach/hooks/use-student-match-video";
import {useStudentMatchMarkings} from "@/app/features/coach/hooks/use-student-match-markings";
import {LoadingSpinner} from "@/widgets/common/Spinner";
import {useUpdateMarkingCoachNote} from "@/app/features/marking/hooks/use-update-marking-coach-note";

export default function Page() {
  const params = useParams();
  const userId = params.userId as string | undefined;
  const matchId = params.matchId as string | undefined;

  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [showMarkings, setShowMarkings] = useState(true);

  const {data: matchResponse, isLoading: matchLoading, isError: matchError} =
    useStudentMatchDetail(userId, matchId);

  const match = matchResponse?.data ?? null;
  const objectName = match?.objectName ?? null;

  const {
    data: videoResponse,
    isLoading: videoLoading,
  } = useStudentMatchVideo(objectName);

  const {data: markingsResponse, isLoading: markingsLoading} =
    useStudentMatchMarkings(matchId);

  const markings = markingsResponse?.data ?? [];
  const videoUrl = videoResponse?.data?.url ?? null;

  const { mutate: updateCoachNote } = useUpdateMarkingCoachNote({
    matchId,
  });

  const seekTo = (time: number) => {
    if (videoRef) {
      videoRef.currentTime = time;
    }
  };

  if (matchLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (matchError || !match) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Unable to load match detail.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col px-8 py-6 gap-6 mb-10">
      {/* 영상 */}
      {videoLoading && !videoUrl ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        videoUrl && (
          <div className="w-full flex flex-col gap-2">
            <VideoPlayer src={videoUrl} getRef={setVideoRef}/>
            {videoRef && (
              <Seekbar markings={markings} videoRef={videoRef}/>
            )}
          </div>
        )
      )}

      {/* 마킹 리스트 */}
      <div className="flex flex-1 gap-6">
        {/* 리스트 */}
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Marking List</h2>
            {markings.length > 0 && (
              <Button size="icon" variant="ghost" onClick={() => setShowMarkings(!showMarkings)}>
                {showMarkings ? <ChevronUp/> : <ChevronDown/>}
              </Button>
            )}
          </div>
          {markingsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            markings.length > 0 && showMarkings && (
              <MarkingList
                markings={markings}
                onSeek={seekTo}
                isCoachMode={true}
                onCoachCommentUpdate={async (markingId, coachNote) => {
                  updateCoachNote({ markingId, coachNote });
                }}
              />
            )
          )}
        </div>
      </div>
    </main>
  )
}

