// 마킹 결과 타입
export type MarkingResult = 'win' | 'lose' | 'attempt';

// 공격 유형 타입 (팡트, 마르세 팡트, 플래시, 밀기)
export type AttackType = 'none' | 'lunge' | 'advanced lunge' | 'fleche' | 'push';

// 수비 유형 타입 (빠라드, 꽁트라 어택)
export type DefenseType = 'none' | 'parry' | 'counter attack';

export type MarkingType = AttackType | DefenseType;

export type MarkingQuality = 'good' | 'bad' | 'lucky'

// 마킹 인터페이스
export interface Marking {
  id: number;
  timestamp: number;
  result: MarkingResult;
  myType: MarkingType;
  opponentType: MarkingType;
  quality: MarkingQuality;
  note: string;
  remainTime: number;
}