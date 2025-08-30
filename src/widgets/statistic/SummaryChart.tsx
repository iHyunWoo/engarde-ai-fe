import type {TechniqueStat} from "@ihyunwoo/engarde-ai-api-sdk/structures";
import {Card, CardContent, CardHeader, CardTitle} from '@/widgets/common/Card';
import {PieChart, Pie, Cell, Tooltip} from 'recharts';
import {useEffect, useState} from "react";
import {useIsMobile} from "@/shared/hooks/use-mobile";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57'];

interface SummaryChartProps {
  title: string;
  data: TechniqueStat[];
}

export function SummaryChart({title, data}: SummaryChartProps) {
  const isMobile = useIsMobile();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`flex ${isMobile ? "flex-col items-center" : "flex-row items-center"} justify-center`}
        >
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={false}
              label={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.id}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip/>
          </PieChart>

          {/* Legend 영역 */}
          <div
            className={`${
              isMobile ?  "mt-4" : "flex flex-col justify-center"
            } text-sm`}
          >
            {data.map((entry, index) => (
              <div key={entry.id} className="flex items-center gap-2 mb-1">
                <div
                  className={`w-3 h-3 ${
                    entry.isMainTechnique ? "rounded-full" : "rounded-sm"
                  }`}
                  style={{backgroundColor: COLORS[index % COLORS.length]}}
                />
                <span className="flex items-center">
                  {entry.name}
                  {entry.isMainTechnique && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-600">
                    Main
                  </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}