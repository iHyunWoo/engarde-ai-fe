import {Card, CardContent, CardHeader} from "@/widgets/common/Card";
import { Clock } from "lucide-react";
import {Badge} from "@/widgets/common/Badge";


const mockMarkings = [
  { id: 1, time: '00:15', actor: 'me', type: 'attack', detail: '직선 공격', result: 'win' },
  { id: 2, time: '00:23', actor: 'opponent', type: 'attack', detail: '안쪽 찌르기', result: 'lose' },
  { id: 3, time: '00:51', actor: 'me', type: 'defense', detail: '백스텝 후 반격', result: 'win' },
];

export function MatchTimelineSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-slate-600" />
          <h2 className="text-xl font-semibold text-slate-900">Timeline</h2>
        </div>
        <p className="text-sm text-slate-600">경기 중 주요 마킹 기록</p>
      </CardHeader>

      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200"></div>

          <div className="space-y-6">
            {mockMarkings.map((mark, index) => (
              <div key={mark.id} className="relative flex items-start space-x-6">
                {/* Timeline dot */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white ${
                  mark.actor === 'me' ? 'border-blue-500' : 'border-red-500'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    mark.actor === 'me' ? 'bg-blue-500' : 'bg-red-500'
                  }`} />
                </div>

                {/* Content */}
                <div className={`flex-1 min-w-0 ${
                  mark.actor === 'opponent' ? 'text-right' : ''
                }`}>
                  <div className={`inline-block max-w-md p-4 rounded-lg border ${
                    mark.actor === 'me'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={mark.actor === 'me' ? 'default' : 'secondary'}>
                        {mark.actor === 'me' ? '나의 마킹' : '상대 마킹'}
                      </Badge>
                      <Badge variant={mark.result === 'win' ? 'success' : 'destructive'}>
                        {mark.result === 'win' ? '득점' : '실점'}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-700 mb-2 leading-relaxed">
                      {mark.detail}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{mark.time}</span>
                      <span>·</span>
                      <span className="font-medium">{mark.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}