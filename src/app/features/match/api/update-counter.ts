import {fetcher} from "@/shared/lib/fetcher";
import {Match} from "@/entities/match";

export type CounterType = 'attack_attempt_count' | 'parry_attempt_count' | 'counter_attack_attempt_count'

export const updateCounter = async (id: number, type: CounterType, delta: number) => {
  return await fetcher<Match>(`/matches/${id}/counter?type=${type}&delta=${delta}`, {
      method: 'PATCH',
    },
  )
}