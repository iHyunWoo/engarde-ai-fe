export async function extractThumbnail(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.currentTime = 1;

    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const thumbnailFile = new File(
            [blob],
            `thumbnail_${Date.now()}.jpg`,
            { type: 'image/jpeg' }
          );
          resolve(thumbnailFile);
        } else {
          reject(new Error('Thumbnail generation failed'));
        }
      }, 'image/jpeg');
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video for thumbnail'));
    });
  });
}