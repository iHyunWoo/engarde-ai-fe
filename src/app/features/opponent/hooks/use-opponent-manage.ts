import {Opponent} from "@/entities/opponent";
import {createOpponent} from "@/app/features/opponent/api/create-opponent";
import {toast} from "sonner";
import {updateOpponent} from "@/app/features/opponent/api/update-opponent";
import {deleteOpponent} from "@/app/features/opponent/api/delete-opponent";
import {Dispatch, SetStateAction} from "react";

export function useOpponentManage(
  opponents: Opponent[],
  setOpponents: Dispatch<SetStateAction<Opponent[]>>
) {
  const addOpponent = async (opponent: Opponent) => {
    const { code, data: newOpponent, message } = await createOpponent(opponent.name, opponent.team);

    if (code !== 201 || !newOpponent) {
      toast.error(message);
      return;
    }

    setOpponents([newOpponent, ...opponents]);
  };

  const handleUpdate = async (opponent: Opponent) => {
    const {code, data: updated, message} = await updateOpponent(opponent.id, opponent);

    if (code !== 200 || !updated) {
      toast.error(message);
      return;
    }

    setOpponents((prev) =>
      prev.map((opponent) => (opponent.id === updated.id ? updated : opponent))
    )
  }

  const handleDelete = async (id: number) => {
    const {code, data, message} = await deleteOpponent(id);

    if (code !== 200 || !data) {
      toast.error(message);
      return;
    }

    setOpponents((prev) => prev.filter((opponent) => opponent.id !== id));
  }

  return {
    addOpponent,
    handleUpdate,
    handleDelete,
  }
}