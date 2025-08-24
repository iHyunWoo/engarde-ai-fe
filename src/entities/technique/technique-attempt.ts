export interface TechniqueAttempt {
  id: number;
  technique: {
    id: number;
    name: string;
  }
  attemptCount: number;
}