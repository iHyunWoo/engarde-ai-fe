import {Technique} from "@/entities/technique/technique";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger} from "@/widgets/common/Select";
import {formatTechniqueName} from "@/app/features/technique/lib/format-technique-name";

interface TechniqueSelectProps {
  techniques: Technique[];
  selected: Technique | null;
  onChange: (technique: Technique | null) => void;
  disabled: boolean;
}

export function TechniqueSelect({
                                  techniques,
                                  selected,
                                  onChange,
                                  disabled,
                                }: TechniqueSelectProps) {

  return (
    <Select
      value={selected ? selected.id.toString() : "none"}
      onValueChange={(v) => {
        if (v === "none") return onChange(null);  // none 옵션이면 null set
        const selectedTechnique = techniques.find((tech) => tech.id === Number(v));
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

        {techniques.map((technique) => (
          <SelectGroup key={technique.id}>
            <SelectItem value={technique.id.toString()}>
              {formatTechniqueName(technique.name)}
            </SelectItem>
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}