import { X } from "lucide-react";
import {Button} from "@/widgets/common/Button";
import {Marking} from "@/entities/marking";

export function MarkingList({ markings, onRemove, onSeek }: {
  markings: Marking[];
  onRemove: (index: number) => void;
  onSeek: (time: number) => void;
}) {
  return (
    <ul className="border rounded p-2 space-y-1 max-h-72 overflow-y-auto text-sm bg-white shadow-sm">
      {markings.map((mark, i) => (
        <li key={i} className="flex items-center justify-between">
          <Button variant={"ghost"} className="text-left flex-1" onClick={() => onSeek(mark.time)}>
            {String(mark.time).padStart(2, '0')}s - {mark.result} - {mark.attackType ?? mark.defenseType}
          </Button>
          <X onClick={() => onRemove(i)} className="cursor-pointer text-red-600 w-4 h-4 ml-2" />
        </li>
      ))}
    </ul>
  );
}