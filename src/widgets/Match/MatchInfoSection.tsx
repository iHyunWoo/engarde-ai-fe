import {Card, CardContent, CardHeader} from "@/widgets/common/Card";
import {Button} from "@/widgets/common/Button";
import {Activity, Calendar, Edit2, Shield, Trophy, User, Users, Zap} from "lucide-react";
import {getMatch} from "@/app/features/match/api/get-match";
import {formatDate} from "@/shared/lib/format-date";
import {headers} from "next/headers";

interface MatchInfoSectionProps {
  id: number;
}

export async function MatchInfoSection({id}: MatchInfoSectionProps) {
  const header = await headers()
  const cookie = header.get('cookie')
  const response = await getMatch(id, cookie ?? "");
  console.log(response);

  if (!response || response.code !== 200 || !response.data) {
    return null;
  }

  const match = response.data;

  const stats = [
    { label: "날짜", value: formatDate(match.tournamentDate), icon: Calendar },
    { label: "상대 이름", value: match.opponentName, icon: User },
    { label: "상대 팀", value: match.opponentTeam, icon: Users },
    { label: "점수", value: `${match.myScore} vs ${match.opponentScore}`, icon: Trophy },
    { label: "공격 시도", value: match.attackAttemptCount, icon: Zap },
    { label: "수비 시도", value: match.parryAttemptCount, icon: Shield },
    { label: "카운터 시도", value: match.counterAttackAttemptCount, icon: Activity }
  ];

  return (
    <Card className="relative">
      <CardHeader className="pb-4">
        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <Button variant="outline" size="sm">
            <Edit2 className="w-4 h-4 mr-2" />
            편집
          </Button>
          <Button size="sm">
            마킹하러 가기
          </Button>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            2025 Fencing Championship
          </h1>
          <p className="text-slate-600">경기 상세 정보 및 타임라인</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex-shrink-0">
                  <Icon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {String(stat.value)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}