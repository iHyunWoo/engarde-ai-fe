import {fetcher} from "@/shared/lib/fetcher";
import {PostSignedUrlRequest, PostSignedUrlResponse} from "@/shared/dto/signed-url";

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