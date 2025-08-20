import { Input } from "@/widgets/common/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/widgets/common/Select";
import { Button } from "@/widgets/common/Button";
import { Plus, Save } from "lucide-react";
import {TechniqueType} from "@/entities/technique-type";
import {Technique} from "@/entities/technique";
import {useState} from "react";

interface TechniqueFormProps {
  initialData?: Omit<Technique, 'id' | 'children'>;
  id?: number;
  onSubmit: (technique: Technique) => void;
  buttonText?: string;
  onCancel?: () => void;
}

export function TechniqueForm({
                                initialData,
                                id,
                                onSubmit,
                                buttonText = "Add",
                                onCancel,
                              }: TechniqueFormProps) {

  const [techniqueName, setTechniqueName] = useState(initialData?.name ?? '');
  const [techniqueType, setTechniqueType] = useState<TechniqueType>(initialData?.type ?? "attack");

  const handleSubmit = () => {
    const payload: Technique = {
      id: id ?? 0,
      name: techniqueName ?? '',
      type: techniqueType ?? 'attack',
      children: [],
    };

    onSubmit(payload);
  };

  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="Technique name"
        value={techniqueName}
        onChange={(e) => setTechniqueName?.(e.target.value)}
        className="flex-1"
      />

      <Select
        value={techniqueType}
        onValueChange={(val) => setTechniqueType?.(val as TechniqueType)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="attack">Attack</SelectItem>
          <SelectItem value="defense">Defense</SelectItem>
          <SelectItem value="etc">Etc</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleSubmit}>
        {buttonText === "Add" ? (
          <>
            <Plus className="w-4 h-4 mr-2" />
            {buttonText}
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            {buttonText}
          </>
        )}
      </Button>

      {onCancel && (
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
}