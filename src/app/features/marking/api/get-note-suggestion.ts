import {fetcher} from "@/shared/lib/fetcher";

export const getNoteSuggestion = async (query: string) => {
  return await fetcher<string[]>('/notes/suggest?query=' + query, {
    method: 'GET',
  })
}