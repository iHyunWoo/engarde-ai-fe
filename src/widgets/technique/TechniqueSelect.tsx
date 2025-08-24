import {Technique} from "@/entities/technique/technique";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger} from "@/widgets/common/Select";
import {formatTechniqueName} from "@/app/features/technique/lib/format-technique-name";
import {groupTechniquesByType} from "@/app/features/technique/lib/group-technique-by-type";

interface TechniqueSelectProps {
  techniques: Technique[];
  selected: Technique | null;
  onChange: (technique: Technique | null) => void;
}

export function TechniqueSelect({
                                  techniques,
                                  selected,
                                  onChange,
                                }: TechniqueSelectProps) {
  const techniqueByGroup = groupTechniquesByType(techniques);
  const techniqueMap = new Map<number, Technique>();

  Object.values(techniqueByGroup).flat().forEach((tech) => {
    techniqueMap.set(tech.id, tech);
    tech.children?.forEach((child) => techniqueMap.set(child.id, child));
  });

  return (
    <Select
      value={selected ? selected.id.toString() : "none"}
      onValueChange={(v) => {
        if (v === "none") return onChange(null);  // none 옵션이면 null set
        const selectedTechnique = techniqueMap.get(Number(v));
        if (selectedTechnique) onChange(selectedTechnique);
      }}
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

        {Object.entries(techniqueByGroup).map(([group, techniques]) => (
          <SelectGroup key={group}>
            <div className="px-2 py-1 text-sm text-muted-foreground">{group}</div>
            {techniques.map((technique) => (
              <div key={technique.id}>
                <SelectItem value={technique.id.toString()}>
                  {formatTechniqueName(technique.name)}
                </SelectItem>
                {technique.children?.map((child) => (
                  <SelectItem key={child.id} value={child.id.toString()}>
                    └ {formatTechniqueName(child.name)}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}