'use client';

import {useEffect, useRef, useState} from 'react';
import {formatTime} from "@/shared/lib/format-time";
import {Marking} from "@/entities/marking";

interface SeekbarProps {
  markings?: Marking[];
  videoRef: HTMLVideoElement | null;
}

export default function Seekbar({ markings = [], videoRef }: SeekbarProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!videoRef) return;

    // 영상 전체 시간
    const updateDuration = () => {
      const duration = Number.isFinite(videoRef.duration) ? videoRef.duration : 0;
      setDuration(duration > 0 ? duration : 0);
    };

    // 영상 시간 업데이트
    const updateTime = () => {
      // requestAnimationFrame으로 과도한 setState 방지
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setCurrentTime(videoRef.currentTime || 0));
    };

    updateDuration();
    setCurrentTime(videoRef.currentTime || 0);

    videoRef.addEventListener("loadedmetadata", updateDuration);
    videoRef.addEventListener("durationchange", updateDuration);
    videoRef.addEventListener("timeupdate", updateTime);
    videoRef.addEventListener("seeking", updateTime);
    videoRef.addEventListener("seeked", updateTime);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      videoRef.removeEventListener("loadedmetadata", updateDuration);
      videoRef.removeEventListener("durationchange", updateDuration);
      videoRef.removeEventListener("timeupdate", updateTime);
      videoRef.removeEventListener("seeking", updateTime);
      videoRef.removeEventListener("seeked", updateTime);
    };
  }, [videoRef]);

  // 슬라이더 드래그
  const handleSeek = (val: number) => {
    const v = videoRef;
    if (!v || !Number.isFinite(duration) || duration <= 0) return;
    const clamped = Math.max(0, Math.min(duration, val));
    v.currentTime = clamped;
    setCurrentTime(clamped); // 즉시 UI 반영
  };

  // 핀 위치 계산
  const getPinPosition = (t: number) => {
    if (!duration || duration <= 0) return 0;
    return Math.max(0, Math.min(100, (t / duration) * 100));
  };

  if (!videoRef) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-600 w-[60px] text-right">
          {formatTime(currentTime)}
        </span>

        <div className="relative flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => handleSeek(Number(e.target.value))}
            onInput={(e) => handleSeek(Number((e.target as HTMLInputElement).value))}
            className="w-full"
          />

          {/* 핀 오버레이 */}
          <div className="pointer-events-none absolute inset-0">
            {duration > 0 &&
              markings.map((m, idx) => {
                const left = `${getPinPosition(m.timestamp)}%`;
                const isWin = m.result === "win";
                const isLose = m.result === "lose";
                const isAttempt = m.result === "attempt";

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
                  return null;
                }

                return (
                  <div
                    key={idx}
                    className="absolute bottom-[-14px]"
                    style={{ left, transform: "translateX(-50%)" }}
                  >
                    <div className={`h-2 w-[2px] ${lineColor} mx-auto`} />
                    <button
                      type="button"
                      className={`pointer-events-auto w-2.5 h-2.5 rounded-full border ${colorClasses} shadow`}
                      onClick={() => handleSeek(m.timestamp)}
                      title={`${m.result.toUpperCase()} • ${formatTime(m.timestamp)}`}
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