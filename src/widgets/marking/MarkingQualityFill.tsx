import {MarkingQuality} from "@/entities/marking";
import {ReactElement} from "react";
import {CheckCircle, Sparkles, XCircle} from "lucide-react";

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

export function QualityPill({ q }: { q: MarkingQuality }) {
  const s = QUALITY_STYLE[q];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${s.pill} ${s.text}`}>
      {s.icon}
      <span className="leading-none">{s.label}</span>
    </span>
  );
}
