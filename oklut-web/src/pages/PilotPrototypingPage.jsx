import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import './PilotPrototypingPage.css'

export default function PilotPrototypingPage() {
  useDocumentMeta({
    title: 'Pilot & Prototyping — Oklut Technologies',
    description:
      'Validate before you build at scale. Test assumptions, prove technical feasibility, and accelerate your path from concept to production-ready solution.',
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
    navigate('/book-consultation', { state: { service: 'Pilot & Prototyping' } })
  }

  return (
    <div className="pp-page">
      {/* Full-screen Hero Section */}
      <section className="pp-hero">
        <img
          src="/img/pilot-prototyping-hero.jpg"
          alt="Oklut Pilot and Prototyping Workspace"
          className="pp-hero-bg"
        />
        <div className="pp-hero-copy reveal">
          <div className="pp-eyebrow">Solution Engineering &amp; Custom Development</div>
          <h1>
            Pilot &amp; <em>Prototyping</em>
          </h1>
          <p>Validate before you build at scale — the confident path from idea to proven concept.</p>
          <div className="pp-hero-actions">
            <button type="button" className="pp-btn-primary" onClick={handleBookConsultation}>
              Initiate a Pilot Discovery
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <Link to="/solution-engineering" className="pp-btn-outline">
              Explore Solution Engineering
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Rows */}
      <section className="pp-content-section">
        <div className="pp-wrap">
          {/* Row 1: Why Prototype First */}
          <div className="pp-row reveal">
            <div className="pp-col-text">
              <div className="pp-tag">Why Prototype First</div>
              <h2>From idea to validated concept</h2>
              <p>
                Turning an idea into a successful solution requires more than simply building it. Our Pilot &amp;
                Prototyping service helps businesses evaluate concepts, test assumptions, and understand what works
                before committing to full-scale development.
              </p>
              <p>
                We work with you to define key objectives, identify potential challenges, and create focused prototypes
                or pilot solutions that bring your idea closer to reality. This approach provides an opportunity to
                explore functionality, user experience, technical feasibility, and business value early, helping you
                make better decisions with greater confidence.
              </p>
            </div>
            <div className="pp-col-image">
              <div className="pp-img-frame">
                <img src="/img/proto-concept-sec.jpg" alt="Concept Validation and Architectural Blueprints" />
                <div className="pp-cap">Interactive Wireframes &amp; Architectural Blueprints</div>
              </div>
            </div>
          </div>

          {/* Row 2: Agile Concept Validation (Reverse) */}
          <div className="pp-row reverse reveal">
            <div className="pp-col-text">
              <div className="pp-tag">Agile Concept Validation</div>
              <h2>Low-Fidelity to Production-Ready Mockups</h2>
              <p>
                We build interactive wireframes, clickable user flows, and functional proof-of-concepts in days, not
                months. Test real user interactions, refine UI/UX patterns, and gather actionable feedback from
                stakeholders before writing a single line of backend production code.
              </p>
              <p>
                By shortening feedback loops during early development, your product team minimizes rework, aligns brand
                messaging, and establishes clear technical specifications before capital-intensive build phases begin.
              </p>
            </div>
            <div className="pp-col-image">
              <div className="pp-img-frame">
                <img src="/img/proto-rapid-sec.jpg" alt="Rapid Prototyping and UX Testing" />
                <div className="pp-cap">Rapid Iteration &amp; Clickable UX Prototypes</div>
              </div>
            </div>
          </div>

          {/* Row 3: Technical Feasibility & Risk Reduction */}
          <div className="pp-row reveal">
            <div className="pp-col-text">
              <div className="pp-tag">Architectural Risk Mitigation</div>
              <h2>De-Risk Complex System Integrations</h2>
              <p>
                Uncover technical bottlenecks, API limitations, and performance constraints before full capital
                commitment. Our pilot engineering team stress-tests legacy integrations, data pipelines, and
                third-party APIs in isolated sandbox environments.
              </p>
              <p>
                This proactive risk mitigation ensures high system availability, security compliance, and predictable
                development timelines when transitioning your proof-of-concept into enterprise production.
              </p>
            </div>
            <div className="pp-col-image">
              <div className="pp-img-frame">
                <img src="/img/solution-arch-design.jpg" alt="De-Risking Cloud & System Architecture" />
                <div className="pp-cap">Sandbox Integration &amp; Stress Testing</div>
              </div>
            </div>
          </div>

          {/* Row 4: Controlled Production Pilot (Reverse) */}
          <div className="pp-row reverse reveal">
            <div className="pp-col-text">
              <div className="pp-tag">Controlled Production Pilot</div>
              <h2>Real-World Pilot Launch &amp; Data Insights</h2>
              <p>
                Deploy targeted pilot releases to a select user segment or test market. Track performance metrics, user
                adoption analytics, and operational feedback to quantify business value and establish a data-backed
                business case for enterprise scaling.
              </p>
              <p>
                With real-world pilot insights, executive sponsors gain clear ROI metrics to justify broader deployment
                and strategic digital transformation investments.
              </p>
            </div>
            <div className="pp-col-image">
              <div className="pp-img-frame">
                <img src="/img/proto-pilot-sec.jpg" alt="Pilot Production Deployment and Analytics" />
                <div className="pp-cap">Controlled Deployment &amp; Performance Telemetry</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Principles Section */}
      <section className="pp-principles-section">
        <div className="pp-wrap">
          <div className="pp-section-header reveal">
            <h2>Our Pilot Engineering Principles</h2>
            <p>Guiding principles that turn technical uncertainty into predictable business success.</p>
          </div>
          <div className="pp-grid">
            <div className="pp-card reveal">
              <div className="pp-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3>Rapid Iteration</h3>
              <p>Deliver working prototypes rapidly to validate value propositions early in the development lifecycle.</p>
            </div>
            <div className="pp-card reveal">
              <div className="pp-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>User Validation</h3>
              <p>Incorporate authentic user feedback directly into wireframes to refine interface workflows.</p>
            </div>
            <div className="pp-card reveal">
              <div className="pp-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Risk Reduction</h3>
              <p>Identify architectural edge cases, security threats, and third-party dependencies early.</p>
            </div>
            <div className="pp-card reveal">
              <div className="pp-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3>Data-Driven Scaling</h3>
              <p>Leverage operational metrics from pilot launches to build a seamless scaling blueprint.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pp-cta-section">
        <div className="pp-wrap">
          <div className="pp-cta-box reveal">
            <h2>Ready to validate your next digital solution?</h2>
            <p>
              Connect with our solution engineering team to explore your project requirements, build a prototype, and
              test feasibility with zero risk.
            </p>
            <button type="button" className="pp-btn-primary" onClick={handleBookConsultation}>
              Book a Pilot Consultation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
