import {Counter} from "@/widgets/common/Counter";

export function CounterList({
                              attackCount,
                              parryCount,
                              counterAttackCount,
                              setAttack,
                              setParry,
                              setCounter,
                            }: {
  attackCount: number;
  parryCount: number;
  counterAttackCount: number;
  setAttack: (v: number) => void;
  setParry: (v: number) => void;
  setCounter: (v: number) => void;
}) {
  return (
    <div className="flex gap-6 text-center">
      <Counter label="Attack" count={attackCount} setCount={setAttack}/>
      <Counter label="Parry" count={parryCount} setCount={setParry}/>
      <Counter label="Counter attack" count={counterAttackCount} setCount={setCounter}/>
    </div>
  );
}