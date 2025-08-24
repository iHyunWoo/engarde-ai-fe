"use client";

import {useEffect} from "react";
import {Card, CardContent} from "@/widgets/common/Card";
import {useInfiniteOpponentList} from "@/app/features/opponent/hooks/use-infinite-opponent-list";
import {OpponentListItem} from "@/widgets/opponent/OpponentListItem";
import {OpponentForm} from "@/widgets/opponent/OpponentForm";
import {useOpponentManage} from "@/app/features/opponent/hooks/use-opponent-manage";

export default function OpponentManageSection() {
  const { opponents, setOpponents, loading, loaderRef, fetchData } = useInfiniteOpponentList();

  const {
    addOpponent,
    handleUpdate,
    handleDelete
  } = useOpponentManage(opponents, setOpponents)

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Add New Opponent</h3>
          <OpponentForm onSubmit={addOpponent} />
        </CardContent>
      </Card>

      <div
        className="space-y-3 pr-2"
      >
        {opponents.map((opponent) => (
          <div key={opponent.id}>
            <OpponentListItem
              opponent={opponent}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>
        ))}

        <div ref={loaderRef} className="h-12" />
        {loading && <p className="text-center text-sm text-gray-400">Loading more...</p>}
      </div>
    </div>
  );
}