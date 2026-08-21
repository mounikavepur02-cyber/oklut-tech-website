import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import './SolutionEngineeringPage.css'

function FeatureIcon({ name }) {
  const icons = {
    cpu: (
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M6.34 6.34l1.42 1.42M16.24 16.24l1.42 1.42M6.34 17.66l1.42-1.42M16.24 7.76l1.42-1.42M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    ),
    cloud: (
      <path d="M17.5 19a4.5 4.5 0 1 0-.42-8.98A6 6 0 0 0 5.5 13 3.5 3.5 0 0 0 7 20h10.5z" />
    ),
    shield: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
    layers: (
      <>
        <path d="m12 2 10 5-10 5L2 7l10-5z" />
        <path d="m2 12 10 5 10-5" />
        <path d="m2 17 10 5 10-5" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
    check: (
      <path d="M20 6 9 17l-5-5" />
    )
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] || icons.cpu}
    </svg>
  )
}

export default function SolutionEngineeringPage() {
  useDocumentMeta({
    title: 'Solution Engineering — Oklut Technologies',
    description:
      'Architecting scalable, resilient, and high-impact digital systems. Custom software architecture, enterprise cloud integration, and automated CI/CD pipelines.',
  })

  useEffect(() => {
    window.scrollTo(0, 0)

    const reveals = () => Array.from(document.querySelectorAll('.reveal'))
    const revealEl = (el) => el.classList.add('revealed')
    const isInView = (el) => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      return r.top < vh && r.bottom > 0
    }
    const revealInView = () => {
      reveals().forEach((el) => {
        if (!el.classList.contains('revealed') && isInView(el)) revealEl(el)
      })
    }

    if (!('IntersectionObserver' in window)) {
      reveals().forEach(revealEl)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealEl(entry.target)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    reveals().forEach((el) => io.observe(el))

    window.addEventListener('scroll', revealInView, { passive: true })
    revealInView()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', revealInView)
    }
  }, [])

  return (
    <div className="se-page">
      {/* Hero Section */}
      <section className="se-hero">
        <img
          src="/img/solution-engineering-hero.jpg"
          alt="Oklut Solution Engineering Architecture"
          className="se-hero-bg"
        />
        <div className="se-hero-content reveal">
          <span className="se-hero-badge">Engineering & Architecture</span>
          <h1>Solution Engineering</h1>
          <p>
            Architecting scalable, resilient, and high-impact digital systems tailored to your business vision.
            From cloud-native microservices to automated deployment pipelines, we design software built for long-term growth.
          </p>
          <div className="se-hero-actions">
            <Link to="/book-consultation" className="btn btn-primary">
              Book a Technical Consultation
            </Link>
            <a href="#architecture" className="btn btn-secondary">
              Explore Our Architecture
            </a>
          </div>
        </div>
      </section>

      {/* Main Section 1 */}
      <section id="architecture" className="se-section reveal">
        <div className="text">
          <span className="se-eyebrow">ARCHITECTURAL EXCELLENCE</span>
          <h2>Custom Software Architecture & System Design</h2>
          <p>
            Grounded in deep domain expertise across complex web applications, automated software, and enterprise B2B integration, our engineering team designs modular systems that eliminate technical debt and maximize velocity.
          </p>
          <p>
            We balance immediate operational agility with long-term reliability — selecting optimal architectural patterns, database schemas, and microservice boundaries that allow your engineering team to iterate rapidly without sacrificing stability.
          </p>
        </div>
        <div className="media">
          <img
            src="/img/solution-arch-design.jpg"
            alt="Software Architects Designing Microservices Architecture"
            loading="lazy"
          />
        </div>
      </section>

      <div className="se-divider" />

      {/* Main Section 2 */}
      <section className="se-section reverse reveal">
        <div className="text">
          <span className="se-eyebrow">ENTERPRISE CLOUD INTEGRATION</span>
          <h2>Cloud-Native Solutions & API Ecosystems</h2>
          <p>
            Transform your digital business capabilities with API-led integrations, IoT middleware pipelines, and cloud migration solutions across AWS, Azure, and Google Cloud Platform.
          </p>
          <p>
            Our managed cloud services help modernize legacy systems, streamline third-party API connectivity, and implement robust event-driven data pipelines for real-time business intelligence and multi-channel mobility.
          </p>
        </div>
        <div className="media">
          <img
            src="/img/cloud-integration-sec.jpg"
            alt="Enterprise Hybrid Multi-Cloud Data Pipeline Integration"
            loading="lazy"
          />
        </div>
      </section>

      <div className="se-divider" />

      {/* Main Section 3 */}
      <section className="se-section reveal">
        <div className="text">
          <span className="se-eyebrow">AUTOMATION & DEVOPS</span>
          <h2>Continuous Delivery Pipelines & Infrastructure Security</h2>
          <p>
            Accelerate your software release cadences with continuous integration and continuous deployment (CI/CD) pipelines, container orchestration, and automated vulnerability scanning.
          </p>
          <p>
            We embed proactive monitoring, logging, and infrastructure-as-code (IaC) principles into your operational workflow, empowering your organization to ship features with high confidence, zero downtime, and strict security compliance.
          </p>
        </div>
        <div className="media">
          <img
            src="/img/devops-automation-sec.jpg"
            alt="DevOps Operations Team Monitoring Automated CI/CD Pipeline"
            loading="lazy"
          />
        </div>
      </section>

      {/* Capabilities & Engineering Principles */}
      <section className="se-principles">
        <div className="se-principles-container">
          <div className="se-principles-head reveal">
            <span className="se-eyebrow">CORE PRINCIPLES</span>
            <h2 className="section-title">Engineered for Enterprise Success</h2>
          </div>
          <div className="se-principles-grid">
            <div className="se-card reveal" style={{ transitionDelay: '0ms' }}>
              <div className="se-card-icon">
                <FeatureIcon name="layers" />
              </div>
              <h3>Domain-Driven Architecture</h3>
              <p>
                Clean separation of concerns with modular services, ensuring your software remains maintainable as business logic expands.
              </p>
            </div>
            <div className="se-card reveal" style={{ transitionDelay: '80ms' }}>
              <div className="se-card-icon">
                <FeatureIcon name="cloud" />
              </div>
              <h3>Cloud-Native Resilience</h3>
              <p>
                Auto-scaling infrastructure with high availability, fault tolerance, and multi-region failover across AWS, Azure & GCP.
              </p>
            </div>
            <div className="se-card reveal" style={{ transitionDelay: '160ms' }}>
              <div className="se-card-icon">
                <FeatureIcon name="shield" />
              </div>
              <h3>DevSecOps & Compliance</h3>
              <p>
                Security-by-design with automated static analysis, compliance checks, data encryption at rest & in transit.
              </p>
            </div>
            <div className="se-card reveal" style={{ transitionDelay: '240ms' }}>
              <div className="se-card-icon">
                <FeatureIcon name="cpu" />
              </div>
              <h3>High Throughput & Performance</h3>
              <p>
                Optimized database queries, caching strategies, and low-latency API response times designed for heavy enterprise traffic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="se-cta">
        <div className="se-cta-container reveal">
          <h2>Ready to Architect Your Digital Solution?</h2>
          <p>
            Partner with Oklut Technologies to modernize your legacy applications, design cloud infrastructure, and scale your technology platform.
          </p>
          <div className="se-hero-actions">
            <Link to="/book-consultation" className="btn btn-primary">
              Schedule a Consultation
            </Link>
            <Link to="/" className="btn btn-secondary">
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
