import {Card, CardContent} from "@/widgets/common/Card";
import {Button} from "@/widgets/common/Button";
import {ChevronDown, ChevronRight, Plus} from "lucide-react";
import {Technique} from "@/entities/technique";

interface TechniqueListItemProps {
  isSub?: boolean;
  technique: Technique;
  showSubForm?: boolean;
  toggleTechnique?: (id: number) => void;
  expanded?: boolean;
  addSubForm?: (id: number) => void;
}

export function TechniqueListItem({
                                    isSub = false,
                                    technique,
                                    showSubForm,
                                    toggleTechnique,
                                    expanded,
                                    addSubForm
                                  }: TechniqueListItemProps) {
  return (
    <Card className={`${isSub ? "ml-8" : ""} hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {((technique.children && technique.children.length > 0) || showSubForm) && toggleTechnique && (
              <Button
                variant="ghost"
                onClick={() => toggleTechnique(technique.id)}
                className="p-1 hover:bg-accent rounded"
              >
                {expanded ? (
                  <ChevronDown className="w-4 h-4"/>
                ) : (
                  <ChevronRight className="w-4 h-4"/>
                )}
              </Button>
            )}
            <div>
              <h4 className="font-semibold">{technique.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${
                technique.type === 'attack'
                  ? 'bg-red-100 text-red-800'
                  : technique.type === 'defense'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {technique.type}
              </span>
            </div>
          </div>
          {addSubForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSubForm(technique.id)}
            >
              <Plus className="w-4 h-4 mr-1"/>
              Sub
            </Button>
          )}

        </div>
      </CardContent>
    </Card>
  )
}