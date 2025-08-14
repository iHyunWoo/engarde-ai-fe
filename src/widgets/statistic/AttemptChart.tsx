"use client"

import {AttemptDto} from "@/app/features/statistic/dto/get-statistics-request";
import {useMemo} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis
} from "recharts";
import {clamp} from "@/shared/lib/format-percent";
import {NotesTooltip} from "@/widgets/statistic/NotesTooltip";

interface AttemptChartProps {
  attempt?: AttemptDto;
}

export function AttemptChart({attempt}: AttemptChartProps) {
  const data = useMemo(() => {
    if (!attempt) return [];
    const arr = [
      {
        name: "Attack",
        win: attempt.attackWinCount,
        total: attempt.attackAttemptCount,
        raw: "attack"
      },
      {
        name: "Parry",
        win: attempt.parryWinCount,
        total: attempt.parryAttemptCount,
        raw: "parry"
      },
      {
        name: "Counter",
        win: attempt.counterAttackWinCount,
        total: attempt.counterAttackAttemptCount,
        raw: "counter"
      },
    ];

    return arr.map(x => ({
      name: x.name,
      raw: x.raw,
      rate: x.total ? x.win / x.total : 0,
      labelValue: `${x.win} / ${x.total}`,
    }));
  }, [attempt]);

  const notesMap = useMemo(() => ({
    attack: attempt?.topNotesByType?.attack ?? [],
    parry: attempt?.topNotesByType?.parry ?? [],
    counter: attempt?.topNotesByType?.counterAttack ?? [],
  }), [attempt]);

  return (
    <div
      className="rounded-2xl border bg-white p-4 shadow-sm"
    >
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold">Success rate</h3>
        <span className="text-xs text-gray-500">(Win / Attempt)</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{left: 8, right: 8}}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis domain={[0, 1]} tickFormatter={(v) => `${v * 100}%`}/>
            <Tooltip content={({active, payload}) => {
              if (!active || !payload?.length) return null;
              const raw = payload[0].payload.raw as 'attack' | 'parry' | 'counter';
              return <NotesTooltip notes={notesMap[raw]}/>;
            }}/>
            <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
              <LabelList dataKey="labelValue" position="top"/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
