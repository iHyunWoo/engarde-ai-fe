import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle} from "@/widgets/common/Dialog";
import {formatDate} from "@/shared/lib/format-date";
import {GetMatchListResponse, OpponentResponse} from "@ihyunwoo/engarde-ai-api-sdk/structures";
import {Button} from "@/widgets/common/Button";
import Link from "next/link";
import {ChevronRight} from "lucide-react";

interface MatchByOpponentModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
  opponent: OpponentResponse;
  matches: GetMatchListResponse[]
}

export function MatchByOpponentModal({
                                       open,
                                       setOpen,
                                       loading,
                                       opponent,
                                       matches,
                                     }: MatchByOpponentModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="max-w-3xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="border-b px-4 py-3 flex flex-row items-center justify-between">
          <DialogTitle>Matches with {opponent.name}</DialogTitle>
          <DialogClose asChild>
            <Button size="sm" variant="outline" className="text-black hover:text-black">
              Close
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="overflow-auto max-h-[70vh]">
          {matches.length === 0 && !loading ? (
            <Empty />
          ) : (
            <ul className="divide-y w-full">
              {matches.map((match) => (
                <li
                  key={match.id}
                  className="w-full px-4 py-3"
                >
                  <Link
                    href={`/matches/${match.id}`}
                    className="flex w-full items-center gap-4 p-4 rounded-md hover:shadow-sm transition"
                  >
                    <div className="w-full flex-1">
                      <h3 className="font-bold text-xl">{match.tournamentName}</h3>
                      <p className="font-medium truncate text-gray-800">
                        vs {match.opponent?.name} ({match.opponent?.team})
                      </p>
                      <p className="text-sm text-gray-500">
                        Score: {match.myScore} - {match.opponentScore}
                      </p>
                    </div>

                    <p>{formatDate(match.tournamentDate)}</p>
                    <ChevronRight />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Empty() {
  return (
    <div className="py-16 text-center text-sm text-gray-500">
      No matches.
    </div>
  )
}