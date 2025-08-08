'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import {Button} from "@/widgets/common/Button";
import {formatTime} from "@/shared/lib/format-time";
import {Marking} from "@/entities/marking";

interface VideoPlayerProps {
  videoUrl: string;
  markings?: Marking[];
  getRef?: (ref: HTMLVideoElement) => void;
}
export default function VideoPlayer({ videoUrl, markings = [], getRef }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef.current && getRef) getRef(videoRef.current);
  }, [videoRef, getRef]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds)
      );
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime || 0);
    const updateDuration = () => setDuration(video.duration || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // 핀 위치 계산 (0~100%)
  const posPct = (t: number) => {
    if (!duration || duration <= 0) return 0;
    const pct = (t / duration) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  // 핀 클릭 → 시크
  const seekTo = (t: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration || 0, t));
    setCurrentTime(videoRef.current.currentTime);
  };

  return (
    <div className="space-y-4">
      <video
        ref={videoRef}
        className="w-full h-[400px] rounded bg-black"
        src={videoUrl}
      />

      {/* 재생 컨트롤 */}
      <div className="flex gap-2 items-center">
        <Button onClick={() => skipTime(-5)} variant="outline" size="sm">
          <SkipBack className="w-4 h-4 mr-1" /> 5s
        </Button>

        <Button onClick={handlePlayPause} size="sm">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>

        <Button onClick={() => skipTime(5)} variant="outline" size="sm">
          5s <SkipForward className="w-4 h-4 ml-1" />
        </Button>

        <select
          className="ml-4 border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={playbackRate}
          onChange={(e) => changePlaybackRate(Number(e.target.value))}
        >
          {[0.5, 1, 1.5, 2, 2.5, 3].map((rate) => (
            <option key={rate} value={rate}>
              {rate}x
            </option>
          ))}
        </select>
      </div>

      {/* 시크바 + 핀 */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-600 w-[60px] text-right">
          {formatTime(currentTime)}
        </span>

        <div className="relative flex-1">
          {/* range 자체 */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />

          {/* 핀 오버레이: 클릭 가능하게 pointer-events 설정 */}
          <div className="pointer-events-none absolute inset-0">
            {duration > 0 &&
              markings.map((m, idx) => {
                const left = `${posPct(m.time)}%`;
                const isWin = m.result === "win";
                const isLose = m.result === "lose";
                const isAttempt = m.result === "attempt";

                // 핀 스타일 (색상 분기)
                let colorClasses = "";
                let lineColor = "";
                if (isWin) {
                  colorClasses = "bg-emerald-500 border-emerald-600";
                  lineColor = "bg-emerald-500";
                } else if (isLose) {
                  colorClasses = "bg-rose-500 border-rose-600";
                  lineColor = "bg-rose-500";
                } else if (isAttempt) {
                  colorClasses = "bg-sky-500 border-sky-600";
                  lineColor = "bg-sky-500";
                } else {
                  return null; // 다른 값은 표시 안 함
                }

                return (
                  <div
                    key={idx}
                    className={`absolute bottom-[-14px]`}
                    style={{ left, transform: "translateX(-50%)" }}
                  >
                    {/* 세로 라인 */}
                    <div className={`h-2 w-[2px] ${lineColor} mx-auto`} />
                    {/* 핀 */}
                    <button
                      type="button"
                      className={`pointer-events-auto w-2.5 h-2.5 rounded-full border ${colorClasses} shadow`}
                      onClick={() => seekTo(m.time)}
                      title={`${m.result.toUpperCase()} • ${formatTime(m.time)}`}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        <span className="text-xs text-gray-600 w-[60px]">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}