import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {storage} from "@/shared/lib/firebase";

export async function uploadVideo(file: File, userId: string): Promise<string> {
  const storageRef = ref(storage, `videos/${userId}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}