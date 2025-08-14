import {Button} from '@/widgets/common/Button';
import {cn} from "@/shared/lib/utils";

export default function MatchCountBadge({
                                          count,
                                          onClick,
                                          className
                                        }: {
  count: number;
  onClick: () => void;
  className?: string;
}) {
  const label = `${count} ${count === 1 ? 'match' : 'matches'}`;
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn([
        className,
        "text-black hover:text-black underline"
      ])}
    >
      {label}
    </Button>
  );
}