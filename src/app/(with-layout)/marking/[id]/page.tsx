'use client';

import {useState, useEffect, Dispatch, SetStateAction} from 'react';
import {ChevronDown, ChevronUp, Diff, X} from 'lucide-react';
import {Button} from '@/widgets/common/Button';
import {getMatch} from "@/app/features/match/api/get-match";
import {useParams} from "next/navigation";
import {Match} from "@/entities/match";
import {Marking, MarkingQuality, MarkingResult} from "@/entities/marking";
import {MarkingForm} from "@/widgets/marking/MarkingForm";
import {MarkingList} from "@/widgets/marking/MarkingList";
import {getVideoReadUrl} from "@/shared/api/get-video-read-url";
import {createMarking} from "@/app/features/marking/api/create-marking";
import {getMarkingList} from "@/app/features/marking/api/get-marking-list";
import {deleteMarking} from "@/app/features/marking/api/delete-marking";
import {toast} from "sonner";
import {VideoPlayer} from "@/widgets/common/VideoPlayer";
import Seekbar from "@/widgets/common/VideoPlayer/Seekbar";
import {CreateMarkingRequest} from "@ihyunwoo/engarde-ai-api-sdk/structures";
import {getTechniqueAllList} from "@/app/features/technique/api/get-technique-all-list";
import {Technique} from "@/entities/technique/technique";
import {CounterList} from "@/widgets/Match/CounterList";
import {Card} from "@/widgets/common/Card";

export default function Page() {
  const params = useParams();
  const id = params.id;

  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const [match, setMatch] = useState<Match | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showMarkings, setShowMarkings] = useState(true);
  const [showCounter, setShowCounter] = useState(false);

  const [markings, setMarkings] = useState<Marking[]>([]);
  const [resultType, setResultType] = useState<MarkingResult>('win');
  const [myTechnique, setMyTechnique] = useState<Technique | null>(null);
  const [opponentTechnique, setOpponentTechnique] = useState<Technique | null>(null);
  const [quality, setQuality] = useState<MarkingQuality>('good')
  const [note, setNote] = useState('');
  const [pisteLocation, setPisteLocation] = useState(0);
  const [isLeftPosition, setIsLeftPosition] = useState(true);
  const [techniques, setTechniques] = useState<Technique[]>([]);


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
    // setAttackAttemptCount(match.attackAttemptCount ?? 0);
    // setParryAttemptCount(match.parryAttemptCount ?? 0);
    // setCounterAttackAttemptCount(match.counterAttackAttemptCount ?? 0);

    // 2) 비디오 read URL
    const videoUrlRes = await getVideoReadUrl(match.objectName);
    const url = videoUrlRes?.data?.url;
    if (url) setVideoUrl(url);

    // 3) 마킹 리스트
    const ml = await getMarkingList(Number(id));
    const list = ml?.data ?? [];
    setMarkings(list);

    // 4) 기술 리스트
    const techniqueRes = await getTechniqueAllList();
    if (techniqueRes.data) {
      setTechniques(techniqueRes.data)
      setMyTechnique(techniqueRes.data[0])
      setOpponentTechnique(techniqueRes.data[0])
    }
  }


  const addMarking = async () => {
    if (!videoRef) return;
    const time = Math.floor(videoRef.currentTime);
    const body: CreateMarkingRequest = {
      matchId: Number(id),
      timestamp: time,
      result: resultType,
      myTechnique,
      opponentTechnique,
      quality,
      note,
      pisteLocation,
      isLeftPosition
    }
    const res = await createMarking(body);
    const newMarking = res?.data;
    if (!newMarking) return;

    setMarkings((prev) =>
      [...prev, newMarking].sort((a, b) => {
        if (a.timestamp === b.timestamp) {
          return a.id - b.id; // id 오름차순
        }
        return a.timestamp - b.timestamp; // timestamp 오름차순
      })
    );

    // Form 초기화
    setResultType('win');
    setQuality('good');
    setNote('');
    setPisteLocation(0);
    setIsLeftPosition(true);
    if (techniques.length > 0) {
      setMyTechnique(techniques[0]);
      setOpponentTechnique(techniques[0]);
    }
  };

  const removeMarking = async (id: number) => {
    const target = markings.find(m => m.id === id);
    if (!target) return;

    const snapshot = markings;

    // 낙관적 제거
    setMarkings(prev => prev.filter(m => m.id !== id));

    try {
      const res = await deleteMarking(id);
      if (!res?.data) throw new Error('delete failed');
    } catch (e) {
      // 롤백
      setMarkings(snapshot);
      toast.error('Failed to delete marking');
    }
  };

  const seekTo = (time: number) => {
    if (videoRef) {
      videoRef.currentTime = time;
    }
  };

  if (!match) return null;

  return (
    <main className="flex flex-col px-8 py-6 gap-6">
      {/* 영상 */}
      {videoUrl && (
        <div className="w-full flex flex-col gap-2">
          <VideoPlayer src={videoUrl} getRef={setVideoRef}/>
          {videoRef && (
            <Seekbar markings={markings} videoRef={videoRef}/>
          )}
        </div>
      )}

      {/* 마킹 리스트 및 입력 폼 */}
      <div className="flex flex-1 gap-6">
        {/* 리스트 */}
        <div className="w-1/2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Marking List</h2>
            {markings.length > 0 && (
              <Button size="icon" variant="ghost" onClick={() => setShowMarkings(!showMarkings)}>
                {showMarkings ? <ChevronUp/> : <ChevronDown/>}
              </Button>
            )}

          </div>
          {markings.length > 0 && showMarkings && (
            <MarkingList
              markings={markings}
              onRemove={removeMarking}
              onSeek={seekTo}
            />
          )}
        </div>

        {(techniques) && (
          <MarkingForm
            isLeftPosition={isLeftPosition}
            setIsLeftPosition={setIsLeftPosition}
            resultType={resultType}
            setResultType={setResultType}
            myTechnique={myTechnique}
            setMyTechnique={setMyTechnique}
            opponentTechnique={opponentTechnique}
            setOpponentTechnique={setOpponentTechnique}
            quality={quality}
            setQuality={setQuality}
            pisteLocation={pisteLocation}
            setPisteLocation={setPisteLocation}
            note={note}
            setNote={setNote}
            onAdd={addMarking}
            techniques={techniques}
          />
        )}
      </div>

      {/* Floating Counter */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3">
        {showCounter && (
          <Card className="mb-2 w-[95vw] max-w-[calc(100vw-3rem)] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h3 className="text-lg font-semibold">Counter</h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowCounter(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="overflow-x-scroll pb-6 px-6 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              <CounterList matchId={match.id} techniques={techniques} />
            </div>
          </Card>
        )}
        <Button
          onClick={() => setShowCounter(!showCounter)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg shrink-0"
        >
          <Diff className="w-6 h-6" />
        </Button>
      </div>

    </main>
  )
}