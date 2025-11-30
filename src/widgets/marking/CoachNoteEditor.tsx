import { GraduationCap, User } from "lucide-react";
import { Button } from "@/widgets/common/Button";
import { Textarea } from "@/widgets/common/Textarea";
import { Pencil, Trash2, Plus } from "lucide-react";

interface CoachNoteEditorProps {
  studentNote: string | null | undefined;
  coachNote: string | null | undefined;
  isEditing: boolean;
  isSaving: boolean;
  editedCoachNote: string;
  onCoachNoteChange: (value: string) => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export function CoachNoteEditor({
  studentNote,
  coachNote,
  isEditing,
  isSaving,
  editedCoachNote,
  onCoachNoteChange,
  onStartEditing,
  onCancelEditing,
  onSave,
  onDelete,
}: CoachNoteEditorProps) {
  const hasStudentNote = studentNote && studentNote.trim().length > 0;
  const hasCoachNote = coachNote && coachNote.trim().length > 0;

  return (
    <div className="px-2 pb-2 pt-2 border-t bg-gray-50">
      {/* 학생 노트 표시 */}
      {hasStudentNote && (
        <div className="mb-2 text-xs bg-white p-2 rounded border border-gray-200">
          <div className="flex items-center gap-1.5 text-gray-600 mb-1">
            <User className="w-3.5 h-3.5" />
            <span className="font-medium">학생 노트</span>
          </div>
          <div className="text-gray-700 pl-5">
            {studentNote}
          </div>
        </div>
      )}

      {isEditing ? (
        // 편집 모드
        <div className="space-y-2">
          <div className="bg-white rounded border border-gray-200">
            <div className="flex items-center gap-1.5 px-3 pt-2 pb-1 text-xs text-blue-700 border-b border-gray-200">
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="font-medium">코치 노트 작성</span>
            </div>
            <Textarea
              value={editedCoachNote}
              onChange={(e) => onCoachNoteChange(e.target.value)}
              placeholder="코치 코멘트를 입력하세요..."
              className="text-sm min-h-24 bg-white border-0 rounded-t-none"
              maxLength={500}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {editedCoachNote.length}/500
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onCancelEditing}
                disabled={isSaving}
                className="h-7 text-xs"
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className="h-7 text-xs"
              >
                {isSaving ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        </div>
      ) : hasCoachNote ? (
        // 코멘트가 있는 경우: 표시 + 편집/삭제 버튼
        <div className="bg-white rounded border border-blue-200">
          <div className="flex items-center gap-1.5 px-3 pt-2 pb-1 text-xs text-blue-700 border-b border-blue-200">
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="font-medium">코치 노트</span>
          </div>
          <div className="flex items-start justify-between gap-2 p-3">
            <div className="flex-1 text-xs text-blue-800">
              {coachNote}
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={onStartEditing}
                disabled={isSaving}
                className="h-7 w-7 p-0"
                title="편집"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                disabled={isSaving}
                className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                title="삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // 코멘트가 없는 경우: 생성하기 버튼
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>코치 노트가 없습니다.</span>
          </div>
          <Button
            size="sm"
            onClick={onStartEditing}
            disabled={isSaving}
            className="h-7 text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            작성
          </Button>
        </div>
      )}
    </div>
  );
}

