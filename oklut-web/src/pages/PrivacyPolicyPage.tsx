import { useCookieConsent } from '../components/cookie/CookieConsentProvider'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: [
      'We collect information you provide directly (such as your name and email address when you submit the contact form or create an account) and information collected automatically through cookies and similar technologies, such as pages visited, device type and approximate location.',
    ],
  },
  {
    title: '2. How We Use Cookies',
    body: [
      'Essential cookies are always enabled because the website cannot function correctly without them. They store session and authentication state and remember your cookie preferences.',
      'Analytics cookies help us understand how visitors use the site so we can improve it. Marketing cookies are used to show you relevant offers and campaigns. These categories are only enabled with your consent and can be changed at any time from the cookie preference panel.',
    ],
  },
  {
    title: '3. Legal Basis (GDPR)',
    body: [
      'We process personal data on the following legal bases: your consent (for non-essential cookies and marketing), performance of a contract (for services you request), legal obligation, and legitimate interests where your rights do not override them. You may withdraw consent at any time without affecting the lawfulness of processing carried out before withdrawal.',
    ],
  },
  {
    title: '4. Your Rights',
    body: [
      'Depending on your location, you may have the right to access, rectify, erase, or restrict the processing of your personal data, to object to processing, and to data portability. You may also lodge a complaint with your local supervisory authority.',
    ],
  },
  {
    title: '5. Data Retention & Security',
    body: [
      'We retain personal data only as long as necessary for the purposes described in this policy. We apply appropriate technical and organisational measures to protect your information against unauthorised access, alteration, disclosure or destruction.',
    ],
  },
  {
    title: '6. Third-Party Services',
    body: [
      'Some cookies may be set by third-party providers (such as analytics or advertising platforms) that help us operate the website. These providers process data under their own privacy policies and only when you have consented to the relevant category.',
    ],
  },
]

export function PrivacyPolicyPage() {
  const { openPreferences } = useCookieConsent()

  return (
    <>
      <section className="hero-section careers-hero">
        <div className="container">
          <div className="careers-hero-content">
            <span className="badge">Legal</span>
            <h1>Privacy Policy</h1>
            <p>
              How Oklut Technologies collects, uses, and protects your personal
              information and cookies.
            </p>
            <p className="privacy-updated">Last updated: August 2026</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="privacy-layout">
            <div className="privacy-note card">
              <h3>Managing your preferences</h3>
              <p>
                You can review or change which cookies you allow at any time from
                the cookie preference panel.
              </p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={openPreferences}
              >
                Manage Cookie Preferences
              </button>
            </div>

            {SECTIONS.map((section) => (
              <article key={section.title} className="privacy-section">
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}

            <article className="privacy-section">
              <h2>7. Contact Us</h2>
              <p>
                For questions about this policy or your personal data, contact us at{' '}
                <a href="mailto:info@oklut.com">info@oklut.com</a> or call{' '}
                <a href="tel:+919014217124">+91-9014217124</a>.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}

export default PrivacyPolicyPage
