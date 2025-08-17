import {TopNoteDto} from "@ihyunwoo/engarde-ai-api-sdk/structures";

export function NotesTooltip({ label, notes }: { label?: string; notes?: TopNoteDto[] }) {
  return (
    <div className="rounded-md border bg-white p-3 shadow-sm text-sm max-w-xs">
      <div className="font-medium mb-1">{label}</div>
      {!notes || notes.length === 0 ? (
        <div className="text-gray-500">No notes</div>
      ) : (
        <ul className="space-y-0.5">
          {notes.map((n) => (
            <li key={n.note} className="flex justify-between gap-4">
              <span className="truncate max-w-[180px]" title={n.note}>{n.note}</span>
              <span>{n.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}