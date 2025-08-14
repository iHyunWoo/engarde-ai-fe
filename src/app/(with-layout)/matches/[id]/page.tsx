"use client"

import {MatchInfoSection} from "@/widgets/Match/MatchInfoSection";
import {MatchTimelineSection} from "@/widgets/Match/MatchTimelineSection";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {getMatch} from "@/app/features/match/api/get-match";
import {getVideoReadUrl} from "@/shared/api/get-video-read-url";
import {getMarkingList} from "@/app/features/marking/api/get-marking-list";
import {Match} from "@/entities/match";
import {Marking} from "@/entities/marking";
import {VideoPlayer} from "@/widgets/common/VideoPlayer";
import Seekbar from "@/widgets/common/VideoPlayer/Seekbar";

export default function Page() {
  const params = useParams();
  const id = params.id;

  const [match, setMatch] = useState<Match | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [markings, setMarkings] = useState<Marking[]>([]);

  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!id) return;
    fetMatchAndMarking()
  }, [id]);

  const fetMatchAndMarking = async () => {
    // 1) 매치 상세
    const matchRes = await getMatch(Number(id));
    const match = matchRes?.data;
    if (!match) return;

    setMatch(match);

    // 2) 비디오 read URL
    const videoUrlRes = await getVideoReadUrl(match.objectName);
    const url = videoUrlRes?.data?.url;
    if (url) setVideoUrl(url);

    // 3) 마킹 리스트
    const ml = await getMarkingList(Number(id));
    const list = ml?.data ?? [];
    setMarkings(list);
  }


  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {match && (
        <>
          <MatchInfoSection match={match} />

          {videoUrl && (
            <div className="w-full flex flex-col gap-2">
              <VideoPlayer src={videoUrl} getRef={setVideoRef}/>
              {videoRef && (
                <Seekbar markings={markings} videoRef={videoRef}/>
              )}
            </div>
          )}

          <MatchTimelineSection markings={markings} />
        </>
      )}
    </main>
  );
}