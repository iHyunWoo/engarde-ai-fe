import {Counter} from "@/widgets/common/Counter";
import {CounterType} from "@/app/features/match/api/update-counter";

export function CounterList({
                              attackCount,
                              parryCount,
                              counterAttackCount,
                              onChange,
                            }: {
  attackCount: number;
  parryCount: number;
  counterAttackCount: number;
  onChange: (type: CounterType, delta: number) => void;
}) {
  return (
    <div className="flex gap-6 text-center">
      <Counter
        label="Attack"
        count={attackCount}
        changeCount={(delta) => onChange('attack_attempt_count', delta)}
      />
      <Counter
        label="Parry"
        count={parryCount}
        changeCount={(delta) => onChange('parry_attempt_count', delta)}
      />
      <Counter
        label="Counter attack"
        count={counterAttackCount}
        changeCount={(delta) => onChange('counter_attack_attempt_count', delta)}
      />
    </div>
  );
}