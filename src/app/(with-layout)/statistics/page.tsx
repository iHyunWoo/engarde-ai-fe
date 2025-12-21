"use client"

import {useMemo, useState} from "react";
import {useStatisticsV3} from "@/app/features/statistic/hooks/use-statistics-v3";
import {last7DaysRange} from "@/shared/lib/format-percent";
import {DateRangeForm} from "@/widgets/statistic/DataRangeForm";
import MatchCountBadge from "@/widgets/Match/MatchCountBadge";
import MatchesModal from "@/widgets/Match/MatchesModal";
import {TopScoredTacticsChart} from "@/widgets/statistic/TopScoredTacticsChart";
import {TopReceivedTacticsChart} from "@/widgets/statistic/TopReceivedTacticsChart";
import {TacticSynergyMatrix} from "@/widgets/statistic/TacticSynergyMatrix";

// 기존 통계들 주석처리
// import {AttemptChart} from "@/widgets/statistic/AttemptChart";
// import {LoseChart} from "@/widgets/statistic/LoseChart";
// import {OpponentChart} from "@/widgets/statistic/OpponentChart";
// import {SummaryChart} from "@/widgets/statistic/SummaryChart";
// import {TechniquesByMatchChart} from "@/widgets/statistic/TechniquesByMatchChart";

export default function StatisticsPage() {
  const initial = useMemo(() => last7DaysRange(), []);
  const [range, setRange] = useState(initial);
  const [mode, setMode] = useState<'all' | 'preliminary' | 'main'>('all');
  const [openMatchListModal, setOpenMatchListModal] = useState(false);

  const { data, loading } = useStatisticsV3(range.from, range.to, mode);


  return (
    <div className="min-h-dvh">
      <div className="mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Statistics</h1>
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

