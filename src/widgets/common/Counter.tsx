import {Button} from "@/widgets/common/Button";

export function Counter({ label, count, changeCount }: {
  label: string;
  count: number;
  changeCount: (delta: number) => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-gray-500 text-sm text-center">{label}</p>
      <div className="flex items-center gap-2 justify-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => changeCount(-1)}>−</Button>
        <p className="text-xl font-semibold min-w-6 text-center">{count}</p>
        <Button variant="outline" size="icon" onClick={() => changeCount(1)}>＋</Button>
      </div>
    </div>
  );
}