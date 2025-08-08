import {Marking, MarkingQuality} from "@/entities/marking";
import {Button} from "@/widgets/common/Button";
import {CheckCircle, Sparkles, X, XCircle} from "lucide-react";
import {formatTime} from "@/shared/lib/format-time";
import {ReactElement} from "react";


const QUALITY_STYLE: Record<MarkingQuality, {
  pill: string;
  text: string;
  border: string;
  icon: ReactElement;
  label: string;
}> = {
  good: {
    pill: "bg-emerald-100 ring-1 ring-emerald-200",
    text: "text-emerald-700",
    border: "border-emerald-400",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    label: "Good",
  },
  bad: {
    pill: "bg-rose-100 ring-1 ring-rose-200",
    text: "text-rose-700",
    border: "border-rose-400",
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: "Bad",
  },
  lucky: {
    pill: "bg-amber-100 ring-1 ring-amber-200",
    text: "text-amber-800",
    border: "border-amber-400",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    label: "Lucky",
  },
};

function QualityPill({ q }: { q: MarkingQuality }) {
  const s = QUALITY_STYLE[q];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${s.pill} ${s.text}`}>
      {s.icon}
      <span className="leading-none">{s.label}</span>
    </span>
  );
}


export function MarkingList({
                              markings,
                              onRemove,
                              onSeek,
                            }: {
  markings: Marking[];
  onRemove: (index: number) => void;
  onSeek: (time: number) => void;
}) {
  return (
    <ul className="border rounded p-2 space-y-1 max-h-72 overflow-y-auto text-sm bg-white shadow-sm">
      {markings.map((mark, i) => (
        <li
          key={i}
          className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition"
        >
          {/* 시간 표시 */}
          <Button
            variant="ghost"
            onClick={() => onSeek(mark.time)}
            className="min-w-[70px] font-mono text-blue-600 hover:text-blue-800 hover:underline text-left"
          >
            {formatTime(mark.time)}
          </Button>

          {/* 내용 표시 */}
          <div className="flex-1 flex items-center justify-start gap-3 pl-1">
            <span className="text-gray-800">{mark.result}</span>
            <span className="text-gray-500">{mark.myType}</span>

            {/* quality pill */}
            <QualityPill q={mark.quality} />
          </div>

          {/* 삭제 버튼 */}
          <X
            onClick={() => onRemove(i)}
            className="cursor-pointer text-red-600 w-4 h-4 ml-2"
          />
        </li>
      ))}
    </ul>
  );
}