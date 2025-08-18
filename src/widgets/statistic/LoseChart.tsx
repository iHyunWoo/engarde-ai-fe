"use client"

import {useMemo} from "react";
import {Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {NotesTooltip} from "@/widgets/statistic/NotesTooltip";
import type {
  LossCountStatisticsResponse, TopNoteDto
} from "@ihyunwoo/engarde-ai-api-sdk/structures";

interface LoseChartProps {
  techniques?: LossCountStatisticsResponse;
}

export function LoseChart({ techniques }: LoseChartProps) {
  const data = useMemo(() => {
    if (!techniques) return [] as { name: string; count: number, raw: string }[];
    return Object.entries(techniques).map(([id, technique]) => ({
      name: technique.name,
      count: technique.count,
      id: id,
      raw: technique.name.toLowerCase(),
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
    <div
      className="rounded-2xl border bg-white p-4 shadow-sm"
    >
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold">Loss types</h3>
        <span className="text-xs text-gray-500">(Counts)</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{left: 8, right: 8}}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis allowDecimals={false}/>
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const id = Number(payload[0].payload.id)
              return <NotesTooltip notes={notesMap.get(id)}/>;
            }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              <LabelList dataKey="count" position="top"/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}