export function RoleCardSkeleton() {
  return (
    <div className="role-card role-card-skeleton" aria-hidden="true">
      <div className="skeleton skeleton-badge" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text short" />
      <div className="skeleton skeleton-meta" />
    </div>
  )
}

export function ApplicationsSkeleton({ count = 3 }) {
  return (
    <div className="applications-list" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="application-item">
          <div className="application-skeleton-main">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>
          <div className="skeleton skeleton-chip" />
        </div>
      ))}
    </div>
  )
}
