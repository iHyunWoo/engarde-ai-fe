'use client'

import React, {useEffect, useRef} from 'react'
import {Button} from "@/widgets/common/Button";
import {
  SkipBack,
  SkipForward,
  Play as PlayIcon,
  Pause as PauseIcon,
  Maximize,
} from 'lucide-react'
import {InlineMenu} from "@/widgets/common/VideoPlayer/InlineMenu";
import {useVideoPlayer} from "@/app/features/video-player/hooks/use-video-player";

interface VideoPlayerProps {
  src: string;
  className?: string;
  getRef?: (el: HTMLVideoElement) => void;
}

export function VideoPlayer({
                              src,
                              className = '',
                              getRef,
                            }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && getRef) {
      getRef(videoRef.current);
    }
  }, [getRef]);

  const {containerRef, state, actions} = useVideoPlayer(videoRef)
  const {isPlaying, volume, muted, rate} = state
  const {handlePlayPause, skipTime, onVolume, toggleMute, setPlaybackRate, toggleFS, onKeyDown} = actions

  return (
    <div
      ref={containerRef}
      className={`group relative w-full overflow-hidden bg-black shadow ${className}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <video
        ref={videoRef}
        className="w-full h-auto aspect-video bg-black"
        src={src}
        playsInline
        onClick={handlePlayPause}
      />

      <div className="absolute inset-0 pointer-events-none flex flex-col justify-end">
        <div className="pointer-events-auto w-full p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <div className="flex items-center gap-2 text-white">
            {/* 앞으로 가기 */}
            <Button onClick={() => skipTime(5)} variant="outline" size="sm" className="text-black"
                    aria-label="Forward 5 seconds">
              5s <SkipForward className="w-4 h-4 ml-1"/>
            </Button>

            {/* 재생/일시정지 */}
            <Button onClick={handlePlayPause} size="sm" aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <PauseIcon className="w-4 h-4"/> : <PlayIcon className="w-4 h-4"/>}
            </Button>

            {/* 뒤로 가기 */}
            <Button onClick={() => skipTime(-5)} variant="outline" size="sm" className="text-black"
                    aria-label="Back 5 seconds">
              <SkipBack className="w-4 h-4 mr-1"/> 5s
            </Button>

            <div className="ml-auto flex items-center gap-2">
              {/* 전체 화면 */}
              <Button onClick={toggleFS} variant="outline" size="sm" aria-label="Fullscreen" className="text-black">
                <Maximize className="w-4 h-4"/>
              </Button>

              {/* 메뉴 */}
              <InlineMenu
                muted={muted}
                volume={volume}
                rate={rate}
                onToggleMute={toggleMute}
                onVolume={onVolume}
                onRate={setPlaybackRate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}