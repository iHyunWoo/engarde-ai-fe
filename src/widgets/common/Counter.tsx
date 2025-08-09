import {Button} from "@/widgets/common/Button";

export function Counter({ label, count, changeCount }: {
  label: string;
  count: number;
  changeCount: (delta: number) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-gray-500 text-sm">{label}</p>
      <div className="flex items-center gap-2 justify-center">
        <Button variant="outline" size="icon" onClick={() => changeCount(-1)}>−</Button>
        <p className="text-xl font-semibold w-6">{count}</p>
        <Button variant="outline" size="icon" onClick={() => changeCount(1)}>＋</Button>
      </div>
    </div>
  );
}