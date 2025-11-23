import {Marking} from "@/entities/marking";
import {Button} from "@/widgets/common/Button";
import {Clock, X, Bookmark, Pencil, Trash2, Plus} from "lucide-react";
import {formatTime} from "@/shared/lib/format-time";
import {useState, useEffect} from "react";
import {QualityPill} from "@/widgets/marking/MarkingQualityFill";
import {formatTechniqueName} from "@/app/features/technique/lib/format-technique-name";
import {Separator} from "@/widgets/common/Separator";
import {Textarea} from "@/widgets/common/Textarea";

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

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5"/>
                <span className="font-mono">{formatTime(mark.remainTime)}</span>
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
                  <div className="px-2 pb-2 pt-1 border-t bg-gray-50">
                    <div className="text-xs text-gray-700">
                      <span className="font-medium">Note: </span>
                      {mark.note}
                    </div>
                  </div>
                )}
                {hasCoachNote && (
                  <div className="px-2 pb-2 pt-1 border-t bg-blue-50">
                    <div className="text-xs text-blue-700">
                      {mark.coachNote}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 코치 모드: 코멘트 섹션 */}
            {isCoachMode && (
              <div className="px-2 pb-2 pt-2 border-t bg-gray-50">
                {/* 학생 노트 표시 (편집 모드가 아니어도 항상 표시) */}
                {hasStudentNote && !isEditing && (
                  <div className="mb-2 text-xs text-gray-600 bg-white p-2 rounded border">
                    <span className="font-medium">Student Note: </span>
                    {mark.note}
                  </div>
                )}
                {isEditing ? (
                  // 편집 모드
                  <div className="space-y-2">
                    {mark.note && (
                      <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                        <span className="font-medium">Student Note: </span>
                        {mark.note}
                      </div>
                    )}
                    <Textarea
                      value={coachNotes[mark.id] ?? ''}
                      onChange={(e) => handleCoachCommentChange(mark.id, e.target.value)}
                      placeholder="Enter coach comment..."
                      className="text-sm min-h-24 bg-white"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {(coachNotes[mark.id] ?? '').length}/500
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => cancelEditing(mark.id)}
                          disabled={isSaving}
                          className="h-7 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveCoachComment(mark.id)}
                          disabled={isSaving}
                          className="h-7 text-xs"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : hasCoachNote ? (
                  // 코멘트가 있는 경우: 표시 + 편집/삭제 버튼
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 text-xs text-gray-700 bg-white p-2 rounded border">
                      {mark.coachNote}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(mark.id)}
                        disabled={isSaving}
                        className="h-7 w-7 p-0"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCoachComment(mark.id)}
                        disabled={isSaving}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 코멘트가 없는 경우: 생성하기 버튼
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">No coach comment.</span>
                    <Button
                      size="sm"
                      onClick={() => startEditing(mark.id)}
                      disabled={isSaving}
                      className="h-7 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Create
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}