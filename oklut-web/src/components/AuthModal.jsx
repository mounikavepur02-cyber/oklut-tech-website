import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuthErrorMessage, useAuth } from '../lib/auth'

function AuthModal({ open, mode, onClose, onSwitchMode, redirectTo }) {
  const { signUp, signIn, isRecovery, resetPassword, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverMessage, setServerMessage] = useState(null)

  const isLogin = mode === 'login'

  const [view, setView] = useState(mode === 'forgot' || isRecovery ? (isRecovery ? 'recovery' : 'forgot') : isLogin ? 'login' : 'signup')

  useEffect(() => {
    setErrors({})
    setServerMessage(null)
    setStatus('idle')
    setAcceptedTerms(false)
    if (isRecovery) {
      setView('recovery')
    } else {
      setView(mode === 'forgot' ? 'forgot' : mode === 'login' ? 'login' : 'signup')
    }
  }, [open, mode, isRecovery])

  if (!open) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const next = {}
    if (view === 'forgot') {
      if (!form.email.trim()) next.email = 'Email is required.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
      return next
    }
    if (view === 'recovery') {
      if (!form.password) next.password = 'New password is required.'
      else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
      if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.'
      return next
    }
    if (!isLogin && !form.fullName.trim()) next.fullName = 'Full name is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (!isLogin && form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.'
    if (isLogin && !acceptedTerms) next.acceptedTerms = 'Please accept the Oklut Privacy Policy and Security Policy to continue.'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    setServerMessage(null)
    try {
      if (view === 'forgot') {
        await resetPassword(form.email.trim())
        setServerMessage({
          type: 'info',
          text: 'Password reset link sent! Check your email to create a new password.',
        })
        setStatus('idle')
      } else if (view === 'recovery') {
        await updatePassword(form.password)
        setForm((f) => ({ ...f, password: '', confirmPassword: '' }))
        setView('login')
        setServerMessage({
          type: 'success',
          text: 'Your password has been updated. Sign in with your new password.',
        })
        setStatus('idle')
      } else if (isLogin) {
        await signIn(form.email.trim(), form.password)
        if (redirectTo) navigate(redirectTo)
        onClose()
      } else {
        await signUp(form.email.trim(), form.password, form.fullName.trim())
        setServerMessage({
          type: 'info',
          text: 'Account created! Check your email to confirm your signup, then sign in.',
        })
        setStatus('idle')
      }
    } catch (err) {
      setStatus('idle')
      setServerMessage({ type: 'error', text: getAuthErrorMessage(err) })
    }
  }

  const goTo = (nextView) => () => {
    setErrors({})
    setServerMessage(null)
    setStatus('idle')
    setView(nextView)
  }

  const switchTo = (nextMode) => () => {
    setErrors({})
    setServerMessage(null)
    onSwitchMode(nextMode)
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="modal-header">
          <span className="brand-mark">O</span>
          <h2>
            {view === 'forgot' ? 'Forgot Password' : view === 'recovery' ? 'Create New Password' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p>
            {view === 'forgot'
              ? 'Enter your email and we will send you a link to reset your password.'
              : view === 'recovery'
                ? 'Choose a strong new password for your account.'
                : isLogin
                  ? 'Sign in to your Oklut account.'
                  : 'Join Oklut Technologies today.'}
          </p>
        </div>

        {serverMessage && (
          <div className={`alert alert-${serverMessage.type}`} role="status">
            {serverMessage.text}
          </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          {view === 'signup' && (
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                autoComplete="name"
                className={errors.fullName ? 'input-error' : ''}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
          )}

          {view !== 'recovery' && (
            <div className="input-group">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@company.com"
                autoComplete="email"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          )}

          {view !== 'forgot' && (
          <div className="input-group">
            <label htmlFor="auth-password">{view === 'recovery' ? 'New Password' : 'Password'}</label>
            <input
              id="auth-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          )}

          {view !== 'login' && view !== 'forgot' && (
            <div className="input-group">
              <label htmlFor="confirmPassword">{view === 'recovery' ? 'Confirm New Password' : 'Confirm Password'}</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}

          {view === 'login' && (
            <>
              <div className="auth-row">
                <button type="button" className="link-btn forgot-link" onClick={goTo('forgot')}>
                  Forgot password?
                </button>
              </div>
              <div className="input-group">
                <label className="check-row">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    aria-invalid={errors.acceptedTerms ? 'true' : undefined}
                  />
                  <span>
                    I accept the Oklut <Link to="/privacy">Privacy &amp; Security</Link> policy.
                  </span>
                </label>
                {errors.acceptedTerms && <span className="error-message">{errors.acceptedTerms}</span>}
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'submitting'}>
            {status === 'submitting'
              ? 'Please wait…'
              : view === 'forgot'
                ? 'Send Reset Link'
                : view === 'recovery'
                  ? 'Create New Password'
                  : isLogin
                    ? 'Sign In'
                    : 'Sign Up'}
          </button>
        </form>

        <div className="modal-footer">
          {view === 'forgot' ? (
            <p>
              Remembered your password?{' '}
              <button type="button" className="link-btn" onClick={goTo('login')}>
                Sign in
              </button>
            </p>
          ) : view === 'recovery' ? (
            <p>
              Changed your mind?{' '}
              <button type="button" className="link-btn" onClick={goTo('login')}>
                Back to sign in
              </button>
            </p>
          ) : isLogin ? (
            <p>
              Don&apos;t have an account?{' '}
              <button type="button" className="link-btn" onClick={switchTo('signup')}>
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button type="button" className="link-btn" onClick={switchTo('login')}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
