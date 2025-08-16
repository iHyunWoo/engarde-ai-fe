import {postVideoWriteUrl} from "@/shared/api/post-video-write-url";
import {PostSignedUrlRequestDto} from "@ihyunwoo/engarde-ai-api-sdk/structures";

export async function uploadToGCS(file: File): Promise<string | null> {
  // signed url 발급
  const body: PostSignedUrlRequestDto = {
    fileName: file.name,
    contentType: file.type
  }
  const response = await postVideoWriteUrl(body)
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