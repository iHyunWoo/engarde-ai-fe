import { User } from "lucide-react";

interface StudentNoteProps {
  note: string;
  className?: string;
}

export function StudentNote({ note, className = "" }: StudentNoteProps) {
  return (
    <div className={`px-2 pb-2 pt-1 border-t bg-gray-50 ${className}`}>
      <div className="flex items-start gap-2 text-xs">
        <div className="flex items-center gap-1 text-gray-600 mt-0.5">
          <User className="w-3.5 h-3.5" />
          <span className="font-medium">Note</span>
        </div>
        <div className="flex-1 text-gray-700">
          {note}
        </div>
      </div>
    </div>
  );
}

