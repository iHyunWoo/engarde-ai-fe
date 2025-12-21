import {useMemo} from "react";
import {Technique} from "@/entities/technique/technique";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/widgets/common/Select";
import {formatTechniqueName} from "@/app/features/technique/lib/format-technique-name";

interface TechniqueSelectProps {
  techniques: Technique[];
  selected: Technique | null;
  onChange: (technique: Technique | null) => void;
  disabled: boolean;
}

interface FlatTechnique {
  technique: Technique;
  isChild: boolean;
}

export function TechniqueSelect({
                                  techniques,
                                  selected,
                                  onChange,
                                  disabled,
                                }: TechniqueSelectProps) {
  // techniques를 flat하게 만들기 (부모 + 자식들)
  const flatTechniques = useMemo<FlatTechnique[]>(() => {
    const result: FlatTechnique[] = [];
    
    techniques.forEach((technique) => {
      // 부모 추가
      result.push({ technique, isChild: false });
      
      // 자식들 추가 (children이 있으면)
      if (technique.children && technique.children.length > 0) {
        technique.children.forEach((child) => {
          result.push({ technique: child, isChild: true });
        });
      }
    });
    
    return result;
  }, [techniques]);

  // selected technique를 flatTechniques에서 찾기
  const findTechniqueById = (id: number): Technique | null => {
    for (const flatTech of flatTechniques) {
      if (flatTech.technique.id === id) {
        return flatTech.technique;
      }
    }
    return null;
  };

  return (
    <Select
      value={selected ? selected.id.toString() : "none"}
      onValueChange={(v) => {
        if (v === "none") return onChange(null);
        const selectedTechnique = findTechniqueById(Number(v));
        if (selectedTechnique) onChange(selectedTechnique);
      }}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <span className="truncate">
          {selected
            ? `${formatTechniqueName(selected.name)}`
            : "None"}
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">None</SelectItem>

        {flatTechniques.map(({ technique, isChild }) => (
          <SelectItem 
            key={technique.id} 
            value={technique.id.toString()}
            className={isChild ? "pl-6" : ""}
          >
            {isChild ? "  └ " : ""}{formatTechniqueName(technique.name)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}