"use client"

import {useEffect, useMemo, useState} from "react";
import {useStatistics} from "@/app/features/statistic/hooks/use-statistics";
import {AttemptChart} from "@/widgets/statistic/AttemptChart";
import {last7DaysRange} from "@/shared/lib/format-percent";
import {LoseChart} from "@/widgets/statistic/LoseChart";
import {DateRangeForm} from "@/widgets/statistic/DataRangeForm";
import MatchCountBadge from "@/widgets/Match/MatchCountBadge";
import MatchesModal from "@/widgets/Match/MatchesModal";
import {OpponentChart} from "@/widgets/statistic/OpponentChart";
import {SummaryChart} from "@/widgets/statistic/SummaryChart";

export default function StatisticsPage() {
  const initial = useMemo(() => last7DaysRange(), []);
  const [range, setRange] = useState(initial);
  const [openMatchListModal, setOpenMatchListModal] = useState(false);

  const { data, loading, fetchData } = useStatistics();

  useEffect(() => {
    fetchData(range.from, range.to, 'all')
  }, []);

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
              setRange(r);
              fetchData(r.from, r.to, r.mode);
            }}
            loading={loading}
          />

          {data && (
            <>
              <MatchCountBadge
                count={data.matchCount}
                onClick={() => setOpenMatchListModal(true)}
                className={"mt-5"}
              />

              <MatchesModal
                open={openMatchListModal}
                onCloseAction={() => setOpenMatchListModal(false)}
                from={range.from}
                to={range.to}
              />
            </>
          )}
        </section>

        {data && (
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <SummaryChart
                title="Win Techniques"
                data={data.summary.win}
              />
              <SummaryChart
                title="Lose Techniques"
                data={data.summary.lose}
              />
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
        )}
      </div>
    </div>
  );
}

