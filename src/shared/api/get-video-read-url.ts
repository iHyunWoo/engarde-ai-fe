import {fetcher} from "@/shared/lib/fetcher";
import {GetSignedUrlResponse} from "@/shared/dto/signed-url";

export const getVideoReadUrl = async (objectName: string) => {
  return await fetcher<GetSignedUrlResponse>(`/files/read-signed-url?object=${objectName}`, {
      method: 'GET',
    }
  )
}