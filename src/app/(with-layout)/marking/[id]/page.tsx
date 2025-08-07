'use client';

import {useState, useEffect} from 'react';
import {ChevronDown, ChevronUp, X} from 'lucide-react';
import {Button} from '@/widgets/common/Button';
import {getMatch} from "@/app/features/match/api/get-match";
import {useParams} from "next/navigation";
import VideoPlayer from "@/widgets/common/VideoPlayer";
import {Match} from "@/entities/match";
import {AttackType, DefenseType, Marking, MarkingResult} from "@/entities/marking";
import {MarkingForm} from "@/widgets/marking/MarkingForm";
import {CounterList} from "@/widgets/Match/MatchCouterSection";
import {MarkingList} from "@/widgets/marking/MarkingList";

export default function Page() {
  const params = useParams();
  const id = params.id;

  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const [match, setMatch] = useState<Match | null>(null);
  const [showMarkings, setShowMarkings] = useState(true);

  const [markings, setMarkings] = useState<Marking[]>([]);
  const [resultType, setResultType] = useState<MarkingResult>('win');
  const [myType, setMyType] = useState<AttackType | DefenseType>('none');
  const [opponentType, setOpponentType] = useState<AttackType | DefenseType>('none');
  const [note, setNote] = useState('');

  const [attackAttemptCount, setAttackAttemptCount] = useState(0);
  const [parryAttemptCount, setParryAttemptCount] = useState(0);
  const [counterAttackAttemptCount, setCounterAttackAttemptCount] = useState(0);


  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const response = await getMatch(Number(id));
      if (response?.data) {
        const match = response.data
        setMatch(response?.data ?? null);
        setAttackAttemptCount(match.attackAttemptCount ?? 0);
        setParryAttemptCount(match.parryAttemptCount ?? 0);
        setCounterAttackAttemptCount(match.counterAttackAttemptCount ?? 0);
      }
    };

    fetchData()

  }, [id]);


  const addMarking = () => {
    if (!videoRef) return;
    const time = Math.floor(videoRef.currentTime);
    setMarkings((prev) => [...prev, {time, result: resultType, myType, opponentType, note}]);
    console.log(markings)
  };

  const removeMarking = (index: number) => {
    setMarkings((prev) => prev.filter((_, i) => i !== index));
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
      {match.videoUrl && (
        <div className="w-full">
          <VideoPlayer videoUrl={match.videoUrl} getRef={setVideoRef}/>
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
          setAttack={setAttackAttemptCount}
          setParry={setParryAttemptCount}
          setCounter={setCounterAttackAttemptCount}
        />

        <Button className="px-6 py-2 text-white bg-black hover:bg-gray-800">
           Save
      </Button>
    </div>
</main>
)
  ;
}