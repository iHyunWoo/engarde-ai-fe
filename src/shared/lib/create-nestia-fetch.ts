import {fetcher} from "@/shared/lib/fetcher";

export const createNestiaFetcher: typeof fetch = async (input, init) => {
  const res = await fetcher<unknown>(input, init);

  if (!res) {
    return new Response(null, { status: 500 });
  }

  return new Response(JSON.stringify(res), {
    headers: { "Content-Type": "application/json" },
  });
};