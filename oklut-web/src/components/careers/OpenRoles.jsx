import { useCallback, useMemo, useState } from 'react'
import JobIcon from './JobIcon'
import RoleCard from './RoleCard'
import { RoleCardSkeleton } from './Skeletons'

function FilterSelect({ id, label, value, onChange, options }) {
  return (
    <div className="filter-field">
      <label htmlFor={id}>{label}</label>
      <div className="filter-select">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  )
}

function NoResults({ query, onClear }) {
  return (
    <div className="jobs-empty roles-empty">
      <div className="roles-empty-art" aria-hidden="true">
        <svg width="104" height="104" viewBox="0 0 104 104" fill="none">
          <rect x="10" y="10" width="84" height="84" rx="24" fill="var(--primary-soft)" />
          <circle cx="46" cy="44" r="19" stroke="var(--primary)" strokeWidth="5" />
          <path d="M60 58l16 16" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" />
          <path d="M38 41h14M38 47h9" stroke="var(--text-muted)" strokeWidth="4" strokeLinecap="round" />
          <rect x="54" y="66" width="34" height="7" rx="3.5" fill="var(--primary)" opacity="0.22" />
        </svg>
      </div>
      <h3>No roles match your filters</h3>
      <p>
        {query
          ? `We could not find roles matching "${query}". `
          : 'We could not find roles that match your criteria. '}
        Try adjusting your search or clearing a few filters to see more opportunities.
      </p>
      <button type="button" className="btn btn-outline" onClick={onClear}>
        Clear all filters
      </button>
    </div>
  )
}

function OpenRoles({ jobs, loading, error, onApply, onRetry }) {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All Departments')
  const [location, setLocation] = useState('All Locations')
  const [employmentType, setEmploymentType] = useState('All Types')
  const [experienceLevel, setExperienceLevel] = useState('All Levels')
  const [expandedId, setExpandedId] = useState(null)

  const departments = useMemo(() => {
    const set = new Set(jobs.map((j) => j.department).filter(Boolean))
    return ['All Departments', ...set]
  }, [jobs])

  const locations = useMemo(() => {
    const set = new Set(jobs.map((j) => j.location).filter(Boolean))
    return ['All Locations', ...set]
  }, [jobs])

  const employmentTypes = useMemo(() => {
    const set = new Set(jobs.map((j) => j.employment_type).filter(Boolean))
    return ['All Types', ...set]
  }, [jobs])

  const experienceLevels = useMemo(() => {
    const set = new Set(jobs.map((j) => j.experience_level).filter(Boolean))
    return ['All Levels', ...set]
  }, [jobs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return jobs.filter((j) => {
      const matchQuery = !q || (j.title || '').toLowerCase().includes(q)
      const matchDept = department === 'All Departments' || j.department === department
      const matchLoc = location === 'All Locations' || j.location === location
      const matchType = employmentType === 'All Types' || j.employment_type === employmentType
      const matchExp = experienceLevel === 'All Levels' || j.experience_level === experienceLevel
      return matchQuery && matchDept && matchLoc && matchType && matchExp
    })
  }, [jobs, query, department, location, employmentType, experienceLevel])

  const hasActiveFilters =
    query.trim() !== '' ||
    department !== 'All Departments' ||
    location !== 'All Locations' ||
    employmentType !== 'All Types' ||
    experienceLevel !== 'All Levels'

  const clearFilters = useCallback(() => {
    setQuery('')
    setDepartment('All Departments')
    setLocation('All Locations')
    setEmploymentType('All Types')
    setExperienceLevel('All Levels')
  }, [])

  const toggleDetails = useCallback(
    (id) => setExpandedId((prev) => (prev === id ? null : id)),
    [],
  )

  const gridKey = `${query}|${department}|${location}|${employmentType}|${experienceLevel}`
  const noun = jobs.length === 1 ? 'role' : 'roles'
  const skeletonCount = jobs.length || 4

  return (
    <>
      <div className="careers-controls">
        <div className="careers-search">
          <span className="careers-search-icon" aria-hidden="true">
            <JobIcon name="search" size={18} />
          </span>
          <input
            type="search"
            placeholder="Search by job title…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search roles by job title"
          />
          {query && (
            <button
              type="button"
              className="careers-search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <JobIcon name="x" size={14} />
            </button>
          )}
        </div>

        <div className="careers-filter-row">
          <FilterSelect id="filter-department" label="Department" value={department} onChange={setDepartment} options={departments} />
          <FilterSelect id="filter-location" label="Location" value={location} onChange={setLocation} options={locations} />
          <FilterSelect id="filter-type" label="Employment Type" value={employmentType} onChange={setEmploymentType} options={employmentTypes} />
          <FilterSelect id="filter-level" label="Experience" value={experienceLevel} onChange={setExperienceLevel} options={experienceLevels} />
        </div>
      </div>

      <div className="careers-results-bar">
        <span className="role-count" aria-live="polite">
          {loading
            ? 'Loading open roles…'
            : error
              ? 'Unable to load roles'
              : hasActiveFilters
                ? `${filtered.length} of ${jobs.length} ${noun}`
                : `${jobs.length} open ${noun}`}
        </span>
        {hasActiveFilters && !loading && !error && (
          <button type="button" className="clear-filters" onClick={clearFilters}>
            <JobIcon name="x" size={14} />
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <>
          <div className="roles-grid" aria-hidden="true">
            {Array.from({ length: skeletonCount }).map((_, i) => <RoleCardSkeleton key={i} />)}
          </div>
          <p className="visually-hidden" role="status">Loading open roles…</p>
        </>
      ) : error ? (
        <div className="careers-error" role="alert">
          <p>We could not load live roles right now. Please try again in a moment.</p>
          <button type="button" className="btn btn-outline btn-sm" onClick={onRetry}>
            Retry
          </button>
        </div>
      ) : (
        <>
          {filtered.length === 0 && <NoResults query={query.trim()} onClear={clearFilters} />}
          {filtered.length > 0 && (
            <div className="roles-grid" key={gridKey}>
              {filtered.map((job, i) => (
                <RoleCard
                  key={job.id}
                  job={job}
                  index={i}
                  expanded={expandedId === job.id}
                  onToggleDetails={toggleDetails}
                  onApply={onApply}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default OpenRoles
