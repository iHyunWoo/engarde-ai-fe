"use client"

import {useMemo} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {NotesTooltip} from "@/widgets/statistic/NotesTooltip";
import type {TopNoteDto, WinRateStatisticsResponse} from "@ihyunwoo/engarde-ai-api-sdk/structures";

interface AttemptChartProps {
  techniques?: WinRateStatisticsResponse;
}

export function AttemptChart({techniques}: AttemptChartProps) {
  const data = useMemo(() => {
    if (!techniques) return [];
    const arr = Object.entries(techniques).map(([id, technique]) => ({
      name: technique.name,
      win: technique.winCount,
      total: technique.attemptCount,
      id: id,
      raw: technique.name.toLowerCase(),
    }));

    return arr.map(x => ({
      name: x.name,
      raw: x.raw,
      id: x.id,
      rate: x.total ? x.win / x.total : 0,
      labelValue: `${x.win} / ${x.total}`,
    }));
  }, [techniques]);

  const notesMap = useMemo(() => {
    if (!techniques) return new Map<number, TopNoteDto[]>();
    return new Map(
      Object.entries(techniques).map(
        ([id, technique]) =>
          [Number(id), technique.topNotes]
      )
    );
  }, [techniques]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold">Success rate</h3>
        <span className="text-xs text-gray-500">(Win / Attempt)</span>
      </div>

      <div className="overflow-x-auto">
        <div className="h-64 min-w-[700px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]} tickFormatter={(v) => `${v * 100}%`} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const id = Number(payload[0].payload.id)
                return <NotesTooltip notes={notesMap.get(id)} />;
              }} />
              <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                <LabelList dataKey="labelValue" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
