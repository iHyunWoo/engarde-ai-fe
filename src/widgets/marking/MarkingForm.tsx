import {Button} from '@/widgets/common/Button';
import {AttackType, MarkingType, DefenseType, MarkingQuality, MarkingResult} from '@/entities/marking';
import {useRef, useState} from "react";
import {formatTime} from "@/shared/lib/format-time";
import {useNoteSuggestions} from "@/app/features/marking/hooks/use-note-suggestion";

const markingResults: MarkingResult[] = ['win', 'lose', 'attempt'];
const attackTypes: AttackType[] = ['lunge', 'advanced_lunge', 'fleche', 'push'];
const defenseTypes: DefenseType[] = ['parry', 'counter_attack'];
const qualities: MarkingQuality[] = ['good', 'bad', 'lucky']

export function MarkingForm({
                              resultType,
                              setResultType,
                              myType,
                              setMyType,
                              opponentType,
                              setOpponentType,
                              quality,
                              setQuality,
                              remainTime,
                              setRemainTime,
                              note,
                              setNote,
                              onAdd,
                            }: {
  resultType: MarkingResult;
  setResultType: (v: MarkingResult) => void;
  myType: MarkingType;
  setMyType: (v: MarkingType) => void;
  opponentType: MarkingType;
  setOpponentType: (v: MarkingType) => void;
  quality: MarkingQuality
  setQuality: (v: MarkingQuality) => void;
  remainTime: number;
  setRemainTime: (v: number) => void;
  note: string;
  setNote: (v: string) => void;
  onAdd: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { suggestions } = useNoteSuggestions(note, focused);

  const handleSelectSuggestion = (text: string) => {
    setNote(text);
    setFocused(false);
    inputRef.current?.blur();
  };

  const formatString = (value: string) => {
    return value
      .replace(/_/g, " ") // _ → 공백
      .replace(/\b\w/g, (char) => char.toUpperCase()) // 각 단어 첫 글자 대문자
  }
  const renderGroupedOptions = (selected: string, onChange: (v: string) => void) => (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-2 py-1 rounded text-sm"
    >
      <option value="none">None</option>
      <optgroup label="Attack">
        {attackTypes.map((type) => (
          <option key={type} value={type}>
            {formatString(type)}
          </option>
        ))}
      </optgroup>
      <optgroup label="Defense">
        {defenseTypes.map((type) => (
          <option key={type} value={type}>
            {formatString(type)}
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
              {formatString(type)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between gap-4">
        <div className="w-1/2 space-y-2">
          <label className="block text-sm font-medium">Me</label>
          {renderGroupedOptions(myType, (val) => {
            setMyType(val as MarkingType);
          })}
        </div>
        <div className="w-1/2 space-y-2">
          <label className="block text-sm font-medium">Opponent</label>
          {renderGroupedOptions(opponentType, (val) => {
            setOpponentType(val as MarkingType);
          })}
        </div>
      </div>

      {/* Quality */}
      <div>
        <label className="block text-sm font-medium mb-1">Quality</label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value as MarkingQuality)}
          className="w-full border px-2 py-1 rounded text-sm"
        >
          {qualities.map((type) => (
            <option key={type} value={type}>
              {formatString(type)}
            </option>
          ))}
        </select>
      </div>

      {/* Remain Time */}
      <div>
        <label className="block text-sm font-medium mb-1">Remain Time</label>
        <input
          type="number"
          min={0}
          value={remainTime}
          onChange={(e) => setRemainTime(Number(e.target.value))}
          className="w-full border px-2 py-1 rounded text-sm"
          placeholder="Enter remaining time in seconds"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formatTime(remainTime)}
        </p>
      </div>


      {/* Note Field */}
      <div className="space-y-1 relative">
        <label className="block text-sm font-medium">Note</label>

        <div className="relative">
          <textarea
            ref={inputRef}
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
            <ul
              className="absolute z-10 w-full border border-gray-300 rounded mt-1 max-h-32 overflow-auto text-xs bg-white shadow-lg">
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