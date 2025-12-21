"use client"

import {useMemo, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useCoachUserStatisticsV3} from "@/app/features/statistic/hooks/use-coach-user-statistics-v3";
import {last7DaysRange} from "@/shared/lib/format-percent";
import {DateRangeForm} from "@/widgets/statistic/DataRangeForm";
import {TopScoredTacticsChart} from "@/widgets/statistic/TopScoredTacticsChart";
import {TopReceivedTacticsChart} from "@/widgets/statistic/TopReceivedTacticsChart";
import {TacticSynergyMatrix} from "@/widgets/statistic/TacticSynergyMatrix";
import {LocationStatChart} from "@/widgets/statistic/LocationStatChart";
import {useStudentName} from "@/app/features/team/hooks/use-student-name";
import {Button} from "@/widgets/common/Button";
import {ArrowLeft, Gamepad2} from "lucide-react";
import Link from "next/link";

// 기존 통계들 주석처리
// import {AttemptChart} from "@/widgets/statistic/AttemptChart";
// import {LoseChart} from "@/widgets/statistic/LoseChart";
// import {OpponentChart} from "@/widgets/statistic/OpponentChart";
// import {SummaryChart} from "@/widgets/statistic/SummaryChart";
// import {TechniquesByMatchChart} from "@/widgets/statistic/TechniquesByMatchChart";
// import MatchCountBadge from "@/widgets/Match/MatchCountBadge";
// import MatchesModal from "@/widgets/Match/MatchesModal";

export default function StudentStatisticsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const { name: studentName } = useStudentName(userId);
  const initial = useMemo(() => last7DaysRange(), []);
  const [range, setRange] = useState(initial);
  const [mode, setMode] = useState<'all' | 'preliminary' | 'main'>('all');

  const { data, loading } = useCoachUserStatisticsV3(userId, range.from, range.to, mode);

  const pageTitle = studentName ? `${studentName}'s Statistics` : 'Student Statistics';

  return (
    <div className="min-h-dvh">
      <div className="mx-auto px-4 py-8">
        <header className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
              <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
            </div>
            <Link href={`/my-team/students/${userId}/matches`}>
              <Button>
                <Gamepad2 className="w-4 h-4 mr-2" />
                View Matches
              </Button>
            </Link>
          </div>
        </header>

        <section className="flex flex-row items-center mb-6 gap-2">
          <DateRangeForm
            from={range.from}
            to={range.to}
            onSubmit={(r) => {
              setRange({ from: r.from, to: r.to });
              setMode(r.mode);
            }}
            loading={loading}
          />
        </section>

        {data && (
          <div className="space-y-6">
            {/* 점한 횟수 높은 tactic (전체) */}
            <TopScoredTacticsChart data={data.topScoringTactics} />
            
            {/* 득점을 제일 많이 당한 tactic (전체) */}
            <TopReceivedTacticsChart data={data.topConcededTactics} />
            
            {/* Tactic 상성 매트릭스 */}
            <TacticSynergyMatrix data={data.tacticMatchups} />
            
            {/* 위치별 통계 */}
            <LocationStatChart data={data.locationStats} />
          </div>
        )}

        {/* 기존 통계들 주석처리 */}
        {/* {data && (
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <SummaryChart
                title="Win Tactics"
                data={data.summary.win}
              />
              <SummaryChart
                title="Lose Tactics"
                data={data.summary.lose}
              />
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4">
              {data.techniquesByMatch.map((techniques) => (
                <div key={techniques.match.id}>
                  <TechniquesByMatchChart techniques={techniques} />
                </div>
              ))}
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4">
              {data.opponentStats.map((opponent) => (
                <div key={opponent.opponent.id}>
                  <OpponentChart opponent={opponent} />
                </div>
              ))}
            </div>

            <AttemptChart
              techniques={data.winRate}
            />
            <LoseChart
              techniques={data.lossCount}
            />
          </div>
        )} */}
      </div>
    </div>
  );
}

