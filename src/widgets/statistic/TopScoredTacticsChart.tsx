"use client"

import {Card, CardContent, CardHeader, CardTitle} from '@/widgets/common/Card';
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid} from 'recharts';
import {CHART_COLORS} from "@/app/features/statistic/constants/chart-colors";
import {TacticScoreStat} from "@ihyunwoo/engarde-ai-api-sdk/structures";

interface TopScoredTacticsChartProps {
  data?: TacticScoreStat[];
}

export function TopScoredTacticsChart({ data }: TopScoredTacticsChartProps) {
  const hasData = data && data.length > 0;
  const sortedData = hasData ? [...data].sort((a, b) => b.count - a.count) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Scoring Tactics</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} times`, 'Scored']}
                    labelStyle={{ color: '#000' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {sortedData.map((entry) => (
                      <Cell
                        key={`cell-${entry.id}`}
                        fill={entry.isMain ? CHART_COLORS[0] : CHART_COLORS[1]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {sortedData.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 ${item.isMain ? "rounded-full" : "rounded-sm"}`}
                    style={{ backgroundColor: item.isMain ? CHART_COLORS[0] : CHART_COLORS[1] }}
                  />
                  <span>{item.name}: {item.count} times</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            <p>No data to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
