import {BarChart, ResponsiveContainer, YAxis, XAxis, Tooltip, Bar} from "recharts";
import {OpponentStat} from "@ihyunwoo/engarde-ai-api-sdk/structures";

interface OpponentChartProps {
  opponent: OpponentStat
}

export function OpponentChart({ opponent }: OpponentChartProps) {
  return (
    <div className="flex items-start gap-6 rounded-2xl border bg-white p-4 shadow-sm min-w-[800px]">
      {/* Opponent Info */}
      <div className="w-48 shrink-0">
        <h3 className="text-lg font-bold mb-2">
          {opponent.opponent.name} ({opponent.opponent.team})
        </h3>
        <div className="text-sm text-gray-600 mb-1">
          {opponent.wins} wins / {opponent.loses} losses
        </div>
        <div className="text-sm text-gray-600">
          <div className="mb-1">
            Preliminary Avg: {opponent.averageScore.preliminary.myScore} : {opponent.averageScore.preliminary.opponentScore}
          </div>
          <div>
            Main Avg: {opponent.averageScore.main.myScore} : {opponent.averageScore.main.opponentScore}
          </div>
        </div>
      </div>

      {/* Win Techniques Chart */}
      <div className="flex-1 items-center justify-center flex flex-col">
        <div className="text-sm font-medium mb-1">My Techniques (Win)</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart
            layout="vertical"
            data={opponent.topWinTechniques}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Lose Techniques Chart */}
      <div className="flex-1 items-center justify-center flex flex-col">
        <div className="text-sm font-medium mb-1">Opponent Techniques (Lose)</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart
            layout="vertical"
            data={opponent.topLoseTechniques}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}