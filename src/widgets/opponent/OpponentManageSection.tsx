"use client";

import {useEffect, useState} from "react";
import {Input} from "@/widgets/common/Input";
import {Button} from "@/widgets/common/Button";
import {Card, CardContent} from "@/widgets/common/Card";
import {Plus} from "lucide-react";
import {createOpponent} from "@/app/features/opponent/api/create-opponent";
import {toast} from "sonner";
import {useInfiniteOpponentList} from "@/app/features/opponent/hooks/use-infinite-opponent-list";

export default function OpponentManageSection() {
  const { opponents, setOpponents, loading, loaderRef, fetchData } = useInfiniteOpponentList();

  const [opponentName, setOpponentName] = useState("");
  const [opponentTeam, setOpponentTeam] = useState("");

  const addOpponent = async () => {
    const { code, data: newOpponent, message } = await createOpponent(opponentName, opponentTeam);

    if (code !== 201 || !newOpponent) {
      toast.error(message);
      return;
    }

    setOpponents([newOpponent, ...opponents]);
    setOpponentName("");
    setOpponentTeam("");
  };

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Add New Opponent</h3>
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
            <Button onClick={addOpponent}>
              <Plus className="w-4 h-4 mr-2"/>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div
        className="space-y-3 pr-2"
      >
        {opponents.map((opponent) => (
          <Card key={opponent.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{opponent.name}</h4>
                  <p className="text-sm text-muted-foreground">{opponent.team}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div ref={loaderRef} className="h-12" />
        {loading && <p className="text-center text-sm text-gray-400">Loading more...</p>}
      </div>
    </div>
  );
}