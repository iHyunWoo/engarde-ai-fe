"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
} from "recharts";
import type {TechniquesByMatch} from "@ihyunwoo/engarde-ai-api-sdk/structures";
import {Card, CardContent, CardHeader} from "@/widgets/common/Card";
import {CHART_COLORS} from "@/app/features/statistic/constants/chart-colors";

interface TechniquesByMatchChartProps {
  techniques: TechniquesByMatch;
}

export function TechniquesByMatchChart({
                                         techniques,
                                       }: TechniquesByMatchChartProps) {
  const {match, summary} = techniques;

  const formatScore = () => `${match.myScore} : ${match.opponentScore}`;
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getResultBadge = () => {
    if (match.myScore > match.opponentScore) {
      return (
        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
        Win
      </span>
      );
    }
    if (match.myScore < match.opponentScore) {
      return (
        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">
        Lose
      </span>
      );
    }
    return (
      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
      Draw
    </span>
    );
  };

  const ChartBlock = ({
                        title,
                        data,
                      }: {
    title: string;
    data: TechniquesByMatch["summary"]["win"];
  }) => (
    <div className="flex flex-col items-center w-[220px]">
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      {data.length === 0 ? (
        <p className="text-sm text-gray-400">No data</p>
      ) : (
        <>
          <PieChart width={160} height={160}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={65}
              labelLine={false}
              label={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.id}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip/>
          </PieChart>

          <div className="mt-2 text-sm">
            {data.slice(0, 3).map((entry, index) => (
              <div key={entry.id} className="flex items-center gap-2 mb-1">
                <div
                  className={`w-3 h-3 ${
                    entry.isMainTechnique ? "rounded-full" : "rounded-sm"
                  }`}
                  style={{backgroundColor: CHART_COLORS[index % CHART_COLORS.length]}}
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
            {data.length > 3 && (
              <p className="text-xs text-gray-400 mt-1">
                + {data.length - 3} more
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-6xl mx-auto h-[448px]">
      <CardHeader>
        <div className="flex flex-col justify-center text-sm">
          <h3 className="font-bold text-xl">{match.tournamentName}</h3>
          <div className="mt-1">
            <span className="font-semibold">Date:</span>{" "}
            {formatDate(match.tournamentDate)}
          </div>
          <div className="mt-1">
            <span className="font-semibold">Opponent:</span>{" "}
            {match.opponent?.name} ({match.opponent?.team})
          </div>
          <div className="mt-1">
            <span className="font-semibold">Score:</span>{" "}
            {formatScore()} <span className="ml-1">{getResultBadge()}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-row justify-center gap-12">
          <ChartBlock title="Win Techniques" data={summary.win}/>
          <ChartBlock title="Lose Techniques" data={summary.lose}/>
        </div>
      </CardContent>
    </Card>
  );
}