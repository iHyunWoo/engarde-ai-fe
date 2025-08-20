import {TechniqueType} from "@/entities/technique-type";

export interface Technique {
  id: number;
  name: string;
  type: TechniqueType
  children?: Technique[];
}