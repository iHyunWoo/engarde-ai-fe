import {Button} from '@/widgets/common/Button';
import {MarkingQuality, MarkingResult} from '@/entities/marking';
import {useRef, useState, Dispatch, SetStateAction} from "react";
import {formatTime} from "@/shared/lib/format-time";
import {useNoteSuggestions} from "@/app/features/marking/hooks/use-note-suggestion";
import {Technique} from "@/entities/technique/technique";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/widgets/common/Select";
import {formatTechniqueName} from "@/app/features/technique/lib/format-technique-name";
import {TechniqueSelect} from "@/widgets/technique/TechniqueSelect";
import { Input } from '../common/Input';

const markingResults: MarkingResult[] = ['win', 'lose', 'attempt', 'setEnded'];
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
                              remainMinutes,
                              setRemainMinutes,
                              remainSeconds,
                              setRemainSeconds,
                              note,
                              setNote,
                              onAdd,
                              techniques,
                            }: {
  resultType: MarkingResult;
  setResultType: Dispatch<SetStateAction<MarkingResult>>;
  myTechnique: Technique | null
  setMyTechnique: Dispatch<SetStateAction<Technique | null>>
  opponentTechnique: Technique | null
  setOpponentTechnique: Dispatch<SetStateAction<Technique | null>>
  quality: MarkingQuality
  setQuality: Dispatch<SetStateAction<MarkingQuality>>;
  remainMinutes: number;
  setRemainMinutes: Dispatch<SetStateAction<number>>;
  remainSeconds: number;
  setRemainSeconds: Dispatch<SetStateAction<number>>;
  note: string;
  setNote: Dispatch<SetStateAction<string>>;
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
        <Select value={resultType} onValueChange={(value) => setResultType(value as MarkingResult)}>
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
        <Select value={quality} onValueChange={(value) => setQuality(value as MarkingQuality)}>
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
        <div className="flex gap-8">
          <div className="flex-1 flex flex-row gap-2">
            <Input
              type="number"
              min={0}
              max={59}
              value={remainMinutes}
              onChange={(e) => setRemainMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
              className="w-full border px-2 py-1 rounded text-sm"
            />
            <p className="text-md text-gray-500 mt-1 text-center">m</p>
          </div>
          <div className="flex-1 flex flex-row gap-2">
            <Input
              type="number"
              min={0}
              max={59}
              value={remainSeconds}
              onChange={(e) => setRemainSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
              className="w-full border px-2 py-1 rounded text-sm"
            />
            <p className="text-md text-gray-500 mt-1 text-center">s</p>
          </div>
        </div>
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