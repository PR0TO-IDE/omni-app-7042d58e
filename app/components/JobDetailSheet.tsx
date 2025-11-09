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
        "fixed inset-0 z-40 flex items-end justify-center bg-black/70 backdrop-blur-md",
        "md:items-center"
      )}
      aria-modal="true"
      role="dialog"
    >
      <Card
        className={cn(
          "relative flex max-h-[90vh] w-full max-w-md flex-col rounded-t-3xl border border-purple-900/60 bg-[#05000d]/98 p-3.5 text-slate-100 shadow-[0_22px_70px_rgba(0,0,0,0.95)]",
          "md:rounded-3xl"
        )}
      >
        <div className="mb-2.5 flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-purple-400/85">
              {job.company}
            </span>
            <h2 className="mt-0.5 text-[16px] font-semibold tracking-[-0.02em] text-slate-50">
              {job.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[9px] text-purple-200/80">
              <span className="rounded-full bg-[#030008] px-2 py-0.5 leading-none">
                {job.location}
              </span>
              {job.isRemote && (
                <span className="rounded-full bg-purple-900/40 px-2 py-0.5 leading-none text-purple-300">
                  Remote
                </span>
              )}
              <span className="rounded-full bg-[#030008] px-2 py-0.5 leading-none text-purple-300/90">
                {job.employmentType}
              </span>
              <span className="rounded-full bg-[#030008] px-2 py-0.5 leading-none text-fuchsia-300/90">
                {job.salary}
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close job details"
            className="mt-0.5 h-7 w-7 rounded-full bg-[#090016] text-[11px] text-purple-300/85 hover:bg-purple-900/50 hover:text-purple-100"
            onClick={onClose}
          >
            ×
          </Button>
        </div>

        <div className="mb-2 flex flex-wrap gap-1.5 text-[8px] text-purple-200/80">
          {job.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#030008] px-2 py-0.5 leading-none"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="custom-scroll -mx-1 flex-1 space-y-1.5 overflow-y-auto px-1 pb-3 text-[10px] leading-snug text-purple-100/90">
          <p>
            Join <span className="font-semibold text-purple-400">{job.company}</span> as a
            {" "}
            <span className="font-semibold text-slate-50">{job.title}</span>. Work with a
            focused team shipping polished, production-grade experiences.
          </p>
          <p className="text-purple-200/80">
            Own features end-to-end, iterate quickly, and help shape a high-trust,
            async-first culture.
          </p>
          <ul className="ml-4 list-disc space-y-0.5">
            <li>3+ years relevant experience or an outstanding portfolio.</li>
            <li>Strong communication skills across distributed teams.</li>
            <li>Hands-on expertise with modern product tooling.</li>
            <li>Bias for shipping and learning fast.</li>
          </ul>
          <p className="text-purple-200/80">
            Benefits include competitive compensation, flexible working, and dedicated
            learning support.
          </p>
        </div>

        <div className="mt-2 flex flex-col gap-1.5 border-t border-purple-900/60 pt-2.5">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              onClick={onToggleSave}
              className={cn(
                "h-9 flex-1 rounded-2xl text-[11px] font-semibold",
                isSaved
                  ? "bg-purple-600 text-slate-950 hover:bg-purple-500"
                  : "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-slate-950 hover:from-violet-400 hover:to-fuchsia-400"
              )}
            >
              {isSaved ? "Saved to shortlist" : "Save to shortlist"}
            </Button>
            <Button
              type="button"
              onClick={onMarkApplied}
              className={cn(
                "h-9 flex-1 rounded-2xl text-[11px] font-semibold",
                isApplied
                  ? "bg-[#0b0219] text-purple-300 hover:bg-[#0d031f]"
                  : "bg-purple-900 text-purple-100 hover:bg-purple-800"
              )}
            >
              {isApplied ? "Marked as applied" : "Mark as applied"}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="h-8 rounded-2xl text-[10px] text-purple-300/85 hover:bg-purple-950/40"
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
