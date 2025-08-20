import {Input} from "@/widgets/common/Input";
import {Button} from "@/widgets/common/Button";
import {Plus, Save} from "lucide-react";
import {Opponent} from "@/entities/opponent";
import {useState} from "react";
import {toast} from "sonner";

export interface OpponentFormProps {
  initialData?: Opponent;
  id?: number;
  onSubmit: (opponent: Opponent) => void;
  buttonText?: string;
  onCancel?: () => void;
}

export function OpponentForm({
                               initialData,
                               onSubmit,
                               id,
                               buttonText = 'Add',
                               onCancel,
                             }: OpponentFormProps) {
  const [opponentName, setOpponentName] = useState(initialData?.name ?? '');
  const [opponentTeam, setOpponentTeam] = useState(initialData?.team ?? '');

  const handleSubmit = () => {
    if (!opponentName) {
      toast.warning('Opponent name is required');
      return;
    }

    onSubmit({
      id: id ?? 0,
      name: opponentName,
      team: opponentTeam,
    })

    setOpponentName("")
    setOpponentTeam("")
  }

  return (
    <div className="flex gap-4">
      <Input
        placeholder="Opponent name"
        value={opponentName}
        onChange={(e) => setOpponentName(e.target.value)}
        className="flex-1"
      />
      <Input
        placeholder="Team name"
        value={opponentTeam}
        onChange={(e) => setOpponentTeam(e.target.value)}
        className="flex-1"
      />
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
  )
}