import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {storage} from "@/shared/lib/firebase";
import {fetcher} from "@/shared/lib/fetcher";
import {PostSignedUrlRequest, PostSignedUrlResponse} from "@/shared/dto/signed-url";

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

export async function uploadToGCS(file: File): Promise<string | null> {
  // signed url 발급
  const body: PostSignedUrlRequest = {
    fileName: file.name,
    contentType: file.type
  }
  const response = await fetcher<PostSignedUrlResponse>("/files/write-signed-url", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response?.data) throw new Error("failed to get signed url");
  const { uploadUrl, objectName } = response.data;

  // GCS 업로드
  const gcsResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!gcsResponse.ok) throw new Error("upload failed");

  return objectName;
}