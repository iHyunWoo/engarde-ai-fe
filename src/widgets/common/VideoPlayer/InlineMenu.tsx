import React from "react";
import {Button} from "@/widgets/common/Button";
import {ChevronsRight, MoreHorizontal, Volume2, VolumeX} from "lucide-react";

export function InlineMenu({
                      muted,
                      volume,
                      rate,
                      onToggleMute,
                      onVolume,
                      onRate,
                    }: {
  muted: boolean
  volume: number
  rate: number
  onToggleMute: () => void
  onVolume: (val: number) => void
  onRate: (val: number) => void
}) {
  const [open, setOpen] = React.useState(false)
  const sliderClass = [
    "w-28 h-3 cursor-pointer align-middle",
    "[appearance:none] touch-none",
    // webkit track
    "[&::-webkit-slider-runnable-track]:rounded-full",
    "[&::-webkit-slider-runnable-track]:bg-white/25",
    // webkit thumb
    "[&::-webkit-slider-thumb]:[-webkit-appearance:none]",
    "[&::-webkit-slider-thumb]:w-3",
    "[&::-webkit-slider-thumb]:h-3",
    "[&::-webkit-slider-thumb]:rounded-full",
    "[&::-webkit-slider-thumb]:bg-white",
    "[&::-webkit-slider-thumb]:border",
    "[&::-webkit-slider-thumb]:border-black/50",
    "[&::-webkit-slider-thumb]:shadow",
    // firefox track
    "[&::-moz-range-track]:rounded-full",
    "[&::-moz-range-track]:bg-white/25",
    // firefox thumb
    "[&::-moz-range-thumb]:w-3",
    "[&::-moz-range-thumb]:h-3",
    "[&::-moz-range-thumb]:rounded-full",
    "[&::-moz-range-thumb]:bg-white",
    "[&::-moz-range-thumb]:border",
    "[&::-moz-range-thumb]:border-black/50",
    "[&::-moz-range-thumb]:shadow",
  ].join(' ')

  return (
    <div className="relative group/menu" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Button size="sm" onClick={() => setOpen(v => !v)} aria-label="Menu">
        <MoreHorizontal className="w-4 h-4"/>
      </Button>

      <div
        className={`absolute right-0 bottom-[calc(100%+6px)] z-10 pointer-events-auto
              bg-black/80 backdrop-blur text-white rounded-xl shadow-lg p-3 min-w-[260px]
              ${open ? 'opacity-100' : 'opacity-0'} transition-opacity
              group-hover/menu:opacity-100`}
      >
        {/* 볼륨 */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onToggleMute}
            size="sm"
            variant="outline"
            className="text-black"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted || volume === 0
              ? <VolumeX className="w-4 h-4"/>
              : <Volume2 className="w-4 h-4"/>}
          </Button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolume(+e.target.value)}
            onInput={(e) => onVolume(+e.currentTarget.value)}
            className={sliderClass}
            aria-label="Volume"
          />

          <div className="w-10 text-right text-xs tabular-nums">
            {Math.round(volume * 100)}%
          </div>
        </div>

        {/* 배속 */}
        <div className="mt-3 flex items-center gap-3">
          <Button
            onClick={() => onRate(1)}
            size="sm"
            variant="outline"
            className="text-black"
            aria-label="Reset playback rate"
          >
            <ChevronsRight className="w-4 h-4"/>
          </Button>

          <input
            type="range"
            min={0.1}
            max={3}
            step={0.1}
            value={rate}
            onChange={(e) => onRate(+e.target.value)}
            onInput={(e) => onRate(+e.currentTarget.value)}
            className={sliderClass}
            aria-label="Playback rate"
          />

          <span className="w-10 text-right text-xs tabular-nums">
    {rate.toFixed(1)}×
          </span>
        </div>
      </div>
    </div>
  )
}