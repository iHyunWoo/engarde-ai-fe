import {Dispatch, SetStateAction, useState} from "react";
import { toast } from "sonner";
import {TechniqueType} from "@/entities/technique-type";
import {createTechnique} from "@/app/features/technique/api/create-technique";
import {Technique} from "@/entities/technique";

export function useTechniqueList(
  techniques: Technique[],
  setTechniques: Dispatch<SetStateAction<Technique[]>>
) {

  const [techniqueName, setTechniqueName] = useState("");
  const [techniqueType, setTechniqueType] = useState<TechniqueType>("attack");
  const [expandedTechniques, setExpandedTechniques] = useState<Set<number>>(new Set());

  const [showSubForm, setShowSubForm] = useState<Set<number>>(new Set());
  // 하위 기술 입력 상태 (기술 id별로 상태 관리)
  const [subInputs, setSubInputs] = useState<Record<number, { name: string; type: TechniqueType }>>({});

  const addTechnique = async () => {
    if (!techniqueName || !techniqueType) {
      toast.warning('Technique name and type is required');
      return;
    }

    const {code, data: newTechnique, message} = await createTechnique({
      name: techniqueName,
      type: techniqueType,
    });

    if (code !== 201 || !newTechnique) {
      toast.error(message);
      return;
    }

    setTechniques([newTechnique, ...techniques])
    setTechniqueName("");
    setTechniqueType("attack");
  };

  const addSubTechnique = async (parentId: number) => {
    const input = subInputs[parentId];
    if (!input?.name || !input?.type) {
      toast.warning("Technique name and type is required");
      return;
    }

    const {code, data: newChild, message} = await createTechnique({
      name: input.name,
      type: input.type,
      parentId,
    });

    if (code !== 201 || !newChild) {
      toast.error(message);
      return;
    }

    // 기술에 자식 추가
    setTechniques((prev) =>
      prev.map((t) =>
        t.id === parentId ? {...t, children: [newChild, ...(t.children || [])]} : t
      )
    );

    // 폼 초기화 및 닫기
    setSubInputs((prev) => ({...prev, [parentId]: {name: "", type: "attack"}}));
    setShowSubForm((prev) => {
      const copy = new Set(prev);
      copy.delete(parentId);
      return copy;
    });

    // 자식 생겼으니 펼치기
    setExpandedTechniques((prev) => new Set(prev).add(parentId));
  };

  const addSubForm = (id: number) => {
    setShowSubForm((prev) => new Set(prev).add(id));
    // 폼 추가하면 expand 상태에도 추가
    setExpandedTechniques((prev) => new Set(prev).add(id));
  };


  const toggleTechnique = (id: number) => {
    setExpandedTechniques((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);

        // 닫을 때 Sub Form도 함께 닫기
        setShowSubForm((prev) => {
          const subFormCopy = new Set(prev);
          subFormCopy.delete(id);
          return subFormCopy;
        });
      } else {
        copy.add(id);
      }
      return copy;
    });
  };

  return {
    techniqueName,
    setTechniqueName,
    techniqueType,
    setTechniqueType,
    expandedTechniques,
    toggleTechnique,
    showSubForm,
    addSubForm,
    subInputs,
    setSubInputs,
    addTechnique,
    addSubTechnique,
  };
}