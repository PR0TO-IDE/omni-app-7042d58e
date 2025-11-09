"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface JobSearchBarProps {
  keyword: string
  location: string
  onKeywordChange: (value: string) => void
  onLocationChange: (value: string) => void
  onClear: () => void
}

export const JobSearchBar: React.FC<JobSearchBarProps> = ({
  keyword,
  location,
  onKeywordChange,
  onLocationChange,
  onClear,
}) => {
  const handleClear = () => {
    onClear()
  }

  return (
    <div className="w-full space-y-2 rounded-3xl bg-gradient-to-b from-slate-950/95 to-slate-900/80 p-3 shadow-lg">
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-400/80">
            PocketJobs
          </span>
          <h1 className="mt-0.5 text-[18px] font-semibold tracking-[-0.02em] text-slate-50">
            Find your next role.
          </h1>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear search fields"
          className="h-9 w-9 rounded-full bg-slate-900/80 text-xs text-slate-400 hover:bg-slate-800"
          onClick={handleClear}
        >
          ⟳
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="Role or company"
              className={cn(
                "h-11 w-full rounded-2xl border-none bg-slate-950/90 px-3 text-[13px] text-slate-100 placeholder:text-slate-500",
                "focus-visible:ring-1 focus-visible:ring-sky-500/80"
              )}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Location or Remote"
            className={cn(
              "h-11 flex-1 rounded-2xl border-none bg-slate-950/90 px-3 text-[13px] text-slate-100 placeholder:text-slate-500",
              "focus-visible:ring-1 focus-visible:ring-sky-500/80"
            )}
          />
          <Button
            type="button"
            variant="default"
            className="h-11 min-w-[72px] rounded-2xl bg-sky-500 text-[12px] font-semibold tracking-wide text-slate-950 hover:bg-sky-400"
            onClick={() => {
              /* Primary CTA intentionally kept as no-op; search is live as user types. */
            }}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JobSearchBar
