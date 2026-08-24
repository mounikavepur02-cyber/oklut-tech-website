import { ServicePageTemplate } from './ServicePageTemplate'

export default function ProcessAutomationPage() {
  return (
    <ServicePageTemplate
      title="Business Process Automation"
      description="Automate repetitive workflows, eliminate manual handoffs, and accelerate operations with intelligent automation — from RPA to AI-powered decisioning."
      features={[
        'Robotic Process Automation (RPA) implementation',
        'Workflow orchestration & BPMN modeling',
        'Intelligent document processing (IDP)',
        'AI/ML-powered decision automation',
        'System integration & API connectivity',
        'Process mining & optimization',
        'Human-in-the-loop workflows',
        'Automation Center of Excellence setup',
      ]}
      benefits={[
        'Reduce operational costs by 40-60%',
        'Eliminate human error in repetitive tasks',
        'Free your team for high-value work',
        'Faster turnaround — hours to minutes',
        'Audit trails & compliance built-in',
        'Scalable bots that grow with you',
        'Vendor-agnostic: UiPath, Power Automate, custom',
        'Change management & training included',
      ]}
      technologies={[
        'UiPath', 'Microsoft Power Automate', 'Automation Anywhere', 'Blue Prism',
        'Python', 'Node.js', 'Camunda', 'Zeebe', 'Apache Airflow',
        'AWS Step Functions', 'Azure Logic Apps', 'Google Workflows',
        'TensorFlow', 'PyTorch', 'Hugging Face', 'OCR engines'
      ]}
      caseStudies={[
        {
          title: 'Invoice Processing Automation',
          category: 'Finance Automation',
          description: 'Automated end-to-end AP processing for 50k+ invoices/month with 95% straight-through rate.',
          image: '/img/case-invoice.jpg',
          link: '#'
        },
        {
          title: 'Customer Onboarding Bot',
          category: 'KYC Automation',
          description: 'Reduced onboarding from 3 days to 15 minutes with automated document verification.',
          image: '/img/case-kyc.jpg',
          link: '#'
        },
        {
          title: 'HR Process Automation',
          category: 'HR Automation',
          description: 'Automated leave management, expense claims, and performance reviews for 2000+ employees.',
          image: '/img/case-hr.jpg',
          link: '#'
        }
      ]}
      ctaText="Automate your processes"
    />
  )
}