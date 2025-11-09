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
    <main className="flex min-h-screen flex-col bg-black px-3 pb-4 pt-3 text-slate-50">
      <header className="mb-3 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Back to job search"
          className="h-10 w-10 rounded-full bg-slate-950/90 text-slate-300 hover:bg-slate-900"
          onClick={() => router.push("/")}
        >
          ←
        </Button>
        <div className="flex flex-col flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-400/80">
            PocketJobs
          </span>
          <h1 className="text-[18px] font-semibold tracking-[-0.02em] text-slate-50">
            Saved roles
          </h1>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-[9px] uppercase tracking-[0.16em] text-slate-500">
            Total
          </span>
          <span className="text-[13px] font-semibold text-emerald-400">
            {savedJobs.length}
          </span>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto">
        {savedJobs.length === 0 && hydrated && (
          <div className="mt-8 rounded-3xl bg-slate-950/98 p-5 text-center text-[11px] text-slate-400">
            <p className="text-[12px] font-semibold text-slate-100">
              Nothing saved yet.
            </p>
            <p className="mt-1">
              Browse roles on the main screen and tap the star icon to keep them in
              your pocket.
            </p>
            <Button
              type="button"
              className="mt-4 h-11 rounded-2xl bg-sky-500 text-[11px] font-semibold text-slate-950 hover:bg-sky-400"
              onClick={() => router.push("/")}
            >
              Discover roles
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
                  <div className="absolute bottom-2 right-3 flex items-center gap-1">
                    <Button
                      type="button"
                      size="sm"
                      className={cn(
                        "h-8 rounded-full px-3 text-[9px] font-semibold",
                        isApplied
                          ? "bg-slate-900 text-emerald-400 hover:bg-slate-800"
                          : "bg-indigo-500 text-slate-950 hover:bg-indigo-400"
                      )}
                      onClick={() => toggleApplied(job.id)}
                    >
                      {isApplied ? "Applied" : "Mark applied"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 rounded-full px-2 text-[9px] text-slate-500 hover:bg-slate-900 hover:text-rose-400"
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
