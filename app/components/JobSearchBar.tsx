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
    <div className="w-full space-y-1.5 rounded-3xl bg-gradient-to-b from-[#0b0219] to-[#05010f] p-3 shadow-[0_14px_40px_rgba(0,0,0,0.6)] ring-1 ring-purple-900/40">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-purple-400/80">
            PocketJobs
          </span>
          <h1 className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em] text-slate-50">
            Curated roles in your pocket.
          </h1>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear search fields"
          className="h-7 w-7 rounded-full bg-[#0f061c] text-[13px] text-purple-300/80 hover:bg-purple-900/40 hover:text-purple-200"
          onClick={handleClear}
        >
          
        </Button>
      </div>
      <div className="mt-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <Input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Role or company"
            className={cn(
              "h-9 flex-1 rounded-2xl border-none bg-[#04000d]/90 px-3 text-[12px] text-slate-100 placeholder:text-purple-500/40",
              "focus-visible:ring-1 focus-visible:ring-purple-500/80"
            )}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Input
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Location or Remote"
            className={cn(
              "h-9 flex-1 rounded-2xl border-none bg-[#04000d]/90 px-3 text-[12px] text-slate-100 placeholder:text-purple-500/40",
              "focus-visible:ring-1 focus-visible:ring-purple-500/80"
            )}
          />
          <Button
            type="button"
            variant="default"
            className="h-9 min-w-[70px] rounded-2xl text-[11px] font-semibold tracking-wide"
            onClick={() => {
              // search is reactive via inputs
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
