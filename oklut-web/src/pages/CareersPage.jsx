import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import ApplyModal from '../components/ApplyModal'
import JobIcon from '../components/careers/JobIcon'
import OpenRoles from '../components/careers/OpenRoles'
import MyApplications from '../components/careers/MyApplications'

const EMPLOYMENT_TYPE_SCHEMA = {
  'Full-time': 'FULL_TIME',
  'Part-time': 'PART_TIME',
  Contract: 'CONTRACTOR',
  Internship: 'INTERN',
}

const SITE_URL = 'https://oklut.com'

function buildJobPostingStructuredData(jobs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Open Roles at Oklut Technologies',
    itemListElement: jobs.map((job, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'JobPosting',
        title: job.title,
        description: job.summary || '',
        datePosted: job.posted_at || undefined,
        employmentType: EMPLOYMENT_TYPE_SCHEMA[job.employment_type] || 'FULL_TIME',
        jobLocation: job.location
          ? { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location } }
          : undefined,
        baseSalary:
          job.salary_min != null || job.salary_max != null
            ? {
                '@type': 'MonetaryAmount',
                currency: 'INR',
                value: {
                  '@type': 'QuantitativeValue',
                  ...(job.salary_min != null ? { minValue: job.salary_min } : {}),
                  ...(job.salary_max != null ? { maxValue: job.salary_max } : {}),
                  unitText: 'YEAR',
                },
              }
            : undefined,
        hiringOrganization: {
          '@type': 'Organization',
          name: 'Oklut Technologies',
          sameAs: SITE_URL,
        },
      },
    })),
  }
}

function CareersPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [applyJob, setApplyJob] = useState(null)
  const [applyCount, setApplyCount] = useState(0)

  const loadJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('job_postings')
        .select('*')
        .order('posted_at', { ascending: false })
      if (err) throw new Error(err.message)
      if (data && data.length > 0) {
        const open = data.filter((j) => j.is_open)
        setJobs(open.length > 0 ? open : data)
      } else {
        setJobs([])
      }
    } catch (e) {
      setError(e.message)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadJobs()
    window.scrollTo(0, 0)
  }, [loadJobs])

  const structuredData = useMemo(() => buildJobPostingStructuredData(jobs), [jobs])

  useDocumentMeta({
    title: 'Careers at Oklut Technologies — Open Roles & Jobs in Hyderabad',
    description:
      'Explore open roles at Oklut Technologies. Senior engineering, design and AI positions in Hyderabad, India — remote-friendly and growth-focused.',
    jsonLd: jobs.length > 0 ? structuredData : undefined,
  })

  const handleApplied = useCallback(() => setApplyCount((c) => c + 1), [])

  return (
    <>
      <section className="hero-section careers-hero">
        <div className="container">
          <div className="careers-hero-layout">
            <div className="careers-hero-content">
              <span className="badge">
                <JobIcon name="sparkle" size={13} />
                Careers at Oklut
              </span>
              <h1>
                Build the Future
                <span className="hero-accent"> With Us</span>
              </h1>
              <p>
                Join a senior team shipping custom software, cloud infrastructure, and AI
                for ambitious companies. Remote-friendly, growth-focused, and always learning.
              </p>
              <div className="hero-actions">
                <a href="#open-roles" className="btn btn-cta btn-lg">View Open Roles</a>
                <a href="#my-applications" className="btn btn-glass btn-lg">Track Applications</a>
              </div>
            </div>
            <div className="careers-hero-visual" aria-hidden="true">
              <div className="glass-card">
                <div className="glass-card-head">
                  <span className="glass-card-kicker">Why join Oklut</span>
                  <span className="glass-card-pulse" />
                </div>
                <ul className="glass-perks">
                  <li><span className="glass-perk-icon"><JobIcon name="globe" /></span>Remote-friendly</li>
                  <li><span className="glass-perk-icon"><JobIcon name="rocket" /></span>High-growth projects</li>
                  <li><span className="glass-perk-icon"><JobIcon name="shield" /></span>Health &amp; benefits</li>
                  <li><span className="glass-perk-icon"><JobIcon name="clock" /></span>Flexible working hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="open-roles">
        <div className="container">
          <div className="section-header">
            <span className="badge">Open Positions</span>
            <h2>Open Roles</h2>
            <p>Explore opportunities across engineering, design, and beyond.</p>
          </div>
          <OpenRoles
            jobs={jobs}
            loading={loading}
            error={error}
            onApply={setApplyJob}
            onRetry={loadJobs}
          />
        </div>
      </section>

      <MyApplications user={user} />

      {applyJob && (
        <ApplyModal
          job={applyJob}
          user={user}
          onClose={() => setApplyJob(null)}
          onSubmitted={handleApplied}
        />
      )}
      <span className="visually-hidden" aria-live="polite">
        {applyCount > 0 ? `${applyCount} application${applyCount === 1 ? '' : 's'} submitted` : ''}
      </span>
    </>
  )
}

export default CareersPage
