import { GraduationCap } from "lucide-react";

interface CoachNoteProps {
  note: string;
  className?: string;
}

export function CoachNote({ note, className = "" }: CoachNoteProps) {
  return (
    <div className={`px-2 pb-2 pt-1 border-t bg-blue-50 ${className}`}>
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-blue-700 mt-0.5">
          <GraduationCap className="w-3.5 h-3.5" />
          <span className="font-medium">Coach Note</span>
        </div>
        <div className="flex-1 text-blue-800">
          {note}
        </div>
      </div>
    </div>
  );
}

