import {Marking, MarkingQuality} from "@/entities/marking";
import {Button} from "@/widgets/common/Button";
import {CheckCircle, Clock, Sparkles, X, XCircle} from "lucide-react";
import {formatTime} from "@/shared/lib/format-time";
import {ReactElement} from "react";
import {QualityPill} from "@/widgets/marking/MarkingQualityFill";

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
            onClick={() => onSeek(mark.timestamp)}
            className="min-w-[70px] font-mono text-blue-600 hover:text-blue-800 hover:underline text-left"
          >
            {formatTime(mark.timestamp)}
          </Button>

          {/* 내용 표시 */}
          <div className="flex-1 flex items-center justify-start gap-3 pl-1">
            <span className="text-gray-800">{mark.result}</span>
            <span className="text-gray-500">{mark.myTechnique.name}</span>

            <QualityPill q={mark.quality}/>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5"/>
            <span className="font-mono">{formatTime(mark.remainTime)}</span>
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