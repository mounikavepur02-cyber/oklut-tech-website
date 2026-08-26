import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from './i18n/TranslationContext'
import { supabase } from './lib/supabase'
import { useAuth } from './lib/auth'
import AuthModal from './components/AuthModal'
import { CookieConsentBanner } from './components/cookie/CookieConsentBanner.tsx'
import { CookiePreferenceModal } from './components/cookie/CookiePreferenceModal.tsx'
import { useCookieConsent } from './components/cookie/CookieConsentProvider.tsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx'
import { Chatbot } from './components/Chatbot/Chatbot'
import { Icon } from './components/Icon'
import './App.css'

function RedirectToStatic({ file }) {
  useEffect(() => {
    window.location.assign(file)
  }, [file])
  return null
}

const CareersPage = lazy(() => import('./pages/CareersPage'))
const BookConsultationPage = lazy(() => import('./pages/BookConsultationPage'))




const EndToEndSolutionsPage = lazy(() => import('./pages/services/EndToEndSolutionsPage'))
const SharedServicesPage = lazy(() => import('./pages/services/SharedServicesPage'))
// Premium pages merged from dinesh/services + chandu/services (modern layouts + assets)
const CustomDevelopmentPage = lazy(() => import('./pages/CustomDevelopmentPage'))
const PilotPrototypingPagePremium = lazy(() => import('./pages/PilotPrototypingPage'))
const SolutionEngineeringPagePremium = lazy(() => import('./pages/SolutionEngineeringPage'))
const CentreOfExcellencePage = lazy(() => import('./pages/CentreOfExcellencePage'))
// Fallback generic templates kept for other services
const ProcessAutomationPage = lazy(() => import('./pages/services/ProcessAutomationPage'))
const CenterOfExcellencePage = lazy(() => import('./pages/services/CenterOfExcellencePage'))
const SolutionEngineeringPage = lazy(() => import('./pages/services/SolutionEngineeringPage'))
const DigitalTransformationPage = lazy(() => import('./pages/services/DigitalTransformationPage'))
const MigrationServicesPage = lazy(() => import('./pages/services/MigrationServicesPage'))
const OneStopSolutionsPage = lazy(() => import('./pages/services/OneStopSolutionsPage'))
const PilotPrototypingPage = lazy(() => import('./pages/services/PilotPrototypingPage'))
const ManagedServicesPage = lazy(() => import('./pages/services/ManagedServicesPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))

const CONTACT = {
  phone: '+91-9014217124',
  phoneHref: 'tel:+919014217124',
  email: 'info@oklut.com',
  emailHref: 'mailto:info@oklut.com',
  addressLine: 'Second Floor, Samridhi Vasyam, Madhapur, Hyderabad',
  address:
    'Second Floor, Samridhi Vasyam, D No 1/98/9/3/23, Capital Pk Rd, beside Narayana High School, Cyber Hills Colony, VIP Hills, Jaihind Enclave, Madhapur, Hyderabad, Telangana 500081',
mapsHref:
    'https://www.google.com/maps/dir/?api=1&destination=Second+Floor,+Samridhi+Vasyam,+D+No+1%2F98%2F9%2F3%2F23,+Capital+Pk+Rd,+beside+Narayana+High+School,+Cyber+Hills+Colony,+VIP+Hills,+Jaihind+Enclave,+Madhapur,+Hyderabad,+Telangana+500081',
}

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services', hasDropdown: true },
  { id: 'products', label: 'Products' },
  { id: 'news', label: 'Perspectives' },
  { id: 'gallery', label: 'Technologies', hasDropdown: true },
  { id: 'contact', label: 'Contact' },
]



const FEATURED_PRODUCTS = [
  { title: 'Oklut AI Suite', description: 'Intelligent autonomous agents and tools that automate complex workflows and customer operations.' },
  { title: 'CloudNexus', description: 'Multi-cloud management platform optimizing performance, security, compliance, and costs.' },
  { title: 'WorkSync', description: 'Hybrid collaboration and productivity hub with integrated task, chat, and document management.' },
  { title: 'DataStream', description: 'Real-time analytics engine transforming streams of business events into actionable insights.' }
]

const ERP_SOLUTIONS = [
  { title: 'Oklut ERP Core', description: 'Unified enterprise architecture connecting finance, assets, HR, procurement, and inventory.' },
  { title: 'HRMS Pro', description: 'Employee experience platform covering payroll, benefits, performance reviews, and self-service.' },
  { title: 'SupplyChain IQ', description: 'Real-time logistics tracking, automated warehouse operations, and demand forecasting.' },
  { title: 'Finance Hub', description: 'Advanced ledger management, billing workflows, automated compliance, and real-time cashflow reports.' }
]

const IT_SOLUTIONS = [
  { title: 'Cloud Infrastructure', description: 'Scalable cloud architecture, migration, and management across AWS, Azure, and GCP.' },
  { title: 'Cybersecurity Suite', description: 'End-to-end security monitoring, threat detection, and compliance management.' },
  { title: 'DevOps Pipeline', description: 'CI/CD automation, containerization, and infrastructure-as-code for faster delivery.' },
  { title: 'Managed IT Services', description: '24/7 infrastructure monitoring, incident response, and proactive maintenance.' }
]

const CRM_SOLUTIONS = [
  { title: 'Sales CRM', description: 'Pipeline management, lead scoring, deal tracking, and sales forecasting in one platform.' },
  { title: 'Customer Support Hub', description: 'Ticketing, knowledge base, live chat, and omnichannel support management.' },
  { title: 'Marketing Automation', description: 'Campaign orchestration, email automation, lead nurturing, and analytics.' },
  { title: 'Customer 360 View', description: 'Unified customer profiles combining sales, support, and interaction data.' }
]

const HRMS_SOLUTIONS = [
  { title: 'Core HR', description: 'Employee records, org hierarchy, leave management, and attendance tracking.' },
  { title: 'Payroll & Compliance', description: 'Automated payroll processing, tax calculations, and statutory compliance.' },
  { title: 'Performance Management', description: 'OKR tracking, 360° reviews, goal setting, and employee development plans.' },
  { title: 'Recruitment Portal', description: 'Job postings, applicant tracking, interview scheduling, and onboarding workflows.' }
]

const TECH_NAV_ITEMS = [
  { label: 'AI & Robotics', href: '#gallery' },
  { label: 'Business Automation', href: '#gallery' },
  { label: 'Cloud Migrations', href: '#gallery' },
  { label: 'Data Centers', href: '#gallery' },
  { label: 'Cognitive Analytics & AI', href: '#gallery' },
  { label: 'Information & Reporting Systems', href: '#gallery' },
  { label: 'Managed Services', to: '/services/managed-services' },
  { label: 'One-Stop Solutions', to: '/services/one-stop-solutions' },
]

const SERVICES = [
  {
    label: 'Custom Development',
    slug: 'custom-development',
    icon: 'code',
    description: 'Bespoke web, mobile and API products built around your exact requirements.',
    translationKey: 'customDevelopment',
  },
  {
    label: 'Process Automation',
    slug: 'process-automation',
    icon: 'gears',
    description: 'Streamline workflows and remove manual effort with intelligent automation.',
    translationKey: 'processAutomation',
  },
  {
    label: 'Center of Excellence',
    slug: 'center-of-excellence',
    icon: 'award',
    description: 'Embed a high-performing engineering hub with shared standards and reuse.',
    translationKey: 'centerOfExcellence',
  },
  {
    label: 'Solution Engineering',
    slug: 'solution-engineering',
    icon: 'layers',
    description: 'Architect resilient, scalable systems from discovery to production.',
    translationKey: 'solutionEngineering',
  },
  {
    label: 'Digital Transformation',
    slug: 'digital-transformation',
    icon: 'trendingUp',
    description: 'Modernize technology, processes and culture to compete in a digital-first world.',
    translationKey: 'digitalTransformation',
  },
  {
    label: 'End-to-End Solutions',
    slug: 'end-to-end-solutions',
    icon: 'package',
    description: 'Full-lifecycle delivery from strategy and design through 24/7 operations.',
    translationKey: 'endToEndSolutions',
  },
  {
    label: 'Migration Services',
    slug: 'migration-services',
    icon: 'cloud',
    description: 'Move applications, data and infrastructure to the cloud securely and cost-effectively.',
    translationKey: 'migrationServices',
  },
  {
    label: 'Pilot & Prototyping',
    slug: 'pilot-prototyping',
    icon: 'rocket',
    description: 'Validate ideas fast with low-risk pilots and production-grade prototypes.',
    translationKey: 'pilotPrototyping',
  },
  {
    label: 'Shared Services',
    slug: 'shared-services',
    icon: 'server',
    description: 'Centralized platforms and managed services that scale across teams.',
    translationKey: 'sharedServices',
  },
]

const SECTION_IDS = ['top', 'about', 'gallery', 'news', 'services', 'contact']

const NAV_OFFSET = 78

function scrollToSection(id) {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior })
    return
  }
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior, block: 'start' })
}

function SectionLink({ id, children, className = '', isActive = false, onNavigate }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault()
    onNavigate?.()
    if (location.pathname === '/') {
      scrollToSection(id)
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }

  return (
    <a
      href={`#${id}`}
      className={`${className}${isActive ? ' active' : ''}`.trim()}
      onClick={handleClick}
      aria-current={isActive ? 'true' : undefined}
    >
      {children}
    </a>
  )
}


function Navbar({ onSignIn, onSignUp }) {
  const { user, signOut } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [techOpen, setTechOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const servicesRef = useRef(null)
  const techRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = () => setMobileOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  useEffect(() => {
    const onOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false)
      }
      if (techRef.current && !techRef.current.contains(e.target)) {
        setTechOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('')
      return
    }
    let ticking = false
    let cancelled = false
    const update = () => {
      ticking = false
      let current = SECTION_IDS[0]
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= NAV_OFFSET) current = id
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) current = SECTION_IDS[SECTION_IDS.length - 1]
      if (!cancelled) setActiveSection(current)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelled = true
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [location.pathname])

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
      <div className="container flex flex-between">
        <SectionLink
          id="top"
          className="brand"
          isActive={location.pathname === '/' && activeSection === 'top'}
          onNavigate={closeMobile}
        >
          <img
            src={`${import.meta.env.BASE_URL}img/logo.jpg`}
            alt="Oklut Technologies logo"
            className="brand-logo"
          />
        </SectionLink>
        <nav className={`nav-links ${mobileOpen ? 'nav-links-open' : ''}`} aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            if (item.hasDropdown && item.id === 'services') {
              return (
                <div
                  key={item.id}
                  className="services-dropdown-wrap"
                  ref={servicesRef}
                >
                  <button
                    type="button"
                    className="services-toggle"
                    aria-haspopup="menu"
                    aria-expanded={servicesOpen}
                    onClick={() => {
                      setServicesOpen((o) => !o)
                      setTechOpen(false)
                    }}
                  >
                    <span>{t('nav.services')}</span>
                    <span
                      className={`services-chevron ${servicesOpen ? 'is-open' : ''}`}
                      aria-hidden="true"
                    >
                      <Icon name="chevron" />
                    </span>
                  </button>
                  <div
                    className={`services-dropdown ${servicesOpen ? 'is-open' : ''}`}
                    role="menu"
                    aria-label="Services"
                  >
                    {SERVICES.map((s) => (
                      s.externalUrl ? (
                        <a
                          key={s.slug}
                          href={s.externalUrl}
                          className="services-dropdown-item"
                          onClick={() => { closeMobile(); setServicesOpen(false) }}
                        >
                          {s.label}
                        </a>
                      ) : (
                        <Link
                          key={s.slug}
                          to={`/services/${s.slug}`}
                          className="services-dropdown-item"
                          onClick={() => { closeMobile(); setServicesOpen(false) }}
                        >
                          {s.label}
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              )
            }
            if (item.hasDropdown && item.id === 'gallery') {
              return (
                <div
                  key={item.id}
                  className="services-dropdown-wrap"
                  ref={techRef}
                >
                  <button
                    type="button"
                    className="services-toggle"
                    aria-haspopup="menu"
                    aria-expanded={techOpen}
                    onClick={() => {
                      setTechOpen((o) => !o)
                      setServicesOpen(false)
                    }}
                  >
                    <span>{t('nav.technologies')}</span>
                    <span
                      className={`services-chevron ${techOpen ? 'is-open' : ''}`}
                      aria-hidden="true"
                    >
                      <Icon name="chevron" />
                    </span>
                  </button>
                  <div
                    className={`services-dropdown ${techOpen ? 'is-open' : ''}`}
                    role="menu"
                    aria-label="Technologies"
                  >
                    {TECH_NAV_ITEMS.map((t, i) => (
                      t.to ? (
                        <Link
                          key={i}
                          to={t.to}
                          className="services-dropdown-item"
                          onClick={() => { closeMobile(); setTechOpen(false) }}
                        >
                          {t.label}
                        </Link>
                      ) : (
                        <a
                          key={i}
                          href={t.href}
                          className="services-dropdown-item"
                          onClick={() => { closeMobile(); setTechOpen(false) }}
                        >
                          {t.label}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )
            }
            if (item.id === 'products') {
              return (
                <Link
                  key={item.id}
                  to="/products"
                  className={location.pathname === '/products' ? 'active' : ''}
                  onClick={closeMobile}
                >
                  {item.label}
                </Link>
              )
            }
            return (
              <SectionLink
                key={item.id}
                id={item.id}
                isActive={location.pathname === '/' && activeSection === item.id}
                onNavigate={closeMobile}
              >
                {item.label}
              </SectionLink>
            )
          })}
          <a
            href="https://suryani-76.github.io/HRMS_app/careers"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobile}
          >
            {t('nav.careers')}
          </a>
          <div className="auth-area">
            {user ? (
              <div className="user-menu">
                <button
                  type="button"
                  className="user-chip"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-expanded={userMenuOpen}
                >
                  <span className="user-avatar" aria-hidden="true">
                    {(user.user_metadata?.full_name || user.email).trim()[0]?.toUpperCase()}
                  </span>
                  <span className="user-name">{(user.user_metadata?.full_name || user.email || '').split('@')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-info">
                      <strong>{user.user_metadata?.full_name || 'User'}</strong>
                      <span>{user.email}</span>
                    </div>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={async () => {
                        setUserMenuOpen(false)
                        try {
                          await signOut()
                        } catch (err) {
                          console.error(err)
                        }
                      }}
                    >
                      {t('nav.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button type="button" className="btn btn-ghost btn-sm nav-signin" onClick={onSignIn}>
                  {t('nav.signIn')}
                </button>
                <button type="button" className="btn btn-primary btn-sm nav-cta" onClick={onSignUp}>
                  {t('nav.signUp')}
                </button>
              </>
            )}
          </div>
        </nav>
        <button
          type="button"
          className="nav-burger"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

function Hero() {
  const { t } = useTranslation()
  return (
    <section id="top" className="hero">
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={`${import.meta.env.BASE_URL}img/hero-poster.jpg`}
      >
        <source src={`${import.meta.env.BASE_URL}video/hero-bg.mp4`} type="video/mp4" />
        <source src={`${import.meta.env.BASE_URL}video/hero-bg.webm`} type="video/webm" />
      </video>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="eyebrow reveal">
            <span className="eyebrow-bar" aria-hidden="true" />
            {t('hero.eyebrow')}
          </span>
          <h1 className="reveal">
            <span dangerouslySetInnerHTML={{ __html: t('hero.title') }} />
          </h1>
          <p className="hero-sub reveal">
            {t('hero.description')}
          </p>
          <div className="hero-actions reveal">
            <Link to="/book-consultation" className="btn btn-primary btn-lg">
              {t('hero.bookConsultation')}
              <Icon name="arrow" />
            </Link>
            <a
              href="#services"
              className="btn btn-glass btn-lg"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('services')
              }}
            >
              {t('hero.exploreServices')}
            </a>
          </div>
          <ul className="hero-facts reveal">
            <li>
              <strong>12+</strong> {t('hero.years')}
            </li>
            <li>
              <strong>320+</strong> {t('hero.projects')}
            </li>
            <li>
              <strong>98%</strong> {t('hero.retention')}
            </li>
          </ul>
          <div className="hero-location reveal">
            <span>
              <Icon name="pin" /> {t('hero.location')}
            </span>
            <span>{t('hero.since')}</span>
          </div>
        </div>
      </div>
      <div className="hero-meta" aria-hidden="true">
        <span>{t('hero.metaStudio')}</span>
        <span>{t('hero.metaTech')}</span>
      </div>
    </section>
  )
}

function SectionHead({ index, eyebrow, title, sub, center = false }) {
  return (
    <div className={`section-head${center ? ' section-head-center' : ''} reveal`}>
      <span className="eyebrow">
        <span className="eyebrow-bar" aria-hidden="true" />
        {index && <span className="eyebrow-index">{index}</span>}
        {eyebrow}
      </span>
      <h2>{title}</h2>
      {sub && <p className="section-head-sub">{sub}</p>}
    </div>
  )
}

function About() {
  const { t } = useTranslation()
  const features = [
    { icon: 'award', title: t('about.awardWinning'), text: t('about.awardText'), color: '#f59e0b' },
    { icon: 'users', title: t('about.professionalStaff'), text: t('about.staffText'), color: '#3b82f6' },
    { icon: 'clock', title: t('about.support247'), text: t('about.supportText'), color: '#10b981' },
    { icon: 'star', title: t('about.fairPrices'), text: t('about.pricesText'), color: '#8b5cf6' },
  ]
  return (
    <section id="about" className="section about-section">
      <div className="container about-grid">
        <div className="about-statement reveal">
          <span className="eyebrow">
            <span className="eyebrow-bar" aria-hidden="true" />
            {t('about.eyebrow')}
          </span>
          <h2>
            <span dangerouslySetInnerHTML={{ __html: t('about.title') }} />
          </h2>
          <p className="about-lede">
            {t('about.description')}
          </p>
          <div className="about-features-grid">
            {features.map((f) => (
              <div key={f.title} className="about-feature-card reveal">
                <div className="about-feature-card-icon" style={{ '--card-accent': f.color }}>
                  <Icon name={f.icon} />
                </div>
                <h3 className="about-feature-card-title">{f.title}</h3>
                <p className="about-feature-card-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="about-visual reveal">
          <figure className="about-frame">
            <img src={`${import.meta.env.BASE_URL}img/about.jpg`} alt="The Oklut Technologies team at work" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>
  )
}



function CountUp({ end, suffix = '', duration = 1600 }) {
  const ref = useRef(null)
  const started = useRef(false)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setValue(end)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const step = (now) => {
              const p = Math.min((now - start) / duration, 1)
              const eased = 1 - Math.pow(1 - p, 3)
              setValue(Math.round(end * eased))
              if (p < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
            io.disconnect()
          }
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [end, duration])

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  return (
    <strong ref={ref}>
      {reduced ? end : `${value.toLocaleString('en-IN')}${suffix}`}
    </strong>
  )
}

function Stats() {
  const { t } = useTranslation()
  const stats = [
    { value: 1056, suffix: '+', label: t('stats.happyClients') },
    { value: 328, suffix: '+', label: t('stats.projectsDone') },
    { value: 23, suffix: '+', label: t('stats.winAwards') },
  ]
  return (
    <section className="statsband" aria-label="Company statistics">
      <div className="container statsband-grid">
        {stats.map((s, i) => (
          <div className="stat reveal" key={s.label} style={{ transitionDelay: `${i * 80}ms` }}>
            <CountUp end={s.value} suffix={s.suffix} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Insights() {
  const { t } = useTranslation()
  const items = [
    {
      date: t('insights.item1Date'),
      tag: t('insights.item1Tag'),
      title: t('insights.item1Title'),
      text: t('insights.item1Text'),
    },
    {
      date: t('insights.item2Date'),
      tag: t('insights.item2Tag'),
      title: t('insights.item2Title'),
      text: t('insights.item2Text'),
    },
    {
      date: t('insights.item3Date'),
      tag: t('insights.item3Tag'),
      title: t('insights.item3Title'),
      text: t('insights.item3Text'),
    },
  ]
  return (
    <section id="news" className="section insights-section">
      <div className="container">
        <SectionHead eyebrow={t('insights.eyebrow')} title={t('insights.title')} />
        <ul className="insights-list">
          {items.map((n, i) => (
            <li className="insights-row reveal" key={n.title} style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="insights-date">{n.date}</span>
              <div className="insights-main">
                <span className="insights-tag">{n.tag}</span>
                <h3>{n.title}</h3>
                <p>{n.text}</p>
              </div>
              <span className="insights-arrow" aria-hidden="true">
                <Icon name="arrow" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Technologies() {
  const { t } = useTranslation()
  const [selectedTech, setSelectedTech] = useState('')
  const navigate = useNavigate()

  const techOptions = [
    { value: '', label: t('technologies.selectTechnology') },
    { value: 'ai-robotics', label: t('technologies.options.aiRobotics') },
    { value: 'business-automation', label: t('technologies.options.businessAutomation') },
    { value: 'cloud-migrations', label: t('technologies.options.cloudMigrations') },
    { value: 'data-centers', label: t('technologies.options.dataCenters') },
    { value: 'cognitive-analytics', label: t('technologies.options.cognitiveAnalytics') },
    { value: 'information-reporting', label: t('technologies.options.informationReporting') },
    { value: 'managed-services', label: t('technologies.options.managedServices') },
    { value: 'one-stop-solutions', label: t('technologies.options.oneStopSolutions') },
  ]

  const techRoutes = {
    'managed-services': '/services/managed-services',
    'one-stop-solutions': '/services/one-stop-solutions',
  }

  return (
    <section id="gallery" className="section tech-section">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--c1)', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>{t('technologies.title')}</h2>
          <select
            value={selectedTech}
            onChange={(e) => {
              const val = e.target.value
              if (techRoutes[val]) {
                navigate(techRoutes[val])
              } else {
                setSelectedTech(val)
              }
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'var(--bg1)',
              color: 'var(--text)',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {techOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <SectionHead
          title={t('technologies.headline')}
          sub={t('technologies.sub')}
          center
        />
      </div>
    </section>
  )
}

function ContactForm() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', company: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = t('contact.validation.nameRequired') || 'Name is required.'
    if (!form.email.trim()) next.email = t('contact.validation.emailRequired') || 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = t('contact.validation.emailInvalid') || 'Enter a valid email.'
    if (!form.message.trim()) next.message = t('contact.validation.messageRequired') || 'Message is required.'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    const { error } = await supabase.from('contact_messages').insert([{ ...form }])

    if (error) {
      setStatus('idle')
      setToast({ type: 'error', text: t('contact.errorMsg') })
    } else {
      setStatus('success')
      setForm({ name: '', email: '', company: '', subject: '', message: '' })
      setToast({ type: 'success', text: t('contact.successMsg') })
      try {
        const { error: emailError } = await supabase.functions.invoke('send-contact-message', {
          body: {
            to: form.email.trim(),
            name: form.name.trim(),
            email: form.email.trim(),
            company: form.company.trim(),
            subject: form.subject.trim(),
            message: form.message.trim(),
          },
        })
        if (emailError) console.error('Contact confirmation email failed:', emailError)
      } catch (emailErr) {
        console.error('Contact confirmation email failed:', emailErr)
      }
    }
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <SectionHead
          eyebrow={t('contact.eyebrow')}
          title={t('contact.title')}
          sub={t('contact.sub')}
        />
        <div className="contact-layout">
          <div className="contact-info reveal">
            <div className="contact-panel">
              <span className="eyebrow">
                <span className="eyebrow-bar" aria-hidden="true" />
                {t('contact.reachUs')}
              </span>
              <h3 className="contact-panel-title">
                {t('contact.preferConversation')}
              </h3>
              <p className="contact-lede">
                {t('contact.contactLede')}
              </p>
              <ul className="contact-list">
                <li>
                  <span className="contact-icon">
                    <a href={CONTACT.phoneHref} aria-label={`Call ${CONTACT.phone}`}>
                      <Icon name="phone" />
                    </a>
                  </span>
                  <span className="contact-channel">
                    <small>{t('contact.phone')}</small>
                    <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                  </span>
                </li>
                <li>
                  <span className="contact-icon">
                    <a href={CONTACT.emailHref} aria-label={`Email ${CONTACT.email}`}>
                      <Icon name="mail" />
                    </a>
                  </span>
                  <span className="contact-channel">
                    <small>{t('contact.email')}</small>
                    <a href={CONTACT.emailHref}>{CONTACT.email}</a>
                  </span>
                </li>
                <li>
                  <span className="contact-icon">
                    <a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer" aria-label="Open office location on Google Maps">
                      <Icon name="pin" />
                    </a>
                  </span>
                  <span className="contact-channel">
                    <small>{t('contact.office')}</small>
                    <a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer">
                      {CONTACT.address}
                    </a>
                  </span>
                </li>
                <li>
                  <span className="contact-icon">
                    <a href="https://www.google.com/maps/search/South+Africa+Office" target="_blank" rel="noopener noreferrer" aria-label="Open South Africa office location on Google Maps">
                      <Icon name="pin" />
                    </a>
                  </span>
                  <span className="contact-channel">
                    <small>South Africa Office</small>
                    <a href="https://www.google.com/maps/search/South+Africa+Office" target="_blank" rel="noopener noreferrer">
                      Unit 11 Sunset View, 10 Hazy Street, Newcastle, Kwa-Zulu Natal, 2930
                    </a>
                  </span>
                </li>
                <li>
                  <span className="contact-icon"><Icon name="clock" /></span>
                  <span className="contact-channel">
                    <small>{t('contact.hours')}</small>
                    <strong>{t('contact.hoursValue')}</strong>
                  </span>
                </li>
              </ul>
              <Link to="/book-consultation" className="btn btn-primary">
                {t('contact.bookSlot')}
                <Icon name="arrow" />
              </Link>
            </div>
          </div>

          <form className="card contact-form reveal" onSubmit={handleSubmit} noValidate>
            <div className="contact-form-head">
              <h3>{t('contact.sendMessage')}</h3>
              <p>{t('contact.fieldsRequired')}</p>
            </div>
            <div className="grid grid-2">
              <div className="input-group">
                <label htmlFor="name">{t('contact.fullName')}</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  aria-invalid={errors.name ? 'true' : undefined}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="error-message" id="name-error">{errors.name}</span>}
              </div>
              <div className="input-group">
                <label htmlFor="email">{t('contact.emailLabel')}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@company.com"
                  autoComplete="email"
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="error-message" id="email-error">{errors.email}</span>}
              </div>
            </div>
            <div className="grid grid-2">
              <div className="input-group">
                <label htmlFor="company">{t('contact.company')}</label>
                <input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Company Inc." autoComplete="organization" />
              </div>
              <div className="input-group">
                <label htmlFor="subject">{t('contact.subject')}</label>
                <input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Project inquiry" />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="message">{t('contact.messageLabel')}</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your project…"
                aria-invalid={errors.message ? 'true' : undefined}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={errors.message ? 'input-error' : ''}
              />
              {errors.message && <span className="error-message" id="message-error">{errors.message}</span>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'submitting'}>
              {status === 'submitting' ? t('contact.sending') : t('contact.sendBtn')}
              {status !== 'submitting' && <Icon name="arrow" />}
            </button>
          </form>
        </div>
      </div>
      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          <span>{toast.type === 'success' ? '✓' : '!'}</span>
          <span>{toast.text}</span>
        </div>
      )}
    </section>
  )
}

function ScrollProgress() {
  const ref = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      el.style.width = `${(p * 100).toFixed(2)}%`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div className="scroll-progress" ref={ref} aria-hidden="true" />
}

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setVisible(!reduced && window.scrollY > 480)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="presentation">
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  )
}

function Footer() {
  const { openPreferences } = useCookieConsent()
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <SectionLink id="top" className="brand">
            <img src={`${import.meta.env.BASE_URL}img/logo.jpg`} alt="Oklut Technologies logo" className="brand-logo" />
            <span className="brand-name">
              Oklut<span>Technologies</span>
            </span>
          </SectionLink>
          <p>
            {t('footer.description')}
          </p>
          <address>
            <a
              href={CONTACT.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open office location on Google Maps"
            >
              <Icon name="pin" />
              {CONTACT.address}
            </a>
          </address>
        </div>
        <div>
          <h4>{t('footer.company')}</h4>
          <ul>
            <li><SectionLink id="about">{t('footer.about')}</SectionLink></li>
            <li><Link to="/careers">{t('footer.careers')}</Link></li>
            <li><SectionLink id="news">{t('footer.perspectives')}</SectionLink></li>
            <li><SectionLink id="gallery">{t('footer.technologies')}</SectionLink></li>
            <li><SectionLink id="contact">{t('footer.contact')}</SectionLink></li>
          </ul>
        </div>
        <div>
          <h4>{t('footer.services')}</h4>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                {s.externalUrl ? (
                  <a href={s.externalUrl} target="_blank" rel="noopener noreferrer">
                    {t(`services.items.${s.translationKey}.label`)}
                  </a>
                ) : (
                  <Link to={`/services/${s.slug}`}>{t(`services.items.${s.translationKey}.label`)}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>{t('footer.getInTouch')}</h4>
          <ul className="footer-contact">
            <li>
              <a href={CONTACT.phoneHref}><Icon name="phone" /> {CONTACT.phone}</a>
            </li>
            <li>
              <a href={CONTACT.emailHref}><Icon name="mail" /> {CONTACT.email}</a>
            </li>
            <li>
              <a href="/book-consultation"><Icon name="calendar" /> {t('footer.bookConsultation')}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <div className="footer-legal">
          <button type="button" className="link-btn" onClick={openPreferences}>
            {t('footer.cookiePreferences')}
          </button>
          <span aria-hidden="true">·</span>
          <Link to="/privacy" className="link-btn">
            {t('footer.privacyPolicy')}
          </Link>
        </div>
      </div>
    </footer>
  )
}

function Services() {
  const { t } = useTranslation()
  return (
    <section id="services" className="section services-section">
      <div className="container">
        <SectionHead
          eyebrow={t('services.eyebrow')}
          title={t('services.title')}
          sub={t('services.sub')}
          center
        />
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <Link
              to={`/services/${s.slug}`}
              key={s.slug}
              className="service-card reveal"
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              <div className="service-card-header">
                <span className="service-card-icon">
                  <Icon name={s.icon} />
                </span>
                <span className="service-card-arrow">
                  <Icon name="arrow" />
                </span>
              </div>
              <h3>{t(`services.items.${s.translationKey}.label`)}</h3>
              <p>{t(`services.items.${s.translationKey}.description`)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  const location = useLocation()
  const pendingScroll = useRef(location.state?.scrollTo || null)

  useEffect(() => {
    const target = pendingScroll.current
    if (!target) return
    const frame = requestAnimationFrame(() => {
      scrollToSection(target)
      pendingScroll.current = null
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
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
      { threshold: 0.12 },
    )
    reveals().forEach((el) => io.observe(el))

    // Fallback: Chrome can skip observer callbacks for elements next to a
    // position:sticky item in a grid (e.g. the services cards), leaving them
    // stuck at opacity 0. Also reveal anything entering the viewport manually.
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

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <Hero />
      <div className="theme-light">
        <Stats />
        <About />
        <Insights />
        <Technologies />
        <ContactForm />
      </div>
    </>
  )
}

function App() {
  const { isRecovery } = useAuth()
  const location = useLocation()
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login', redirectTo: null })
  const hideFooter =
    location.pathname === '/products' ||
    location.pathname.startsWith('/services/')

  const openAuth = (mode, redirectTo) => setAuthModal({ open: true, mode, redirectTo: redirectTo || null })
  const closeAuth = () => setAuthModal((prev) => ({ open: false, mode: prev.mode, redirectTo: null }))

  useEffect(() => {
    if (isRecovery) {
      setAuthModal((prev) => ({ open: true, mode: 'recovery', redirectTo: prev.redirectTo }))
    }
  }, [isRecovery])

  return (
    <>
      <ScrollProgress />
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar onSignIn={() => openAuth('login')} onSignUp={() => openAuth('signup')} />
      <main id="main">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route
              path="/book-consultation"
              element={
                <BookConsultationPage onRequireAuth={(mode) => openAuth(mode, '/book-consultation')} />
              }
            />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/products" element={<ProductsPage />} />
            
            <Route path="/services/end-to-end-solutions" element={<EndToEndSolutionsPage />} />
            <Route path="/services/pilot-prototyping" element={<PilotPrototypingPagePremium />} />
            <Route path="/services/shared-services" element={<SharedServicesPage />} />
            <Route path="/services/custom-development" element={<CustomDevelopmentPage />} />
            <Route path="/services/process-automation" element={<ProcessAutomationPage />} />
            <Route path="/services/center-of-excellence" element={<CentreOfExcellencePage />} />
            <Route path="/services/centre-of-excellence" element={<CentreOfExcellencePage />} />
            <Route path="/services/solution-engineering" element={<SolutionEngineeringPagePremium />} />
            <Route path="/services/digital-transformation" element={<DigitalTransformationPage />} />
            <Route path="/services/migration-services" element={<MigrationServicesPage />} />
            <Route path="/services/one-stop-solutions" element={<OneStopSolutionsPage />} />
            <Route path="/services/managed-services" element={<ManagedServicesPage />} />
            {/* Legacy fallback routes kept for backwards compat */}
            <Route path="/services/pilot-prototyping-legacy" element={<PilotPrototypingPage />} />
            <Route path="/services/solution-engineering-legacy" element={<SolutionEngineeringPage />} />
            <Route path="/services/center-of-excellence-legacy" element={<CenterOfExcellencePage />} />
          </Routes>
        </Suspense>
      </main>
      <BackToTop />
      {!hideFooter && (
        <div className="theme-light">
          <Footer />
        </div>
      )}
      <AuthModal
        open={authModal.open}
        mode={authModal.mode}
        redirectTo={authModal.redirectTo}
        onClose={closeAuth}
        onSwitchMode={(mode) => setAuthModal({ open: true, mode, redirectTo: authModal.redirectTo })}
      />
      <CookieConsentBanner />
      <CookiePreferenceModal />
      <Chatbot />
    </>
  )
}

export default App
