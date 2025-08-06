import Image from "next/image";
import {formatDate} from "@/shared/lib/format-date";
import Link from "next/link";
import {MatchSummary} from "@/entities/match-summary";

interface MatchListItemProps {
  match: MatchSummary;
}

export function MatchListItem({match}: MatchListItemProps) {
  return (
    <Link
      href={`/matches/${match.id}`}
      className="flex items-center gap-4 p-4 border rounded-md shadow-sm hover:shadow-md transition"
    >
      {match.thumbnailUrl && (
        <Image
          src={match.thumbnailUrl}
          alt={match.tournamentName}
          className="w-28 h-16 object-cover rounded"
          width={200}
          height={100}
        />
      )}

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-xl">{match.tournamentName}</h3>
        <p className="font-medium truncate text-gray-800">
          vs {match.opponentName}({match.opponentTeam})
        </p>
        <p className="text-sm text-gray-500">
          Score: {match.myScore} - {match.opponentScore}
        </p>
      </div>

      <p>{formatDate(match.tournamentDate)}</p>
    </Link>
  )
}