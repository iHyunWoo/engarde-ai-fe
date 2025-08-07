import { Button } from '@/widgets/common/Button';
import { AttackType, DefenseType, MarkingResult } from '@/entities/marking';
import {useEffect, useRef, useState} from "react";

const markingResults: MarkingResult[] = ['win', 'lose', 'attempt'];
const attackTypes: AttackType[] = ['none', 'lunge', 'advanced lunge', 'fleche', 'push'];
const defenseTypes: DefenseType[] = ['none', 'parry', 'counter attack'];

const mockNotes = [
  'Nice push',
  'Fast fleche',
  'Parry failed',
  'Counter was late',
  'Good distance',
  'Lost balance',
  'Great rhythm',
  'Too passive',
  'Attack without prep',
];

export function MarkingForm({
                              resultType,
                              setResultType,
                              attackType,
                              setAttackType,
                              defenseType,
                              setDefenseType,
                              note,
                              setNote,
                              onAdd,
                            }: {
  resultType: MarkingResult;
  setResultType: (v: MarkingResult) => void;
  attackType: AttackType;
  setAttackType: (v: AttackType) => void;
  defenseType: DefenseType;
  setDefenseType: (v: DefenseType) => void;
  note: string;
  setNote: (v: string) => void;
  onAdd: () => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectSuggestion = (text: string) => {
    setNote(text);
    setFocused(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (note.length > 1) {
      // TODO: 실제 API 연동
      const filtered = mockNotes.filter(n => n.toLowerCase().includes(note.toLowerCase()));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [note]);
  const renderGroupedOptions = (selected: string, onChange: (v: string) => void) => (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-2 py-1 rounded text-sm"
    >
      <optgroup label="Attack">
        {attackTypes.map((type) => (
          <option key={type} value={type}>
            {type[0].toUpperCase() + type.slice(1)}
          </option>
        ))}
      </optgroup>
      <optgroup label="Defense">
        {defenseTypes.map((type) => (
          <option key={type} value={type}>
            {type[0].toUpperCase() + type.slice(1)}
          </option>
        ))}
      </optgroup>
    </select>
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Result Type</label>
        <select
          value={resultType}
          onChange={(e) => setResultType(e.target.value as MarkingResult)}
          className="w-full border px-2 py-1 rounded text-sm"
        >
          {markingResults.map((type) => (
            <option key={type} value={type}>
              {type[0].toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between gap-4">
        <div className="w-1/2 space-y-2">
          <label className="block text-sm font-medium">Me</label>
          {renderGroupedOptions(attackType, (val) => {
            if (attackTypes.includes(val as AttackType)) setAttackType(val as AttackType);
            else setDefenseType(val as DefenseType);
          })}
        </div>
        <div className="w-1/2 space-y-2">
          <label className="block text-sm font-medium">Opponent</label>
          {renderGroupedOptions(defenseType, (val) => {
            if (attackTypes.includes(val as AttackType)) setAttackType(val as AttackType);
            else setDefenseType(val as DefenseType);
          })}
        </div>
      </div>

      {/* Note Field */}
      <div className="space-y-1 relative">
        <label className="block text-sm font-medium">Note</label>

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={note}
            onChange={(e) => {
              if (e.target.value.length <= 100) setNote(e.target.value);
            }}
            placeholder="Enter note (max 100 characters)"
            className="w-full border px-2 py-1 rounded text-sm"
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 100)} // blur 이후 클릭 감지 위해 delay
          />

          {focused && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full border border-gray-300 rounded mt-1 max-h-32 overflow-auto text-xs bg-white shadow-lg">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Button onClick={onAdd}>Add Marking</Button>
    </div>
  );
}