import { ServicePageTemplate } from './ServicePageTemplate'
import { Icon } from '../../components/Icon'
import './ServicePage.css'

export default function ManagedServicesPage() {
  const heroImageUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=90'
  const sideImageUrl = 'https://www.designarena.ai/_next/image?url=https%3A%2F%2Fdvxrhkgloakisnvqoxgl.supabase.co%2Fstorage%2Fv1%2Fobject%2Fsign%2Fimages%2F1787553034673_c359kv.jpg%3Ftoken%3DeyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80NWE1YWU1ZS0xNzg4LTRiMWYtYWM5OC1hMjgwNmQ2OTM4ZWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvMTc4NzU1MzAzNDY3M19jMzU5a3YuanBnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NzU1MzA2NSwiZXhwIjoxNzg3NTU2NjY1fQ.224mxqOy5hv3lycxPMdCWIaaki3A5nP0VNmAomYNk80&w=750&q=75'

  return (
    <div className="managed-services-page">
      <ServicePageTemplate
        title="Managed Services"
        tagline="Technology operations, managed with confidence."
        heroImage={heroImageUrl}
        hideHeroTitle
        description="Oklut's Managed Services help organizations simplify IT operations, improve performance, and maintain reliable technology environments. We provide continuous monitoring, support, maintenance, and optimization so businesses can focus on their core operations while we manage their technology needs."
        showCta={false}
      />

      {/* What We Offer */}
      <section className="section service-overview">
        <div className="container">
          <div className="service-overview-layout">
            <div className="section-head reveal">
              <span className="eyebrow">
                <span className="eyebrow-bar" aria-hidden="true" />
                What We Offer
              </span>
              <h2>Comprehensive managed services for your business</h2>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: '24/7 Monitoring & Support', description: 'Proactive monitoring and technical support to keep critical systems running smoothly.' },
                  { title: 'Application Management', description: 'Ongoing maintenance, updates, troubleshooting, and optimization of business applications.' },
                  { title: 'Infrastructure Management', description: 'Management and monitoring of servers, networks, cloud environments, and IT infrastructure.' },
                  { title: 'Cloud Managed Services', description: 'Cloud monitoring, optimization, security, and operational support.' },
                  { title: 'Security & Compliance', description: 'Proactive security management to help protect systems, applications, and business data.' },
                  { title: 'Performance Optimization', description: 'Identify bottlenecks and continuously improve system performance and reliability.' },
                  { title: 'Backup & Recovery', description: 'Reliable backup strategies and recovery support to minimize business disruption.' },
                  { title: 'Service Desk Support', description: 'Centralized technical assistance for users, applications, and IT issues.' },
                ].map((item, i) => (
                  <li key={item.title} className="reveal" style={{ transitionDelay: `${i * 60}ms`, display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '6px', background: 'var(--color-primary)', color: 'var(--color-primary-contrast)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
                      <Icon name="check" />
                    </span>
                    <span>
                      <strong>{item.title}</strong> – {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="service-overview-image reveal">
              <img
                src={sideImageUrl}
                alt="Managed Services"
                onError={(e) => {
                  if (e.currentTarget.src !== '/img/shared-services-hero.jpg') {
                    e.currentTarget.src = '/img/shared-services-hero.jpg'
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
