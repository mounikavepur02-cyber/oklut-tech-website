import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { STATUS_LABELS, formatDate } from './jobData'
import { ApplicationsSkeleton } from './Skeletons'

function StatusBadge({ status }) {
  const safe = status || 'new'
  const label = STATUS_LABELS[safe] || safe
  return <span className={`status-badge status-${safe}`}>{label}</span>
}

function MyApplications({ user }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    setError(null)
    supabase
      .from('job_applications')
      .select('*, job_postings(title, department)')
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) throw new Error(err.message)
        setApplications(data || [])
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message)
          setApplications([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user, reloadKey])

  const retry = () => setReloadKey((k) => k + 1)

  return (
    <section className="section section-alt" id="my-applications">
      <div className="container">
        <div className="section-header">
          <span className="badge">Track</span>
          <h2>Your Applications</h2>
          <p>
            {user
              ? 'Follow the status of every role you have applied to.'
              : 'Sign in to track the status of applications you have submitted.'}
          </p>
        </div>

        {!user && (
          <div className="jobs-empty">
            <h3>Sign in to see your applications</h3>
            <p>
              Use the Sign In button in the navigation bar to view the status of roles you have applied to.
            </p>
          </div>
        )}

        {user && loading && (
          <>
            <ApplicationsSkeleton />
            <p className="visually-hidden" role="status">Loading your applications…</p>
          </>
        )}

        {user && error && (
          <div className="careers-error" role="alert">
            <p>We could not load your applications. ({error})</p>
            <button type="button" className="btn btn-outline btn-sm" onClick={retry}>
              Retry
            </button>
          </div>
        )}

        {user && !loading && !error && applications.length === 0 && (
          <div className="jobs-empty">
            <h3>No applications yet</h3>
            <p>Find a role above and submit your first application — we would love to hear from you.</p>
          </div>
        )}

        {user && !loading && !error && applications.length > 0 && (
          <ul className="applications-list">
            {applications.map((app) => (
              <li key={app.id} className="application-item">
                <div>
                  <strong>{app.job_postings?.title || 'Position'}</strong>
                  <span>{app.job_postings?.department || 'Oklut Technologies'}</span>
                </div>
                <div className="application-right">
                  <StatusBadge status={app.status} />
                  <span className="application-date">{formatDate(app.created_at)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default MyApplications
