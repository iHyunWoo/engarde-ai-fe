import { Input } from '@/widgets/common/Input';
import { Button } from '@/widgets/common/Button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CreateTeamRequest } from '@ihyunwoo/engarde-ai-api-sdk/structures';
import { Counter } from '@/widgets/common/Counter';
import { Label } from '@/widgets/common/Label';

export interface TeamFormProps {
  onSubmit: (team: CreateTeamRequest) => void;
  onCancel?: () => void;
}

export function TeamForm({ onSubmit, onCancel }: TeamFormProps) {
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(10);

  const handleSubmit = () => {
    if (!teamName.trim()) {
      toast.warning('팀 이름을 입력해주세요.');
      return;
    }

    onSubmit({
      name: teamName.trim(),
      description: teamDescription.trim() || undefined,
      maxMembers,
    });

    setTeamName('');
    setTeamDescription('');
    setMaxMembers(10);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="팀 이름"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="flex-1"
        />
      </div>
      <div>
        <Input
          placeholder="팀 설명 (선택사항)"
          value={teamDescription}
          onChange={(e) => setTeamDescription(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">최대 인원 수</Label>
        <Counter
          label=""
          count={maxMembers}
          changeCount={(delta) => {
            const newValue = maxMembers + delta;
            if (newValue >= 1) {
              setMaxMembers(newValue);
            }
          }}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit}>
          <Plus className="w-4 h-4 mr-2" />
          생성
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </div>
  );
}

