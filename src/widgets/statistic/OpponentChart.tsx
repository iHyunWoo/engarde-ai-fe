"use client"

import {BarChart, ResponsiveContainer, YAxis, XAxis, Tooltip, Bar, Cell} from "recharts";
import {GetMatchListResponse, OpponentStat} from "@ihyunwoo/engarde-ai-api-sdk/structures";
import {useState} from "react";
import {getMatchListByOpponent} from "@/app/features/match/api/get-match-list-by-opponent";
import {MatchByOpponentModal} from "@/widgets/Match/MatchByOpponentModal";
import {Button} from "@/widgets/common/Button";
import {toast} from "sonner";
import {CHART_COLORS} from "@/app/features/statistic/constants/chart-colors";

interface OpponentChartProps {
  opponent: OpponentStat
}

export function OpponentChart({opponent}: OpponentChartProps) {
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState<GetMatchListResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    const result = await getMatchListByOpponent(opponent.opponent.id);
    if (!result.data) {
      toast.error(result.message);
    } else {
      setMatches(result.data);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-start gap-6 rounded-2xl border bg-white p-4 shadow-sm min-w-[800px]">
      {/* Opponent Info */}
      <div className="w-48 shrink-0">
        <Button
          variant="ghost"
          className="text-lg font-bold mb-2 underline"
          onClick={() => handleOpen()}
        >
          {opponent.opponent.name} ({opponent.opponent.team})
        </Button>
        <div className="text-sm text-gray-600 mb-1">
          {opponent.wins} wins / {opponent.loses} losses
        </div>
        <div className="text-sm text-gray-600">
          <div className="mb-1">
            Preliminary
            Avg: {opponent.averageScore.preliminary.myScore} : {opponent.averageScore.preliminary.opponentScore}
          </div>
          <div>
            Main Avg: {opponent.averageScore.main.myScore} : {opponent.averageScore.main.opponentScore}
          </div>
        </div>
      </div>

      {/* Win Tactics Chart */}
      <div className="flex-1 items-center justify-center flex flex-col">
        <div className="text-sm font-medium mb-1">Win Tactics</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart
            layout="vertical"
            data={opponent.topWinTechniques}
            margin={{top: 5, right: 10, left: 0, bottom: 5}}
          >
            <XAxis type="number" hide/>
            <YAxis dataKey="name" type="category" width={100}/>
            <Tooltip/>
            <Bar dataKey="count">
              {opponent.topWinTechniques.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isMainTechnique ? CHART_COLORS[0] : CHART_COLORS[1]}
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Lose Tactics Chart */}
      <div className="flex-1 items-center justify-center flex flex-col">
        <div className="text-sm font-medium mb-1">Lose Tactics</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart
            layout="vertical"
            data={opponent.topLoseTechniques}
            margin={{top: 5, right: 10, left: 0, bottom: 5}}
          >
            <XAxis type="number" hide/>
            <YAxis dataKey="name" type="category" width={100}/>
            <Tooltip/>
            <Bar dataKey="count">
              {opponent.topLoseTechniques.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isMainTechnique ? CHART_COLORS[0] : CHART_COLORS[1]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <MatchByOpponentModal
        open={open}
        setOpen={setOpen}
        loading={loading}
        opponent={opponent.opponent}
        matches={matches}
      />
    </div>
  );
}