'use client';

import { useParams } from 'next/navigation';
import { useState, useRef } from 'react';
import { MatchInfoSection } from '@/widgets/Match/MatchInfoSection';
import { MatchTimelineSection } from '@/widgets/Match/MatchTimelineSection';
import { useStudentMatchDetail } from '@/app/features/coach/hooks/use-student-match-detail';
import { useStudentMatchVideo } from '@/app/features/coach/hooks/use-student-match-video';
import { useStudentMatchMarkings } from '@/app/features/coach/hooks/use-student-match-markings';
import { LoadingSpinner } from '@/widgets/common/Spinner';
import Seekbar from '@/widgets/common/VideoPlayer/Seekbar';
import { VideoPlayer } from '@/widgets/common/VideoPlayer';

export default function StudentMatchDetailPage() {
  const params = useParams();
  const userId = params.userId as string | undefined;
  const matchId = params.matchId as string | undefined;

  const { data: matchResponse, isLoading: matchLoading, isError: matchError } =
    useStudentMatchDetail(userId, matchId);

  const match = matchResponse?.data ?? null;
  const objectName = match?.objectName ?? null;

  const {
    data: videoResponse,
    isLoading: videoLoading,
  } = useStudentMatchVideo(objectName);

  const { data: markingsResponse, isLoading: markingsLoading } = useStudentMatchMarkings(matchId);

  const markings = markingsResponse?.data ?? [];
  const videoUrl = videoResponse?.data?.url ?? null;

  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

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
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <MatchInfoSection match={match} studentId={userId} />

      {objectName && (
        <div ref={videoContainerRef} className="w-full flex flex-col gap-2">
          {videoLoading && !videoUrl ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            videoUrl && (
              <>
                <VideoPlayer src={videoUrl} getRef={setVideoRef} />
                {videoRef && <Seekbar markings={markings} videoRef={videoRef} />}
              </>
            )
          )}
        </div>
      )}

      {markingsLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <MatchTimelineSection 
          markings={markings} 
          onSeek={(timestamp) => {
            if (videoRef) {
              videoRef.currentTime = timestamp;
            }
            if (videoContainerRef.current) {
              videoContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        />
      )}
    </main>
  );
}
