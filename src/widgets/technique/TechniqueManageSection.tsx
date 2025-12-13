"use client"

import {useEffect} from "react";
import {Card, CardContent} from "@/widgets/common/Card";
import {useInfiniteTechniqueList} from "@/app/features/technique/hooks/use-infinite-technique-list";
import {TechniqueForm} from "@/widgets/technique/TechniqueForm";
import {TechniqueListItem} from "@/widgets/technique/TechniqueListItem";
import {useTechniqueList} from "@/app/features/technique/hooks/use-technique-list";

export default function TechniqueManageSection() {
  const {techniques, setTechniques, loading, loaderRef, fetchData} = useInfiniteTechniqueList();

  const {
    expandedTechniques,
    toggleTechnique,
    showSubForm,
    addSubForm,
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
          <h3 className="text-lg font-semibold mb-4">Add New Tactics</h3>
          <TechniqueForm
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
                    onSubmit={(techniqueForm) => addSubTechnique(technique.id, techniqueForm)}
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