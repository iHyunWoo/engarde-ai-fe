import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {storage} from "@/shared/lib/firebase";

export async function uploadFileToFBStorage(file: File, type: 'images' | 'videos'): Promise<string | null> {
  // Firebase 유저 정보 가져오기
  // const user = auth.currentUser;
  // if (!user) {
  //   console.warn("Firebase 로그인 실패")
  //   return null;
  // }

  // const userId = user.uid;
  const filename = `${Date.now()}_${file.name}`;
  // const path = `${type}/${userId}/${filename}`;
  const path = `${type}/${filename}`;
  const storageRef = ref(storage, path);

  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}