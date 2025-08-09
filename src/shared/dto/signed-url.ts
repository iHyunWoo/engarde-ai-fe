export interface PostSignedUrlRequest {
  fileName: string;
  contentType: string;
}

export interface PostSignedUrlResponse {
  uploadUrl: string;
  objectName: string;
}

export interface GetSignedUrlResponse {
  url: string;
  expiredAt: number;
}