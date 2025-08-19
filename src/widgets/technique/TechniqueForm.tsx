import {Input} from "@/widgets/common/Input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/widgets/common/Select";
import {Button} from "@/widgets/common/Button";
import {Plus} from "lucide-react";
import {TechniqueType} from "@/entities/technique-type";

interface TechniqueFormProps {
  techniqueName: string;
  setTechniqueName: (name: string) => void;
  techniqueType: TechniqueType;
  setTechniqueType: (type: TechniqueType) => void;
  addTechnique: () => void;
}

export function TechniqueForm({ techniqueName, setTechniqueName, techniqueType, setTechniqueType, addTechnique }: TechniqueFormProps) {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Technique name"
        value={techniqueName}
        onChange={(e) => setTechniqueName(e.target.value)}
        className="flex-1"
      />
      <Select
        value={techniqueType}
        onValueChange={(val) =>
          setTechniqueType(val as "attack" | "defense" | "etc")
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select type"/>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="attack">Attack</SelectItem>
          <SelectItem value="defense">Defense</SelectItem>
          <SelectItem value="etc">Etc</SelectItem>
        </SelectContent>

      </Select>
      <Button onClick={() => addTechnique()}>
        <Plus className="w-4 h-4 mr-2"/>
        Add
      </Button>
    </div>
  )
}