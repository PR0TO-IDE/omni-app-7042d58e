"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { JobCard, type Job } from "./components/JobCard"
import { JobSearchBar } from "./components/JobSearchBar"
import { JobFiltersBar } from "./components/JobFiltersBar"
import { JobDetailSheet } from "./components/JobDetailSheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

const JOBS_KEY = "jobs_seed"
const SAVED_KEY = "saved_jobs"
const APPLIED_KEY = "applications"
const RECENT_KEY = "recent_searches"

export type ApplicationsState = {
  [jobId: string]: {
    applied: boolean
    appliedAt: string
  }
}

const seedJobs: Job[] = [
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
    tags: ["TypeScript", "Next.js", "Node"] ,
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

function ensureSeedJobs(existing: Job[] | null): Job[] {
  if (!existing || existing.length === 0) {
    return seedJobs
  }
  const existingIds = new Set(existing.map((j) => j.id))
  const merged = [...existing]
  for (const job of seedJobs) {
    if (!existingIds.has(job.id)) merged.push(job)
  }
  return merged
}

function salaryMinFromLabel(label: string): number {
  if (!label) return 0
  const numeric = parseInt(label.replace(/[^0-9]/g, ""), 10)
  return isNaN(numeric) ? 0 : numeric * 1000
}

export default function HomePage() {
  const router = useRouter()

  const [jobs, setJobs] = useState<Job[]>([])
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [employmentType, setEmploymentType] = useState("")
  const [salaryRange, setSalaryRange] = useState("")
  const [remoteOnly, setRemoteOnly] = useState(false)

  const [savedJobIds, setSavedJobIds] = useState<string[]>([])
  const [applications, setApplications] = useState<ApplicationsState>({})

  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [hydrated, setHydrated] = useState(false)

  // Hydrate state from localStorage on mount
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const storedJobs = await api.get<Job[] | null>(JOBS_KEY, null)
        const mergedJobs = ensureSeedJobs(storedJobs)
        if (mounted) {
          setJobs(mergedJobs)
        }
        await api.set(JOBS_KEY, mergedJobs)

        const saved = await api.get<string[]>(SAVED_KEY, [])
        const apps = await api.get<ApplicationsState>(APPLIED_KEY, {})
        const recent = await api.get<
          {
            keyword: string
            location: string
            employmentType: string
            salaryRange: string
            remoteOnly: boolean
          } | null
        >(RECENT_KEY, null)

        if (mounted) {
          setSavedJobIds(saved)
          setApplications(apps)
          if (recent) {
            setKeyword(recent.keyword)
            setLocation(recent.location)
            setEmploymentType(recent.employmentType)
            setSalaryRange(recent.salaryRange)
            setRemoteOnly(recent.remoteOnly)
          }
        }
      } finally {
        if (mounted) setHydrated(true)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // Persist saved jobs, applications, and recent search
  useEffect(() => {
    if (!hydrated) return
    api.set(SAVED_KEY, savedJobIds)
  }, [savedJobIds, hydrated])

  useEffect(() => {
    if (!hydrated) return
    api.set(APPLIED_KEY, applications)
  }, [applications, hydrated])

  useEffect(() => {
    if (!hydrated) return
    api.set(RECENT_KEY, {
      keyword,
      location,
      employmentType,
      salaryRange,
      remoteOnly,
    })
  }, [keyword, location, employmentType, salaryRange, remoteOnly, hydrated])

  const toggleSave = useCallback(
    (jobId: string) => {
      setSavedJobIds((prev) => {
        const exists = prev.includes(jobId)
        if (exists) {
          return prev.filter((id) => id !== jobId)
        }
        return [...prev, jobId]
      })
    },
    []
  )

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

  const handleSelectJob = useCallback((job: Job) => {
    setSelectedJob(job)
    setIsDetailOpen(true)
  }, [])

  const handleClearSearch = useCallback(() => {
    setKeyword("")
    setLocation("")
  }, [])

  const handleResetFilters = useCallback(() => {
    setEmploymentType("")
    setSalaryRange("")
    setRemoteOnly(false)
  }, [])

  const filteredJobs = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    const loc = location.trim().toLowerCase()
    const salaryMin = salaryMinFromLabel(salaryRange)

    return jobs.filter((job) => {
      if (kw) {
        const target = `${job.title} ${job.company}`.toLowerCase()
        if (!target.includes(kw)) return false
      }

      if (loc) {
        const targetLoc = `${job.location}${job.isRemote ? " remote" : ""}`.toLowerCase()
        if (!targetLoc.includes(loc)) return false
      }

      if (remoteOnly && !job.isRemote) return false

      if (employmentType && job.employmentType !== employmentType) return false

      if (salaryMin) {
        const digits = job.salary.replace(/[^0-9]/g, "")
        const numeric = parseInt(digits || "0", 10)
        if (!isNaN(numeric) && numeric < salaryMin) return false
      }

      return true
    })
  }, [jobs, keyword, location, remoteOnly, employmentType, salaryRange])

  const savedCount = savedJobIds.length

  return (
    <main className="flex min-h-screen flex-col bg-black px-3 pb-4 pt-3 text-slate-50">
      <JobSearchBar
        keyword={keyword}
        location={location}
        onKeywordChange={setKeyword}
        onLocationChange={setLocation}
        onClear={handleClearSearch}
      />

      <JobFiltersBar
        employmentType={employmentType}
        salaryRange={salaryRange}
        remoteOnly={remoteOnly}
        onEmploymentTypeChange={setEmploymentType}
        onSalaryRangeChange={setSalaryRange}
        onRemoteToggle={() => setRemoteOnly((prev) => !prev)}
        onReset={handleResetFilters}
      />

      <section className="mt-3 flex-1 overflow-y-auto pb-20">
        <div className="mb-2 flex items-baseline justify-between text-[10px] text-slate-500">
          <span>
            {filteredJobs.length} role{filteredJobs.length === 1 ? "" : "s"} found
          </span>
          {keyword || location || employmentType || salaryRange || remoteOnly ? (
            <span className="text-sky-400">Filters active</span>
          ) : (
            <span className="text-slate-500">Curated for you</span>
          )}
        </div>
        <div>
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              onPress={() => handleSelectJob(job)}
              onToggleSave={() => toggleSave(job.id)}
            />
          ))}
          {hydrated && filteredJobs.length === 0 && (
            <div className="mt-6 rounded-2xl bg-slate-950/95 p-4 text-center text-[11px] text-slate-400">
              <p className="font-medium text-slate-100">
                No roles match your filters yet.
              </p>
              <p className="mt-1 text-slate-400">
                Try broadening your search keyword, expanding locations, or lowering the
                salary minimum.
              </p>
              <Button
                type="button"
                className="mt-3 h-10 rounded-2xl bg-slate-800 text-[11px] text-slate-100 hover:bg-slate-700"
                onClick={() => {
                  handleClearSearch()
                  handleResetFilters()
                }}
              >
                Reset search & filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-2 z-30 flex justify-center">
        <div className="pointer-events-auto flex w-full max-w-md items-center px-3">
          <Button
            type="button"
            onClick={() => router.push("/saved")}
            className={cn(
              "flex h-12 flex-1 items-center justify-between rounded-2xl bg-slate-950/98 px-4 text-[11px] font-semibold text-slate-50 shadow-2xl",
              savedCount > 0
                ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border border-slate-800/90 bg-slate-950/98 text-slate-300"
            )}
          >
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-500">
                Saved
              </span>
              <span>
                {savedCount > 0
                  ? `${savedCount} job${savedCount === 1 ? "" : "s"} in your pocket`
                  : "No saved jobs yet"}
              </span>
            </div>
            <span className="ml-2 text-[13px]">↗</span>
          </Button>
        </div>
      </div>

      <JobDetailSheet
        job={selectedJob}
        isOpen={isDetailOpen}
        isSaved={selectedJob ? savedJobIds.includes(selectedJob.id) : false}
        isApplied={selectedJob ? Boolean(applications[selectedJob.id]?.applied) : false}
        onClose={() => setIsDetailOpen(false)}
        onToggleSave={() => {
          if (!selectedJob) return
          toggleSave(selectedJob.id)
        }}
        onMarkApplied={() => {
          if (!selectedJob) return
          toggleApplied(selectedJob.id)
        }}
      />
    </main>
  )
}
