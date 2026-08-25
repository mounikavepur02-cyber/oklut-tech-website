import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
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
const CustomDevelopmentPage = lazy(() => import('./pages/services/CustomDevelopmentPage'))
const ProcessAutomationPage = lazy(() => import('./pages/services/ProcessAutomationPage'))
const CenterOfExcellencePage = lazy(() => import('./pages/services/CenterOfExcellencePage'))
const SolutionEngineeringPage = lazy(() => import('./pages/services/SolutionEngineeringPage'))
const DigitalTransformationPage = lazy(() => import('./pages/services/DigitalTransformationPage'))
const MigrationServicesPage = lazy(() => import('./pages/services/MigrationServicesPage'))
const OneStopSolutionsPage = lazy(() => import('./pages/services/OneStopSolutionsPage'))
const PilotPrototypingPage = lazy(() => import('./pages/services/PilotPrototypingPage'))
const ManagedServicesPage = lazy(() => import('./pages/services/ManagedServicesPage'))

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
  { id: 'products', label: 'Products', hasDropdown: true },
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
  },
  {
    label: 'Process Automation',
    slug: 'process-automation',
    icon: 'gears',
    description: 'Streamline workflows and remove manual effort with intelligent automation.',
  },
  {
    label: 'Center of Excellence',
    slug: 'center-of-excellence',
    icon: 'award',
    description: 'Embed a high-performing engineering hub with shared standards and reuse.',
  },
  {
    label: 'Solution Engineering',
    slug: 'solution-engineering',
    icon: 'layers',
    description: 'Architect resilient, scalable systems from discovery to production.',
  },
  {
    label: 'Digital Transformation',
    slug: 'digital-transformation',
    icon: 'trendingUp',
    description: 'Modernize technology, processes and culture to compete in a digital-first world.',
  },
  {
    label: 'End-to-End Solutions',
    slug: 'end-to-end-solutions',
    icon: 'package',
    description: 'Full-lifecycle delivery from strategy and design through 24/7 operations.',
  },
  {
    label: 'Migration Services',
    slug: 'migration-services',
    icon: 'cloud',
    description: 'Move applications, data and infrastructure to the cloud securely and cost-effectively.',
  },
  {
    label: 'Pilot & Prototyping',
    slug: 'pilot-prototyping',
    icon: 'rocket',
    description: 'Validate ideas fast with low-risk pilots and production-grade prototypes.',
  },
  {
    label: 'Shared Services',
    slug: 'shared-services',
    icon: 'server',
    description: 'Centralized platforms and managed services that scale across teams.',
  },
]

const SECTION_IDS = ['top', 'about', 'services', 'news', 'gallery', 'contact']

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

const POPULAR_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
]

const WORLD_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  { code: 'fa', name: 'Persian', native: 'فارسی' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'da', name: 'Danish', native: 'Dansk' },
  { code: 'fi', name: 'Finnish', native: 'Suomi' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina' },
  { code: 'bg', name: 'Bulgarian', native: 'Български' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', native: 'Српски' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina' },
  { code: 'et', name: 'Estonian', native: 'Eesti' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių' },
  { code: 'is', name: 'Icelandic', native: 'Íslenska' },
  { code: 'ga', name: 'Irish', native: 'Gaeilge' },
  { code: 'mt', name: 'Maltese', native: 'Malti' },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg' },
  { code: 'sq', name: 'Albanian', native: 'Shqip' },
  { code: 'mk', name: 'Macedonian', native: 'Македонски' },
  { code: 'bs', name: 'Bosnian', native: 'Bosanski' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans' },
  { code: 'zu', name: 'Zulu', native: 'isiZulu' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ' },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá' },
  { code: 'ha', name: 'Hausa', native: 'Hausa' },
  { code: 'ig', name: 'Igbo', native: 'Igbo' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල' },
  { code: 'my', name: 'Burmese', native: 'မြန်မာစာ' },
  { code: 'km', name: 'Khmer', native: 'ភាសាខ្មែរ' },
  { code: 'lo', name: 'Lao', native: 'ພາສາລາວ' },
  { code: 'ka', name: 'Georgian', native: 'ქართული' },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն' },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan' },
  { code: 'uz', name: 'Uzbek', native: 'Oʻzbek' },
  { code: 'kk', name: 'Kazakh', native: 'Қазақ' },
  { code: 'mn', name: 'Mongolian', native: 'Монгол хэл' },
  { code: 'tl', name: 'Filipino', native: 'Filipino' },
  { code: 'haw', name: 'Hawaiian', native: 'ʻŌlelo Hawaiʻi' },
  { code: 'mi', name: 'Maori', native: 'Te Reo Māori' },
  { code: 'sm', name: 'Samoan', native: 'Gagana Samoa' },
  { code: 'to', name: 'Tongan', native: 'Lea Faka-Tonga' },
]

function Navbar({ onSignIn, onSignUp }) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [productsTab, setProductsTab] = useState('featured')
  const [techOpen, setTechOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [langSearch, setLangSearch] = useState('')
  const [selectedLang, setSelectedLang] = useState(POPULAR_LANGUAGES[0])
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const servicesRef = useRef(null)
  const productsRef = useRef(null)
  const techRef = useRef(null)
  const langRef = useRef(null)

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
      if (productsRef.current && !productsRef.current.contains(e.target)) {
        setProductsOpen(false)
      }
      if (techRef.current && !techRef.current.contains(e.target)) {
        setTechOpen(false)
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
        setLangSearch('')
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
          <img src={`${import.meta.env.BASE_URL}img/logo.jpg`} alt="Oklut Technologies logo" className="brand-logo" />
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
                      setProductsOpen(false)
                      setTechOpen(false)
                    }}
                  >
                    <span>Services</span>
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
                          onClick={closeMobile}
                        >
                          {s.label}
                        </a>
                      ) : (
                        <Link
                          key={s.slug}
                          to={`/services/${s.slug}`}
                          className="services-dropdown-item"
                          onClick={closeMobile}
                        >
                          {s.label}
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              )
            }
            if (item.hasDropdown && item.id === 'products') {
              const tabConfig = {
                featured: { items: FEATURED_PRODUCTS, title: 'Featured Products', sub: 'Simplify operations, connect teams, automate processes, and drive smarter business growth.', btnText: 'See All Products', gridTitle: 'FEATURED PRODUCTS', promoTitle: 'Meet the Autonomous Workforce', promoText: 'Transform your operations with AI agents that work alongside your team to handle complex, repetitive tasks.', promoBtnText: 'Learn More' },
                erp: { items: ERP_SOLUTIONS, title: 'One Platform Ready for Anything', sub: 'Empowering businesses with connected, intelligent, and scalable enterprise management solutions.', btnText: 'Explore ERP Solutions', gridTitle: 'ERP SOLUTIONS', promoTitle: 'Modular ERP for Growth', promoText: 'Deploy modular ERP features rapidly without the complexity of traditional multi-year systems.', promoBtnText: 'Schedule Demo' },
                it: { items: IT_SOLUTIONS, title: 'IT Solutions', sub: 'Enterprise-grade infrastructure, security, and DevOps solutions to keep your business running.', btnText: 'Explore IT Solutions', gridTitle: 'IT SOLUTIONS', promoTitle: 'Reliable IT Infrastructure', promoText: 'Build a resilient technology foundation with managed cloud, security, and DevOps services.', promoBtnText: 'Get Started' },
                crm: { items: CRM_SOLUTIONS, title: 'CRM Solutions', sub: 'Customer relationship management to streamline sales, support, and marketing workflows.', btnText: 'Explore CRM Solutions', gridTitle: 'CRM SOLUTIONS', promoTitle: 'Close More Deals', promoText: 'Empower your sales and support teams with unified customer data and intelligent automation.', promoBtnText: 'Start Free Trial' },
                hrms: { items: HRMS_SOLUTIONS, title: 'HRMS Solutions', sub: 'Human resource management covering payroll, recruitment, performance, and employee engagement.', btnText: 'Explore HRMS Solutions', gridTitle: 'HRMS SOLUTIONS', promoTitle: 'Simplify HR Operations', promoText: 'Automate HR workflows from recruitment to retirement with a modern, employee-first platform.', promoBtnText: 'Request Demo' },
              };
              const activeTab = tabConfig[productsTab] || tabConfig.featured;

              return (
                <div
                  key={item.id}
                  className="services-dropdown-wrap products-mega-dropdown-wrap"
                  ref={productsRef}
                >
                  <button
                    type="button"
                    className="services-toggle"
                    aria-haspopup="menu"
                    aria-expanded={productsOpen}
                    onClick={() => {
                      setProductsOpen((o) => !o)
                      setServicesOpen(false)
                      setTechOpen(false)
                    }}
                  >
                    <span>Products</span>
                    <span
                      className={`services-chevron ${productsOpen ? 'is-open' : ''}`}
                      aria-hidden="true"
                    >
                      <Icon name="chevron" />
                    </span>
                  </button>
                  <div
                    className={`products-dropdown ${productsOpen ? 'is-open' : ''}`}
                    role="menu"
                    aria-label="Products"
                  >
                    {/* Desktop layout */}
                    <div className="mega-menu-desktop-only">
                      <div className="mega-menu-sidebar">
                        <button
                          type="button"
                          className={`mega-menu-tab-btn ${productsTab === 'featured' ? 'is-active' : ''}`}
                          onClick={() => setProductsTab('featured')}
                        >
                          <span>Featured Products</span>
                          <span className="mega-menu-tab-chevron"><Icon name="chevronRight" /></span>
                        </button>
                        <button
                          type="button"
                          className={`mega-menu-tab-btn ${productsTab === 'erp' ? 'is-active' : ''}`}
                          onClick={() => setProductsTab('erp')}
                        >
                          <span>ERP Solutions</span>
                          <span className="mega-menu-tab-chevron"><Icon name="chevronRight" /></span>
                        </button>
                        <div className="mega-menu-sidebar-heading">SOLUTIONS</div>
                        <button
                          type="button"
                          className={`mega-menu-tab-btn ${productsTab === 'it' ? 'is-active' : ''}`}
                          onClick={() => setProductsTab('it')}
                        >
                          <span>IT</span>
                          <span className="mega-menu-tab-chevron"><Icon name="chevronRight" /></span>
                        </button>
                        <button
                          type="button"
                          className={`mega-menu-tab-btn ${productsTab === 'crm' ? 'is-active' : ''}`}
                          onClick={() => setProductsTab('crm')}
                        >
                          <span>CRM</span>
                          <span className="mega-menu-tab-chevron"><Icon name="chevronRight" /></span>
                        </button>
                        <button
                          type="button"
                          className={`mega-menu-tab-btn ${productsTab === 'hrms' ? 'is-active' : ''}`}
                          onClick={() => setProductsTab('hrms')}
                        >
                          <span>HRMS</span>
                          <span className="mega-menu-tab-chevron"><Icon name="chevronRight" /></span>
                        </button>
                      </div>

                      <div className="mega-menu-main">
                        <div className="mega-menu-main-header">
                          <h3 className="mega-menu-title">{activeTab.title}</h3>
                          <p className="mega-menu-subtitle">{activeTab.sub}</p>
                          <Link to="/book-consultation" className="btn btn-outline btn-sm mega-menu-cta" onClick={() => { setProductsOpen(false); closeMobile(); }}>
                            {activeTab.btnText}
                          </Link>
                        </div>
                        <div className="mega-menu-divider" />
                        <div className="mega-menu-grid-title">{activeTab.gridTitle}</div>
                        <div className="mega-menu-grid">
                          {activeTab.items.map((prod, idx) => (
                            <Link key={idx} to="/book-consultation" className="mega-menu-grid-item" onClick={() => { setProductsOpen(false); closeMobile(); }}>
                              <h4>{prod.title}</h4>
                              <p>{prod.description}</p>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="mega-menu-promo">
                        <div className="mega-menu-promo-card">
                          <h3>{activeTab.promoTitle}</h3>
                          <p>{activeTab.promoText}</p>
                          <Link to="/book-consultation" className="btn btn-primary btn-sm" onClick={() => { setProductsOpen(false); closeMobile(); }}>
                            {activeTab.promoBtnText}
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Mobile layout */}
                    <div className="mega-menu-mobile-only">
                      <div className="mega-menu-mobile-section">
                        <div className="mega-menu-mobile-heading">Featured Products</div>
                        <div className="mega-menu-mobile-list">
                          {FEATURED_PRODUCTS.map((prod, idx) => (
                            <Link key={idx} to="/book-consultation" className="mega-menu-mobile-item" onClick={() => { setProductsOpen(false); closeMobile(); }}>
                              <strong>{prod.title}</strong>
                              <span>{prod.description}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="mega-menu-mobile-section">
                        <div className="mega-menu-mobile-heading">One Platform Ready for Anything</div>
                        <div className="mega-menu-mobile-list">
                          {ERP_SOLUTIONS.map((prod, idx) => (
                            <Link key={idx} to="/book-consultation" className="mega-menu-mobile-item" onClick={() => { setProductsOpen(false); closeMobile(); }}>
                              <strong>{prod.title}</strong>
                              <span>{prod.description}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="mega-menu-mobile-section">
                        <div className="mega-menu-mobile-heading">Solutions</div>
                        <div className="mega-menu-mobile-sub-heading">IT</div>
                        <div className="mega-menu-mobile-list">
                          {IT_SOLUTIONS.map((prod, idx) => (
                            <Link key={idx} to="/book-consultation" className="mega-menu-mobile-item" onClick={() => { setProductsOpen(false); closeMobile(); }}>
                              <strong>{prod.title}</strong>
                              <span>{prod.description}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="mega-menu-mobile-section">
                        <div className="mega-menu-mobile-sub-heading">CRM</div>
                        <div className="mega-menu-mobile-list">
                          {CRM_SOLUTIONS.map((prod, idx) => (
                            <Link key={idx} to="/book-consultation" className="mega-menu-mobile-item" onClick={() => { setProductsOpen(false); closeMobile(); }}>
                              <strong>{prod.title}</strong>
                              <span>{prod.description}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="mega-menu-mobile-section">
                        <div className="mega-menu-mobile-sub-heading">HRMS</div>
                        <div className="mega-menu-mobile-list">
                          {HRMS_SOLUTIONS.map((prod, idx) => (
                            <Link key={idx} to="/book-consultation" className="mega-menu-mobile-item" onClick={() => { setProductsOpen(false); closeMobile(); }}>
                              <strong>{prod.title}</strong>
                              <span>{prod.description}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
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
                      setProductsOpen(false)
                    }}
                  >
                    <span>Technologies</span>
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
            Careers
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
            <div className="lang-selector-wrap" ref={langRef}>
              <button
                type="button"
                className="lang-selector"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                onClick={() => setLangOpen((o) => !o)}
              >
                <Icon name="globe" className="lang-icon" />
                <span className="lang-text">{selectedLang.native}</span>
                <Icon name="chevron" className={`lang-chevron ${langOpen ? 'is-open' : ''}`} />
              </button>
              {langOpen && (
                <div className="lang-dropdown" role="listbox" aria-label="Choose your language">
                  <div className="lang-dropdown-header">
                    <span className="lang-dropdown-title">Choose your language</span>
                  </div>
                  <div className="lang-search">
                    <Icon name="search" className="lang-search-icon" />
                    <input
                      type="text"
                      className="lang-search-input"
                      placeholder="Search language"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </div>
                  <div className="lang-options">
                    {/* Reset to English option */}
                    <button
                      type="button"
                      className="lang-option"
                      role="option"
                      onClick={() => {
                        setSelectedLang(POPULAR_LANGUAGES[0])
                        setLangOpen(false)
                        setLangSearch('')
                        // Reset to English
                        const select = document.querySelector('.goog-te-combo')
                        if (select) {
                          select.value = 'en'
                          select.dispatchEvent(new Event('change'))
                        }
                        // Remove Google Translate banner
                        const banner = document.querySelector('.goog-te-banner-frame')
                        if (banner) banner.remove()
                        document.body.style.top = '0px'
                      }}
                    >
                      <span className="lang-option-native">English</span>
                      <span className="lang-option-name">Reset to English</span>
                      {selectedLang.code === 'en' && <Icon name="check" className="lang-option-check" />}
                    </button>
                    {(() => {
                      const query = langSearch.trim().toLowerCase()
                      const results = query
                        ? WORLD_LANGUAGES.filter(
                            (l) =>
                              l.name.toLowerCase().includes(query) ||
                              l.native.toLowerCase().includes(query)
                          )
                        : POPULAR_LANGUAGES
                      return results.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          className={`lang-option ${selectedLang.code === l.code ? 'is-selected' : ''}`}
                          role="option"
                          aria-selected={selectedLang.code === l.code}
                          onClick={() => {
                            setSelectedLang(l)
                            setLangOpen(false)
                            setLangSearch('')
                            // Trigger Google Translate
                            const select = document.querySelector('.goog-te-combo')
                            if (select) {
                              select.value = l.code
                              select.dispatchEvent(new Event('change'))
                            }
                          }}
                        >
                          <span className="lang-option-native">{l.native}</span>
                          <span className="lang-option-name">{l.name}</span>
                          {selectedLang.code === l.code && <Icon name="check" className="lang-option-check" />}
                        </button>
                      ))
                    })()}
                    {langSearch.trim() && (() => {
                      const query = langSearch.trim().toLowerCase()
                      const results = WORLD_LANGUAGES.filter(
                        (l) =>
                          l.name.toLowerCase().includes(query) ||
                          l.native.toLowerCase().includes(query)
                      )
                      return results.length === 0 ? (
                        <div className="lang-no-results">No languages found</div>
                      ) : null
                    })()}
                  </div>
                </div>
              )}
            </div>
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
          <div className="hero-location reveal">
            <span>
              <Icon name="pin" /> Madhapur, Hyderabad
            </span>
            <span>Oklut Technologies — since 2012</span>
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
    { icon: 'award', title: 'Award Winning', text: 'Recognized for delivery excellence across web and mobile product engineering.', color: '#f59e0b' },
    { icon: 'users', title: 'Professional Staff', text: 'Senior, accountable engineers who own the work from first call to go-live.', color: '#3b82f6' },
    { icon: 'clock', title: '24/7 Support', text: 'Managed services and a support line that answers when you need it.', color: '#10b981' },
    { icon: 'star', title: 'Fair Prices', text: 'Honest estimates and transparent billing on every single engagement.', color: '#8b5cf6' },
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

function Technologies() {
  const [selectedTech, setSelectedTech] = useState('')
  const navigate = useNavigate()

  const techOptions = [
    { value: '', label: 'Select a Technology' },
    { value: 'ai-robotics', label: 'AI & Robotics' },
    { value: 'business-automation', label: 'Business Automation' },
    { value: 'cloud-migrations', label: 'Cloud Migrations' },
    { value: 'data-centers', label: 'Data Centers' },
    { value: 'cognitive-analytics', label: 'Cognitive Analytics & AI' },
    { value: 'information-reporting', label: 'Information & Reporting Systems' },
    { value: 'managed-services', label: 'Managed Services' },
    { value: 'one-stop-solutions', label: 'One-Stop Solutions' },
  ]

  const techRoutes = {
    'managed-services': '/services/managed-services',
    'one-stop-solutions': '/services/one-stop-solutions',
  }

  return (
    <section id="gallery" className="section tech-section">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--c1)', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Technologies</h2>
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
          title="Technology That Drives Global Business"
          sub="Empowering organizations worldwide with intelligent, scalable, and innovative technology solutions."
          center
        />
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
                    <strong>Mon – Sat, 9:30 – 18:30 IST</strong>
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
            <img src={`${import.meta.env.BASE_URL}img/logo.jpg`} alt="Oklut Technologies logo" className="brand-logo" />
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
            <li><SectionLink id="gallery">Technologies</SectionLink></li>
            <li><SectionLink id="contact">Contact</SectionLink></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                {s.externalUrl ? (
                  <a href={s.externalUrl} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ) : (
                  <Link to={`/services/${s.slug}`}>{s.label}</Link>
                )}
              </li>
            ))}
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

function Services() {
  return (
    <section id="services" className="section services-section">
      <div className="container">
        <SectionHead
          eyebrow="Services"
          title="What we do"
          sub="From strategy to managed operations, we deliver end-to-end technology partnerships for companies that compete on execution."
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
              <h3>{s.label}</h3>
              <p>{s.description}</p>
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
            <Route path="/careers" element={<CareersPage />} />
            <Route
              path="/book-consultation"
              element={
                <BookConsultationPage onRequireAuth={(mode) => openAuth(mode, '/book-consultation')} />
              }
            />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            
            
            
            <Route path="/services/end-to-end-solutions" element={<EndToEndSolutionsPage />} />
            <Route path="/services/pilot-prototyping" element={<PilotPrototypingPage />} />
            <Route path="/services/shared-services" element={<SharedServicesPage />} />
            <Route path="/services/custom-development" element={<CustomDevelopmentPage />} />
            <Route path="/services/process-automation" element={<ProcessAutomationPage />} />
            <Route path="/services/center-of-excellence" element={<CenterOfExcellencePage />} />
            <Route path="/services/solution-engineering" element={<SolutionEngineeringPage />} />
            <Route path="/services/digital-transformation" element={<DigitalTransformationPage />} />
            <Route path="/services/migration-services" element={<MigrationServicesPage />} />
            <Route path="/services/one-stop-solutions" element={<OneStopSolutionsPage />} />
            <Route path="/services/managed-services" element={<ManagedServicesPage />} />
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
      <Chatbot />
    </>
  )
}

export default App