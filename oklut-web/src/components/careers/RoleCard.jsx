import { memo } from 'react'
import JobIcon from './JobIcon'
import { DEPT_COLORS, formatSalary, timeAgo } from './jobData'

function RoleCard({ job, index = 0, expanded, onToggleDetails, onApply }) {
  const salary = formatSalary(job)
  const meta = [
    job.location && { icon: 'pin', text: job.location },
    job.employment_type && { icon: 'briefcase', text: job.employment_type },
    job.experience_level && { icon: 'trending', text: job.experience_level },
    salary && { icon: 'rupee', text: salary },
    job.posted_at && { icon: 'calendar', text: `Posted ${timeAgo(job.posted_at)}` },
  ].filter(Boolean)

  const deptColor = DEPT_COLORS[job.department] || '#2563eb'
  const detailsId = `role-details-${job.id}`

  return (
    <article
      className="role-card"
      style={{ '--dept-color': deptColor, animationDelay: `${index * 45}ms` }}
    >
      <div className="role-card-head">
        <span className="dept-badge">{job.department || 'General'}</span>
        {job.remote && <span className="badge-remote"><JobIcon name="pin" /> Remote</span>}
      </div>

      <h3 className="role-card-title">{job.title}</h3>
      {job.summary && <p className="role-card-summary">{job.summary}</p>}

      <div className="role-meta">
        {meta.map((m) => (
          <span className="role-meta-item" key={m.icon + m.text}>
            <JobIcon name={m.icon} />
            {m.text}
          </span>
        ))}
      </div>

      <div
        className={`role-details-wrap${expanded ? ' open' : ''}`}
        id={detailsId}
        inert={!expanded}
        aria-hidden={!expanded}
      >
        <div className="role-details-inner">
          <div className="role-details">
            {job.responsibilities?.length > 0 && (
              <div className="role-details-block">
                <h4>Responsibilities</h4>
                <ul>{job.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
              </div>
            )}
            {job.requirements?.length > 0 && (
              <div className="role-details-block">
                <h4>Requirements</h4>
                <ul>{job.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
              </div>
            )}
            {job.nice_to_have?.length > 0 && (
              <div className="role-details-block">
                <h4>Nice to Have</h4>
                <ul>{job.nice_to_have.map((r) => <li key={r}>{r}</li>)}</ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="role-card-actions">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onApply(job)}
          aria-label={`Apply to ${job.title}`}
        >
          Apply
          <JobIcon name="arrow" />
        </button>
        <button
          type="button"
          className={`role-details-toggle${expanded ? ' open' : ''}`}
          onClick={() => onToggleDetails(job.id)}
          aria-expanded={expanded}
          aria-controls={detailsId}
        >
          {expanded ? 'Hide details' : 'View details'}
          <JobIcon name="chevron" />
        </button>
      </div>
    </article>
  )
}

export default memo(RoleCard)
