import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './CentreOfExcellencePage.css'

// CoE Image Assets
import coeHeroImg from '../assets/coe/coe_hero.jpg'
import coeEngImg from '../assets/coe/coe_engineering.jpg'
import coeInnovImg from '../assets/coe/coe_innovation.jpg'
import coeCloudImg from '../assets/coe/coe_cloud.jpg'

export default function CentreOfExcellencePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Centre of Excellence | Oklut Tech'
  }, [])

  const FRAMEWORK_PILLARS = [
    {
      icon: '⚡',
      title: 'Architectural Governance',
      description: 'Standardized enterprise blueprinting, microservices patterns, and strict code review gates across modern tech stacks.',
      tag: 'Governance Framework'
    },
    {
      icon: '🤖',
      title: 'AI & Machine Intelligence',
      description: 'Custom AI agent deployment, LLM fine-tuning, RAG enterprise pipelines, and automated intelligence integrations.',
      tag: 'AI & Automation'
    },
    {
      icon: '🛡️',
      title: 'Zero-Trust Cybersecurity',
      description: 'Bank-grade compliance, vulnerability prevention, continuous SOC monitoring, and automated threat mitigations.',
      tag: 'Security & Compliance'
    },
    {
      icon: '☁️',
      title: 'Cloud Native Infra',
      description: 'Multi-cloud Kubernetes orchestration, IaC terraform automation, and 99.99% high-availability resilience.',
      tag: 'Cloud Orchestration'
    },
    {
      icon: '🚀',
      title: 'CI/CD & DevOps Automation',
      description: 'Zero-downtime deployment pipelines, blue-green releases, and real-time observability telemetry.',
      tag: 'Delivery Engineering'
    },
    {
      icon: '📈',
      title: 'Product Delivery Metrics',
      description: 'DORA metrics tracking, continuous code quality scoring, and data-driven agile engineering throughput.',
      tag: 'Quality & Benchmarking'
    }
  ]

  return (
    <div className="coe-page">
      {/* HERO SECTION */}
      <section className="coe-hero">
        <img
          src={coeHeroImg}
          alt="Oklut Tech Centre of Excellence Innovation Center"
          className="coe-hero-img-bg"
        />
        <div className="coe-hero-overlay" />
        <div className="coe-hero-content">
          <div className="coe-hero-badge">
            <span>OKLUT TECH COE</span>
          </div>
          <h1 className="coe-hero-title">
            Centre of <span>Excellence</span>
          </h1>
          <p className="coe-hero-subtitle">
            Pioneering digital transformation through rigorous engineering standards, continuous AI innovation, and enterprise cloud excellence.
          </p>
          <div className="coe-hero-actions">
            <Link to="/book-consultation" className="coe-btn-primary">
              Book CoE Consultation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a href="#engineering" className="coe-btn-secondary">
              Explore Capabilities
            </a>
          </div>
        </div>
        <div className="scroll-cue">
          <span>Scroll</span>
          <div className="line" />
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="coe-stats-strip">
        <div className="coe-stats-container">
          <div className="coe-stat-item">
            <div className="coe-stat-num">99.99%</div>
            <div className="coe-stat-label">Enterprise Uptime</div>
          </div>
          <div className="coe-stat-item">
            <div className="coe-stat-num">150+</div>
            <div className="coe-stat-label">Engineers & Architects</div>
          </div>
          <div className="coe-stat-item">
            <div className="coe-stat-num">50+</div>
            <div className="coe-stat-label">AI & Cloud Deployments</div>
          </div>
          <div className="coe-stat-item">
            <div className="coe-stat-num">4.9/5</div>
            <div className="coe-stat-label">Client Satisfaction</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: ENGINEERING MASTERY */}
      <section id="engineering" className="coe-section">
        <div className="coe-split">
          <div className="coe-copy">
            <div className="coe-eyebrow">Pillar 01 — Engineering Standard</div>
            <h2>High-Performance Software Engineering</h2>
            <p>
              Our Centre of Excellence establishes standardized design patterns, rigorous automated testing, and zero-defect code review practices that accelerate time-to-market while keeping technical debt to zero.
            </p>
            <ul className="coe-feature-list">
              <li className="coe-feature-item">
                <span className="coe-check-icon">✓</span>
                Automated CI/CD release pipelines with DORA metrics analytics
              </li>
              <li className="coe-feature-item">
                <span className="coe-check-icon">✓</span>
                Strict architectural review boards & microservices governance
              </li>
              <li className="coe-feature-item">
                <span className="coe-check-icon">✓</span>
                Continuous security linting and automated vulnerability patching
              </li>
            </ul>
            <Link to="/book-consultation" className="coe-btn-primary">
              Learn Engineering Standards
            </Link>
          </div>
          <div className="coe-visual">
            <img src={coeEngImg} alt="Engineering Excellence Center Dashboard" />
            <div className="tag">
              <span>DevOps & Quality Engineering</span>
            </div>
          </div>
        </div>
      </section>

      <div className="coe-divider" />

      {/* SECTION 2: AI & INNOVATION HUB */}
      <section className="coe-section">
        <div className="coe-split reverse">
          <div className="coe-copy">
            <div className="coe-eyebrow">Pillar 02 — R&D Innovation</div>
            <h2>AI Innovation Lab & Emerging Technology</h2>
            <p>
              We experiment with state-of-the-art machine learning models, custom AI agents, and intelligent workflow automation to build next-generation enterprise products.
            </p>
            <ul className="coe-feature-list">
              <li className="coe-feature-item">
                <span className="coe-check-icon">✓</span>
                Enterprise Generative AI & RAG knowledge integration
              </li>
              <li className="coe-feature-item">
                <span className="coe-check-icon">✓</span>
                Autonomous AI agent workflows for business process automation
              </li>
              <li className="coe-feature-item">
                <span className="coe-check-icon">✓</span>
                Custom machine learning model optimization & fine-tuning
              </li>
            </ul>
            <Link to="/book-consultation" className="coe-btn-primary">
              Explore AI Lab
            </Link>
          </div>
          <div className="coe-visual">
            <img src={coeInnovImg} alt="AI Innovation Hub Visualization" />
            <div className="tag">
              <span>Artificial Intelligence & Neural R&D</span>
            </div>
          </div>
        </div>
      </section>

      <div className="coe-divider" />

      {/* SECTION 3: CLOUD & SECURITY */}
      <section className="coe-section">
        <div className="coe-split">
          <div className="coe-copy">
            <div className="coe-eyebrow">Pillar 03 — Infrastructure</div>
            <h2>Enterprise Cloud Architecture & Zero-Trust Security</h2>
            <p>
              We design and manage resilient multi-cloud environments built on zero-trust security frameworks, ensuring your data remains protected against evolving global cyber threats.
            </p>
            <ul className="coe-feature-list">
              <li className="coe-feature-item">
                <span className="coe-check-icon">✓</span>
                AWS, Azure, & GCP multi-cloud infrastructure orchestration
              </li>
              <li className="coe-feature-item">
                <span className="coe-check-icon">✓</span>
                Zero-Trust network security & ISO 27001 / SOC2 compliance
              </li>
              <li className="coe-feature-item">
                <span className="coe-check-icon">✓</span>
                Infra-as-Code (Terraform) with automated disaster recovery
              </li>
            </ul>
            <Link to="/book-consultation" className="coe-btn-primary">
              Consult Cloud Architect
            </Link>
          </div>
          <div className="coe-visual">
            <img src={coeCloudImg} alt="Cloud Infrastructure & Security Center" />
            <div className="tag">
              <span>Cloud & Zero-Trust Security</span>
            </div>
          </div>
        </div>
      </section>

      {/* FRAMEWORK GRID SECTION */}
      <section className="coe-grid-section">
        <div className="coe-header-center">
          <div className="coe-eyebrow">Comprehensive Capabilities</div>
          <h2>Our Core Excellence Frameworks</h2>
          <p>
            Designed to empower enterprise clients with scalable, secure, and modern digital platforms.
          </p>
        </div>

        <div className="coe-cards-grid">
          {FRAMEWORK_PILLARS.map((pillar, idx) => (
            <div key={idx} className="coe-card">
              <div className="coe-card-icon">{pillar.icon}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
              <div className="coe-card-tag">{pillar.tag}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="coe-cta-section">
        <div className="coe-cta-box">
          <h2>Elevate Your Engineering Standard</h2>
          <p>
            Partner with Oklut Tech’s Centre of Excellence to build resilient cloud architectures, automate workflows, and accelerate digital product delivery.
          </p>
          <Link to="/book-consultation" className="coe-btn-primary">
            Schedule Executive Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}
