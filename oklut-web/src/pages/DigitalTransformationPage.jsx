import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import './DigitalTransformationPage.css'

export default function DigitalTransformationPage() {
  useDocumentMeta({
    title: 'Digital Transformation — Oklut Technologies',
    description: 'Modernize your technology, processes, and culture to compete in a digital-first world. Strategy, cloud, data and CX transformation with measurable business outcomes.',
  })
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo(0, 0)
    const reveals = () => Array.from(document.querySelectorAll('.reveal'))
    const revealEl = (el) => el.classList.add('revealed')
    const isInView = (el) => { const r = el.getBoundingClientRect(); const vh = window.innerHeight || document.documentElement.clientHeight; return r.top < vh && r.bottom > 0 }
    const revealInView = () => reveals().forEach((el) => { if (!el.classList.contains('revealed') && isInView(el)) revealEl(el) })
    if (!('IntersectionObserver' in window)) { reveals().forEach(revealEl); return }
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { revealEl(entry.target); io.unobserve(entry.target) } }), { threshold: 0.12 })
    reveals().forEach((el) => io.observe(el))
    let raf = 0
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; revealInView() }) }
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); revealInView(); setTimeout(revealInView, 50)
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])
  const handleBook = () => navigate('/book-consultation', { state: { service: 'Digital Transformation' } })
  return (
    <div className="dt-page">
      <section className="dt-hero">
        <img src={`${import.meta.env.BASE_URL}img/cloud-integration-sec.jpg`} alt="Digital Transformation hero" className="dt-hero-bg" />
        <div className="dt-hero-copy reveal">
          <div className="dt-eyebrow">Digital Transformation</div>
          <h1>Transform <em>Beyond</em> Technology</h1>
          <p>Modernize strategy, legacy systems, cloud, data and customer experience — a phased transformation that delivers measurable business outcomes.</p>
          <div className="dt-hero-actions">
            <button type="button" className="dt-btn-primary" onClick={handleBook}>Book Transformation Workshop <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>
            <Link to="/services/end-to-end-solutions" className="dt-btn-outline">Explore End-to-End Solutions</Link>
          </div>
        </div>
      </section>
      <section className="dt-section">
        <div className="dt-wrap">
          <div className="dt-row reveal">
            <div className="dt-text-col"><div className="dt-eyebrow">Strategy & Roadmap</div><h2>From Vision to Executable Roadmap</h2><p>We partner with CXOs to define digital strategy, business cases and phased roadmaps with quick wins and de-risked execution — not just slides.</p><p>Prioritized initiatives, TCO models and KPIs ensure every investment ties to revenue, cost or experience outcomes.</p></div>
            <div className="dt-img-col"><div className="dt-img-frame"><img src={`${import.meta.env.BASE_URL}img/custom-dev-sec1.jpg`} alt="Strategy roadmap" /></div></div>
          </div>
          <div className="dt-row reverse reveal">
            <div className="dt-text-col"><div className="dt-eyebrow">Legacy Modernization</div><h2>Modernize Without Breaking the Business</h2><p>Re-platform monoliths to microservices, APIs and cloud-native patterns with strangler-fig, zero-downtime cutovers and automated validation.</p><p>We modernize apps, data and integration layers while preserving compliance and security posture.</p></div>
            <div className="dt-img-col"><div className="dt-img-frame"><img src={`${import.meta.env.BASE_URL}img/devops-automation-sec.jpg`} alt="Legacy modernization" /></div></div>
          </div>
          <div className="dt-row reveal">
            <div className="dt-text-col"><div className="dt-eyebrow">Cloud, Data & CX</div><h2>Cloud Adoption & Data-Driven Experiences</h2><p>Adopt AWS/Azure/GCP, build Snowflake/Databricks modern data stacks, and redesign CX with journey mapping and personalization.</p><p>From data pipelines to Amplify/Segment analytics, transformation becomes measurable and sustainable.</p></div>
            <div className="dt-img-col"><div className="dt-img-frame"><img src={`${import.meta.env.BASE_URL}img/custom-dev-sec2.jpg`} alt="Cloud data CX" /></div></div>
          </div>
          <div className="dt-row reverse reveal">
            <div className="dt-text-col"><div className="dt-eyebrow">Change & Innovation</div><h2>Change Management & Innovation Labs</h2><p>Technology fails without adoption. We run change programs, enablement and innovation labs/pilots that prove value fast and scale what works.</p><p>DevOps platform engineering, GitOps and feature flags make transformation continuous, not a one-off project.</p></div>
            <div className="dt-img-col"><div className="dt-img-frame"><img src={`${import.meta.env.BASE_URL}img/proto-concept-sec.jpg`} alt="Change management" /></div></div>
          </div>
        </div>
      </section>
      <section className="dt-capabilities-section">
        <div className="dt-wrap">
          <div className="dt-section-header reveal"><h2>Transformation Pillars</h2><p>Outcome-focused levers that make transformation stick.</p></div>
          <div className="dt-grid">
            <div className="dt-card reveal"><div className="dt-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div><h3>Roadmap & Governance</h3><p>Phased plan with KPIs, architecture governance and risk mitigation at every milestone.</p></div>
            <div className="dt-card reveal"><div className="dt-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div><h3>Cloud & Data Platform</h3><p>AWS/Azure/GCP, Kubernetes, Snowflake/Databricks and analytics enablement from day one.</p></div>
            <div className="dt-card reveal"><div className="dt-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg></div><h3>CX Redesign</h3><p>Journey-led design, personalization and omnichannel experiences that lift conversion.</p></div>
            <div className="dt-card reveal"><div className="dt-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div><h3>Change & Scale</h3><p>Org change, pilot labs and platform engineering for sustainable operating models.</p></div>
          </div>
        </div>
      </section>
      <section className="dt-cta-section"><div className="dt-wrap"><div className="dt-cta-box reveal"><h2>Ready to Transform?</h2><p>Partner with Oklut for CEO-level transformation — phased, de-risked and tied to business value.</p><button type="button" className="dt-btn-primary" onClick={handleBook}>Book a Digital Transformation Call <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button></div></div></section>
    </div>
  )
}
