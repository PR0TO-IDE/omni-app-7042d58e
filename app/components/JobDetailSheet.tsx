"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Job } from "./JobCard"

export interface JobDetailSheetProps {
  job: Job | null
  isOpen: boolean
  isSaved: boolean
  isApplied: boolean
  onClose: () => void
  onToggleSave: () => void
  onMarkApplied: () => void
}

export const JobDetailSheet: React.FC<JobDetailSheetProps> = ({
  job,
  isOpen,
  isSaved,
  isApplied,
  onClose,
  onToggleSave,
  onMarkApplied,
}) => {
  if (!isOpen || !job) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm",
        "md:items-center md:bg-black/70"
      )}
      aria-modal="true"
      role="dialog"
    >
      <Card
        className={cn(
          "relative flex max-h-[90vh] w-full max-w-md flex-col rounded-t-3xl bg-slate-950/98 p-4 text-slate-100 shadow-2xl",
          "md:rounded-3xl"
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-400/80">
              {job.company}
            </span>
            <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em] text-slate-50">
              {job.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
              <span className="rounded-full bg-slate-900/90 px-2 py-1 leading-none">
                {job.location}
              </span>
              {job.isRemote && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 leading-none text-emerald-400">
                  Remote
                </span>
              )}
              <span className="rounded-full bg-slate-900/90 px-2 py-1 leading-none text-sky-400">
                {job.employmentType}
              </span>
              <span className="rounded-full bg-slate-900/90 px-2 py-1 leading-none text-indigo-400">
                {job.salary}
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close job details"
            className="h-9 w-9 rounded-full bg-slate-900/90 text-slate-400 hover:bg-slate-800"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5 text-[9px] text-slate-400">
          {job.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-950/95 px-2 py-1 leading-none"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="custom-scroll -mx-1 flex-1 space-y-2 overflow-y-auto px-1 pb-4 text-[11px] leading-relaxed text-slate-300">
          <p>
            Join <span className="font-semibold text-sky-400">{job.company}</span> as a
            {" "}
            <span className="font-semibold text-slate-50">{job.title}</span>. You will
            collaborate with a tight-knit team to build polished, production-grade
            experiences with modern tooling and a culture that values craft.
          </p>
          <p className="text-slate-400">
            Ideal candidates are comfortable owning features end-to-end, working in
            async environments, and shipping quickly without compromising quality.
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li>3+ years relevant experience (or equivalent portfolio).</li>
            <li>Strong communication and collaboration skills.</li>
            <li>Fluency with modern web stacks and design systems.</li>
            <li>Comfort working across time zones with distributed teams.</li>
          </ul>
          <p className="text-slate-400">
            Benefits include competitive compensation, flexible schedule, remote-first
            culture, and a learning budget to grow your skills.
          </p>
        </div>

        <div className="mt-2 flex flex-col gap-2 border-t border-slate-800/80 pt-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={onToggleSave}
              className={cn(
                "h-11 flex-1 rounded-2xl text-[12px] font-semibold",
                isSaved
                  ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  : "bg-sky-500 text-slate-950 hover:bg-sky-400"
              )}
            >
              {isSaved ? "Saved" : "Save to shortlist"}
            </Button>
            <Button
              type="button"
              onClick={onMarkApplied}
              className={cn(
                "h-11 flex-1 rounded-2xl text-[12px] font-semibold",
                isApplied
                  ? "bg-slate-800 text-emerald-400 hover:bg-slate-700"
                  : "bg-indigo-500 text-slate-950 hover:bg-indigo-400"
              )}
            >
              {isApplied ? "Applied" : "Mark as applied"}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="h-10 rounded-2xl text-[11px] text-slate-400 hover:bg-slate-900"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default JobDetailSheet
