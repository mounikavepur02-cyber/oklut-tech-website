import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import './EndToEndSolutionsPage.css'

export default function EndToEndSolutionsPage() {
  useDocumentMeta({ title: 'End-to-End Solutions — Oklut Technologies', description: 'One partner for the full lifecycle — strategy, design, development, deployment and 24/7 managed operations.' })
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo(0, 0)
    const reveals = () => Array.from(document.querySelectorAll('.reveal')); const revealEl = (el) => el.classList.add('revealed')
    const isInView = (el) => { const r = el.getBoundingClientRect(); const vh = window.innerHeight || document.documentElement.clientHeight; return r.top < vh && r.bottom > 0 }
    const revealInView = () => reveals().forEach((el) => { if (!el.classList.contains('revealed') && isInView(el)) revealEl(el) })
    if (!('IntersectionObserver' in window)) { reveals().forEach(revealEl); return }
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { revealEl(entry.target); io.unobserve(entry.target) } }), { threshold: 0.12 })
    reveals().forEach((el) => io.observe(el))
    let raf=0; const onScroll=()=>{ if(raf) return; raf=requestAnimationFrame(()=>{raf=0; revealInView()})}
    window.addEventListener('scroll', onScroll,{passive:true}); window.addEventListener('resize', onScroll); revealInView(); setTimeout(revealInView,50)
    return ()=>{ io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if(raf) cancelAnimationFrame(raf)}
  }, [])
  const handleBook = () => navigate('/book-consultation', { state: { service: 'End-to-End Solutions' } })
  return (
    <div className="e2e-page">
      <section className="e2e-hero">
        <img src={`${import.meta.env.BASE_URL}img/solution-arch-design.jpg`} alt="End to End Solutions" className="e2e-hero-bg" />
        <div className="e2e-hero-copy reveal"><div className="e2e-eyebrow">End-to-End Solutions</div><h1>One Partner <em>Full Lifecycle</em></h1><p>Strategy → Design → Build → Launch → Operate. No handoff gaps, single accountability from discovery to 24/7 operations.</p>
          <div className="e2e-hero-actions"><button type="button" className="e2e-btn-primary" onClick={handleBook}>Start Your Lifecycle Journey <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button><Link to="/services/digital-transformation" className="e2e-btn-outline">Explore Transformation</Link></div></div>
      </section>
      <section className="e2e-section"><div className="e2e-wrap">
        <div className="e2e-row reveal"><div className="e2e-text-col"><div className="e2e-eyebrow">Discovery & Design</div><h2>Product Discovery & Rapid Prototyping</h2><p>Workshops, UX/UI in Figma, clickable prototypes and validation with real users — de-risk before you build.</p><p>Storybook/Chromatic ensures design-to-code fidelity and shared understanding across teams.</p></div><div className="e2e-img-col"><div className="e2e-img-frame"><img src={`${import.meta.env.BASE_URL}img/proto-concept-sec.jpg`} alt="Discovery" /></div></div></div>
        <div className="e2e-row reverse reveal"><div className="e2e-text-col"><div className="e2e-eyebrow">Build & Quality</div><h2>Full-Stack Development & QA</h2><p>React/Node, APIs, QA automation and security hardening — built with Vercel/AWS Amplify and hardened for compliance.</p><p>CI with GitHub Actions, Terraform, and feature flags for progressive delivery.</p></div><div className="e2e-img-col"><div className="e2e-img-frame"><img src={`${import.meta.env.BASE_URL}img/custom-dev-sec1.jpg`} alt="Build" /></div></div></div>
        <div className="e2e-row reveal"><div className="e2e-text-col"><div className="e2e-eyebrow">Launch & Operate</div><h2>Launch & 24/7 Managed Operations</h2><p>Go-to-market, launch runbooks, observability with Datadog/New Relic/Sentry and on-call via PagerDuty/Opsgenie.</p><p>We retain institutional knowledge and evolve the product continuously — your strategic partner, not vendor.</p></div><div className="e2e-img-col"><div className="e2e-img-frame"><img src={`${import.meta.env.BASE_URL}img/custom-dev-sec3.jpg`} alt="Operate" /></div></div></div>
        <div className="e2e-row reverse reveal"><div className="e2e-text-col"><div className="e2e-eyebrow">Why Oklut</div><h2>Shared Risk, Aligned Incentives</h2><p>Predictable pricing, faster time-to-market, and scalable team models as you grow — we own outcomes, not just deliverables.</p><p>Continuous enhancement with PostHog/Amplitude ensures the product evolves with user needs.</p></div><div className="e2e-img-col"><div className="e2e-img-frame"><img src={`${import.meta.env.BASE_URL}img/proto-pilot-sec.jpg`} alt="Why" /></div></div></div>
      </div></section>
      <section className="e2e-capabilities-section"><div className="e2e-wrap"><div className="e2e-section-header reveal"><h2>Lifecycle Capabilities</h2><p>Every phase covered, no gaps.</p></div><div className="e2e-grid">
        <div className="e2e-card reveal"><div className="e2e-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div><h3>Discovery to Design</h3><p>Workshops, prototyping and validation to align vision and de-risk investment.</p></div>
        <div className="e2e-card reveal"><div className="e2e-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div><h3>Build & Hardening</h3><p>Secure, compliant builds with automated QA and DevOps from day one.</p></div>
        <div className="e2e-card reveal"><div className="e2e-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg></div><h3>Launch & Scale</h3><p>GTM support, infra as code and progressive rollout with feature flags.</p></div>
        <div className="e2e-card reveal"><div className="e2e-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div><h3>Operate & Evolve</h3><p>24/7 ops, observability and continuous enhancement as strategic partner.</p></div>
      </div></div></section>
      <section className="e2e-cta-section"><div className="e2e-wrap"><div className="e2e-cta-box reveal"><h2>Need a Partner, Not a Vendor?</h2><p>We own the full lifecycle so you can focus on business outcomes.</p><button type="button" className="e2e-btn-primary" onClick={handleBook}>Partner for the Full Lifecycle <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button></div></div></section>
    </div>
  )
}
