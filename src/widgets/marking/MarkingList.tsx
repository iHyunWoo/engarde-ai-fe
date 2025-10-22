import {Marking, MarkingQuality} from "@/entities/marking";
import {Button} from "@/widgets/common/Button";
import {CheckCircle, Clock, Sparkles, X, XCircle, Bookmark} from "lucide-react";
import {formatTime} from "@/shared/lib/format-time";
import {ReactElement} from "react";
import {QualityPill} from "@/widgets/marking/MarkingQualityFill";
import {formatTechniqueName} from "@/app/features/technique/lib/format-technique-name";
import {Separator} from "@/widgets/common/Separator";

export function MarkingList({
                              markings,
                              onRemove,
                              onSeek,
                            }: {
  markings: Marking[];
  onRemove: (id: number) => void;
  onSeek: (time: number) => void;
}) {
  return (
    <div className="border rounded p-2 space-y-1 max-h-72 overflow-y-auto text-sm bg-white shadow-sm">
      {markings.map((mark) => {
        if (mark.result === 'setEnded') {
          return (
            <div key={mark.id} className="flex items-center gap-2 py-2 mx-2">
              <Separator className="flex-1" />
              <div className="flex items-center gap-1 font-medium">
                <Bookmark className="w-4 h-4" />
                <span>Set Ended</span>
              </div>
              <Separator className="flex-1" />
              <X
                onClick={() => onRemove(mark.id)}
                className="cursor-pointer text-red-600 w-4 h-4 ml-2"
              />
            </div>
          );
        }

        return (
          <div
            key={mark.id}
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
              <span className="text-gray-800">{formatTechniqueName(mark.result)}</span>
              <span className="text-gray-500">{formatTechniqueName(mark.myTechnique?.name ?? "None")}</span>

              <QualityPill q={mark.quality}/>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5"/>
              <span className="font-mono">{formatTime(mark.remainTime)}</span>
            </div>

            {/* 삭제 버튼 */}
            <X
              onClick={() => onRemove(mark.id)}
              className="cursor-pointer text-red-600 w-4 h-4 ml-2"
            />
          </div>
        );
      })}
    </div>
  );
}