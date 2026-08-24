import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import './CustomDevelopmentPage.css'

export default function CustomDevelopmentPage() {
  useDocumentMeta({
    title: 'Custom Development — Oklut Technologies',
    description:
      'Software built around how you work. Tailored enterprise applications, scalable architectures, and custom digital solutions built to drive business growth.',
  })

  const navigate = useNavigate()

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

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        revealInView()
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    revealInView()
    setTimeout(revealInView, 50)

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const handleBookConsultation = () => {
    navigate('/book-consultation', { state: { service: 'Custom Development' } })
  }

  return (
    <div className="cd-page">
      {/* Hero Section */}
      <section className="cd-hero">
        <img
          src="/img/custom-dev-hero.jpg"
          alt="Custom Software Development Engineering Workspace"
          className="cd-hero-bg"
        />
        <div className="cd-hero-copy reveal">
          <div className="cd-eyebrow">Custom Software Engineering</div>
          <h1>
            Custom <em>Development</em>
          </h1>
          <p>Software built around how you work — tailored digital solutions designed for your unique business goals.</p>
          <div className="cd-hero-actions">
            <button type="button" className="cd-btn-primary" onClick={handleBookConsultation}>
              Book a Custom Development Call
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <Link to="/solution-engineering" className="cd-btn-outline">
              Explore Solution Engineering
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Rows */}
      <section className="cd-section">
        <div className="cd-wrap">
          {/* Row 1: User Provided Content */}
          <div className="cd-row reveal">
            <div className="cd-text-col">
              <div className="cd-eyebrow">Custom Development</div>
              <h2>Software Built Around How You Work</h2>
              <p>
                Every business has unique requirements, workflows, and objectives that demand more than standard software
                solutions. Our Custom Development service combines technical expertise with a detailed understanding of
                your business needs to design and build solutions tailored to your specific requirements.
              </p>
              <p>
                From understanding your processes and defining functional needs to architecting the right technology
                approach, our team focuses on creating reliable, scalable, and high-performing software that aligns
                closely with your business goals.
              </p>
            </div>
            <div className="cd-img-col">
              <div className="cd-img-frame">
                <img src="/img/custom-dev-sec1.jpg" alt="Software Built Around How You Work" />
              </div>
            </div>
          </div>

          {/* Row 2: Tailored Architecture & Engineering (Reverse) */}
          <div className="cd-row reverse reveal">
            <div className="cd-text-col">
              <div className="cd-eyebrow">Tailored Architecture &amp; Engineering</div>
              <h2>Scalable Systems Built for Growth</h2>
              <p>
                We design robust software architectures that evolve alongside your enterprise. From microservices and
                RESTful/GraphQL APIs to high-throughput data processing engines, our custom engineering ensures system
                resilience, sub-second latency, and seamless scalability under peak workloads.
              </p>
              <p>
                By building clean, modular codebases with strict security controls, we provide your organization with an
                adaptable technology foundation that supports ongoing innovation.
              </p>
            </div>
            <div className="cd-img-col">
              <div className="cd-img-frame">
                <img src="/img/custom-dev-sec2.jpg" alt="Scalable Microservices Architecture" />
              </div>
            </div>
          </div>

          {/* Row 3: End-to-End Development Lifecycle */}
          <div className="cd-row reveal">
            <div className="cd-text-col">
              <div className="cd-eyebrow">End-to-End Development Lifecycle</div>
              <h2>Agile Delivery with Uncompromising Quality</h2>
              <p>
                Our dedicated software teams manage every phase of the development lifecycle—from discovery, UI/UX
                prototyping, and sprint planning to continuous integration, automated testing, and cloud deployment.
              </p>
              <p>
                Transparent communication, automated testing pipelines, and milestone-driven delivery keep your project
                on schedule and aligned with strategic business metrics.
              </p>
            </div>
            <div className="cd-img-col">
              <div className="cd-img-frame">
                <img src="/img/custom-dev-sec3.jpg" alt="Continuous Delivery and Telemetry" />
              </div>
            </div>
          </div>

          {/* Row 4: Modern Stack & Seamless Integration (Reverse) */}
          <div className="cd-row reverse reveal">
            <div className="cd-text-col">
              <div className="cd-eyebrow">Modern Stack &amp; Integration</div>
              <h2>Unifying Your Digital Ecosystem</h2>
              <p>
                Eliminate operational silos by integrating custom software directly into your existing infrastructure.
                Whether connecting legacy databases, third-party ERP/CRM platforms, or cloud microservices, we build
                secure, API-driven workflows.
              </p>
              <p>
                Our solutions streamline internal operations, enhance real-time data visibility, and empower teams to work
                more productively across all business units.
              </p>
            </div>
            <div className="cd-img-col">
              <div className="cd-img-frame">
                <img src="/img/solution-arch-design.jpg" alt="API Integration and Digital Ecosystems" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="cd-capabilities-section">
        <div className="cd-wrap">
          <div className="cd-section-header reveal">
            <h2>Our Development Pillars</h2>
            <p>Foundational engineering principles that guarantee enterprise-grade quality and performance.</p>
          </div>
          <div className="cd-grid">
            <div className="cd-card reveal">
              <div className="cd-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3>Bespoke Architecture</h3>
              <p>Tailored technology choices designed to match your specific business domain and operational load.</p>
            </div>
            <div className="cd-card reveal">
              <div className="cd-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3>Enterprise Security</h3>
              <p>Built-in security standards, role-based access control, and compliance with industry regulations.</p>
            </div>
            <div className="cd-card reveal">
              <div className="cd-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                </svg>
              </div>
              <h3>Cloud-Native Scale</h3>
              <p>Containerized microservices and automated auto-scaling for uninterrupted cloud availability.</p>
            </div>
            <div className="cd-card reveal">
              <div className="cd-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>Agile Delivery</h3>
              <p>Iterative sprint cycles with continuous stakeholder feedback and transparent progress tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cd-cta-section">
        <div className="cd-wrap">
          <div className="cd-cta-box reveal">
            <h2>Ready to Build Your Custom Software Solution?</h2>
            <p>
              Partner with our solution engineering team to design, architect, and deliver custom digital applications
              tailored to your unique business goals.
            </p>
            <button type="button" className="cd-btn-primary" onClick={handleBookConsultation}>
              Book a Custom Software Consultation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
