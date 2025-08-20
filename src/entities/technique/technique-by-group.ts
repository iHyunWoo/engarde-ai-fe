import {Technique} from "@/entities/technique/technique";
import {TechniqueType} from "@/entities/technique/technique-type";

export type TechniqueByGroup = {
  [key in TechniqueType]: Technique[];
};