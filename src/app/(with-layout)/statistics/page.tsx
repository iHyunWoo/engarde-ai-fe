"use client"

import {useEffect, useMemo, useState} from "react";
import {useStatistics} from "@/app/features/statistic/hooks/use-statistics";
import {AttemptChart} from "@/widgets/statistic/AttemptChart";
import {last7DaysRange} from "@/shared/lib/format-percent";
import {LoseChart} from "@/widgets/statistic/LoseChart";
import {DateRangeForm} from "@/widgets/common/DataRangeForm";

export default function StatisticsPage() {
  const initial = useMemo(() => last7DaysRange(), []);
  const [range, setRange] = useState(initial);
  const { data, loading, fetchData } = useStatistics();

  useEffect(() => {
    fetchData(range.from, range.to)
  }, []);

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Statistics</h1>
        </header>

        <section className="mb-6">
          <DateRangeForm
            from={range.from}
            to={range.to}
            onSubmit={(r) => {
              setRange(r);
              fetchData(r.from, r.to);
            }}
            loading={loading}
          />
        </section>

        {data && (
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AttemptChart
                attempt={data.attempt}
              />
              <LoseChart
                lose={data.lose}
              />
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

