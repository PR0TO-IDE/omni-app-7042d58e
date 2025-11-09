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
      className={
        cn(
          "relative mb-3 flex cursor-pointer items-stretch gap-3 rounded-2xl bg-gradient-to-br from-slate-900/90 to-black/95 p-3 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl",
          "min-h-[72px]"
        )
      }
      onClick={onPress}
    >
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400/80">
              {job.company}
            </span>
            <h3 className="mt-0.5 line-clamp-1 text-[15px] font-semibold tracking-[-0.01em] text-slate-50">
              {job.title}
            </h3>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
          <span className="rounded-full bg-slate-900/80 px-2 py-1 leading-none text-slate-300">
            {job.location}
          </span>
          {job.isRemote && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-1 leading-none text-emerald-400">
              Remote
            </span>
          )}
          <span className="rounded-full bg-slate-900/80 px-2 py-1 leading-none text-sky-400">
            {job.employmentType}
          </span>
          <span className="rounded-full bg-slate-900/80 px-2 py-1 leading-none text-indigo-400">
            {job.salary}
          </span>
          {job.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-950/70 px-2 py-1 leading-none text-[9px] text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div
        className="flex flex-col items-end justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          aria-label={isSaved ? "Unsave job" : "Save job"}
          variant={isSaved ? "secondary" : "outline"}
          size="icon"
          className={cn(
            "h-9 w-9 rounded-full border-slate-700/80 bg-black/60 text-xs text-slate-200 shadow-md",
            isSaved && "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
          )}
          onClick={onToggleSave}
        >
          {isSaved ? "★" : "☆"}
        </Button>

        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-slate-500">
          View
        </span>
      </div>
    </Card>
  )
}

export default JobCard
