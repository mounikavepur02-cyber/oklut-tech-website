export const STATUS_LABELS = {
  new: 'New',
  reviewed: 'Reviewed',
  interview: 'Interview',
  offered: 'Offered',
  rejected: 'Not Selected',
  withdrawn: 'Withdrawn',
}

export const DEPT_COLORS = {
  Engineering: '#2563eb',
  Design: '#0d9488',
  Product: '#d97706',
  Marketing: '#dc2626',
  Sales: '#16a34a',
  Operations: '#64748b',
}

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function timeAgo(iso) {
  if (!iso) return ''
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  return formatDate(iso)
}

export function formatSalary(job) {
  const { salary_min: min, salary_max: max } = job
  if (min == null && max == null) return null
  const fmt = (n) =>
    n >= 100000
      ? `₹${(n / 100000).toLocaleString('en-IN', { maximumFractionDigits: 1 })}L`
      : `₹${Number(n).toLocaleString('en-IN')}`
  if (min != null && max != null && min !== max) return `${fmt(min)} – ${fmt(max)} / yr`
  return `${fmt(min ?? max)} / yr`
}
