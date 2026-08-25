import { ServicePageTemplate } from './ServicePageTemplate'

export default function CustomDevelopmentPage() {
  return (
    <ServicePageTemplate
      title="Custom Software Development"
      description="We design and build tailored web applications, mobile apps, and enterprise software that solve your unique business challenges. From concept to deployment and beyond."
      features={[
        'Full-stack web application development',
        'Native iOS & Android mobile apps',
        'Cross-platform apps (React Native, Flutter)',
        'Enterprise B2B software & SaaS platforms',
        'API design & microservices architecture',
        'Database design, optimization & migration',
        'CI/CD pipelines & DevOps automation',
        'Legacy system modernization',
      ]}
      benefits={[
        'Senior engineers who own delivery end-to-end',
        'Agile process with 2-week sprints & demos',
        'Transparent pricing — fixed or time & materials',
        '98% client retention across 12+ years',
        'Post-launch support & maintenance included',
        'Security-first development practices',
        'Scalable architecture from day one',
        'Direct access to your engineering team',
      ]}
      technologies={[
        'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Django', 'FastAPI',
        'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure',
        'React Native', 'Flutter', 'Swift', 'Kotlin', 'GraphQL', 'REST', 'gRPC'
      ]}
      caseStudies={[
        {
          title: 'ERP Platform for Manufacturing',
          category: 'Enterprise Software',
          description: 'Built a modular ERP integrating finance, inventory, HR, and procurement for a mid-market manufacturer.',
          image: `${import.meta.env.BASE_URL}img/case-erp.jpg`,
          link: '#'
        },
        {
          title: 'SaaS Platform for Logistics',
          category: 'SaaS Product',
          description: 'Developed a multi-tenant logistics management platform with real-time tracking and analytics.',
          image: `${import.meta.env.BASE_URL}img/case-logistics.jpg`,
          link: '#'
        },
        {
          title: 'Mobile App for Healthcare',
          category: 'Mobile App',
          description: 'Created a HIPAA-compliant patient engagement app with telehealth and appointment management.',
          image: `${import.meta.env.BASE_URL}img/case-healthcare.jpg`,
          link: '#'
        }
      ]}
      ctaText="Start your custom project"
    />
  )
}