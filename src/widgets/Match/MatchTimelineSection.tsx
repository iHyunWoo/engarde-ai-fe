"use client"

import {Card, CardContent, CardHeader} from "@/widgets/common/Card";
import {Clock} from "lucide-react";
import {ReactNode} from "react";
import {Marking, MarkingResult} from "@/entities/marking";
import {formatTime} from "@/shared/lib/format-time";

interface MatchTimelineSectionProps {
  markings: Marking[]
}

const PALETTE: Record<MarkingResult, {
  border: string; dot: string; bg: string; borderLight: string; badge: string; label: string;
}> = {
  win:     { border: 'border-emerald-500', dot: 'bg-emerald-500', bg: 'bg-emerald-50', borderLight: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', label: '득점' },
  attempt: { border: 'border-sky-500',     dot: 'bg-sky-500',     bg: 'bg-sky-50',     borderLight: 'border-sky-200',     badge: 'bg-sky-100 text-sky-700',     label: '시도' },
  lose:    { border: 'border-rose-500',    dot: 'bg-rose-500',    bg: 'bg-rose-50',    borderLight: 'border-rose-200',    badge: 'bg-rose-100 text-rose-700',   label: '실점' },
};

export function MatchTimelineSection({markings}: MatchTimelineSectionProps) {
  // 타임라인은 timestamp asc, 동시간대는 id asc
  const sorted = [...markings].sort((a,b) =>
    a.timestamp === b.timestamp ? a.id - b.id : a.timestamp - b.timestamp
  );

  const items: ReactNode[] = [];
  let prevRemain: number | null = null;
  let setIndex = 1;

  // 각 item을 돌면서 remainTime 기준으로 세트를 계산.
  // remainTime이 감소하다 증가하는 시점에 divider 추가
  sorted.forEach((mark, idx) => {
    const startNewSet = prevRemain === null || mark.remainTime > (prevRemain ?? 0);
    if (startNewSet && idx !== 0) {
      items.push(
        <Divider key={`set-${setIndex}-${mark.id}`} />
      );
      if (prevRemain !== null) setIndex += 1;
    }
    prevRemain = mark.remainTime;
    items.push(<TimelineItem key={mark.id} mark={mark} />);
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-slate-600" />
          <h2 className="text-xl font-semibold text-slate-900">Timeline</h2>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200" />
          <div className="space-y-6">{items}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Divider() {
  return (
    <div className="pl-14">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </div>
  );
}

function TimelineItem({ mark }: { mark: Marking }) {
  // lose → 오른쪽, 나머지 왼쪽
  const isRight = mark.result === "lose";
  const theme = PALETTE[mark.result];

  return (
    <div className={`relative flex items-start space-x-6 ${isRight ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Dot */}
      <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white ${theme.border}`}>
        <div className={`w-3 h-3 rounded-full ${theme.dot}`} />
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${isRight ? 'text-right' : ''}`}>
        <div className={`inline-block max-w-md p-4 rounded-lg border ${theme.bg} ${theme.borderLight}`}>
          <div className={`flex items-center gap-2 mb-2 ${isRight ? 'justify-end' : ''}`}>
            <span className={`px-2 py-0.5 text-xs rounded ${theme.badge}`}>{theme.label}</span>
          </div>

          <div className={`flex items-center gap-2 text-xs text-slate-500 ${isRight ? 'justify-end' : ''}`}>
            <Clock className="w-3 h-3" />
            <span>{formatTime(mark.remainTime)}</span>
            <span>·</span>
            {(mark.result === 'win' || mark.result === 'attempt') && (
              <span className="font-medium">{mark.myType}</span>
            )}
            {mark.result === 'lose' && (
              <span className="font-medium">{mark.opponentType}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}