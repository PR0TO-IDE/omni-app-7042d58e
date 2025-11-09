"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance"

export type Job = {
  id: string
  title: string
  company: string
  location: string
  isRemote: boolean
  salary: string
  employmentType: EmploymentType
  tags?: string[]
}

export interface JobCardProps {
  job: Job
  isSaved: boolean
  onPress: () => void
  onToggleSave: () => void
}

export const JobCard: React.FC<JobCardProps> = ({ job, isSaved, onPress, onToggleSave }) => {
  return (
    <Card
      className={cn(
        "relative mb-2.5 flex cursor-pointer items-stretch gap-2 rounded-2xl border border-purple-900/40 bg-gradient-to-br from-[#080114] via-[#05000d] to-[#020008] p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-500/70 hover:shadow-[0_18px_45px_rgba(0,0,0,0.85)]",
        "min-h-[64px]"
      )}
      onClick={onPress}
    >
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-purple-400/80">
              {job.company}
            </span>
            <h3 className="mt-0.5 line-clamp-1 text-[14px] font-semibold tracking-[-0.01em] text-slate-50">
              {job.title}
            </h3>
          </div>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[9px] text-purple-200/70">
          <span className="rounded-full bg-[#05000d] px-2 py-0.5 leading-none text-purple-200/80">
            {job.location}
          </span>
          {job.isRemote && (
            <span className="rounded-full bg-purple-900/40 px-2 py-0.5 leading-none text-purple-300">
              Remote
            </span>
          )}
          <span className="rounded-full bg-[#05000d] px-2 py-0.5 leading-none text-purple-300/90">
            {job.employmentType}
          </span>
          <span className="rounded-full bg-[#05000d] px-2 py-0.5 leading-none text-fuchsia-300/90">
            {job.salary}
          </span>
          {job.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#030008] px-2 py-0.5 text-[8px] leading-none text-purple-400/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div
        className="flex flex-col items-end justify-between gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          aria-label={isSaved ? "Unsave job" : "Save job"}
          variant={isSaved ? "secondary" : "outline"}
          size="icon"
          className={cn(
            "h-7 w-7 rounded-full border-purple-900/70 bg-[#050010]/90 text-[11px] text-purple-200 shadow-md",
            isSaved && "bg-purple-600/20 text-purple-300"
          )}
          onClick={onToggleSave}
        >
          {isSaved ? "★" : "☆"}
        </Button>

        <span className="text-[8px] font-medium uppercase tracking-[0.14em] text-purple-500/80">
          View
        </span>
      </div>
    </Card>
  )
}

export default JobCard
