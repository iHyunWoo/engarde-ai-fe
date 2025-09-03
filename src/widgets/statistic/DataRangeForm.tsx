import React, {useEffect, useState} from "react";
import {Button} from "@/widgets/common/Button";
import {StatisticMode} from "@/app/features/statistic/dto/statistic-mode";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/widgets/common/Select";

interface DataRangeFormProps {
  from: string;
  to: string;
  onSubmit: (r: { from: string; to: string, mode: StatisticMode }) => void;
  loading?: boolean;
}

export function DateRangeForm({
                                from: _from,
                                to: _to,
                                onSubmit,
                                loading
                              }: DataRangeFormProps) {
  const [from, setFrom] = useState(_from);
  const [to, setTo] = useState(_to);
  const [mode, setMode] = useState<StatisticMode>('all')

  useEffect(() => setFrom(_from), [_from]);
  useEffect(() => setTo(_to), [_to]);

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({from, to, mode});
      }}
    >
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">From</label>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          max={to}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">To</label>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          min={from}
        />
      </div>

      <Select value={mode} onValueChange={(v) => setMode(v as 'preliminary' | 'main' | 'all')}>
        <SelectTrigger className="w-36 h-10 data-[size=default]:h-10">
          <SelectValue placeholder="경기 유형" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="preliminary">Preliminary</SelectItem>
          <SelectItem value="main">Main</SelectItem>
        </SelectContent>
      </Select>

      <Button
        type="submit"
        className="h-10 bg-gray-800 hover:bg-gray-900 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"/>
            loading...
          </>
        ) : (
          <>
            Show Results
          </>
        )}
      </Button>
    </form>
  );
}