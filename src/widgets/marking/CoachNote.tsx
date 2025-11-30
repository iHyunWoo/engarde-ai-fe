import Image from "next/image";

interface CoachNoteProps {
  note: string;
  className?: string;
}

export function CoachNote({ note, className = "" }: CoachNoteProps) {
  return (
    <div className={`px-2 pb-2 pt-1 border-t bg-blue-50 ${className}`}>
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-blue-700 mt-0.5">
          <Image src="/images/coach.webp" alt="Coach Note" width={30} height={30} />
          <span className="font-medium">Coach Note</span>
        </div>
        <div className="flex-1 text-blue-800">
          {note}
        </div>
      </div>
    </div>
  );
}

