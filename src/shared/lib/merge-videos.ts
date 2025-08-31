"use client"

import {FFmpeg} from "@ffmpeg/ffmpeg";

interface VideoMetadata {
  videoCodec: string;
  audioCodec: string;
  width: number;
  height: number;
  frameRate: number;
  pixelFormat: string;
  bitRate: number;
}

export async function mergeVideos(files: File[]): Promise<File> {
  const {FFmpeg} = await import('@ffmpeg/ffmpeg');
  const {fetchFile} = await import('@ffmpeg/util');

  const ffmpeg = new FFmpeg();

  if (!ffmpeg.loaded) {
    await ffmpeg.load();
  }

  // 1. 비디오 파일들을 ffmpeg FS에 씀
  for (let i = 0; i < files.length; i++) {
    await ffmpeg.writeFile(`input${i}.mp4`, await fetchFile(files[i]));
  }

  // 2. 메타데이터 추출
  const metadataArray: VideoMetadata[] = [];
  for (let i = 0; i < files.length; i++) {
    const metadata = await extractVideoMetadata(ffmpeg, `input${i}.mp4`);
    if (!metadata) throw new Error(`Metadata extraction failed for input${i}.mp4`);
    metadataArray.push(metadata);
  }


  // 3. 호환성 검사
  const isCompatible = areAllFilesCompatible(metadataArray);

  if (isCompatible) {
    // fast encode
    const inputList = files.map((_, idx) => `file input${idx}.mp4`).join('\n');
    await ffmpeg.writeFile('input.txt', new TextEncoder().encode(inputList));

    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'input.txt',
      '-c', 'copy',
      '-movflags', 'frag_keyframe+empty_moov+faststart',
      'output.mp4',
    ]);
  } else {
    // re-encode
    const normalizedFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const input = `input${i}.mp4`;
      const output = `norm${i}.mp4`;
      normalizedFiles.push(output);

      await ffmpeg.exec([
        '-i', input,
        '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1',
        '-r', '30',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-ar', '48000',
        '-ac', '2',
        output,
      ]);
    }

    const inputList = normalizedFiles.map((f) => `file ${f}`).join('\n');
    await ffmpeg.writeFile('input.txt', new TextEncoder().encode(inputList));

    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'input.txt',
      '-c', 'copy',
      '-movflags', '+faststart',
      'output.mp4',
    ]);
  }

  // 4. 결과 파일을 읽어서 Blob으로 변환
  const output = await ffmpeg.readFile('output.mp4');
  if (typeof output === 'string') {
    throw new Error('Expected Uint8Array but got string');
  }

  const arrayBuffer = output.slice().buffer;
  const blob = new Blob([arrayBuffer], {type: 'video/mp4'});

  // 5. Blob → File 변환 (File 생성자 사용)
  return new File([blob], 'merged-match.mp4', {type: 'video/mp4'});
}

// 비디오 메타데이터 추출하는 함수
async function extractVideoMetadata(ffmpeg: FFmpeg, filename: string): Promise<VideoMetadata | null> {
  let logOutput = '';

  // 로그 수집 핸들러
  const logHandler = ({message}: { message: string }) => {
    logOutput += message + '\n';
  };

  ffmpeg.on?.("log", logHandler);

  // 파일 정보 추출을 위한 명령
  try {
    await ffmpeg.exec(['-i', filename, '-t', '0.001', '-f', 'null', '-']);
  } catch (e) {
    console.error(e)
  }

  ffmpeg.off?.("log", logHandler);
  return parseVideoMetadata(logOutput);
}

// FFmpeg 로그에서 비디오 메타데이터 파싱

function parseVideoMetadata(log: string): VideoMetadata {
  const metadata: VideoMetadata = {
    videoCodec: "",
    audioCodec: "",
    width: 0,
    height: 0,
    frameRate: 0,
    pixelFormat: "",
    bitRate: 0,
  };

  const lines = log.split('\n');

  for (const line of lines) {
    // Video stream 정보
    if (line.includes('Video:') && line.includes('Stream')) {
      // 코덱 추출: "Video: h264 (avc1)" → "h264"
      const codecMatch = line.match(/Video:\s*([^\s\(,]+)/);
      if (codecMatch) metadata.videoCodec = codecMatch[1];

      // 해상도 추출: "1920x1080" → width: 1920, height: 1080
      const resolutionMatch = line.match(/(\d+)x(\d+)/);
      if (resolutionMatch) {
        metadata.width = parseInt(resolutionMatch[1]);
        metadata.height = parseInt(resolutionMatch[2]);
      }

      // 프레임레이트 추출: "30 fps" → 30
      const fpsMatch = line.match(/(\d+(?:\.\d+)?)\s*fps/);
      if (fpsMatch) metadata.frameRate = parseFloat(fpsMatch[1]);

      // 픽셀 포맷 추출: "yuv420p"
      const pixelMatch = line.match(/(yuv\d+p\w*|rgb\w*)/);
      if (pixelMatch) metadata.pixelFormat = pixelMatch[1];
    }

    // Audio stream 정보
    if (line.includes('Audio:') && line.includes('Stream')) {
      const audioCodecMatch = line.match(/Audio:\s*([^\s\(,]+)/);
      if (audioCodecMatch) metadata.audioCodec = audioCodecMatch[1];
    }
  }

  return metadata;
}

// 메타데이터 호환성 확인
function areMetadataCompatible(meta1: VideoMetadata, meta2: VideoMetadata): boolean {
  if (!meta1 || !meta2) return false;

  return (
    meta1.videoCodec === meta2.videoCodec &&
    meta1.audioCodec === meta2.audioCodec &&
    meta1.width === meta2.width &&
    meta1.height === meta2.height &&
    Math.abs(meta1.frameRate - meta2.frameRate) < 0.1 &&
    meta1.pixelFormat === meta2.pixelFormat
  );
}

// 모든 파일들이 서로 호환되는지 확인
function areAllFilesCompatible(metadataArray: VideoMetadata[]): boolean {
  if (metadataArray.length < 2) return true;

  const baseMetadata = metadataArray[0];
  if (!baseMetadata) return false;

  for (let i = 1; i < metadataArray.length; i++) {
    if (!areMetadataCompatible(baseMetadata, metadataArray[i])) {
      return false;
    }
  }

  return true;
}