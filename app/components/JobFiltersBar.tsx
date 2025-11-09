"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface JobFiltersBarProps {
  employmentType: string
  salaryRange: string
  remoteOnly: boolean
  onEmploymentTypeChange: (value: string) => void
  onSalaryRangeChange: (value: string) => void
  onRemoteToggle: () => void
  onReset: () => void
}

const EMPLOYMENT_TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship"]
const SALARY_RANGES = ["Any", "50k+", "80k+", "120k+", "150k+"]

export const JobFiltersBar: React.FC<JobFiltersBarProps> = ({
  employmentType,
  salaryRange,
  remoteOnly,
  onEmploymentTypeChange,
  onSalaryRangeChange,
  onRemoteToggle,
  onReset,
}) => {
  return (
    <div className="mt-3 flex w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1">
      <div className="flex flex-nowrap items-center gap-1.5">
        {EMPLOYMENT_TYPES.map((type) => {
          const active = employmentType === type || (type === "All" && employmentType === "")
          return (
            <Button
              key={type}
              type="button"
              variant={active ? "default" : "outline"}
              className={cn(
                "h-9 rounded-full px-3 text-[10px] font-medium tracking-wide",
                active
                  ? "bg-sky-500 text-slate-950 hover:bg-sky-400"
                  : "border-slate-700/60 bg-black/60 text-slate-300 hover:bg-slate-900"
              )}
              onClick={() => onEmploymentTypeChange(type === "All" ? "" : type)}
            >
              {type}
            </Button>
          )
        })}
      </div>
      <div className="flex flex-nowrap items-center gap-1.5">
        {SALARY_RANGES.map((range) => {
          const active = salaryRange === range || (range === "Any" && salaryRange === "")
          return (
            <Button
              key={range}
              type="button"
              variant={active ? "default" : "outline"}
              className={cn(
                "h-9 rounded-full px-3 text-[10px] font-medium",
                active
                  ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  : "border-slate-700/60 bg-black/60 text-slate-300 hover:bg-slate-900"
              )}
              onClick={() => onSalaryRangeChange(range === "Any" ? "" : range)}
            >
              {range === "Any" ? "Any salary" : range}
            </Button>
          )
        })}
      </div>
      <Button
        type="button"
        variant={remoteOnly ? "default" : "outline"}
        className={cn(
          "ml-1 h-9 rounded-full px-3 text-[10px] font-semibold",
          remoteOnly
            ? "bg-indigo-500 text-slate-950 hover:bg-indigo-400"
            : "border-slate-700/60 bg-black/60 text-slate-300 hover:bg-slate-900"
        )}
        onClick={onRemoteToggle}
      >
        Remote only
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="ml-1 h-9 rounded-full px-3 text-[9px] font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-100"
        onClick={onReset}
      >
        Reset
      </Button>
    </div>
  )
}

export default JobFiltersBar
