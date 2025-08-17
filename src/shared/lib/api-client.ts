import type { IConnection } from "@nestia/fetcher";
import {createNestiaFetcher} from "@/shared/lib/create-nestia-fetch";

export const conn: IConnection = {
  host: process.env.NEXT_PUBLIC_API_URL!,
  fetch: createNestiaFetcher,
  options: {
    credentials: 'include'
  },
  headers: {
    "Content-Type": "application/json",
  },
};
