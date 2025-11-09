"use client"

import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { JobCard, type Job } from "../components/JobCard"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

const JOBS_KEY = "jobs_seed"
const SAVED_KEY = "saved_jobs"
const APPLIED_KEY = "applications"

type ApplicationsState = {
  [jobId: string]: {
    applied: boolean
    appliedAt: string
  }
}

const fallbackSeed: Job[] = [
  {
    id: "pocket-01",
    title: "Senior Product Designer",
    company: "Nova Systems",
    location: "Remote - EU",
    isRemote: true,
    salary: "$120k - $150k",
    employmentType: "Full-time",
    tags: ["Figma", "Design Systems", "SaaS"],
  },
  {
    id: "pocket-02",
    title: "Full-stack Engineer",
    company: "Orbit Labs",
    location: "San Francisco, CA",
    isRemote: true,
    salary: "$140k - $180k",
    employmentType: "Full-time",
    tags: ["TypeScript", "Next.js", "Node"],
  },
  {
    id: "pocket-03",
    title: "Product Manager - Growth",
    company: "Driftwave",
    location: "New York, NY",
    isRemote: false,
    salary: "$110k - $140k",
    employmentType: "Full-time",
    tags: ["Experimentation", "B2B", "Analytics"],
  },
  {
    id: "pocket-04",
    title: "Frontend Engineer (React/Next)",
    company: "Signal Studio",
    location: "Remote - US",
    isRemote: true,
    salary: "$90k - $130k",
    employmentType: "Contract",
    tags: ["React", "Next.js", "Animations"],
  },
  {
    id: "pocket-05",
    title: "Data Analyst",
    company: "Northwind Insights",
    location: "Austin, TX",
    isRemote: false,
    salary: "$80k - $105k",
    employmentType: "Full-time",
    tags: ["SQL", "dbt", "Looker"],
  },
  {
    id: "pocket-06",
    title: "UX Researcher",
    company: "Daybreak",
    location: "Remote - Global",
    isRemote: true,
    salary: "$90k - $120k",
    employmentType: "Contract",
    tags: ["Research", "Remote", "Product Discovery"],
  },
]

export default function SavedJobsPage() {
  const router = useRouter()

  const [jobs, setJobs] = useState<Job[]>([])
  const [savedJobIds, setSavedJobIds] = useState<string[]>([])
  const [applications, setApplications] = useState<ApplicationsState>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const storedJobs = await api.get<Job[] | null>(JOBS_KEY, null)
        const allJobs = storedJobs && storedJobs.length > 0 ? storedJobs : fallbackSeed
        const saved = await api.get<string[]>(SAVED_KEY, [])
        const apps = await api.get<ApplicationsState>(APPLIED_KEY, {})

        if (!mounted) return
        setJobs(allJobs)
        setSavedJobIds(saved)
        setApplications(apps)
      } finally {
        if (mounted) setHydrated(true)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    api.set(SAVED_KEY, savedJobIds)
  }, [savedJobIds, hydrated])

  useEffect(() => {
    if (!hydrated) return
    api.set(APPLIED_KEY, applications)
  }, [applications, hydrated])

  const toggleSave = useCallback((jobId: string) => {
    setSavedJobIds((prev) => prev.filter((id) => id !== jobId))
  }, [])

  const toggleApplied = useCallback((jobId: string) => {
    setApplications((prev) => {
      const current = prev[jobId]
      const applied = !current?.applied
      const next: ApplicationsState = {
        ...prev,
        [jobId]: applied
          ? { applied: true, appliedAt: new Date().toISOString() }
          : { applied: false, appliedAt: "" },
      }
      if (!applied) {
        delete next[jobId]
      }
      return { ...next }
    })
  }, [])

  const savedJobs = useMemo(
    () => jobs.filter((job) => savedJobIds.includes(job.id)),
    [jobs, savedJobIds]
  )

  return (
    <main className="flex min-h-screen flex-col bg-transparent pb-4 pt-1 text-slate-50">
      <header className="mb-2.5 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Back to job search"
          className="h-8 w-8 rounded-full bg-[#050011]/95 text-[12px] text-purple-200 hover:bg-purple-950/60"
          onClick={() => router.push("/")}
        >
          ←
        </Button>
        <div className="flex flex-1 flex-col">
          <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-purple-400/85">
            PocketJobs
          </span>
          <h1 className="text-[16px] font-semibold tracking-[-0.02em] text-slate-50">
            Saved roles
          </h1>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-[7px] uppercase tracking-[0.16em] text-purple-500/80">
            Total
          </span>
          <span className="text-[12px] font-semibold text-fuchsia-300">
            {savedJobs.length}
          </span>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto pb-2">
        {savedJobs.length === 0 && hydrated && (
          <div className="mt-6 rounded-3xl border border-purple-900/60 bg-[#050010]/98 p-4 text-center text-[10px] text-purple-200/85 shadow-[0_18px_50px_rgba(0,0,0,0.95)]">
            <p className="text-[11px] font-semibold text-slate-50">
              No saved roles yet.
            </p>
            <p className="mt-0.5">
              Tap the star on any role to keep it in your Pocket.
            </p>
            <Button
              type="button"
              className="mt-2 h-8 rounded-2xl text-[10px]"
              onClick={() => router.push("/")}
            >
              Browse roles
            </Button>
          </div>
        )}

        {savedJobs.length > 0 && (
          <div className="space-y-2">
            {savedJobs.map((job) => {
              const isApplied = Boolean(applications[job.id]?.applied)
              return (
                <div key={job.id} className="relative">
                  <JobCard
                    job={job}
                    isSaved={true}
                    onPress={() => {}}
                    onToggleSave={() => toggleSave(job.id)}
                  />
                  <div className="absolute bottom-1.5 right-2.5 flex items-center gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      className={cn(
                        "h-7 rounded-full px-2.5 text-[8px] font-semibold",
                        isApplied
                          ? "bg-[#050012] text-fuchsia-300 hover:bg-[#070018]"
                          : "bg-purple-700 text-slate-50 hover:bg-purple-600"
                      )}
                      onClick={() => toggleApplied(job.id)}
                    >
                      {isApplied ? "Applied" : "Mark applied"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 rounded-full px-2 text-[8px] text-purple-300/80 hover:bg-purple-950/40 hover:text-fuchsia-300"
                      onClick={() => toggleSave(job.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
