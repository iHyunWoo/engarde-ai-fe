"use client"

import {useState, useMemo} from "react";
import {Card, CardContent, CardHeader, CardTitle} from '@/widgets/common/Card';
import {cn} from "@/shared/lib/utils";
import {TacticMatchupDetail} from "@ihyunwoo/engarde-ai-api-sdk/structures";

interface TacticSynergyMatrixProps {
  data?: TacticMatchupDetail[];
}

interface TacticInfo {
  id: number;
  name: string;
  isMain: boolean;
  parentId?: number | null;
}

export function TacticSynergyMatrix({ data }: TacticSynergyMatrixProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [expandedCols, setExpandedCols] = useState<Set<number>>(new Set());

  const hasData = data && data.length > 0;

  // Main tactics만 추출 (isMain이 true이고 parentId가 없는 것들)
  const mainTactics = useMemo(() => {
    if (!hasData || !data) return [];
    const mainIds = new Set<number>();
    data.forEach(matchup => {
      if (matchup.myTactic.isMain && !matchup.myTactic.parentId) {
        mainIds.add(matchup.myTactic.id);
      }
      if (matchup.opponentTactic.isMain && !matchup.opponentTactic.parentId) {
        mainIds.add(matchup.opponentTactic.id);
      }
    });
    
    const tactics: TacticInfo[] = [];
    mainIds.forEach(id => {
      const matchup = data.find(m => m.myTactic.id === id || m.opponentTactic.id === id);
      if (matchup) {
        const tactic = matchup.myTactic.id === id ? matchup.myTactic : matchup.opponentTactic;
        tactics.push(tactic);
      }
    });
    
    return tactics;
  }, [hasData, data]);

  // Main tactic의 sub tactics 가져오기 (subMatchups 포함)
  const getSubTactics = (mainTacticId: number): TacticInfo[] => {
    if (!hasData || !data) return [];
    const subTactics: TacticInfo[] = [];
    const seen = new Set<number>();
    
    const checkMatchup = (matchup: TacticMatchupDetail) => {
      if (matchup.myTactic.parentId === mainTacticId && !seen.has(matchup.myTactic.id)) {
        subTactics.push(matchup.myTactic);
        seen.add(matchup.myTactic.id);
      }
      if (matchup.opponentTactic.parentId === mainTacticId && !seen.has(matchup.opponentTactic.id)) {
        subTactics.push(matchup.opponentTactic);
        seen.add(matchup.opponentTactic.id);
      }
    };
    
    data.forEach(matchup => {
      checkMatchup(matchup);
      // subMatchups도 확인
      if (matchup.subMatchups && matchup.subMatchups.length > 0) {
        matchup.subMatchups.forEach(subMatchup => {
          checkMatchup(subMatchup);
        });
      }
    });
    
    return subTactics;
  };

  const rowTactics = useMemo(() => {
    const result: TacticInfo[] = [];
    
    mainTactics.forEach(tactic => {
      result.push(tactic);
      if (expandedRows.has(tactic.id)) {
        const subTactics = getSubTactics(tactic.id);
        result.push(...subTactics);
      }
    });
    
    return result;
  }, [mainTactics, expandedRows, hasData, data]);

  const colTactics = useMemo(() => {
    const result: TacticInfo[] = [];
    
    mainTactics.forEach(tactic => {
      result.push(tactic);
      if (expandedCols.has(tactic.id)) {
        const subTactics = getSubTactics(tactic.id);
        result.push(...subTactics);
      }
    });
    
    return result;
  }, [mainTactics, expandedCols, hasData, data]);

  const toggleRowExpansion = (tacticId: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(tacticId)) {
        next.delete(tacticId);
      } else {
        next.add(tacticId);
      }
      return next;
    });
  };

  const toggleColExpansion = (tacticId: number) => {
    setExpandedCols(prev => {
      const next = new Set(prev);
      if (next.has(tacticId)) {
        next.delete(tacticId);
      } else {
        next.add(tacticId);
      }
      return next;
    });
  };

  // 모든 매치업을 평탄하게 만들기 (subMatchups 포함)
  const allMatchups = useMemo(() => {
    if (!hasData || !data) return [];
    const result: TacticMatchupDetail[] = [];
    
    data.forEach(matchup => {
      result.push(matchup);
      // subMatchups도 추가
      if (matchup.subMatchups && matchup.subMatchups.length > 0) {
        result.push(...matchup.subMatchups);
      }
    });
    
    return result;
  }, [hasData, data]);

  const getMatchup = (rowTacticId: number, colTacticId: number): TacticMatchupDetail | null => {
    if (!hasData || allMatchups.length === 0) return null;
    
    // 직접 매치업 찾기 (단방향만)
    const matchup = allMatchups.find(
      m => m.myTactic.id === rowTacticId && m.opponentTactic.id === colTacticId
    );
    
    return matchup || null;
  };

  const getTacticDisplayName = (tactic: TacticInfo, isMain: boolean) => {
    if (isMain) {
      const subCount = getSubTactics(tactic.id).length;
      return `${tactic.name}${subCount > 0 ? ` (${subCount})` : ''}`;
    }
    return tactic.name;
  };

  const isMainTactic = (tactic: TacticInfo) => {
    return tactic.isMain && !tactic.parentId;
  };

  // 펼쳐진 행/열이 있는지 확인
  const hasExpandedRowsOrCols = expandedRows.size > 0 || expandedCols.size > 0;

  // 행이 현재 펼쳐진 부분과 관련이 있는지 확인
  const isRowRelevant = (tactic: TacticInfo): boolean => {
    // 아무것도 펼쳐지지 않았으면 모두 관련 있음
    if (expandedRows.size === 0) return true;
    
    // Main tactic이고 펼쳐져 있으면 관련 있음
    if (isMainTactic(tactic) && expandedRows.has(tactic.id)) {
      return true;
    }
    
    // Sub tactic이고 부모가 펼쳐져 있으면 관련 있음
    if (!isMainTactic(tactic) && tactic.parentId && expandedRows.has(tactic.parentId)) {
      return true;
    }
    
    // 그 외는 관련 없음
    return false;
  };

  // 열이 현재 펼쳐진 부분과 관련이 있는지 확인
  const isColRelevant = (tactic: TacticInfo): boolean => {
    // 아무것도 펼쳐지지 않았으면 모두 관련 있음
    if (expandedCols.size === 0) return true;
    
    // Main tactic이고 펼쳐져 있으면 관련 있음
    if (isMainTactic(tactic) && expandedCols.has(tactic.id)) {
      return true;
    }
    
    // Sub tactic이고 부모가 펼쳐져 있으면 관련 있음
    if (!isMainTactic(tactic) && tactic.parentId && expandedCols.has(tactic.parentId)) {
      return true;
    }
    
    // 그 외는 관련 없음
    return false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tactic Matchup Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <table className="border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-0 bg-gray-50 sticky left-0 z-10 min-w-[150px] relative">
                        <div className="relative w-full h-full min-h-[60px]">
                          <div className="absolute inset-0 flex items-end justify-start pl-1 pb-2">
                            <span className="text-xs font-semibold">My Tactic</span>
                          </div>
                          <div className="absolute inset-0 flex items-start justify-end pr-1 pt-2">
                            <span className="text-xs font-semibold">Opponent Tactic</span>
                          </div>
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                            <line 
                              x1="100%" 
                              y1="100%" 
                              x2="0%" 
                              y2="0" 
                              stroke="#e5e7eb" 
                              strokeWidth="1"
                            />
                          </svg>
                        </div>
                      </th>
                      {colTactics.map(colTactic => {
                        const isMain = isMainTactic(colTactic);
                        const isSub = !isMain;
                        const isRelevant = isColRelevant(colTactic);
                        const canExpand = isMain && getSubTactics(colTactic.id).length > 0;
                        return (
                          <th
                            key={colTactic.id}
                            className={cn(
                              "border p-2 bg-gray-50 min-w-[120px] transition-opacity",
                              canExpand && "cursor-pointer hover:bg-gray-100 transition-colors",
                              isSub && "bg-gray-200",
                              hasExpandedRowsOrCols && !isRelevant && "opacity-30"
                            )}
                            onClick={() => canExpand && toggleColExpansion(colTactic.id)}
                          >
                            <div className={cn(
                              "flex items-center justify-center gap-1",
                              isSub && "flex-col"
                            )}>
                              <span className={cn(
                                isMain && "font-semibold",
                                isSub && "text-xs text-gray-700"
                              )}>
                                {getTacticDisplayName(colTactic, isMain)}
                              </span>
                              {isMain && getSubTactics(colTactic.id).length > 0 && (
                                <span className="text-xs">
                                  {expandedCols.has(colTactic.id) ? '▼' : '▶'}
                                </span>
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {rowTactics.map(rowTactic => {
                      const isMainRow = isMainTactic(rowTactic);
                      const isSubRow = !isMainRow;
                      const isRowRelevantToFocus = isRowRelevant(rowTactic);
                      const canExpandRow = isMainRow && getSubTactics(rowTactic.id).length > 0;
                      return (
                        <tr 
                          key={rowTactic.id}
                          className={cn(
                            hasExpandedRowsOrCols && !isRowRelevantToFocus && "opacity-30"
                          )}
                        >
                          <td
                            className={cn(
                              "border p-2 bg-gray-50 sticky left-0 z-10 font-medium transition-opacity",
                              canExpandRow && "cursor-pointer hover:bg-gray-100 transition-colors",
                              isSubRow && "bg-gray-200",
                              hasExpandedRowsOrCols && !isRowRelevantToFocus && "opacity-30"
                            )}
                            onClick={() => canExpandRow && toggleRowExpansion(rowTactic.id)}
                          >
                            <div className={cn(
                              "flex items-center gap-2",
                              isSubRow && "pl-6"
                            )}>
                              <span className={cn(
                                isMainRow && "font-semibold",
                                isSubRow && "text-sm text-gray-700"
                              )}>
                                {getTacticDisplayName(rowTactic, isMainRow)}
                              </span>
                              {isMainRow && getSubTactics(rowTactic.id).length > 0 && (
                                <span className="text-xs ml-auto">
                                  {expandedRows.has(rowTactic.id) ? '▼' : '▶'}
                                </span>
                              )}
                            </div>
                          </td>
                          {colTactics.map(colTactic => {
                            const matchup = getMatchup(rowTactic.id, colTactic.id);
                            const winRate = matchup?.winRate ?? null;
                            const isColRelevantToFocus = isColRelevant(colTactic);
                            const isCellRelevant = isRowRelevantToFocus && isColRelevantToFocus;
                            
                            return (
                              <td
                                key={`${rowTactic.id}-${colTactic.id}`}
                                className={cn(
                                  "border p-2 text-center transition-colors",
                                  winRate !== null && "cursor-pointer hover:bg-blue-50",
                                  winRate !== null && winRate >= 60 && "bg-green-50",
                                  winRate !== null && winRate < 60 && winRate >= 40 && "bg-yellow-50",
                                  winRate !== null && winRate < 40 && "bg-red-50",
                                  hasExpandedRowsOrCols && !isCellRelevant && "opacity-30"
                                )}
                                title={matchup ? `${matchup.winCount}W/${matchup.winCount + matchup.loseCount}L` : undefined}
                              >
                                {winRate !== null && matchup ? (
                                  <div className="flex flex-col items-center">
                                    <span className="text-sm font-semibold">
                                      {parseInt(winRate.toString())}%
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ({matchup.winCount}/{matchup.winCount + matchup.loseCount})
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border border-green-200" />
                <span>Win Rate ≥ 60%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-50 border border-yellow-200" />
                <span>Win Rate 40-60%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border border-red-200" />
                <span>Win Rate &lt; 40%</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              * Click Main Tactic to expand Sub Tactics (펼친 부분만 강조됩니다)
            </div>
          </>
        ) : (
          <div className="py-12 flex items-center justify-center text-gray-500">
            <p>No data to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
