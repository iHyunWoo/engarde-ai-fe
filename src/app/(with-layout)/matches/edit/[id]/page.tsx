"use client"

import MatchInfoForm from "@/widgets/Match/MatchInfoForm";
import React from "react";
import {useParams} from "next/navigation";
import {useMatchUpdate} from "@/app/features/match/hooks/use-match-update";
import {Button} from "@/widgets/common/Button";
import {toast} from "sonner";

export default function Page() {
  const params = useParams();
  const id = params.id;

  const {
    matchData,
    initialLoading,
    saving,
    updateMatchData,
    submit,
    handleDelete
  } = useMatchUpdate(Number(id));

  if (initialLoading) return null;

  const handleDeleteClicked = async () => {
    const result = await handleDelete();
    if (result && result.code === 200) {
      window.location.href = '/matches';
    } else {
      toast('Failed to delete match.');
    }
  }

  return (
    <div className="min-h-screen w-full py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <MatchInfoForm
          matchData={matchData}
          uploading={saving}
          onUpdateMatchData={updateMatchData}
          onUpload={submit}
        />

        <Button
          variant="destructive"
          onClick={handleDeleteClicked}
        >
          Delete Match
        </Button>
      </div>
    </div>
  );
}