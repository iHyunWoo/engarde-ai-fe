"use client"

import React, {useState} from 'react';
import {Button} from '@/widgets/common/Button';
import {Input} from '@/widgets/common/Input';
import {Label} from '@/widgets/common/Label';
import {Card, CardContent, CardHeader, CardTitle} from '@/widgets/common/Card';
import {Upload} from 'lucide-react';
import {MatchData} from "@/app/features/match/hooks/use-match-form";
import {useSuggestions} from "@/shared/hooks/use-suggestion";
import {getOpponentSuggest} from "@/app/features/opponent/api/get-opponent-suggest";
import {OpponentResponse} from "@ihyunwoo/engarde-ai-api-sdk/structures";

interface MatchInfoSectionProps {
  matchData: MatchData;
  uploading: boolean;
  onUpdateMatchData: (field: keyof MatchData, value: unknown) => void;
  onUpload: () => void;
}

export default function MatchInfoForm({
                                        matchData,
                                        uploading,
                                        onUpdateMatchData,
                                        onUpload,
                                      }: MatchInfoSectionProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSuggest = async (query: string) => {
    const result = await getOpponentSuggest(query);
    return { data: result.data ?? [] };
  }

  const handleSelectSuggestion = (suggestion: OpponentResponse) => {
    onUpdateMatchData('opponentName', suggestion.name);
    onUpdateMatchData('opponentTeam', suggestion.team);
    setQuery('');
    setFocused(false);
  };

  const { suggestions } = useSuggestions(query, handleSuggest, focused, { minChars: 1 })

  return (
    <Card className="shadow-md border-0 bg-white/80 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-800">Match Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tournamentName" className="text-sm font-medium text-gray-700">
            Tournament Name
          </Label>
          <Input
            id="tournamentName"
            value={matchData.tournamentName}
            onChange={(e) => onUpdateMatchData('tournamentName', e.target.value)}
            className="border-gray-300 focus:border-gray-600 focus:ring-gray-400"
            placeholder="Enter tournament name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tournamentDate" className="text-sm font-medium text-gray-700">
            Tournament Date
          </Label>
          <div>
            <input
              id="tournamentDate"
              type="date"
              value={matchData.tournamentDate
                ? new Date(matchData.tournamentDate).toISOString().split('T')[0]
                : ''}
              onChange={(e) => onUpdateMatchData('tournamentDate', e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-600 bg-white"
              style={{WebkitAppearance: 'none'}}
            />
          </div>
        </div>

        {/* Opponent Input */}
        <div className="space-y-4">
          {/* Suggest Field */}
          <div className="space-y-2 relative">
            <Label htmlFor="opponentSuggestion" className="text-sm font-medium text-gray-700">
              Opponent Search
            </Label>
            <Input
              id="opponentSuggestion"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder="Search opponent"
              className="border-gray-300 focus:border-gray-600 focus:ring-gray-400"
            />
            {focused && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-md max-h-40 overflow-auto">
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                  >
                    {item.name} <span className="text-gray-400">({item.team})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Inputs */}
          <div className="space-y-2 ml-2 pl-3 border-l border-gray-200">
            <div>
              <Label htmlFor="opponentName" className="text-xs text-gray-500">
                Name
              </Label>
              <Input
                id="opponentName"
                value={matchData.opponentName}
                onChange={(e) => onUpdateMatchData('opponentName', e.target.value)}
                className="border-gray-200 focus:border-gray-400 focus:ring-gray-300 text-sm"
                placeholder="Enter opponent name"
              />
            </div>

            <Label htmlFor="opponentTeam" className="text-xs text-gray-500">
              Team
            </Label>
            <div>
              <Input
                id="opponentTeam"
                value={matchData.opponentTeam}
                onChange={(e) => onUpdateMatchData('opponentTeam', e.target.value)}
                className="border-gray-200 focus:border-gray-400 focus:ring-gray-300 text-sm"
                placeholder="Enter opponent team"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Score</Label>

          <div className="flex items-center gap-2">
            {/* 내 점수 */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">You</span>
              <Input
                type="number"
                min={0}
                value={matchData.myScore}
                onChange={(e) =>
                  onUpdateMatchData('myScore', Number(e.target.value))
                }
                className="w-20 text-center border-gray-300 focus:border-gray-600 focus:ring-gray-400"
              />
            </div>

            <span className="text-xl font-semibold text-gray-600">:</span>

            {/* 상대 점수 */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">Opponent</span>
              <Input
                type="number"
                min={0}
                value={matchData.opponentScore}
                onChange={(e) =>
                  onUpdateMatchData('opponentScore', Number(e.target.value))
                }
                className="w-20 text-center border-gray-300 focus:border-gray-600 focus:ring-gray-400"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={onUpload}
          disabled={uploading}
          className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"/>
              Loading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2"/>
              Upload
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
