import {TechniqueType} from "@/entities/technique/technique-type";

export interface Technique {
  id: number;
  name: string;
  type: TechniqueType
  children?: Technique[];
}