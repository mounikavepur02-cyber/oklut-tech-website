import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const SERVICES = [
  'Custom Software Development',
  'Web & Mobile App Development',
  'Cloud & DevOps Solutions',
  'AI & Machine Learning',
  'IT Consulting',
  'Digital Marketing & SEO',
  'ERP Solutions',
  'Other / Not sure yet',
]

const TIME_SLOTS = [
  '9:00 AM – 10:00 AM',
  '10:30 AM – 11:30 AM',
  '12:00 PM – 1:00 PM',
  '2:00 PM – 3:00 PM',
  '3:30 PM – 4:30 PM',
  '5:00 PM – 6:00 PM',
]

const BUDGETS = ['Under ₹1L', '₹1L – ₹5L', '₹5L – ₹10L', '₹10L+', 'Not decided yet']

const EXPECT_POINTS = [
  {
    title: 'Understand your goals',
    text: 'We listen first. A 30-minute call to map your business needs, audience and desired outcomes.',
  },
  {
    title: 'Get technical direction',
    text: 'Our engineers share the right architecture, stack and approach for your project.',
  },
  {
    title: 'Receive a clear quote',
    text: 'Walk away with a transparent estimate, timeline and next steps — no obligation.',
  },
]

const CONTACT = {
  phone: '+91-9014217124',
  phoneHref: 'tel:+919014217124',
  email: 'info@oklut.com',
  emailHref: 'mailto:info@oklut.com',
  address:
    'Second Floor, Samridhi Vasyam, D No 1/98/9/3/23, Capital Pk Rd, beside Narayana High School, Cyber Hills Colony, VIP Hills, Jaihind Enclave, Madhapur, Hyderabad, Telangana 500081',
}

function BookConsultationPage({ onRequireAuth }) {
  const { user, loading } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    preferred_date: '',
    preferred_time: '',
    budget: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [toast, setToast] = useState(null)

  useDocumentMeta({
    title: 'Book a Free Consultation — Oklut Technologies',
    description:
      'Schedule a free consultation with Oklut Technologies. Discuss your project requirements, get technical direction and request a quote for software, cloud, AI and digital marketing services.',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const today = () => {
    const d = new Date()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${m}-${day}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Full name is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.phone.trim()) next.phone = 'Phone number is required.'
    else if (!/^[+0-9()\-\s]{7,20}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number.'
    if (!form.service) next.service = 'Please choose a service.'
    if (!form.preferred_date) next.preferred_date = 'Pick a preferred date.'
    if (!form.preferred_time) next.preferred_time = 'Pick a preferred time slot.'
    if (form.message.trim().length > 0 && form.message.trim().length < 10) {
      next.message = 'Add a little more detail (at least 10 characters).'
    }
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setToast({
        type: 'error',
        text: 'Please sign in to book your consultation.',
      })
      return
    }
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    const { error } = await supabase.from('consultations').insert([
      {
        user_id: user.id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim() || null,
        service: form.service,
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
        budget: form.budget || null,
        requirements: form.message.trim(),
      },
    ])

    if (error) {
      setStatus('idle')
      setToast({
        type: 'error',
        text: 'Could not book your consultation. Check that the consultations table exists, then try again.',
      })
    } else {
      setStatus('success')
      setForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        preferred_date: '',
        preferred_time: '',
        budget: '',
        message: '',
      })
      setToast({
        type: 'success',
        text: 'Consultation booked! Our team will confirm your time slot via email shortly.',
      })
    }
  }

  return (
    <>
      <section className="careers-hero consult-hero">
        <div className="container">
          <div className="consult-hero-inner">
            <span className="badge">Book a Free Consultation</span>
            <h1>
              Let&apos;s Plan Your Project <span className="hero-accent">Together</span>
            </h1>
            <p>
              Schedule a no-obligation call with our consultants. Discuss your requirements,
              explore the right technical approach and get a clear quote — all in under 30 minutes.
            </p>
            <div className="hero-actions">
              <a href="#consultation-form" className="btn btn-cta btn-lg">
                Book Your Slot
              </a>
              <a href="#how-it-works" className="btn btn-glass btn-lg">
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="consultation-form">
        <div className="container consult-layout">
          {!loading && !user ? (
            <div className="card contact-form consult-card consult-auth-gate">
              <div className="section-header consult-heading">
                <span className="badge">Account Required</span>
                <h2>Sign in to book your consultation</h2>
                <p>
                  You&apos;ll need an Oklut account to request a consultation. Sign in or create
                  one — it takes less than a minute.
                </p>
              </div>
              <button type="button" className="btn btn-primary btn-lg" onClick={() => onRequireAuth('login')}>
                Sign In to Continue
              </button>
              <p className="apply-gate-note">
                New to Oklut?{' '}
                <button type="button" className="link-btn" onClick={() => onRequireAuth('signup')}>
                  Create an account
                </button>
              </p>
            </div>
          ) : !loading && user ? (
          <div className="card contact-form consult-card">
            <div className="section-header consult-heading">
              <span className="badge">Request a Meeting</span>
              <h2>Tell Us About Your Project</h2>
              <p>Fill in your details and we will confirm your consultation slot by email.</p>
            </div>
            <form onSubmit={handleSubmit} noValidate>
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
                  {errors.name && (
                    <span className="error-message" id="name-error">{errors.name}</span>
                  )}
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
                  {errors.email && (
                    <span className="error-message" id="email-error">{errors.email}</span>
                  )}
                </div>
              </div>
              <div className="grid grid-2">
                <div className="input-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 90000 00000"
                    autoComplete="tel"
                    aria-invalid={errors.phone ? 'true' : undefined}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && (
                    <span className="error-message" id="phone-error">{errors.phone}</span>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company Inc."
                    autoComplete="organization"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="service">Service of Interest *</label>
                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  aria-invalid={errors.service ? 'true' : undefined}
                  aria-describedby={errors.service ? 'service-error' : undefined}
                  className={errors.service ? 'input-error' : ''}
                >
                  <option value="">Select a service…</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.service && (
                  <span className="error-message" id="service-error">{errors.service}</span>
                )}
              </div>
              <div className="grid grid-2">
                <div className="input-group">
                  <label htmlFor="preferred_date">Preferred Date *</label>
                  <input
                    id="preferred_date"
                    name="preferred_date"
                    type="date"
                    min={today()}
                    value={form.preferred_date}
                    onChange={handleChange}
                    aria-invalid={errors.preferred_date ? 'true' : undefined}
                    aria-describedby={errors.preferred_date ? 'date-error' : undefined}
                    className={errors.preferred_date ? 'input-error' : ''}
                  />
                  {errors.preferred_date && (
                    <span className="error-message" id="date-error">{errors.preferred_date}</span>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="preferred_time">Preferred Time *</label>
                  <select
                    id="preferred_time"
                    name="preferred_time"
                    value={form.preferred_time}
                    onChange={handleChange}
                    aria-invalid={errors.preferred_time ? 'true' : undefined}
                    aria-describedby={errors.preferred_time ? 'time-error' : undefined}
                    className={errors.preferred_time ? 'input-error' : ''}
                  >
                    <option value="">Select a time slot…</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.preferred_time && (
                    <span className="error-message" id="time-error">{errors.preferred_time}</span>
                  )}
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="budget">Estimated Budget</label>
                <select
                  id="budget"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                >
                  <option value="">Select a range…</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="message">Project Requirements</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your goals, scope, timeline and anything else we should know…"
                  rows={5}
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={errors.message ? 'input-error' : ''}
                />
                {errors.message && (
                  <span className="error-message" id="message-error">{errors.message}</span>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Booking…' : 'Book My Free Consultation'}
              </button>
              <p className="consult-note">
                100% free and no obligation. We normally respond within 24 hours.
              </p>
            </form>
          </div>
          ) : null}

          <aside className="consult-side">
            <div className="consult-info card">
              <h3>What to Expect</h3>
              {EXPECT_POINTS.map((p, i) => (
                <div className="consult-step" key={p.title}>
                  <span className="consult-step-num">{i + 1}</span>
                  <div>
                    <strong>{p.title}</strong>
                    <p>{p.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="consult-info card">
              <h3>Prefer to Reach Us Directly?</h3>
              <ul className="consult-contact">
                <li>
                  <strong>Call us</strong>
                  <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                </li>
                <li>
                  <strong>Email us</strong>
                  <a href={CONTACT.emailHref}>{CONTACT.email}</a>
                </li>
                <li>
                  <strong>Visit us</strong>
                  <span>{CONTACT.address}</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section consult-why" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="badge">Why Book With Us</span>
            <h2>A Free Call That Actually Helps</h2>
          </div>
<div className="products-grid">
            <article className="card product-card">
              <div className="product-icon preview-icon">1</div>
              <h3>Free Call, No Pressure</h3>
              <p>Every first consultation is free. There is no obligation to buy — just honest advice.</p>
            </article>
            <article className="card product-card">
              <div className="product-icon preview-icon">2</div>
              <h3>Senior Consultants Only</h3>
              <p>Your meeting is led by senior engineers and consultants who build for a living.</p>
            </article>
            <article className="card product-card">
              <div className="product-icon preview-icon">3</div>
              <h3>Clear Timelines &amp; Quotes</h3>
              <p>Leave with a defined next step, realistic timeline and transparent pricing for your project.</p>
            </article>
          </div>
        </div>
      </section>

      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          <span>{toast.type === 'success' ? '✓' : '!'}</span>
          <span>{toast.text}</span>
        </div>
      )}
    </>
  )
}

export default BookConsultationPage
