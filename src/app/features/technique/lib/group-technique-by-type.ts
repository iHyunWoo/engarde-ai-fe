import {TechniqueByGroup} from "@/entities/technique/technique-by-group";
import {Technique} from "@/entities/technique/technique";

export function groupTechniquesByType(techniques: Technique[]): TechniqueByGroup {
  return techniques.reduce<TechniqueByGroup>(
    (acc, technique) => {
      acc[technique.type].push(technique);
      return acc;
    },
    {
      attack: [],
      defense: [],
      etc: [],
    }
  );
}