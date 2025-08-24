import {Card, CardContent} from "@/widgets/common/Card";
import {Button} from "@/widgets/common/Button";
import {Pencil, Trash2} from "lucide-react";
import {
  AlertDialog, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/widgets/common/AlertDialog";
import {Opponent} from "@/entities/opponent";
import {useState} from "react";
import {OpponentForm} from "@/widgets/opponent/OpponentForm";

interface OpponentListItemProps {
  opponent: Opponent;
  onUpdate?: (opponent: Opponent) => void;
  onDelete?: (id: number) => void;
}

export function OpponentListItem({opponent, onUpdate, onDelete}: OpponentListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <Card key={opponent.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {isEditing ? (
          <OpponentForm
            initialData={opponent}
            id={opponent.id}
            buttonText="Save"
            onCancel={() => setIsEditing(false)}
            onSubmit={(updated) => {
              onUpdate?.(updated);
              setIsEditing(false)
            }}
          />
        ): (
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{opponent.name}</h4>
              <p className="text-sm text-muted-foreground">{opponent.team}</p>
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
                        onDelete?.(opponent.id);
                        setShowDeleteDialog(false);
                      }}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}