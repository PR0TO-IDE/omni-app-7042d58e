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
    <div className="mt-2 flex w-full flex-nowrap items-center gap-1.5 overflow-x-auto pb-1">
      <div className="flex flex-nowrap items-center gap-1">
        {EMPLOYMENT_TYPES.map((type) => {
          const active = employmentType === type || (type === "All" && employmentType === "")
          return (
            <Button
              key={type}
              type="button"
              variant={active ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-full px-2.5 text-[9px]",
                active
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-slate-950"
                  : "border-purple-900/70 bg-[#03000a] text-purple-200/80 hover:bg-purple-950/40"
              )}
              onClick={() => onEmploymentTypeChange(type === "All" ? "" : type)}
            >
              {type}
            </Button>
          )
        })}
      </div>
      <div className="flex flex-nowrap items-center gap-1">
        {SALARY_RANGES.map((range) => {
          const active = salaryRange === range || (range === "Any" && salaryRange === "")
          return (
            <Button
              key={range}
              type="button"
              variant={active ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-full px-2.5 text-[9px]",
                active
                  ? "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-slate-950"
                  : "border-purple-900/70 bg-[#03000a] text-purple-200/80 hover:bg-purple-950/40"
              )}
              onClick={() => onSalaryRangeChange(range === "Any" ? "" : range)}
            >
              {range === "Any" ? "Any" : range}
            </Button>
          )
        })}
      </div>
      <Button
        type="button"
        variant={remoteOnly ? "default" : "outline"}
        size="sm"
        className={cn(
          "ml-0.5 rounded-full px-2.5 text-[9px]",
          remoteOnly
            ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-slate-950"
            : "border-purple-900/70 bg-[#03000a] text-purple-200/80 hover:bg-purple-950/40"
        )}
        onClick={onRemoteToggle}
      >
        Remote only
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-0.5 rounded-full px-2.5 text-[8px] font-medium text-purple-300/80 hover:bg-purple-950/40 hover:text-purple-100"
        onClick={onReset}
      >
        Reset
      </Button>
    </div>
  )
}

export default JobFiltersBar
