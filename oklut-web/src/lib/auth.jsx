import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRecovery, setIsRecovery] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true)
      }
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setIsRecovery(false)
      }
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    if (error) throw error
  }

  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  const value = {
    session,
    user,
    loading,
    isRecovery,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function getAuthErrorMessage(error) {
  if (!error?.message) return 'Something went wrong. Please try again.'
  const msg = error.message.toLowerCase()
  if (msg.includes('invalid login credentials')) return 'Invalid email or password. Please try again.'
  if (msg.includes('email not confirmed') || msg.includes('email not verified'))
    return 'Please confirm your email address before signing in. Check your inbox for the confirmation link.'
  if (msg.includes('already registered')) return 'An account with this email already exists. Try signing in instead.'
  if (msg.includes('password should be at least')) return 'Password must be at least 6 characters.'
  if (msg.includes('rate limit') || msg.includes('too many requests'))
    return 'Too many attempts. Please wait a moment and try again.'
  if (msg.includes('network') || msg.includes('fetch')) return 'Could not reach our servers. Check your connection and try again.'
  return error.message
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
