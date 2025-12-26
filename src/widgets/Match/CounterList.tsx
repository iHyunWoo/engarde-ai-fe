"use client"

import {Counter} from "@/widgets/common/Counter";
import {TechniqueAttempt} from "@/entities/technique/technique-attempt";
import {Technique} from "@/entities/technique/technique";
import {useEffect, useState} from "react";
import {Plus, X} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/widgets/common/Dialog";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@/widgets/common/Command";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@/widgets/common/AlertDialog";
import {createTechniqueAttempt} from "@/app/features/technique/api/create-technique-attempt";
import {toast} from "sonner";
import {getTechniqueAttemptList} from "@/app/features/technique/api/get-technique-attempt-list";
import {updateTechniqueAttemptCounter} from "@/app/features/technique/api/update-technique-attempt-counter";
import {deleteTechniqueAttempt} from "@/app/features/technique/api/delete-technique-attempt";
import { Button } from "../common/Button";
import { Card } from "../common/Card";

interface CounterListProps {
  matchId: number;
  techniques: Technique[];
}

export function CounterList({matchId, techniques}: CounterListProps) {
  const [open, setOpen] = useState(false);
  const [attempts, setAttempts] = useState<TechniqueAttempt[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attemptToDelete, setAttemptToDelete] = useState<TechniqueAttempt | null>(null);

  const handleCounterChange = async (id: number, delta: number) => {
    const current = attempts.find((a) => a.id === id);
    if (!current) return;

    const nextValue = current.attemptCount + delta;
    if (nextValue < 0) return;

    const prevAttempts = [...attempts];

    // 낙관적 업데이트
    setAttempts((prev) =>
      prev.map((attempt) =>
        attempt.id === id
          ? { ...attempt, attemptCount: nextValue }
          : attempt
      )
    );

    const result = await updateTechniqueAttemptCounter(id, delta);

    // 실패시 롤백
    if (result.code !== 200) {
      toast.error(result.message);
      setAttempts(prevAttempts);
    }
  };

  const getTechniqueAttempts = async () => {
    const result = await getTechniqueAttemptList(matchId);
    if (!result.data) {
      toast.error(result.message);
      return;
    }
    setAttempts(result.data);
  }

  const handleSelectTechnique = async (techniqueId: number) => {
    const {data, message} = await createTechniqueAttempt(techniqueId, matchId);
    if (!data) {
      toast.error(message);
      return;
    }

    setAttempts((prev) => [...prev, data]);
  };

  const handleDeleteClick = (attempt: TechniqueAttempt) => {
    setAttemptToDelete(attempt);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!attemptToDelete) return;
    
    const prevAttempts = [...attempts];
    
    // 낙관적 삭제
    setAttempts((prev) => prev.filter((attempt) => attempt.id !== attemptToDelete.id));

    try {
      const result = await deleteTechniqueAttempt(attemptToDelete.id);
      if (result.code !== 200) {
        throw new Error(result.message);
      }
      toast.success('Technique attempt deleted successfully');
    } catch (error) {
      // 롤백
      setAttempts(prevAttempts);
      toast.error('Failed to delete technique attempt');
    } finally {
      setDeleteDialogOpen(false);
      setAttemptToDelete(null);
      // Dialog 상태를 명시적으로 유지
      setOpen(true);
    }
  };

  useEffect(() => {
    getTechniqueAttempts()
  }, []);

  // chidren flatten
  const flattenedTechniques = flattenTechniques(techniques);

  // 이미 선택된 기술들 제외
  const existingIds = new Set(attempts.map((a) => a.technique.id));
  // 중복 제거
  const availableTechniques = flattenedTechniques.filter(
    (t) => !existingIds.has(t.id)
  );

  return (
    <div className="flex items-center gap-4" style={{ minWidth: 'max-content' }}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors w-20 shrink-0 flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Plus className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm text-center">Add</span>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Tactics</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 기존 기술들 */}
            {attempts.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Current Tactics</h3>
                <div className="space-y-2">
                  {attempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium">{attempt.technique.name}</p>
                      </div>
                      <Button
                        onClick={() => handleDeleteClick(attempt)}
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 새 기술 추가 */}
            <div>
              <h3 className="text-sm font-medium mb-2">Add New Tactics</h3>
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Search Tactics" className="h-9" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {availableTechniques.map((technique) => (
                    <CommandItem
                      key={technique.id}
                      value={technique.name}
                      onSelect={() => handleSelectTechnique(technique.id)}
                      className="cursor-pointer"
                    >
                      <span>{technique.name}</span>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
        setDeleteDialogOpen(open);
        // AlertDialog가 닫힐 때 Dialog 상태를 명시적으로 유지
        if (!open) {
          setOpen(true);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tactics Attempt</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{attemptToDelete?.technique.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Counter 리스트 */}
      <div className="flex gap-4 flex-nowrap">
        {attempts.map((attempt) => (
          <div key={attempt.id} className="flex-shrink-0">
            <Counter
              label={attempt.technique.name}
              count={attempt.attemptCount}
              changeCount={(delta) => handleCounterChange(attempt.id, delta)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function flattenTechniques(techniques: Technique[]): Technique[] {
  const result: Technique[] = [];

  function traverse(technique: Technique) {
    result.push(technique);
    technique.children?.forEach(traverse);
  }

  techniques.forEach(traverse);
  return result;
}