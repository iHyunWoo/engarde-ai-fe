import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

// export type CounterType = 'attack_attempt_count' | 'parry_attempt_count' | 'counter_attack_attempt_count'
//
// export const updateCounter = async (id: number, type: CounterType, delta: number) => {
//   return await apis.functional.matches.counter.updateCounter(conn,
//     id,
//     {
//       type,
//       delta
//     }
//   )
// }