import {Marking} from "@/entities/marking";
import {Button} from "@/widgets/common/Button";
import {Clock, X, Bookmark} from "lucide-react";
import {formatTime} from "@/shared/lib/format-time";
import {useState, useEffect} from "react";
import {QualityPill} from "@/widgets/marking/MarkingQualityFill";
import {formatTechniqueName} from "@/app/features/technique/lib/format-technique-name";
import {Separator} from "@/widgets/common/Separator";
import {StudentNote} from "@/widgets/marking/StudentNote";
import {CoachNote} from "@/widgets/marking/CoachNote";
import {CoachNoteEditor} from "@/widgets/marking/CoachNoteEditor";

export function MarkingList({
                              markings,
                              onRemove,
                              onSeek,
                              isCoachMode,
                              onCoachCommentUpdate,
                            }: {
  markings: Marking[];
  onRemove?: (id: number) => void;
  onSeek: (time: number) => void;
  isCoachMode?: boolean;
  onCoachCommentUpdate?: (markingId: number, coachNote: string) => Promise<void>;
}) {
  const [editingMarkings, setEditingMarkings] = useState<Set<number>>(new Set());
  const [coachNotes, setCoachNotes] = useState<Record<number, string>>(
    Object.fromEntries(markings.map(m => [m.id, m.coachNote ?? '']))
  );
  const [savingComments, setSavingComments] = useState<Set<number>>(new Set());

  // 마킹 데이터가 변경될 때 코치 코멘트 상태 업데이트
  useEffect(() => {
    setCoachNotes(prev => {
      const updated = {...prev};
      markings.forEach(m => {
        if (m.coachNote !== undefined) {
          updated[m.id] = m.coachNote;
        }
      });
      return updated;
    });
  }, [markings]);

  const startEditing = (markingId: number) => {
    setEditingMarkings(prev => new Set(prev).add(markingId));
  };

  const cancelEditing = (markingId: number) => {
    setEditingMarkings(prev => {
      const next = new Set(prev);
      next.delete(markingId);
      return next;
    });
    // 원래 값으로 복원
    const marking = markings.find(m => m.id === markingId);
    if (marking) {
      setCoachNotes(prev => ({...prev, [markingId]: marking.coachNote ?? ''}));
    }
  };

  const handleCoachCommentChange = (markingId: number, value: string) => {
    setCoachNotes(prev => ({...prev, [markingId]: value}));
  };

  const handleSaveCoachComment = async (markingId: number) => {
    if (!onCoachCommentUpdate) return;
    
    setSavingComments(prev => new Set(prev).add(markingId));
    try {
      await onCoachCommentUpdate(markingId, coachNotes[markingId] ?? '');
      setEditingMarkings(prev => {
        const next = new Set(prev);
        next.delete(markingId);
        return next;
      });
    } finally {
      setSavingComments(prev => {
        const next = new Set(prev);
        next.delete(markingId);
        return next;
      });
    }
  };

  const handleDeleteCoachComment = async (markingId: number) => {
    if (!onCoachCommentUpdate) return;
    
    setSavingComments(prev => new Set(prev).add(markingId));
    try {
      await onCoachCommentUpdate(markingId, '');
    } finally {
      setSavingComments(prev => {
        const next = new Set(prev);
        next.delete(markingId);
        return next;
      });
    }
  };

  return (
    <div className="border rounded p-2 space-y-1 max-h-72 overflow-y-auto text-sm bg-white shadow-sm">
      {markings.map((mark) => {
        if (mark.result === 'setEnded') {
          return (
            <div key={mark.id} className="flex items-center gap-2 py-2 mx-2">
              <Separator className="flex-1" />
              <div className="flex items-center gap-1 font-medium">
                <Bookmark className="w-4 h-4" />
                <span>Set Ended</span>
              </div>
              <Separator className="flex-1" />
              {!isCoachMode && onRemove && (
                <X
                  onClick={() => onRemove(mark.id)}
                  className="cursor-pointer text-red-600 w-4 h-4 ml-2"
                />
              )}
            </div>
          );
        }

        const isEditing = editingMarkings.has(mark.id);
        const isSaving = savingComments.has(mark.id);
        const hasCoachNote = mark.coachNote && mark.coachNote.trim().length > 0;
        const hasStudentNote = mark.note && mark.note.trim().length > 0;

        return (
          <div
            key={mark.id}
            className="border-b last:border-b-0"
          >
            {/* 마킹 아이템 */}
            <div
              className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition"
            >
              {/* 시간 표시 */}
              <Button
                variant="ghost"
                onClick={() => onSeek(mark.timestamp)}
                className="min-w-[70px] font-mono text-blue-600 hover:text-blue-800 hover:underline text-left"
              >
                {formatTime(mark.timestamp)}
              </Button>

              {/* 내용 표시 */}
              <div className="flex-1 flex items-center justify-start gap-3 pl-1">
                <span className="text-gray-800">{formatTechniqueName(mark.result)}</span>
                <span className="text-gray-500">{formatTechniqueName(mark.myTechnique?.name ?? "None")}</span>

                <QualityPill q={mark.quality}/>
              </div>

              {/* 일반 모드일 때 삭제 버튼 */}
              {!isCoachMode && onRemove && (
                <X
                  onClick={() => onRemove(mark.id)}
                  className="cursor-pointer text-red-600 w-4 h-4 ml-2"
                />
              )}
            </div>

            {/* 일반 유저: 학생 노트와 코치 노트 표시 */}
            {!isCoachMode && (
              <>
                {hasStudentNote && (
                  <StudentNote note={mark.note!} />
                )}
                {hasCoachNote && (
                  <CoachNote note={mark.coachNote!} />
                )}
              </>
            )}

            {/* 코치 모드: 코멘트 섹션 */}
            {isCoachMode && (
              <CoachNoteEditor
                studentNote={mark.note}
                coachNote={mark.coachNote}
                isEditing={isEditing}
                isSaving={isSaving}
                editedCoachNote={coachNotes[mark.id] ?? ''}
                onCoachNoteChange={(value) => handleCoachCommentChange(mark.id, value)}
                onStartEditing={() => startEditing(mark.id)}
                onCancelEditing={() => cancelEditing(mark.id)}
                onSave={() => handleSaveCoachComment(mark.id)}
                onDelete={() => handleDeleteCoachComment(mark.id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}