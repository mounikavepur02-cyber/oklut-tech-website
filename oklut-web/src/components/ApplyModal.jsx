import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getAuthErrorMessage, useAuth } from '../lib/auth'
import { useFocusTrap } from '../lib/useFocusTrap'
import { useBodyScrollLock } from '../lib/useBodyScrollLock'

const URL_RE = /^https?:\/\/.+\..+/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+]?[\d\s().-]{7,20}$/

const RESUME_ACCEPT =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const RESUME_EXT_RE = /\.(pdf|doc|docx)$/i
const MAX_RESUME_SIZE = 5 * 1024 * 1024 // 5 MB
const RESUME_BUCKET = 'resumes'

const FIELD_IDS = {
  name: 'apply-name',
  email: 'apply-email',
  phone: 'apply-phone',
  linkedin_url: 'apply-linkedin',
  portfolio_url: 'apply-portfolio',
  resume: 'apply-resume-dropzone',
}

function ApplyModal({ job, user, onClose, onSubmitted }) {
  const { signIn, signUp } = useAuth()

  const [step, setStep] = useState(user ? 'form' : 'gate')
  const [gateMode, setGateMode] = useState('signin')

  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedin_url: '', portfolio_url: '', resume_url: '', cover_letter: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverMessage, setServerMessage] = useState(null)
  const [notice, setNotice] = useState(null)
  const [success, setSuccess] = useState(false)
  const [emailStatus, setEmailStatus] = useState('idle')

  const [resumeFile, setResumeFile] = useState(null)
  const [resumeError, setResumeError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [signInForm, setSignInForm] = useState({ email: '', password: '' })
  const [signInAccepted, setSignInAccepted] = useState(false)
  const [signInErrors, setSignInErrors] = useState({})
  const [signInStatus, setSignInStatus] = useState('idle')
  const [signInMessage, setSignInMessage] = useState(null)

  const [signupForm, setSignupForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [signupErrors, setSignupErrors] = useState({})
  const [signupStatus, setSignupStatus] = useState('idle')
  const [signupMessage, setSignupMessage] = useState(null)

  const modalRef = useRef(null)
  const nameInputRef = useRef(null)
  const successRef = useRef(null)
  const uploadTimerRef = useRef(null)

  useFocusTrap(modalRef, true)
  useBodyScrollLock(true)

  useEffect(() => {
    setForm((f) => ({
      ...f,
      name: f.name || user?.user_metadata?.full_name || '',
      email: f.email || user?.email || '',
    }))
  }, [user])

  // Signed-in users skip the auth gate entirely.
  useEffect(() => {
    if (user && step === 'gate') setStep('form')
  }, [user, step])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(uploadTimerRef.current)
    }
  }, [onClose])

  // Move focus with each step so keyboard and screen reader users land on
  // the right element (and the success panel is announced).
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => successRef.current?.focus(), 0)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      if (step === 'gate') {
        document.getElementById(gateMode === 'signin' ? 'gate-email' : 'gate-name')?.focus()
      } else {
        nameInputRef.current?.focus()
      }
    }, 0)
    return () => clearTimeout(t)
  }, [step, gateMode, success])

  if (!job) return null

  const startUploadProgress = () => {
    setUploadProgress(0)
    clearTimeout(uploadTimerRef.current)
    const tick = () => {
      setUploadProgress((p) => {
        if (p >= 88) return p
        const next = Math.min(p + 9 + Math.random() * 11, 88)
        uploadTimerRef.current = setTimeout(tick, 170)
        return next
      })
    }
    uploadTimerRef.current = setTimeout(tick, 150)
  }

  const finishUploadProgress = () => {
    clearTimeout(uploadTimerRef.current)
    setUploadProgress(100)
    setTimeout(() => setUploadProgress(0), 700)
  }

  const failUploadProgress = () => {
    clearTimeout(uploadTimerRef.current)
    setUploadProgress(0)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
    if (serverMessage) setServerMessage(null)
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.phone.trim()) next.phone = 'Phone number is required.'
    else if (!PHONE_RE.test(form.phone.trim())) next.phone = 'Enter a valid phone number.'
    if (!resumeFile && !form.resume_url) next.resume = 'Please upload your resume.'
    for (const field of ['linkedin_url', 'portfolio_url']) {
      if (form[field].trim() && !URL_RE.test(form[field].trim())) {
        next[field] = 'Enter a full URL (https://…).'
      }
    }
    return next
  }

  const uploadResume = async () => {
    if (!resumeFile) throw new Error('No resume selected.')
    const safeName = resumeFile.name.replace(/[^a-z0-9._-]/gi, '-').toLowerCase()
    const applicant = user?.id || 'guest'
    const path = `${applicant}/${job.id}/${Date.now()}-${safeName}`.toLowerCase()
    startUploadProgress()
    try {
      const { error: uploadError } = await supabase.storage
        .from(RESUME_BUCKET)
        .upload(path, resumeFile, {
          contentType: resumeFile.type || 'application/octet-stream',
          upsert: false,
        })
      if (uploadError) {
        failUploadProgress()
        throw new Error(
          `Could not upload your resume (${uploadError.message}). Ask the team to create the "${RESUME_BUCKET}" storage bucket — see supabase-schema.sql.`,
        )
      }
      finishUploadProgress()
      const { data } = supabase.storage.from(RESUME_BUCKET).getPublicUrl(path)
      setForm((f) => ({ ...f, resume_url: data.publicUrl }))
      return data.publicUrl
    } catch (err) {
      failUploadProgress()
      throw err
    }
  }

  const handleResumeChange = (file) => {
    setResumeError(null)
    setErrors((prev) => {
      if (!prev.resume) return prev
      const next = { ...prev }
      delete next.resume
      return next
    })
    if (!file) {
      setResumeFile(null)
      return
    }
    if (!RESUME_EXT_RE.test(file.name)) {
      setResumeError('Resume must be a PDF, DOC, or DOCX file.')
      setResumeFile(null)
      return
    }
    if (file.size > MAX_RESUME_SIZE) {
      setResumeError('Resume must be 5 MB or smaller.')
      setResumeFile(null)
      return
    }
    setResumeFile(file)
    setForm((f) => ({ ...f, resume_url: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors)
      return
    }

    setStatus('submitting')
    setServerMessage(null)

    let resumeUrl = form.resume_url
    if (resumeFile) {
      try {
        resumeUrl = await uploadResume()
      } catch (err) {
        setStatus('idle')
        setServerMessage({
          type: 'error',
          text: err.message || 'Could not upload your resume. Please try again.',
        })
        return
      }
    }

    const { error } = await supabase.from('job_applications').insert([
      {
        job_id: job.id,
        applicant_id: user?.id ?? null,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        linkedin_url: form.linkedin_url.trim() || null,
        portfolio_url: form.portfolio_url.trim() || null,
        resume_url: resumeUrl || null,
        cover_letter: form.cover_letter.trim() || null,
      },
    ])

    if (error) {
      setStatus('idle')
      setServerMessage({
        type: 'error',
        text: 'Could not submit your application. Check that the job_applications table exists, then try again.',
      })
    } else {
      setStatus('success')
      setSuccess(true)
      onSubmitted?.()

      // Send a confirmation email. Best effort — if it fails the application
      // is already saved; we log the error and still show a success screen.
      try {
        const { error: emailError } = await supabase.functions.invoke(
          'send-application-confirmation',
          {
            body: {
              to: form.email.trim(),
              name: form.name.trim(),
              jobTitle: job.title,
            },
          },
        )
        if (emailError) {
          console.error('Confirmation email failed:', emailError)
          setEmailStatus('failed')
        } else {
          setEmailStatus('sent')
        }
      } catch (emailErr) {
        console.error('Confirmation email failed:', emailErr)
        setEmailStatus('failed')
      }
    }
  }

  const focusFirstError = (errs) => {
    const firstKey = Object.keys(errs)[0]
    if (!firstKey) return
    const id = FIELD_IDS[firstKey]
    const el = id && document.getElementById(id)
    if (el) el.focus()
  }

  const handleSignInChange = (e) => {
    const { name, value } = e.target
    setSignInForm((f) => ({ ...f, [name]: value }))
    setSignInErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
    if (signInMessage) setSignInMessage(null)
  }

  const handleSignInAcceptedChange = (e) => {
    setSignInAccepted(e.target.checked)
    setSignInErrors((prev) => {
      if (!prev.acceptedTerms) return prev
      const next = { ...prev }
      delete next.acceptedTerms
      return next
    })
    if (signInMessage) setSignInMessage(null)
  }

  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupForm((f) => ({ ...f, [name]: value }))
    setSignupErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
    if (signupMessage) setSignupMessage(null)
  }

  const validateSignIn = () => {
    const next = {}
    if (!signInForm.email.trim()) next.email = 'Email is required.'
    else if (!EMAIL_RE.test(signInForm.email.trim())) next.email = 'Enter a valid email.'
    if (!signInForm.password) next.password = 'Password is required.'
    if (!signInAccepted) next.acceptedTerms = 'Please accept the Oklut Privacy Policy and Security Policy to continue.'
    return next
  }

  const validateSignup = () => {
    const next = {}
    if (!signupForm.fullName.trim()) next.fullName = 'Full name is required.'
    if (!signupForm.email.trim()) next.email = 'Email is required.'
    else if (!EMAIL_RE.test(signupForm.email.trim())) next.email = 'Enter a valid email.'
    if (!signupForm.password) next.password = 'Password is required.'
    else if (signupForm.password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (signupForm.confirmPassword !== signupForm.password) next.confirmPassword = 'Passwords do not match.'
    return next
  }

  const handleSignInSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validateSignIn()
    setSignInErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSignInStatus('submitting')
    setSignInMessage(null)
    try {
      await signIn(signInForm.email.trim(), signInForm.password)
      setSignInStatus('idle')
    } catch (err) {
      setSignInStatus('idle')
      setSignInMessage({ type: 'error', text: getAuthErrorMessage(err) })
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validateSignup()
    setSignupErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSignupStatus('submitting')
    setSignupMessage(null)
    try {
      const { user: createdUser, session } = await signUp(
        signupForm.email.trim(),
        signupForm.password,
        signupForm.fullName.trim(),
      )
      setSignupStatus('idle')
      setForm((f) => ({
        ...f,
        name: f.name || signupForm.fullName.trim(),
        email: f.email || signupForm.email.trim(),
      }))
      if (!session && !createdUser?.confirmed_at) {
        setNotice({
          type: 'info',
          text: `Account created! Check ${signupForm.email.trim()} to confirm your signup so you can upload your resume. You can continue with your application below.`,
        })
      }
      setStep('form')
    } catch (err) {
      setSignupStatus('idle')
      setSignupMessage({ type: 'error', text: getAuthErrorMessage(err) })
    }
  }

  const switchGate = (mode) => {
    setGateMode(mode)
    setSignInAccepted(false)
    setSignInErrors({})
    setSignInMessage(null)
    setSignupErrors({})
    setSignupMessage(null)
  }

  const renderAuthGate = () => (
    <>
      <div className="modal-header">
        <span className="brand-mark">O</span>
        <h2 id="apply-modal-title">Apply to Oklut Technologies</h2>
        <p>Sign in or create a profile to apply for {job.title}.</p>
      </div>

      <div className="auth-tabs" role="tablist" aria-label="Account access">
        <button
          type="button"
          role="tab"
          id="gate-tab-signin"
          aria-selected={gateMode === 'signin'}
          aria-controls="gate-panel-signin"
          className={`auth-tab${gateMode === 'signin' ? ' auth-tab-active' : ''}`}
          onClick={() => switchGate('signin')}
        >
          Sign In
        </button>
        <button
          type="button"
          role="tab"
          id="gate-tab-signup"
          aria-selected={gateMode === 'signup'}
          aria-controls="gate-panel-signup"
          className={`auth-tab${gateMode === 'signup' ? ' auth-tab-active' : ''}`}
          onClick={() => switchGate('signup')}
        >
          Create Account
        </button>
      </div>

      {gateMode === 'signin' ? (
        <div
          className="apply-gate-section"
          id="gate-panel-signin"
          role="tabpanel"
          aria-labelledby="gate-tab-signin"
        >
          {signInMessage && (
            <div className={`alert alert-${signInMessage.type}`} role="status">
              {signInMessage.text}
            </div>
          )}

          <form className="modal-form" onSubmit={handleSignInSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="gate-email">Email</label>
              <input
                id="gate-email"
                name="email"
                type="email"
                value={signInForm.email}
                onChange={handleSignInChange}
                placeholder="jane@company.com"
                autoComplete="email"
                className={signInErrors.email ? 'input-error' : ''}
                aria-invalid={signInErrors.email ? 'true' : undefined}
                aria-describedby={signInErrors.email ? 'gate-email-error' : undefined}
              />
              {signInErrors.email && (
                <span id="gate-email-error" className="error-message" role="alert">{signInErrors.email}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="gate-password">Password</label>
              <input
                id="gate-password"
                name="password"
                type="password"
                value={signInForm.password}
                onChange={handleSignInChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className={signInErrors.password ? 'input-error' : ''}
                aria-invalid={signInErrors.password ? 'true' : undefined}
                aria-describedby={signInErrors.password ? 'gate-password-error' : undefined}
              />
              {signInErrors.password && (
                <span id="gate-password-error" className="error-message" role="alert">{signInErrors.password}</span>
              )}
            </div>

            <div className="input-group">
              <label className="check-row">
                <input
                  type="checkbox"
                  name="signInAccepted"
                  checked={signInAccepted}
                  onChange={handleSignInAcceptedChange}
                  aria-invalid={signInErrors.acceptedTerms ? 'true' : undefined}
                />
                <span>
                  I accept the Oklut <Link to="/privacy">Privacy &amp; Security</Link> policy.
                </span>
              </label>
              {signInErrors.acceptedTerms && (
                <span className="error-message" role="alert">{signInErrors.acceptedTerms}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={signInStatus === 'submitting'}>
              {signInStatus === 'submitting' ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="apply-gate-note">
            New here?{' '}
            <button type="button" className="link-btn" onClick={() => switchGate('signup')}>
              Create an account
            </button>
          </p>
        </div>
      ) : (
        <div
          className="apply-gate-section"
          id="gate-panel-signup"
          role="tabpanel"
          aria-labelledby="gate-tab-signup"
        >
          {signupMessage && (
            <div className={`alert alert-${signupMessage.type}`} role="status">
              {signupMessage.text}
            </div>
          )}

          <form className="modal-form" onSubmit={handleSignupSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="gate-name">Full Name *</label>
              <input
                id="gate-name"
                name="fullName"
                value={signupForm.fullName}
                onChange={handleSignupChange}
                placeholder="Jane Doe"
                autoComplete="name"
                className={signupErrors.fullName ? 'input-error' : ''}
                aria-invalid={signupErrors.fullName ? 'true' : undefined}
                aria-describedby={signupErrors.fullName ? 'gate-name-error' : undefined}
              />
              {signupErrors.fullName && (
                <span id="gate-name-error" className="error-message" role="alert">{signupErrors.fullName}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="gate-signup-email">Email *</label>
              <input
                id="gate-signup-email"
                name="email"
                type="email"
                value={signupForm.email}
                onChange={handleSignupChange}
                placeholder="jane@company.com"
                autoComplete="email"
                className={signupErrors.email ? 'input-error' : ''}
                aria-invalid={signupErrors.email ? 'true' : undefined}
                aria-describedby={signupErrors.email ? 'gate-signup-email-error' : undefined}
              />
              {signupErrors.email && (
                <span id="gate-signup-email-error" className="error-message" role="alert">{signupErrors.email}</span>
              )}
            </div>

            <div className="grid grid-2">
              <div className="input-group">
                <label htmlFor="gate-signup-password">Password *</label>
                <input
                  id="gate-signup-password"
                  name="password"
                  type="password"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={signupErrors.password ? 'input-error' : ''}
                  aria-invalid={signupErrors.password ? 'true' : undefined}
                  aria-describedby={signupErrors.password ? 'gate-signup-password-error' : undefined}
                />
                {signupErrors.password && (
                  <span id="gate-signup-password-error" className="error-message" role="alert">{signupErrors.password}</span>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="gate-signup-confirm">Confirm Password *</label>
                <input
                  id="gate-signup-confirm"
                  name="confirmPassword"
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={handleSignupChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={signupErrors.confirmPassword ? 'input-error' : ''}
                  aria-invalid={signupErrors.confirmPassword ? 'true' : undefined}
                  aria-describedby={signupErrors.confirmPassword ? 'gate-signup-confirm-error' : undefined}
                />
                {signupErrors.confirmPassword && (
                  <span id="gate-signup-confirm-error" className="error-message" role="alert">{signupErrors.confirmPassword}</span>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={signupStatus === 'submitting'}>
              {signupStatus === 'submitting' ? 'Creating account…' : 'Create Account & Continue'}
            </button>
          </form>

          <p className="apply-gate-note">
            Already have an account?{' '}
            <button type="button" className="link-btn" onClick={() => switchGate('signin')}>
              Sign in
            </button>
          </p>
        </div>
      )}
    </>
  )

  const renderApplicationForm = () => (
    <>
      <div className="modal-header">
        <span className="brand-mark">O</span>
        <h2 id="apply-modal-title">Apply: {job.title}</h2>
        <p>{job.department || 'Oklut Technologies'} · {job.location || 'Hyderabad, India'}</p>
      </div>

      {notice && (
        <div className={`alert alert-${notice.type}`} role="status">
          {notice.text}
        </div>
      )}

      {serverMessage && (
        <div className={`alert alert-${serverMessage.type}`} role="alert">
          {serverMessage.text}
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="alert alert-error" role="alert">
          Please fix the highlighted fields below before submitting.
        </div>
      )}

      <form className="modal-form" onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <label htmlFor="apply-role">Job Role *</label>
          <input
            id="apply-role"
            value={job.title}
            readOnly
            className="input-readonly"
            aria-describedby="apply-role-hint"
          />
          <span id="apply-role-hint" className="field-hint">
            Auto-filled from the role you selected.
          </span>
        </div>

        <div className="grid grid-2">
          <div className="input-group">
            <label htmlFor="apply-name">Full Name *</label>
            <input
              ref={nameInputRef}
              id="apply-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              autoComplete="name"
              className={errors.name ? 'input-error' : ''}
              aria-invalid={errors.name ? 'true' : undefined}
              aria-describedby={errors.name ? 'apply-name-error' : undefined}
            />
            {errors.name && <span id="apply-name-error" className="error-message" role="alert">{errors.name}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="apply-email">Email *</label>
            <input
              id="apply-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@company.com"
              autoComplete="email"
              className={errors.email ? 'input-error' : ''}
              aria-invalid={errors.email ? 'true' : undefined}
              aria-describedby={errors.email ? 'apply-email-error' : undefined}
            />
            {errors.email && <span id="apply-email-error" className="error-message" role="alert">{errors.email}</span>}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="apply-phone">Phone *</label>
          <input
            id="apply-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            autoComplete="tel"
            className={errors.phone ? 'input-error' : ''}
            aria-invalid={errors.phone ? 'true' : undefined}
            aria-describedby={errors.phone ? 'apply-phone-error' : undefined}
          />
          {errors.phone && <span id="apply-phone-error" className="error-message" role="alert">{errors.phone}</span>}
        </div>

        <div className="grid grid-2">
          <div className="input-group">
            <label htmlFor="apply-linkedin">LinkedIn URL</label>
            <input
              id="apply-linkedin"
              name="linkedin_url"
              value={form.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/janedoe"
              autoComplete="url"
              className={errors.linkedin_url ? 'input-error' : ''}
              aria-invalid={errors.linkedin_url ? 'true' : undefined}
              aria-describedby={errors.linkedin_url ? 'apply-linkedin-error' : undefined}
            />
            {errors.linkedin_url && <span id="apply-linkedin-error" className="error-message" role="alert">{errors.linkedin_url}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="apply-portfolio">Portfolio URL</label>
            <input
              id="apply-portfolio"
              name="portfolio_url"
              value={form.portfolio_url}
              onChange={handleChange}
              placeholder="https://janedoe.dev"
              autoComplete="url"
              className={errors.portfolio_url ? 'input-error' : ''}
              aria-invalid={errors.portfolio_url ? 'true' : undefined}
              aria-describedby={errors.portfolio_url ? 'apply-portfolio-error' : undefined}
            />
            {errors.portfolio_url && <span id="apply-portfolio-error" className="error-message" role="alert">{errors.portfolio_url}</span>}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="apply-resume-dropzone">Resume Upload *</label>
          <div
            id="apply-resume-dropzone"
            className={`resume-dropzone${resumeFile ? ' resume-dropzone-filled' : ''}${resumeError || errors.resume ? ' resume-dropzone-error' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="Upload your resume: PDF, DOC, or DOCX, maximum 5 MB"
            onClick={() => document.getElementById('apply-resume')?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                document.getElementById('apply-resume')?.click()
              }
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.currentTarget.classList.add('resume-dropzone-dragging')
            }}
            onDragLeave={(e) => e.currentTarget.classList.remove('resume-dropzone-dragging')}
            onDrop={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove('resume-dropzone-dragging')
              const file = e.dataTransfer?.files?.[0] || null
              handleResumeChange(file)
            }}
          >
            <input
              id="apply-resume"
              type="file"
              accept={RESUME_ACCEPT}
              className="visually-hidden"
              tabIndex={-1}
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                handleResumeChange(file)
              }}
            />
            {resumeFile ? (
              <div className="resume-file">
                <span className="resume-file-icon" aria-hidden="true">📄</span>
                <div className="resume-file-info">
                  <strong>{resumeFile.name}</strong>
                  <span>{(resumeFile.size / 1024 / 1024).toFixed(2)} MB · {resumeFile.type.split('/').pop().toUpperCase() || 'FILE'}</span>
                </div>
                <button
                  type="button"
                  className="resume-remove"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleResumeChange(null)
                  }}
                  aria-label={`Remove ${resumeFile.name}`}
                >
                  Remove
                </button>
              </div>
            ) : status === 'submitting' ? (
              <div className="resume-upload">
                <p className="resume-dropzone-status" id="resume-upload-status">
                  Uploading your resume…
                </p>
                <div
                  className="progress-track"
                  role="progressbar"
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-labelledby="resume-upload-status"
                >
                  <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="resume-hint">{uploadProgress}%</p>
              </div>
            ) : (
              <>
                <span className="resume-dropzone-icon" aria-hidden="true">⬆</span>
                <p className="resume-dropzone-text">
                  Drag &amp; drop your resume here, or <span className="resume-browse">browse files</span>
                </p>
                <p className="resume-hint">PDF, DOC, or DOCX · Max 5 MB</p>
              </>
            )}
          </div>
          {(resumeError || errors.resume) && (
            <span className="error-message" role="alert">{resumeError || errors.resume}</span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="apply-cover">Cover Letter</label>
          <textarea id="apply-cover" name="cover_letter" value={form.cover_letter} onChange={handleChange} placeholder="Tell us why you are a great fit for this role…" />
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
        </button>
      </form>
    </>
  )

  const firstName = (form.name.trim().split(/\s+/)[0] || 'there').replace(/^./, (c) => c.toUpperCase())

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal modal-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
        aria-describedby="apply-modal-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <span id="apply-modal-desc" className="visually-hidden">
          Apply for a job at Oklut Technologies. Fields marked with an asterisk are required.
        </span>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close application dialog">
          &times;
        </button>

        {success ? (
          <div ref={successRef} tabIndex={-1} className="apply-success" role="status" aria-live="polite">
            <div className="success-confetti" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
            <svg className="success-check" viewBox="0 0 52 52" aria-hidden="true">
              <circle className="success-check-circle" cx="26" cy="26" r="24" />
              <path className="success-check-mark" d="M14 27l8 8 16-16" />
            </svg>
            <h2 id="apply-modal-title">Application Submitted</h2>
            <p className="apply-success-thanks">
              Thank you, {firstName}! Your application for <strong>{job.title}</strong> has been
              submitted successfully.
              {emailStatus === 'sent'
                ? ' A confirmation email is on its way to your inbox.'
                : ''}
            </p>
            <div className="apply-success-steps">
              <div className="apply-success-step">
                <span className="apply-success-step-num">1</span>
                <p>Our team reviews your resume and cover letter.</p>
              </div>
              <div className="apply-success-step">
                <span className="apply-success-step-num">2</span>
                <p>Shortlisted candidates are invited to a conversation.</p>
              </div>
              <div className="apply-success-step">
                <span className="apply-success-step-num">3</span>
                <p>We follow up by email — keep an eye on your inbox.</p>
              </div>
            </div>
            {emailStatus === 'failed' && (
              <p className="apply-email-note">
                We could not send a confirmation email at this time. Your application has been
                saved — please contact us at{' '}
                <a href="mailto:info@oklut.com">info@oklut.com</a> if you have any questions.
              </p>
            )}
            <button type="button" className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        ) : step === 'form' ? (
          renderApplicationForm()
        ) : (
          renderAuthGate()
        )}
      </div>
    </div>
  )
}

export default ApplyModal
