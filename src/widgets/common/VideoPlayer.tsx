'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import {Button} from "@/widgets/common/Button";

interface VideoPlayerProps {
  videoUrl: string;
  getRef?: (ref: HTMLVideoElement) => void;
}

export default function VideoPlayer({ videoUrl, getRef }: VideoPlayerProps) {
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
      videoRef.current.currentTime += seconds;
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
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

    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };

    const updateDuration = () => {
      setDuration(video.duration);
    };

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
          <SkipBack className="w-4 h-4 mr-1" />
          5s
        </Button>

        <Button onClick={handlePlayPause} size="sm">
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>

        <Button onClick={() => skipTime(5)} variant="outline" size="sm">
          5s
          <SkipForward className="w-4 h-4 ml-1" />
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

      {/* 시크바 */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-600 w-[60px] text-right">
          {formatTime(currentTime)}
        </span>
        <div className="relative flex-1">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />
        </div>
        <span className="text-xs text-gray-600 w-[60px]">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

function formatTime(time: number): string {
  if (isNaN(time) || !isFinite(time)) return '00:00';

  const min = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const sec = Math.floor(time % 60)
    .toString()
    .padStart(2, '0');
  return `${min}:${sec}`;
}