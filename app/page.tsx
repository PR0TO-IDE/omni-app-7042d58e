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
    <main className="flex min-h-screen flex-col bg-transparent pb-4 pt-1 text-slate-50">
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

      <section className="mt-2 flex-1 overflow-y-auto pb-16">
        <div className="mb-1.5 flex items-baseline justify-between text-[9px] text-purple-300/70">
          <span>
            {filteredJobs.length} role{filteredJobs.length === 1 ? "" : "s"} found
          </span>
          {keyword || location || employmentType || salaryRange || remoteOnly ? (
            <span className="text-fuchsia-400/90">Filters active</span>
          ) : (
            <span className="text-purple-500/70">Curated for you</span>
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
            <div className="mt-4 rounded-2xl border border-purple-900/60 bg-[#050010]/98 p-3.5 text-center text-[10px] text-purple-200/80 shadow-[0_14px_40px_rgba(0,0,0,0.9)]">
              <p className="font-medium text-slate-100">
                No roles match your filters yet.
              </p>
              <p className="mt-0.5 text-purple-200/80">
                Try broadening your search, explore more locations, or relax the salary
                minimum.
              </p>
              <Button
                type="button"
                className="mt-2 h-8 rounded-2xl text-[10px]"
                onClick={() => {
                  handleClearSearch()
                  handleResetFilters()
                }}
              >
                Reset search and filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-1.5 z-30 flex justify-center">
        <div className="pointer-events-auto flex w-full max-w-md items-center px-3">
          <Button
            type="button"
            onClick={() => router.push("/saved")}
            className={cn(
              "flex h-10 flex-1 items-center justify-between rounded-2xl border border-purple-900/70 bg-[#04000d]/98 px-3 text-[9px] font-semibold text-purple-100/90 shadow-[0_14px_40px_rgba(0,0,0,0.9)]",
              savedCount > 0 &&
                "border-purple-500/80 bg-gradient-to-r from-violet-600/20 to-fuchsia-500/10 text-fuchsia-200"
            )}
          >
            <div className="flex flex-col text-left">
              <span className="text-[7px] font-medium uppercase tracking-[0.16em] text-purple-500/80">
                Saved
              </span>
              <span>
                {savedCount > 0
                  ? `${savedCount} job${savedCount === 1 ? "" : "s"} in your pocket`
                  : "Save roles you love to review later"}
              </span>
            </div>
            <span className="ml-2 text-[11px] text-fuchsia-400">
              ↗
            </span>
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
