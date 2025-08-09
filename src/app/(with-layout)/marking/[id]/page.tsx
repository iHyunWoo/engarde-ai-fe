'use client';

import {useState, useEffect} from 'react';
import {ChevronDown, ChevronUp, X} from 'lucide-react';
import {Button} from '@/widgets/common/Button';
import {getMatch} from "@/app/features/match/api/get-match";
import {useParams} from "next/navigation";
import VideoPlayer from "@/widgets/common/VideoPlayer";
import {Match} from "@/entities/match";
import {AttackType, DefenseType, Marking, MarkingQuality, MarkingResult, MarkingType} from "@/entities/marking";
import {MarkingForm} from "@/widgets/marking/MarkingForm";
import {CounterList} from "@/widgets/Match/MatchCouterSection";
import {MarkingList} from "@/widgets/marking/MarkingList";
import {getVideoReadUrl} from "@/shared/api/get-video-read-url";
import {CreateMarkingRequest} from "@/app/features/marking/dto/create-marking-request";
import {createMarking} from "@/app/features/marking/api/create-marking";
import {getMarkingList} from "@/app/features/marking/api/get-marking-list";
import {deleteMarking} from "@/app/features/marking/api/delete-marking";
import {toast} from "sonner";
import {CounterType, updateCounter} from "@/app/features/match/api/update-counter";

export default function Page() {
  const params = useParams();
  const id = params.id;

  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const [match, setMatch] = useState<Match | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showMarkings, setShowMarkings] = useState(true);

  const [markings, setMarkings] = useState<Marking[]>([]);
  const [resultType, setResultType] = useState<MarkingResult>('win');
  const [myType, setMyType] = useState<AttackType | DefenseType>('none');
  const [opponentType, setOpponentType] = useState<AttackType | DefenseType>('none');
  const [quality, setQuality] = useState<MarkingQuality>('good')
  const [note, setNote] = useState('');
  const [remainTime, setRemainTime] = useState(0);

  const [attackAttemptCount, setAttackAttemptCount] = useState(0);
  const [parryAttemptCount, setParryAttemptCount] = useState(0);
  const [counterAttackAttemptCount, setCounterAttackAttemptCount] = useState(0);


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
    setAttackAttemptCount(match.attackAttemptCount ?? 0);
    setParryAttemptCount(match.parryAttemptCount ?? 0);
    setCounterAttackAttemptCount(match.counterAttackAttemptCount ?? 0);

    // 2) 비디오 read URL
    const videoUrlRes = await getVideoReadUrl(match.objectName);
    const url = videoUrlRes?.data?.url;
    if (url) setVideoUrl(url);

    // 3) 마킹 리스트
    const ml = await getMarkingList(Number(id));
    const list = ml?.data ?? [];
    setMarkings(list);
  }


  const addMarking = async () => {
    if (!videoRef) return;
    const time = Math.floor(videoRef.currentTime);
    const body: CreateMarkingRequest = {
      matchId: Number(id),
      timestamp: time,
      result: resultType,
      myType,
      opponentType,
      quality,
      note,
      remainTime,
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
  };

  const removeMarking = async (index: number) => {
    const target = markings[index];
    if (!target) return;
    const id = target.id;

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

  const handleCounterChange = async (type: CounterType, delta: number) => {
    // 현재 값 가져오기
    const current = (() => {
      switch (type) {
        case 'attack_attempt_count':
          return attackAttemptCount;
        case 'parry_attempt_count':
          return parryAttemptCount;
        case 'counter_attack_attempt_count':
          return counterAttackAttemptCount;
      }
    })();

    // 0 이하로 내려가는 경우 막기
    if (delta < 0 && current === 0) return;

    // 낙관적 업데이트
    const updater = (v: number) => Math.max(0, v + delta);
    switch (type) {
      case 'attack_attempt_count':
        setAttackAttemptCount(updater);
        break;
      case 'parry_attempt_count':
        setParryAttemptCount(updater);
        break;
      case 'counter_attack_attempt_count':
        setCounterAttackAttemptCount(updater);
        break;
    }

    // API 호출
    const res = await updateCounter(Number(id), type, delta);

    // 실패 시 복구
    if (!res || res.code !== 200) {
      switch (type) {
        case 'attack_attempt_count':
          setAttackAttemptCount(current);
          break;
        case 'parry_attempt_count':
          setParryAttemptCount(current);
          break;
        case 'counter_attack_attempt_count':
          setCounterAttackAttemptCount(current);
          break;
      }
    }
  };

  if (!match) return null;

  return (
    <main className="flex flex-col px-8 py-6 gap-6">
      {/* 영상 */}
      {videoUrl && (
        <div className="w-full">
          <VideoPlayer
            videoUrl={videoUrl}
            markings={markings}
            getRef={setVideoRef}
          />
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

        <MarkingForm
          resultType={resultType}
          setResultType={setResultType}
          myType={myType}
          setMyType={setMyType}
          opponentType={opponentType}
          setOpponentType={setOpponentType}
          quality={quality}
          setQuality={setQuality}
          remainTime={remainTime}
          setRemainTime={setRemainTime}
          note={note}
          setNote={setNote}
          onAdd={addMarking}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-4 mt-6 rounded">
        <CounterList
          attackCount={attackAttemptCount}
          parryCount={parryAttemptCount}
          counterAttackCount={counterAttackAttemptCount}
          onChange={handleCounterChange}
        />
    </div>
</main>
)
  ;
}