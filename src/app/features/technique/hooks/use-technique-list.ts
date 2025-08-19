import {Dispatch, SetStateAction, useState} from "react";
import { toast } from "sonner";
import {TechniqueType} from "@/entities/technique-type";
import {createTechnique} from "@/app/features/technique/api/create-technique";
import {Technique} from "@/entities/technique";
import {updateTechnique} from "@/app/features/technique/api/update-technique";
import {deleteTechnique} from "@/app/features/technique/api/delete-technique";

export function useTechniqueList(
  techniques: Technique[],
  setTechniques: Dispatch<SetStateAction<Technique[]>>
) {

  const [techniqueName, setTechniqueName] = useState("");
  const [techniqueType, setTechniqueType] = useState<TechniqueType>("attack");
  const [expandedTechniques, setExpandedTechniques] = useState<Set<number>>(new Set());

  const [showSubForm, setShowSubForm] = useState<Set<number>>(new Set());
  // 하위 기술 입력 상태 key: 부모 ID, value: sub 기술 입력 상태
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

  const handleUpdate = async (technique: Technique) => {
    const {code, data: updated, message} = await updateTechnique(technique.id, technique);

    if (code !== 200 || !updated) {
      toast.error(message);
      return;
    }

    setTechniques((prev) =>
      prev.map((t) => {
        // 부모 탐색
        if (t.id === updated.id) {
          return { ...t, ...updated };
        }

        // 자식 탐색
        const updatedChildren = t.children?.map((c) =>
          c.id === updated.id ? { ...c, ...updated } : c
        ) ?? [];

        return { ...t, children: updatedChildren };
      })
    );

    toast.success("update success");
  }

  const handleDelete = async (id: number) => {
    const {code, data, message} = await deleteTechnique(id);

    if (code !== 200 || !data) {
      toast.error(message);
      return;
    }

    setTechniques((prev) =>
      prev
        .filter((t) => t.id !== id) // 부모 삭제
        .map((t) => ({
          ...t,
          // 자식 삭제
          children: t.children?.filter((c) => c.id !== id) ?? [],
        }))
    );


    toast.success("delete success");
  }

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
    handleUpdate,
    handleDelete,
  };
}