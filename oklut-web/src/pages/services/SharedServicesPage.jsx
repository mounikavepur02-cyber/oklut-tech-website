import { ServicePageTemplate } from './ServicePageTemplate'
import './ServicePage.css'

export default function SharedServicesPage() {
  const heroImageUrl = '/img/shared-services-hero.jpg'
  const overviewImageUrl = '/img/case-shared-services.jpg'

  return (
    <div className="shared-services-page">
      <ServicePageTemplate
        title="Shared Services"
        tagline="Centralize. Optimize. Scale."
        heroImage={heroImageUrl}
        hideHeroTitle
        description="Transform your business operations with intelligent shared services designed to simplify processes, improve efficiency, and support scalable growth."
        overviewImage={overviewImageUrl}
        sectionHeadline="One Platform. Multiple Business Functions. Better Outcomes."
        sectionDescription="Oklut Technologies provides centralized shared services that help organizations manage essential business functions more efficiently. By combining skilled expertise, streamlined processes, and modern technology, we help businesses reduce operational complexity and focus on their core objectives."
        showCta={false}
      />

      {/* How It Works */}
      <section className="section service-overview">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">
              <span className="eyebrow-bar" aria-hidden="true" />
              How It Works
            </span>
            <h2>A proven path to shared services success</h2>
            <p className="service-overview-desc">
              Whether you need to centralize back-office operations, establish a global services hub,
              or optimize an existing shared service center, our structured approach ensures a smooth
              transition with minimal disruption.
            </p>
          </div>
          <div className="service-features-grid" style={{ marginTop: '48px' }}>
            {[
              { step: '01', title: 'Assess & Map', description: 'We analyze your current processes, cost structures, and pain points to identify consolidation opportunities.' },
              { step: '02', title: 'Design & Plan', description: 'We architect the shared services model — defining governance, SLAs, technology stack, and team structure.' },
              { step: '03', title: 'Migrate & Launch', description: 'We execute a phased migration with knowledge transfer, training, and parallel-run validation.' },
              { step: '04', title: 'Optimize & Scale', description: 'Continuous improvement through automation, analytics, and iterative process refinement.' },
            ].map((item, i) => (
              <article key={item.step} className="service-feature-card reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="service-feature-icon" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {item.step}
                </span>
                <h3>{item.title}</h3>
                <p style={{ marginTop: '8px', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
