import {Button} from '@/widgets/common/Button';
import {MarkingQuality, MarkingResult} from '@/entities/marking';
import {useRef, useState} from "react";
import {formatTime} from "@/shared/lib/format-time";
import {useNoteSuggestions} from "@/app/features/marking/hooks/use-note-suggestion";
import {Technique} from "@/entities/technique/technique";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/widgets/common/Select";
import {formatTechniqueName} from "@/app/features/technique/lib/format-technique-name";
import {TechniqueSelect} from "@/widgets/technique/TechniqueSelect";

const markingResults: MarkingResult[] = ['win', 'lose', 'attempt'];
const qualities: MarkingQuality[] = ['good', 'bad', 'lucky']

export function MarkingForm({
                              resultType,
                              setResultType,
                              myTechnique,
                              setMyTechnique,
                              opponentTechnique,
                              setOpponentTechnique,
                              quality,
                              setQuality,
                              remainTime,
                              setRemainTime,
                              note,
                              setNote,
                              onAdd,
                              techniques,
                            }: {
  resultType: MarkingResult;
  setResultType: (v: MarkingResult) => void;
  myTechnique: Technique | null
  setMyTechnique: (v: Technique | null) => void
  opponentTechnique: Technique | null
  setOpponentTechnique: (v: Technique | null) => void
  quality: MarkingQuality
  setQuality: (v: MarkingQuality) => void;
  remainTime: number;
  setRemainTime: (v: number) => void;
  note: string;
  setNote: (v: string) => void;
  onAdd: () => void;
  techniques: Technique[]
}) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const {suggestions} = useNoteSuggestions(note, focused)

  const handleSelectSuggestion = (text: string) => {
    setNote(text)
    setFocused(false)
    inputRef.current?.blur()
  }

  return (
    <div className="w-full max-w-96 space-y-4">
      {/* Result Type */}
      <div>
        <label className="block text-sm font-medium mb-1">Result Type</label>
        <Select value={resultType} onValueChange={setResultType}>
          <SelectTrigger className="w-1/2">
            <SelectValue placeholder="Select result"/>
          </SelectTrigger>
          <SelectContent>
            {markingResults.map((type) => (
              <SelectItem key={type} value={type}>
                {formatTechniqueName(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Me & Opponent Technique */}
      <div className="flex justify-between gap-4">
        <div className="w-1/2 space-y-2">
          <label className="block text-sm font-medium">Me</label>
          <TechniqueSelect
            techniques={techniques}
            selected={myTechnique}
            onChange={setMyTechnique}
          />
        </div>
        <div className="w-1/2 space-y-2">
          <label className="block text-sm font-medium">Opponent</label>
          <TechniqueSelect
            techniques={techniques}
            selected={opponentTechnique}
            onChange={setOpponentTechnique}
          />
        </div>
      </div>

      {/* Quality */}
      <div>
        <label className="block text-sm font-medium mb-1">Quality</label>
        <Select value={quality} onValueChange={setQuality}>
          <SelectTrigger className="w-1/2">
            <SelectValue placeholder="Select quality"/>
          </SelectTrigger>
          <SelectContent>
            {qualities.map((type) => (
              <SelectItem key={type} value={type}>
                {formatTechniqueName(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      {/* Note */}
      <div className="space-y-1 relative">
        <label className="block text-sm font-medium">Note</label>
        <div className="relative">
          <textarea
            ref={inputRef}
            value={note}
            onChange={(e) => {
              if (e.target.value.length <= 100) setNote(e.target.value)
            }}
            placeholder="Enter note (max 100 characters)"
            className="w-full border px-2 py-1 rounded text-sm"
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 100)}
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

      {/* Submit */}
      <Button onClick={onAdd}>Add Marking</Button>
    </div>
  )
}