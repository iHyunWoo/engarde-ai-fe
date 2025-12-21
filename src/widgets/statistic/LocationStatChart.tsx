"use client"

import {Card, CardContent, CardHeader, CardTitle} from '@/widgets/common/Card';
import {LocationStat} from "@ihyunwoo/engarde-ai-api-sdk/structures";
import {FencingPiste} from "@/widgets/marking/FencingPiste";
import {useState, useMemo} from "react";
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend} from 'recharts';

interface LocationStatChartProps {
  data?: LocationStat[];
}

export function LocationStatChart({ data }: LocationStatChartProps) {
  const [isLeftPosition, setIsLeftPosition] = useState(true);
  const hasData = data && data.length > 0;

  // 위치별 데이터를 맵으로 변환 (1-6)
  const locationMap = useMemo(() => {
    if (!hasData || !data) return new Map<number, LocationStat>();
    const map = new Map<number, LocationStat>();
    data.forEach(stat => {
      if (stat.location >= 1 && stat.location <= 6) {
        map.set(stat.location, stat);
      }
    });
    return map;
  }, [hasData, data]);

  // 차트용 데이터 준비 (1-6 위치)
  const chartData = useMemo(() => {
    const result = [];
    for (let i = 1; i <= 6; i++) {
      const stat = locationMap.get(i);
      result.push({
        location: isLeftPosition ? i : (7 - i),
        winCount: stat?.winCount || 0,
        loseCount: stat?.loseCount || 0,
        total: (stat?.winCount || 0) + (stat?.loseCount || 0),
        winRate: stat && (stat.winCount + stat.loseCount) > 0 
          ? Math.round((stat.winCount / (stat.winCount + stat.loseCount)) * 100) 
          : 0,
      });
    }
    return result;
  }, [locationMap, isLeftPosition]);

  // 가장 많이 사용된 위치 찾기 (승리+패배 합계 기준)
  const mostUsedLocation = useMemo(() => {
    let maxTotal = 0;
    let maxLocation = 0;
    chartData.forEach(item => {
      if (item.total > maxTotal) {
        maxTotal = item.total;
        maxLocation = item.location;
      }
    });
    return maxLocation;
  }, [chartData]);

  // 차트에서 위치 선택 시 피스트에도 반영 (선택 가능하지 않지만 강조)
  const selectedLocation = mostUsedLocation > 0 ? mostUsedLocation : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Location Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-6">
            {/* 피스트 시각화 */}
            <div className="flex justify-center px-4">
              <div className="w-full max-w-[50rem]">
                <FencingPiste
                  readOnly={true}
                  showDirectionToggle={false}
                />
              </div>
            </div>

            {/* 승리/패배 선 그래프 */}
            <div className="flex justify-center px-4 mr-10">
              <div className="w-full max-w-[40rem] h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={chartData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="location" 
                    label={{ value: 'Location', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => Math.round(value).toString()}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'winCount') return [`${value}`, 'Wins'];
                      if (name === 'loseCount') return [`${value}`, 'Losses'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Location ${label}`}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                  />
                  <Legend 
                    formatter={(value) => {
                      if (value === 'winCount') return 'Wins';
                      if (value === 'loseCount') return 'Losses';
                      return value;
                    }}
                    align="center"
                    wrapperStyle={{ paddingLeft: '40px', paddingTop: '10px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="winCount" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="winCount"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="loseCount" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="loseCount"
                  />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 flex items-center justify-center text-gray-500">
            <p>No data to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

