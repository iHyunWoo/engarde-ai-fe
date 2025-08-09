import {Card, CardContent, CardHeader} from "@/widgets/common/Card";
import {Button} from "@/widgets/common/Button";
import {Activity, Calendar, Edit2, Shield, Trophy, User, Users, Zap} from "lucide-react";
import {getMatch} from "@/app/features/match/api/get-match";
import {formatDate} from "@/shared/lib/format-date";
import {headers} from "next/headers";
import Link from "next/link";

interface MatchInfoSectionProps {
  id: number;
}

export async function MatchInfoSection({id}: MatchInfoSectionProps) {
  const header = await headers()
  const cookie = header.get('cookie')
  const response = await getMatch(id, cookie ?? "");

  if (!response || response.code !== 200 || !response.data) {
    return null;
  }

  const match = response.data;

  const topStats = [
    {label: "Date", value: formatDate(match.tournamentDate), icon: Calendar},
    {label: "Score", value: `${match.myScore} : ${match.opponentScore}`, icon: Trophy},
  ];

  const bottomStats = [
    {label: "Attack", value: match.attackAttemptCount},
    {label: "Parry", value: match.parryAttemptCount},
    {label: "Counter Attack", value: match.counterAttackAttemptCount},
  ];

  return (
    <Card className="relative">
      <CardHeader className="pb-4">

        <div className="absolute top-6 right-6 flex gap-2">
          <Button variant="outline" size="sm">
            <Edit2 className="w-4 h-4 mr-2"/>
            편집
          </Button>
          <Link href={`/marking/${id}`}>
            <Button size="sm">
              마킹하러 가기
            </Button>
          </Link>

        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {match.tournamentName}
          </h1>
          <p className="text-slate-600">vs {match.opponentName}({match.opponentTeam})</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Top row: Date & Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topStats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-slate-300 to-slate-200"/>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-slate-50 p-2">
                      <Icon className="h-5 w-5 text-slate-600"/>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        {s.label}
                      </p>
                      <p className="truncate text-lg font-semibold text-slate-900">
                        {String(s.value)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom row: Attempts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {bottomStats.map((s, i) => {
              return (
                <div
                  key={i}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center justify-center rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600 border border-slate-200">
                        {s.label}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-bold text-slate-900">
                    {s.value}
                  </span>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}