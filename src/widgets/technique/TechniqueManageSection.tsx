"use client"

import {useEffect} from "react";
import {Card, CardContent} from "@/widgets/common/Card";
import {useInfiniteTechniqueList} from "@/app/features/technique/hooks/use-infinite-technique-list";
import {TechniqueForm} from "@/widgets/technique/TechniqueForm";
import {TechniqueListItem} from "@/widgets/technique/TechniqueListItem";
import {useTechniqueList} from "@/app/features/technique/hooks/use-technique-list";
import {Technique} from "@/entities/technique";

export default function TechniqueManageSection() {
  const {techniques, setTechniques, loading, loaderRef, fetchData} = useInfiniteTechniqueList();
  const {
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
  } = useTechniqueList(
    techniques,
    setTechniques
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Add New Technique</h3>
          <TechniqueForm
            techniqueName={techniqueName}
            setTechniqueName={setTechniqueName}
            techniqueType={techniqueType}
            setTechniqueType={setTechniqueType}
            onSubmit={addTechnique}
          />
        </CardContent>
      </Card>

      {/* Techniques List */}
      <div className="space-y-3">
        {techniques.map((technique) => (
          <div key={technique.id} className="space-y-2">
            {/* Parent Technique */}
            <TechniqueListItem
              technique={technique}
              showSubForm={showSubForm.has(technique.id)}
              toggleTechnique={toggleTechnique}
              expanded={expandedTechniques.has(technique.id)}
              addSubForm={addSubForm}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />

            {showSubForm.has(technique.id) && (
              <Card className="ml-8">
                <CardContent className="p-4">
                  <TechniqueForm
                    techniqueName={subInputs[technique.id]?.name || ""}
                    setTechniqueName={(name) => {
                      setSubInputs((prev) => ({
                        ...prev,
                        [technique.id]: {...prev[technique.id], name: name},
                      }))
                    }}
                    techniqueType={subInputs[technique.id]?.type || "attack"}
                    setTechniqueType={(type) => {
                      setSubInputs((prev) => ({
                        ...prev,
                        [technique.id]: {...prev[technique.id], type: type},
                      }))
                    }}
                    onSubmit={() => addSubTechnique(technique.id)}
                  />
                </CardContent>
              </Card>
            )}


            {/* Child Techniques */}
            {expandedTechniques.has(technique.id) && technique.children?.map((child) => (
              <div key={child.id}>
                <TechniqueListItem
                  isSub={true}
                  technique={child}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        ))}
        <div ref={loaderRef} className="h-12"/>
        {loading && <p className="text-center text-sm text-gray-400">Loading more...</p>}
      </div>
    </div>
  );
}