export interface Technique {
  id: number;
  name: string;
  children?: Technique[];
}