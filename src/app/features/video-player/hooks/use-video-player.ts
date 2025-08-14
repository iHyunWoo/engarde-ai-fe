import {RefObject, useEffect, useRef, useState} from "react";

export function useVideoPlayer(
  videoRef: RefObject<HTMLVideoElement | null>
) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [rate, setRate] = useState(1)
  const [isFS, setIsFS] = useState(false)

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onRate = () => setRate(v.playbackRate);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ratechange", onRate);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ratechange", onRate);
    };
  }, [videoRef]);

  // 전체화면 listener
  useEffect(() => {
    const onFS = () => {
      const d: any = document
      const fsEl = d.fullscreenElement || d.webkitFullscreenElement
      setIsFS(!!fsEl)
    }
    document.addEventListener('fullscreenchange', onFS)
    document.addEventListener('webkitfullscreenchange', onFS as any)
    return () => {
      document.removeEventListener('fullscreenchange', onFS)
      document.removeEventListener('webkitfullscreenchange', onFS as any)
    }
  }, [])

  // actions
  const handlePlayPause = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      try {
        await v.play();
      } catch {}
    } else {
      v.pause();
    }
  };

  const skipTime = (sec: number) => {
    const v = videoRef.current;
    if (!v) return;
    const next = Math.max(
      0,
      Math.min(v.duration || Number.MAX_SAFE_INTEGER, v.currentTime + sec)
    );
    v.currentTime = next;
  };

  const onVolume = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    const clamped = Math.max(0, Math.min(1, val));
    v.volume = clamped;
    setVolume(clamped);
    if (v.muted && clamped > 0) {
      v.muted = false;
      setMuted(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const setPlaybackRate = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    const clamped = Math.max(0.1, Math.min(3, +val.toFixed(2)));
    v.playbackRate = clamped;
    setRate(clamped);
  };

  const toggleFS = () => {
    const el = containerRef.current;
    if (!el) return;
    const d: any = document;
    if (!d.fullscreenElement && !d.webkitFullscreenElement) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
    } else {
      if (d.exitFullscreen) d.exitFullscreen();
      else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const tag = (e.target as HTMLElement).tagName;
    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      (e.target as HTMLElement).isContentEditable
    )
      return;
    switch (e.key) {
      case " ":
        e.preventDefault();
        handlePlayPause();
        break;
      case "ArrowLeft":
        skipTime(-5);
        break;
      case "ArrowRight":
        skipTime(5);
        break;
      case "ArrowUp":
        onVolume(Math.min(1, volume + 0.05));
        break;
      case "ArrowDown":
        onVolume(Math.max(0, volume - 0.05));
        break;
      case "f":
      case "F":
        toggleFS();
        break;
      default:
        break;
    }
  };

  return {
    containerRef,
    state: { isPlaying, volume, muted, rate, isFS },
    actions: {
      handlePlayPause,
      skipTime,
      onVolume,
      toggleMute,
      setPlaybackRate,
      toggleFS,
      onKeyDown,
    },
  };
}