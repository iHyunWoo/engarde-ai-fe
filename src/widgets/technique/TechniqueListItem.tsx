import {Card, CardContent} from "@/widgets/common/Card";
import {Button} from "@/widgets/common/Button";
import {ChevronDown, ChevronRight, Pencil, Trash2, Plus} from "lucide-react";
import {Technique} from "@/entities/technique/technique";
import {useState} from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/widgets/common/AlertDialog";
import {TechniqueForm} from "@/widgets/technique/TechniqueForm";

interface TechniqueListItemProps {
  isSub?: boolean;
  technique: Technique;
  showSubForm?: boolean;
  toggleTechnique?: (id: number) => void;
  expanded?: boolean;
  addSubForm?: (id: number) => void;
  onUpdate?: (technique: Technique) => void;
  onDelete?: (id: number) => void;
}

export function TechniqueListItem({
                                    isSub = false,
                                    technique,
                                    showSubForm,
                                    toggleTechnique,
                                    expanded,
                                    addSubForm,
                                    onUpdate,
                                    onDelete
                                  }: TechniqueListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <Card className={`${isSub ? "ml-8" : ""} hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        {isEditing ? (
          <TechniqueForm
            initialData={technique}
            id={technique.id}
            buttonText="Save"
            onCancel={() => setIsEditing(false)}
            onSubmit={(updated) => {
              onUpdate?.(updated);
              setIsEditing(false);
            }}
          />
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {((technique.children && technique.children.length > 0) || showSubForm) && toggleTechnique && (
                <Button
                  variant="ghost"
                  onClick={() => toggleTechnique(technique.id)}
                  className="p-1 hover:bg-accent rounded"
                >
                  {expanded ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
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

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4"/>
              </Button>
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-destructive"/>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this technique?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        onDelete?.(technique.id);
                        setShowDeleteDialog(false);
                      }}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {addSubForm && (
                <Button variant="outline" size="sm" onClick={() => addSubForm(technique.id)}>
                  <Plus className="w-4 h-4 mr-1"/>
                  Sub
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}