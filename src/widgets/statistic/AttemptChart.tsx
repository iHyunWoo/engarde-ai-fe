"use client"

import {useMemo} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid, Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {NotesTooltip} from "@/widgets/statistic/NotesTooltip";
import type {TopNotesDTO, WinRateStatisticsResponse} from "@ihyunwoo/engarde-ai-api-sdk/structures";
import {CHART_COLORS} from "@/app/features/statistic/constants/chart-colors";

interface AttemptChartProps {
  techniques?: WinRateStatisticsResponse;
}

export function AttemptChart({techniques}: AttemptChartProps) {
  const data = useMemo(() => {
    if (!techniques) return [];

    return Object.entries(techniques).map(([id, technique]) => {
      const { name, winCount, attemptCount, isMainTechnique } = technique;

      return {
        id,
        name,
        raw: name.toLowerCase(),
        rate: attemptCount ? winCount / attemptCount : 0,
        labelValue: `${winCount} / ${attemptCount}`,
        isMainTechnique,
      };
    });
  }, [techniques]);

  const notesMap = useMemo(() => {
    if (!techniques) return new Map<number, TopNotesDTO[]>();
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
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isMainTechnique ? CHART_COLORS[0] : CHART_COLORS[1]}
                  />
                ))}
                <LabelList dataKey="labelValue" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
