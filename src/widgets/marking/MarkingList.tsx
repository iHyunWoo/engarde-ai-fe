import {Marking} from "@/entities/marking";
import {Button} from "@/widgets/common/Button";
import {X} from "lucide-react";
import {formatTime} from "@/shared/lib/format-time";

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
          <div className="flex-1 flex justify-start gap-4 text-gray-800 text-sm pl-4">
            <span className="">{mark.result}</span>
            <span className="text-gray-500">{mark.myType}</span>
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