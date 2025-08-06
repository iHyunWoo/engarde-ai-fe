"use client"

export async function mergeVideos(files: File[]): Promise<File> {
  // 런타입 중 실행하기 위해 지연 로딩
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  const { fetchFile } = await import('@ffmpeg/util');

  const ffmpeg = new FFmpeg();

  if (!ffmpeg.loaded) {
    await ffmpeg.load();
  }

  // 1. 비디오 파일들을 ffmpeg FS에 씀
  for (let i = 0; i < files.length; i++) {
    await ffmpeg.writeFile(`input${i}.mp4`, await fetchFile(files[i]));
  }

  // 2. input.txt 생성 (병합 대상 목록)
  const inputList = files.map((_, idx) => `file input${idx}.mp4`).join('\n');
  await ffmpeg.writeFile('input.txt', new TextEncoder().encode(inputList));

  // 3. ffmpeg로 병합 실행
  await ffmpeg.exec([
    '-f', 'concat',
    '-safe', '0',
    '-i', 'input.txt',
    '-movflags', 'frag_keyframe+empty_moov',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-crf', '28',
    '-c:a', 'aac',
    'output.mp4',
  ]);

  // 4. 결과 파일을 읽어서 Blob으로 변환
  const output = await ffmpeg.readFile('output.mp4');
  if (typeof output === 'string') {
    throw new Error('Expected Uint8Array but got string');
  }

  const arrayBuffer = output.slice().buffer;
  const blob = new Blob([arrayBuffer], { type: 'match/mp4' });

  // 5. Blob → File 변환 (File 생성자 사용)
  const file = new File([blob], 'merged-match.mp4', { type: 'match/mp4' });
  return file;
}