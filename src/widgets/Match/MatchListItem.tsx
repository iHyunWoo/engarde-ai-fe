import {formatDate} from "@/shared/lib/format-date";
import Link from "next/link";
import {GetMatchListResponse} from "@ihyunwoo/engarde-ai-api-sdk/structures";

interface MatchListItemProps {
  match: GetMatchListResponse;
  href?: string;
}

export function MatchListItem({match, href}: MatchListItemProps) {
  const defaultHref = `/matches/${match.id}`;
  const finalHref = href || defaultHref;

  return (
    <Link
      href={finalHref}
      className="flex items-center gap-4 p-4 border rounded-md shadow-sm hover:shadow-md transition"
    >
      {/*{match.thumbnailUrl && (*/}
      {/*  <Image*/}
      {/*    src={match.thumbnailUrl}*/}
      {/*    alt={match.tournamentName}*/}
      {/*    className="w-28 h-16 object-cover rounded"*/}
      {/*    width={200}*/}
      {/*    height={100}*/}
      {/*  />*/}
      {/*)}*/}

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-xl">{match.tournamentName}</h3>
        <p className="font-medium truncate text-gray-800">
          vs {match.opponent?.name}({match.opponent?.team})
        </p>
        <p className="text-sm text-gray-500">
          Score: {match.myScore} - {match.opponentScore}
        </p>
      </div>

      <p>{formatDate(match.tournamentDate)}</p>
    </Link>
  )
}