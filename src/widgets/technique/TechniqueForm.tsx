import { Input } from "@/widgets/common/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/widgets/common/Select";
import { Button } from "@/widgets/common/Button";
import { Plus, Save } from "lucide-react";
import {TechniqueType} from "@/entities/technique-type";
import {Technique} from "@/entities/technique";
import {useState} from "react";

interface TechniqueFormProps {
  techniqueName?: string;
  setTechniqueName?: (name: string) => void;
  techniqueType?: TechniqueType;
  setTechniqueType?: (type: TechniqueType) => void;
  onSubmit: (technique: Technique) => void;
  buttonText?: string;
  initialData?: Technique;
  onCancel?: () => void;
}

export function TechniqueForm({
                                techniqueName,
                                setTechniqueName,
                                techniqueType,
                                setTechniqueType,
                                onSubmit,
                                buttonText = "Add",
                                initialData,
                                onCancel,
                              }: TechniqueFormProps) {
  const [localName, setLocalName] = useState(initialData?.name ?? techniqueName ?? "");
  const [localType, setLocalType] = useState<TechniqueType>(initialData?.type ?? techniqueType ?? "etc");

  const handleSubmit = () => {
    const payload: Technique = {
      ...(initialData ?? {}),
      id: initialData?.id ?? 0,
      name: localName,
      type: localType,
      children: initialData?.children ?? [],
    };

    if (setTechniqueName) setTechniqueName(localName);
    if (setTechniqueType) setTechniqueType(localType);

    onSubmit(payload);
  };


  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="Technique name"
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
        className="flex-1"
      />

      <Select
        value={localType}
        onValueChange={(val) => setLocalType(val as TechniqueType)}
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