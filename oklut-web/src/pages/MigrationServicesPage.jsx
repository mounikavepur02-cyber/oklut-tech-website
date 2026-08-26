import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import './MigrationServicesPage.css'

export default function MigrationServicesPage() {
  useDocumentMeta({ title: 'Migration Services — Oklut Technologies', description: 'Zero-downtime migrations for apps, data and infrastructure — cloud, database, mainframe and Kubernetes with automated validation and rollback safety.' })
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
  const handleBook = () => navigate('/book-consultation', { state: { service: 'Migration Services' } })
  return (
    <div className="ms-page">
      <section className="ms-hero">
        <img src={`${import.meta.env.BASE_URL}img/cloud-integration-sec.jpg`} alt="Migration Services" className="ms-hero-bg" />
        <div className="ms-hero-copy reveal"><div className="ms-eyebrow">Migration Services</div><h1>Migrate <em>Without</em> Downtime</h1><p>Apps, data and infra to modern platforms — cloud, containers, databases and mainframe with automated validation and rollback safety nets.</p>
          <div className="ms-hero-actions"><button type="button" className="ms-btn-primary" onClick={handleBook}>Plan Your Migration <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button><Link to="/services/digital-transformation" className="ms-btn-outline">Explore Transformation</Link></div></div>
      </section>
      <section className="ms-section"><div className="ms-wrap">
        <div className="ms-row reveal"><div className="ms-text-col"><div className="ms-eyebrow">Cloud Migration</div><h2>Lift, Re-platform, Refactor — Your Choice</h2><p>Migration Hub, Azure Migrate, Google Cloud Migrate with TCO modeling, wave planning and compliance preserved.</p><p>Whether lift-and-shift or refactor to cloud-native, we choose the right strategy per workload.</p></div><div className="ms-img-col"><div className="ms-img-frame"><img src={`${import.meta.env.BASE_URL}img/custom-dev-sec2.jpg`} alt="Cloud migration" /></div></div></div>
        <div className="ms-row reverse reveal"><div className="ms-text-col"><div className="ms-eyebrow">Data & Mainframe</div><h2>Database & Mainframe Modernization</h2><p>DMS, Striim, Qlik Replicate and automated SQL translation (Teradata→Snowflake) with 99.99% fidelity checks.</p><p>Automated reconciliation and cutover planning ensure data integrity and zero business disruption.</p></div><div className="ms-img-col"><div className="ms-img-frame"><img src={`${import.meta.env.BASE_URL}img/custom-dev-sec3.jpg`} alt="Database" /></div></div></div>
        <div className="ms-row reveal"><div className="ms-text-col"><div className="ms-eyebrow">Platform Migration</div><h2>Kubernetes & Data Center Exits</h2><p>MTC, Velero, Konveyor for 150+ microservices to EKS across regions with zero downtime; data center exits with colocation planning.</p><p>Container platform migrations with cost optimization via KubeCost and runbooks delivered.</p></div><div className="ms-img-col"><div className="ms-img-frame"><img src={`${import.meta.env.BASE_URL}img/devops-automation-sec.jpg`} alt="Kubernetes" /></div></div></div>
        <div className="ms-row reverse reveal"><div className="ms-text-col"><div className="ms-eyebrow">Validation & Cutover</div><h2>Automated Testing & Rollback Safety</h2><p>Automated testing, Terraform/Ansible/Packer, CloudEndure and detailed cutover runbooks with rollback plans per wave.</p><p>Post-migration optimization included — reference architectures and cost governance handed over.</p></div><div className="ms-img-col"><div className="ms-img-frame"><img src={`${import.meta.env.BASE_URL}img/proto-pilot-sec.jpg`} alt="Validation" /></div></div></div>
      </div></section>
      <section className="ms-capabilities-section"><div className="ms-wrap"><div className="ms-section-header reveal"><h2>Migration Assurances</h2><p>De-risked moves with guarantees.</p></div><div className="ms-grid">
        <div className="ms-card reveal"><div className="ms-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div><h3>Zero-Downtime Patterns</h3><p>Blue-green, canary and strangler-fig cutovers with automated health checks.</p></div>
        <div className="ms-card reveal"><div className="ms-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div><h3>Validation & Reconciliation</h3><p>Automated data validation, checksums and business-rule reconciliation per wave.</p></div>
        <div className="ms-card reveal"><div className="ms-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg></div><h3>Rollback Safety</h3><p>Rollback plans and rehearsals for every wave — risk contained, never open-ended.</p></div>
        <div className="ms-card reveal"><div className="ms-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div><h3>Optimization Included</h3><p>Post-migration rightsizing, cost governance and reference architectures delivered.</p></div>
      </div></div></section>
      <section className="ms-cta-section"><div className="ms-wrap"><div className="ms-cta-box reveal"><h2>Ready to Migrate with Confidence?</h2><p>We deliver zero-downtime migrations with validation and rollback — not hope.</p><button type="button" className="ms-btn-primary" onClick={handleBook}>Plan Your Migration Workshop <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button></div></div></section>
    </div>
  )
}
