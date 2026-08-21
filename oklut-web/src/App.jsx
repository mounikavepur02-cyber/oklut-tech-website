import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuth } from './lib/auth'
import AuthModal from './components/AuthModal'
import { CookieConsentBanner } from './components/cookie/CookieConsentBanner.tsx'
import { CookiePreferenceModal } from './components/cookie/CookiePreferenceModal.tsx'
import { useCookieConsent } from './components/cookie/CookieConsentProvider.tsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx'
import './App.css'

const CareersPage = lazy(() => import('./pages/CareersPage'))
const BookConsultationPage = lazy(() => import('./pages/BookConsultationPage'))
const CentreOfExcellencePage = lazy(() => import('./pages/CentreOfExcellencePage'))

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

const ICONS = {
  arrow: ['M5 12h14', 'm12 5 7 7-7 7'],
  phone: [
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
  ],
  mail: ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', 'm22 7-10 6L2 7'],
  pin: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  check: ['M20 6 9 17l-5-5'],
  users: [
    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2',
    'M23 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
    'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  ],
  award: ['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M8.21 13.89 7 23l5-3 5 3-1.21-9.12'],
  cubes: ['M12 2 22 7v10l-10 5L2 17V7l10-5z', 'M2 7l10 5 10-5', 'M12 22V12'],
  chart: ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
  code: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
  search: ['M21 21l-4.35-4.35', 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z'],
  quote: [
    'M9 7.5C8 7.5 7.25 8 6.78 8.75c-.34.55-.5 1.3-.44 2.25H8.4c.9 0 1.6.7 1.6 1.6v2.4c0 .97-.83 1.8-1.8 1.8H4.8c-1.27 0-2.3-1.03-2.3-2.3v-3C2.5 7.5 5.33 4.5 8.5 4.5c.55 0 1 .45 1 1s-.45 2-0.5 2z',
    'M19.5 7.5c-1 0-1.75.5-2.22 1.25-.34.55-.5 1.3-.44 2.25h2.06c.9 0 1.6.7 1.6 1.6v2.4c0 .97-.83 1.8-1.8 1.8h-3.4c-1.27 0-2.3-1.03-2.3-2.3v-3c0-4.8 2.83-7.8 6-7.8.55 0 1 .45 1 1s-.45 2-.5 2z',
  ],
  layers: ['m12 2 10 5-10 5L2 7l10-5z', 'm2 12 10 5 10-5', 'm2 17 10 5 10-5'],
  cloud: ['M17.5 19a4.5 4.5 0 1 0-.42-8.98A6 6 0 0 0 5.5 13 3.5 3.5 0 0 0 7 20h10.5z'],
  briefcase: ['M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16', 'M3 7h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z'],
  globe: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M3 12h18', 'M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  calendar: ['M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'],
  star: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  chevron: ['m6 9 6 6 6-6'],
  badgeCheck: [
    'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z',
    'm9 12 2 2 4-4',
  ],
}

function Icon({ name, className = '' }) {
  const paths = ICONS[name] || ICONS.code
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="presentation"
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'news', label: 'Perspectives' },
  { id: 'gallery', label: 'Projects & Insights' },
  { id: 'contact', label: 'Contact' },
]

const SECTION_IDS = ['top', 'about', 'services', 'news', 'gallery', 'contact']

const NAV_OFFSET = 90

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
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)

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
          <img src="/img/logo.jpg" alt="Oklut Technologies logo" className="brand-logo" />
          <span className="brand-name">
            Oklut<span>Technologies</span>
          </span>
        </SectionLink>
        <nav className={`nav-links ${mobileOpen ? 'nav-links-open' : ''}`} aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            if (item.id === 'services') {
              return (
                <div
                  key={item.id}
                  className="nav-dropdown-wrapper"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <SectionLink
                    id={item.id}
                    isActive={location.pathname === '/' && activeSection === item.id}
                    onNavigate={closeMobile}
                  >
                    {item.label} <Icon name="chevron" className={`dropdown-chevron ${servicesDropdownOpen ? 'open' : ''}`} />
                  </SectionLink>
                  {servicesDropdownOpen && (
                    <div className="nav-dropdown-menu">
                      <Link
                        to="/centre-of-excellence"
                        className="nav-dropdown-item highlighted-item"
                        onClick={() => {
                          setServicesDropdownOpen(false)
                          closeMobile()
                        }}
                      >
                        <span className="dropdown-item-title">Centre of Excellence</span>
                        <span className="dropdown-item-desc">Engineering Standards & Innovation</span>
                      </Link>
                      <SectionLink
                        id="services"
                        className="nav-dropdown-item"
                        onNavigate={() => {
                          setServicesDropdownOpen(false)
                          closeMobile()
                        }}
                      >
                        <span className="dropdown-item-title">Software Development</span>
                        <span className="dropdown-item-desc">Custom Web & Mobile Applications</span>
                      </SectionLink>
                      <SectionLink
                        id="services"
                        className="nav-dropdown-item"
                        onNavigate={() => {
                          setServicesDropdownOpen(false)
                          closeMobile()
                        }}
                      >
                        <span className="dropdown-item-title">Digital & Cloud Solutions</span>
                        <span className="dropdown-item-desc">AWS, Azure & Cloud Native Platforms</span>
                      </SectionLink>
                      <SectionLink
                        id="services"
                        className="nav-dropdown-item"
                        onNavigate={() => {
                          setServicesDropdownOpen(false)
                          closeMobile()
                        }}
                      >
                        <span className="dropdown-item-title">IT Consulting</span>
                        <span className="dropdown-item-desc">Tech Strategy & Offshore Delivery</span>
                      </SectionLink>
                      <SectionLink
                        id="services"
                        className="nav-dropdown-item"
                        onNavigate={() => {
                          setServicesDropdownOpen(false)
                          closeMobile()
                        }}
                      >
                        <span className="dropdown-item-title">Digital Marketing</span>
                        <span className="dropdown-item-desc">SEO, Social & Growth Strategy</span>
                      </SectionLink>
                    </div>
                  )}
                </div>
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
          <Link
            to="/careers"
            className={location.pathname === '/careers' ? 'active' : ''}
            aria-current={location.pathname === '/careers' ? 'page' : undefined}
            onClick={closeMobile}
          >
            Careers
          </Link>
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
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button type="button" className="btn btn-ghost btn-sm nav-signin" onClick={onSignIn}>
                  Sign In
                </button>
                <button type="button" className="btn btn-primary btn-sm nav-cta" onClick={onSignUp}>
                  Sign Up
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
  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="eyebrow reveal">
            <span className="eyebrow-bar" aria-hidden="true" />
            Oklut Technologies — Hyderabad
          </span>
          <h1 className="reveal">
            Software, engineered for the way <em>your business</em> runs.
          </h1>
          <p className="hero-sub reveal">
            Oklut is a digital product and IT services company. We design, build and scale custom
            software, web and mobile products, cloud infrastructure and AI — for companies that
            compete on execution.
          </p>
          <div className="hero-actions reveal">
            <Link to="/book-consultation" className="btn btn-primary btn-lg">
              Book a free consultation
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
              Explore services
            </a>
          </div>
          <ul className="hero-facts reveal">
            <li>
              <strong>12+</strong> years
            </li>
            <li>
              <strong>320+</strong> projects
            </li>
            <li>
              <strong>98%</strong> retention
            </li>
          </ul>
        </div>
        <div className="hero-visual reveal">
          <div className="hero-frame">
            <img src="/img/carousel-1.jpg" alt="The Oklut engineering team at work in Madhapur, Hyderabad" />
            <div className="hero-caption">
              <span>
                <Icon name="pin" /> Madhapur, Hyderabad
              </span>
              <span className="hero-caption-sub">Oklut Technologies — since 2012</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-meta" aria-hidden="true">
        <span>Digital product studio</span>
        <span>Web · Mobile · Cloud · AI</span>
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
  const features = [
    { icon: 'award', title: 'Award Winning', text: 'Recognized for delivery excellence across web and mobile product engineering.' },
    { icon: 'users', title: 'Professional Staff', text: 'Senior, accountable engineers who own the work from first call to go-live.' },
    { icon: 'clock', title: '24/7 Support', text: 'Managed services and a support line that answers when you need it.' },
    { icon: 'star', title: 'Fair Prices', text: 'Honest estimates and transparent billing on every single engagement.' },
  ]
  return (
    <section id="about" className="section about-section">
      <div className="container about-grid">
        <div className="about-statement reveal">
          <span className="eyebrow">
            <span className="eyebrow-bar" aria-hidden="true" />
            About Us
          </span>
          <h2>
            The Best IT Solution — <em>Oklut Technologies</em>
          </h2>
          <p className="about-lede">
            Oklut Technologies is an Indian subsidiary IT company and one of India's leading web
            design and web application development companies. We have mastered content management
            systems and mobile application development, including iPhone, iPad and Android app
            development. We offer a variety of services specialized mainly in website designing
            and development — built on trust, quality and long-term partnership.
          </p>
          <ul className="about-features">
            {features.map((f) => (
              <li key={f.title}>
                <span className="about-feature-icon">
                  <Icon name={f.icon} />
                </span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="about-visual reveal">
          <figure className="about-frame">
            <img src="/img/about.jpg" alt="The Oklut Technologies team at work" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>
  )
}

function Services() {
  const services = [
    {
      n: '01',
      title: 'Software Development',
      text: "Grounded in deep domain expertise in the web applications design, development, automation software & online applications supporting B2B collaborations, support and maintenance services, API/ Web services, database design, continuous integrations & deployment etc., our team will help you implement, enhance, support and upgrade applications from end to end.",
      tags: ['Web Applications', 'APIs & Web Services', 'Database Design', 'CI/CD'],
      icon: 'code',
    },
    {
      n: '02',
      title: 'Digital and Cloud Solutions',
      text: "Our team will help you in implementing and enhancing digital business capabilities with digital transformation implementation, AWS, Azure and Google Cloud solutions, API-led integrations, IoT middleware, IoT data pipeline, mobility and machine learning etc. Our managed services will help in migrating to the cloud and modernize applications, third-party integrations and cloud infrastructure handling.",
      tags: ['AWS · Azure · GCP', 'API Integration', 'IoT & Data', 'Mobility'],
      icon: 'cloud',
    },
    {
      n: '03',
      title: 'IT Consulting Services',
      text: 'We provide affordable offshore IT consulting services, to help you across various domains and technology areas to build innovative products and scale up quickly by using latest trends in software development. We provide managed services to collaboratively work towards streamlining the process and accelerate your business growth, with skilled resources and flexible billing models based on your needs.',
      tags: ['Offshore Consulting', 'Managed Services', 'Flexible Billing', 'Scale Up'],
      icon: 'briefcase',
    },
    {
      n: '04',
      title: 'Digital Marketing',
      text: "Oklut Technologies is one of the top-rated SEO & Digital Marketing Agency in South India, started its journey in the year 2016 and serving wide range of portfolio in the digital era. We provide services across branding, email marketing, social media, SEO, PPC, marketing automation, online reputation management and Google Ads — for clients in Education, Healthcare, Transport, Retail, Manufacturing and Technology.",
      tags: ['SEO', 'Social Media', 'Email & PPC', 'Google Ads'],
      icon: 'chart',
    },
  ]
  const left = services.slice(0, 2)
  const right = services.slice(2)
  const ServiceCard = ({ s, delay }) => (
    <article className="services-card reveal" style={{ transitionDelay: `${delay}ms` }}>
      <span className="services-card-icon">
        <Icon name={s.icon} />
      </span>
      <span className="services-card-n">{s.n}</span>
      <h3>{s.title}</h3>
      <p>{s.text}</p>
      <ul className="tag-row">
        {s.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <Link to="/book-consultation" className="services-card-link" aria-label={`Discuss ${s.title}`}>
        Discuss this service
        <Icon name="arrow" />
      </Link>
    </article>
  )
  return (
    <section id="services" className="section services-section">
      <div className="container">
        <SectionHead
          eyebrow="Why Choose Us"
          title="We Are Here to Grow Your Business Exponentially"
          center
        />
        <div className="services-choose">
          <div className="services-column">
            <ServiceCard s={left[0]} delay={0} />
            <ServiceCard s={left[1]} delay={120} />
          </div>
          <div className="services-image reveal" style={{ transitionDelay: '240ms' }}>
            <figure className="services-image-frame">
              <img src="/img/feature.jpg" alt="Oklut Technologies — digital solutions" loading="lazy" />
            </figure>
          </div>
          <div className="services-column">
            <ServiceCard s={right[0]} delay={80} />
            <ServiceCard s={right[1]} delay={200} />
          </div>
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
  const stats = [
    { value: 1056, suffix: '+', label: 'Happy clients' },
    { value: 328, suffix: '+', label: 'Projects done' },
    { value: 23, suffix: '+', label: 'Win awards' },
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
  const items = [
    {
      date: 'Jul 2026',
      tag: 'Product',
      title: 'A modular ERP approach for growing enterprises',
      text: 'How we structure ERP engagements so finance, inventory, HR and procurement integrate without a multi-year programme.',
    },
    {
      date: 'May 2026',
      tag: 'Company',
      title: 'Recognized among leading IT firms in Hyderabad',
      text: 'Our engineering team has been recognized for delivery excellence and client satisfaction in digital product engineering.',
    },
    {
      date: 'Mar 2026',
      tag: 'People',
      title: 'Hiring: senior engineers to grow our cloud & AI practice',
      text: 'We are growing our cloud, data and AI teams — remote-friendly roles, senior ownership and real product work.',
    },
  ]
  return (
    <section id="news" className="section insights-section">
      <div className="container">
        <SectionHead eyebrow="Perspectives" title="Perspectives and thinking from the studio" />
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

function Gallery() {
  const shots = [
    { src: '/img/carousel-1.jpg', alt: 'Oklut engineering team at work', tag: 'Studio' },
    { src: '/img/carousel-2.jpg', alt: 'Product launch session at Oklut', tag: 'Events' },
    { src: '/img/feature.jpg', alt: 'Client delivery review meeting', tag: 'Clients' },
    { src: '/img/about.jpg', alt: 'The Oklut Technologies team', tag: 'Team' },
  ]
  return (
    <section id="gallery" className="section gallery-section">
      <div className="container">
        <SectionHead eyebrow="Projects & Insights" title="Projects and moments from the studio" />
        <div className="gallery-grid">
          {shots.map((g, i) => (
            <figure className="gallery-item reveal" key={g.src} style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
              <img src={g.src} alt={g.alt} loading="lazy" />
              <figcaption>
                <span>{g.tag}</span>
                <strong>{g.alt}</strong>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactForm() {
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
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.message.trim()) next.message = 'Message is required.'
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
      setToast({ type: 'error', text: 'Could not save your message. Check that the contact_messages table exists, then try again.' })
    } else {
      setStatus('success')
      setForm({ name: '', email: '', company: '', subject: '', message: '' })
      setToast({ type: 'success', text: 'Message sent! A copy has been emailed to you.' })
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
          eyebrow="Contact"
          title="Talk to a senior engineer, not a sales script"
          sub="Share a little about your project and we will respond within one business day."
        />
        <div className="contact-layout">
          <div className="contact-info reveal">
            <div className="contact-panel">
              <span className="eyebrow">
                <span className="eyebrow-bar" aria-hidden="true" />
                Reach us directly
              </span>
              <h3 className="contact-panel-title">
                Prefer a conversation? We are one call away.
              </h3>
              <p className="contact-lede">
                The fastest way to move forward is a short conversation. Reach us on any channel
                below, or book a slot and we will come to you prepared.
              </p>
              <ul className="contact-list">
                <li>
                  <span className="contact-icon">
                    <a href={CONTACT.phoneHref} aria-label={`Call ${CONTACT.phone}`}>
                      <Icon name="phone" />
                    </a>
                  </span>
                  <span className="contact-channel">
                    <small>Phone</small>
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
                    <small>Email</small>
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
                    <small>Office</small>
                    <a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer">
                      {CONTACT.address}
                    </a>
                  </span>
                </li>
                <li>
                  <span className="contact-icon"><Icon name="clock" /></span>
                  <span className="contact-channel">
                    <small>Hours</small>
                    <strong>Mon – Sat, 10:00 – 19:00 IST</strong>
                  </span>
                </li>
              </ul>
              <Link to="/book-consultation" className="btn btn-primary">
                Book a consultation slot
                <Icon name="arrow" />
              </Link>
            </div>
          </div>

          <form className="card contact-form reveal" onSubmit={handleSubmit} noValidate>
            <div className="contact-form-head">
              <h3>Send us a message</h3>
              <p>Fields marked with * are required.</p>
            </div>
            <div className="grid grid-2">
              <div className="input-group">
                <label htmlFor="name">Full Name *</label>
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
                <label htmlFor="email">Email *</label>
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
                <label htmlFor="company">Company</label>
                <input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Company Inc." autoComplete="organization" />
              </div>
              <div className="input-group">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Project inquiry" />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="message">Message *</label>
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
              {status === 'submitting' ? 'Sending…' : 'Send message'}
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

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <SectionLink id="top" className="brand">
            <img src="/img/logo.jpg" alt="Oklut Technologies logo" className="brand-logo" />
            <span className="brand-name">
              Oklut<span>Technologies</span>
            </span>
          </SectionLink>
          <p>
            Oklut Technologies is a digital product and IT services company in Hyderabad, India.
            We design, build and scale software for companies that compete on execution.
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
          <h4>Company</h4>
          <ul>
            <li><SectionLink id="about">About</SectionLink></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><SectionLink id="news">Perspectives</SectionLink></li>
            <li><SectionLink id="gallery">Projects & Insights</SectionLink></li>
            <li><SectionLink id="contact">Contact</SectionLink></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li><SectionLink id="services">Software Development</SectionLink></li>
            <li><SectionLink id="services">Digital & Cloud Solutions</SectionLink></li>
            <li><SectionLink id="services">IT Consulting</SectionLink></li>
            <li><SectionLink id="services">Digital Marketing</SectionLink></li>
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <ul className="footer-contact">
            <li>
              <a href={CONTACT.phoneHref}><Icon name="phone" /> {CONTACT.phone}</a>
            </li>
            <li>
              <a href={CONTACT.emailHref}><Icon name="mail" /> {CONTACT.email}</a>
            </li>
            <li>
              <a href="/book-consultation"><Icon name="calendar" /> Book a consultation</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Oklut Technologies. All rights reserved.</p>
        <div className="footer-legal">
          <button type="button" className="link-btn" onClick={openPreferences}>
            Cookie Preferences
          </button>
          <span aria-hidden="true">·</span>
          <Link to="/privacy" className="link-btn">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
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
        <Services />
        <Insights />
        <Gallery />
        <ContactForm />
      </div>
    </>
  )
}

function App() {
  const { isRecovery } = useAuth()
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login', redirectTo: null })

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
            <Route path="/centre-of-excellence" element={<CentreOfExcellencePage />} />
            <Route path="/coe" element={<CentreOfExcellencePage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route
              path="/book-consultation"
              element={
                <BookConsultationPage onRequireAuth={(mode) => openAuth(mode, '/book-consultation')} />
              }
            />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
          </Routes>
        </Suspense>
      </main>
      <BackToTop />
      <div className="theme-light">
        <Footer />
      </div>
      <AuthModal
        open={authModal.open}
        mode={authModal.mode}
        redirectTo={authModal.redirectTo}
        onClose={closeAuth}
        onSwitchMode={(mode) => setAuthModal({ open: true, mode, redirectTo: authModal.redirectTo })}
      />
      <CookieConsentBanner />
      <CookiePreferenceModal />
    </>
  )
}

export default App