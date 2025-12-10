'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/widgets/common/Card';
import { Button } from '@/widgets/common/Button';
import { Calendar, Edit2, Trophy } from 'lucide-react';
import { formatDate } from '@/shared/lib/format-date';
import Link from 'next/link';
import { Match } from '@/entities/match';
import { Textarea } from '@/widgets/common/Textarea';
import { useUserInfo } from '@/app/features/auth/hooks/use-user-info';
import { useUpdateCoachMatchFeedback } from '@/app/features/coach/hooks/use-update-coach-match-feedback';

interface MatchInfoSectionProps {
  match: Match;
  onCoachFeedbackChange?: (feedback: string | null) => void;
  studentId?: string | number;
}

export function MatchInfoSection({ match, onCoachFeedbackChange, studentId }: MatchInfoSectionProps) {
  const { hasRole } = useUserInfo();

  const isCoach = hasRole(['COACH']);

  const [note, setNote] = useState(match.coachFeedback ?? '');
  const [draft, setDraft] = useState(match.coachFeedback ?? '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const nextValue = match.coachFeedback ?? '';
    setNote(nextValue);
    setDraft(nextValue);
    setIsEditing(false);
  }, [match.id, match.coachFeedback]);

  const { mutate, isPending: isSaving } = useUpdateCoachMatchFeedback({
    matchId: match.id,
    onSuccess: (feedback) => {
      const normalized = feedback ?? '';
      setNote(normalized);
      setDraft(normalized);
      setIsEditing(false);
      onCoachFeedbackChange?.(feedback);
    },
  });

  const markingHref = studentId !== undefined && isCoach
    ? `/my-team/students/${studentId}/markings/${match.id}`
    : `/marking/${match.id}`;

  

  const topStats = [
    { label: 'Date', value: formatDate(match.tournamentDate), icon: Calendar },
    { label: 'Score', value: `${match.myScore} : ${match.opponentScore}`, icon: Trophy },
  ];

  const handleCancelEdit = () => {
    setDraft(note);
    setIsEditing(false);
  };

  const handleSave = () => {
    mutate(draft);
  };

  const emptyMessage = isCoach
    ? 'No coach note yet. Use the button above to add one.'
    : 'No coach note has been added yet.';

  return (
    <Card className="relative">
      <CardHeader className="pb-4">
        <div className="absolute top-6 right-6 flex gap-2">
          {!isCoach && (
            <Link href={`/matches/edit/${match.id}`}>
              <Button variant="outline" size="sm">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          )}
          <Link href={markingHref}>
            <Button size="sm">Go to Marking</Button>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {match.tournamentName}
          </h1>
          <p className="text-slate-600">vs {match.opponent?.name}({match.opponent?.team})</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {topStats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-slate-300 to-slate-200" />
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-slate-50 p-2">
                      <Icon className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        {s.label}
                      </p>
                      <p className="truncate text-lg font-semibold text-slate-900">{String(s.value)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-700">Coach Note</h3>
              {isCoach && !isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  {note ? 'Edit Note' : 'Add Note'}
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="mt-3 space-y-3">
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={4}
                  placeholder="Write your coaching notes here..."
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
                {note ? note : emptyMessage}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
