"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import type { Job } from "../components/JobCard"

const SAVED_KEY = "saved_jobs"
const APPLIED_KEY = "applications"
const JOBS_KEY = "jobs_seed"

type ApplicationsState = {
  [jobId: string]: {
    applied: boolean
    appliedAt: string
  }
}

export default function ProfilePage() {
  const router = useRouter()

  const [savedJobIds, setSavedJobIds] = useState<string[]>([])
  const [applications, setApplications] = useState<ApplicationsState>({})
  const [jobs, setJobs] = useState<Job[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const saved = await api.get<string[]>(SAVED_KEY, [])
        const apps = await api.get<ApplicationsState>(APPLIED_KEY, {})
        const storedJobs = await api.get<Job[] | null>(JOBS_KEY, [])

        if (!mounted) return
        setSavedJobIds(saved)
        setApplications(apps)
        setJobs(storedJobs || [])
      } finally {
        if (mounted) setHydrated(true)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const savedCount = savedJobIds.length
  const appliedCount = useMemo(
    () => Object.values(applications).filter((a) => a.applied).length,
    [applications]
  )

  const mostRecentApplication = useMemo(() => {
    const appliedEntries = Object.entries(applications)
      .filter(([, value]) => value.applied && value.appliedAt)
      .sort((a, b) => (a[1].appliedAt < b[1].appliedAt ? 1 : -1))

    if (appliedEntries.length === 0) return null

    const [jobId, meta] = appliedEntries[0]
    const job = jobs.find((j) => j.id === jobId)
    return job
      ? {
          title: job.title,
          company: job.company,
          appliedAt: new Date(meta.appliedAt).toLocaleDateString(),
        }
      : null
  }, [applications, jobs])

  return (
    <main className="flex min-h-screen flex-col bg-transparent pb-4 pt-1 text-slate-50">
      <header className="mb-3 flex items-center justify-between gap-2">
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
            Your activity
          </h1>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-[11px] font-semibold text-slate-950">
          PJ
        </div>
      </header>

      <section className="grid grid-cols-2 gap-2 pb-2">
        <div className="rounded-2xl border border-purple-900/60 bg-[#050010]/98 p-2.5 text-[9px] text-purple-200/90 shadow-[0_16px_40px_rgba(0,0,0,0.9)]">
          <div className="text-[8px] font-semibold uppercase tracking-[0.16em] text-purple-500/85">
            Saved roles
          </div>
          <div className="mt-0.5 text-[18px] font-semibold text-fuchsia-300">
            {hydrated ? savedCount : "-"}
          </div>
          <p className="mt-0.5 text-[8px] text-purple-200/80">
            Keep a tight shortlist of roles you care about.
          </p>
          <Button
            type="button"
            size="sm"
            className="mt-1.5 h-6 rounded-xl px-2 text-[8px]"
            onClick={() => router.push("/saved")}
          >
            View saved
          </Button>
        </div>

        <div className="rounded-2xl border border-purple-900/60 bg-[#050010]/98 p-2.5 text-[9px] text-purple-200/90 shadow-[0_16px_40px_rgba(0,0,0,0.9)]">
          <div className="text-[8px] font-semibold uppercase tracking-[0.16em] text-purple-500/85">
            Applications
          </div>
          <div className="mt-0.5 text-[18px] font-semibold text-violet-300">
            {hydrated ? appliedCount : "-"}
          </div>
          <p className="mt-0.5 text-[8px] text-purple-200/80">
            Track where you have already signaled interest.
          </p>
        </div>
      </section>

      <section className="mt-1 flex-1 space-y-1.5 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-400/90">
            Latest activity
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 rounded-full px-2 text-[8px] text-purple-300/85 hover:bg-purple-950/40"
            onClick={() => router.push("/")}
          >
            Browse roles
          </Button>
        </div>

        <div className="rounded-2xl border border-purple-900/60 bg-[#050010]/98 p-2.5 text-[9px] text-purple-200/85 shadow-[0_16px_40px_rgba(0,0,0,0.9)]">
          {mostRecentApplication ? (
            <div>
              <div className="text-[8px] uppercase tracking-[0.14em] text-purple-500/85">
                Most recent application
              </div>
              <div className="mt-0.5 text-[11px] font-semibold text-slate-50">
                {mostRecentApplication.title}
              </div>
              <div className="text-[9px] text-fuchsia-300">
                {mostRecentApplication.company}
              </div>
              <div className="mt-0.5 text-[8px] text-purple-300/85">
                Applied on {mostRecentApplication.appliedAt}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[8px] uppercase tracking-[0.14em] text-purple-500/85">
                No applications yet
              </div>
              <p className="mt-0.5 text-[8px] text-purple-200/85">
                Mark roles as applied from listings or your saved pocket to track your
                pipeline here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
