export type TopNote = {
  note: string;
  count: number;
};

export type AttemptDto = {
  attackAttemptCount: number;
  parryAttemptCount: number;
  counterAttackAttemptCount: number;
  attackWinCount: number;
  parryWinCount: number;
  counterAttackWinCount: number;
  topNotesByType?: {
    attack: TopNote[];
    parry: TopNote[];
    counterAttack: TopNote[];
  };
};

export type LoseDto = {
  lungeLoseCount: number;
  advancedLungeLoseCount: number;
  flecheLoseCount: number;
  pushLoseCount: number;
  parryLoseCount: number;
  counterAttackLoseCount: number;
  topNotesByType?: {
    lunge: TopNote[];
    advancedLunge: TopNote[];
    fleche: TopNote[];
    push: TopNote[];
    parry: TopNote[];
    counter: TopNote[];
  }
};

export type GetStatisticResponse = {
  matchCount: number;
  attempt?: AttemptDto;
  lose?: LoseDto;
};