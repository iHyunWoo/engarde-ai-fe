"use client"

import {useMemo} from "react";
import {Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {NotesTooltip} from "@/widgets/statistic/NotesTooltip";
import {LoseDto} from "@ihyunwoo/engarde-ai-api-sdk/structures";

interface LoseChartProps {
  lose?: LoseDto;
}

export function LoseChart({ lose }: LoseChartProps) {
  const data = useMemo(() => {
    if (!lose) return [] as { name: string; count: number, raw: string }[];
    return [
      {name: "Lunge", count: lose.lungeLoseCount, raw: "lunge"},
      {name: "Adv Lunge", count: lose.advancedLungeLoseCount, raw: "advancedLunge"},
      {name: "Fleche", count: lose.flecheLoseCount, raw: "fleche"},
      {name: "Push", count: lose.pushLoseCount, raw: "push"},
      {name: "Parry", count: lose.parryLoseCount, raw: "parry"},
      {name: "Counter", count: lose.counterAttackLoseCount, raw: "counter"},
    ];
  }, [lose]);

  const notesMap = useMemo(() => ({
    lunge: lose?.topNotesByType?.lunge ?? [],
    advancedLunge: lose?.topNotesByType?.advancedLunge ?? [],
    fleche: lose?.topNotesByType?.fleche ?? [],
    push: lose?.topNotesByType?.push ?? [],
    parry: lose?.topNotesByType?.parry ?? [],
    counter: lose?.topNotesByType?.counter ?? [],
  }), [lose]);

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
              const raw = payload[0].payload.raw as 'lunge' | 'advancedLunge' | 'fleche' | 'push' | 'parry' | 'counter'
              return <NotesTooltip notes={notesMap[raw]} />;
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