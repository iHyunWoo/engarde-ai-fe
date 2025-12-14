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
                              pisteLocation,
                              setPisteLocation,
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
  pisteLocation: number;
  setPisteLocation: Dispatch<SetStateAction<number>>;
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
            disabled={resultType === 'setEnded'}
          />
        </div>
        <div className="w-1/2 space-y-2">
          <label className="block text-sm font-medium">Opponent</label>
          <TechniqueSelect
            techniques={techniques}
            selected={opponentTechnique}
            onChange={setOpponentTechnique}
            disabled={resultType === 'setEnded'}
          />
        </div>
      </div>

      {/* Quality */}
      <div>
        <label className="block text-sm font-medium mb-1">Quality</label>
        <Select value={quality} onValueChange={(value) => setQuality(value as MarkingQuality)} disabled={resultType === 'setEnded'}>
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
            className={`w-full border px-2 py-1 rounded text-sm ${resultType === 'setEnded' ? 'cursor-not-allowed opacity-50' : ''}`}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 100)}
            disabled={resultType === 'setEnded'}
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