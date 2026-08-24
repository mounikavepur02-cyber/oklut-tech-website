import { supabase } from './supabase'

const CONTACT = {
  phone: '+91-9014217124',
  email: 'info@oklut.com',
  address:
    'Second Floor, Samridhi Vasyam, D No 1/98/9/3/23, Capital Pk Rd, beside Narayana High School, Cyber Hills Colony, VIP Hills, Jaihind Enclave, Madhapur, Hyderabad, Telangana 500081',
  hours: 'Monday – Saturday, 9:30 – 18:30 IST',
}

export const WELCOME_MESSAGE = `Hello! 👋 Welcome to Oklut Technologies.
I'm the Oklut AI Assistant. I can help you explore our services, technologies, careers, and contact information.`

export const QUICK_ACTIONS = [
  { label: 'Our Services', value: 'What services do you offer?' },
  { label: 'Technologies', value: 'What technologies do you use?' },
  { label: 'Careers', value: 'What career opportunities are available at Oklut?' },
  { label: 'Contact Oklut', value: 'How can I contact Oklut?' },
]

const FALLBACK = `I don't have enough information to answer that yet. For accurate details, please contact the Oklut team at ${CONTACT.email} or ${CONTACT.phone}, and they will be happy to help.`

const KB = [
  {
    id: 'greeting',
    keywords: [
      'hello',
      'hi',
      'hey',
      'good morning',
      'good afternoon',
      'good evening',
      'namaste',
    ],
    reply: `Hello! 👋 Welcome to Oklut Technologies. I'm the Oklut AI Assistant. How can I help you today? You can ask about our services, technologies, careers, or contact details.`,
  },
  {
    id: 'who-are-you',
    keywords: ['who are you', 'what are you', 'your name', 'are you a robot', 'are you ai'],
    reply: `I'm the Oklut AI Assistant — a virtual assistant for Oklut Technologies. I can answer questions about our services, technologies, careers and contact information. If you need help beyond what I know, our team at ${CONTACT.email} will be glad to assist.`,
  },
  {
    id: 'about',
    keywords: [
      'about oklut',
      'about the company',
      'about oklut technologies',
      'tell me about oklut',
      'tell me about oklut technologies',
      'about yourselves',
      'about yourself',
      'what is oklut',
      'what is oklut technologies',
      'oklut technologies',
      'who is oklut',
      'company overview',
      'what does oklut do',
      'what do you do',
      'your company',
      'history',
      'since 2012',
      'founded',
    ],
    reply: `Oklut Technologies is a digital product and IT services company based in Madhapur, Hyderabad, India, operating since 2012. We design, build and scale custom software, web and mobile products, cloud infrastructure and AI — for companies that compete on execution. We're known for website design and development, web application development and mobile application development (iPhone, iPad, Android), built on trust, quality and long-term partnership.`,
  },
  {
    id: 'services',
    keywords: [
      'services',
      'what services',
      'your services',
      'what do you offer',
      'service offering',
      'solutions',
      'what can you help with',
      'capabilities',
      'list services',
      'all services',
      'show services',
    ],
    reply: `Oklut Technologies offers the following services:

1. Custom Development
2. Process Automation
3. Center of Excellence
4. Solution Engineering
5. Digital Transformation
6. End-to-End Solutions
7. Migration Services
8. Pilot & Prototyping
9. Shared Services
10. One-Stop Solutions

Type a service name to learn more about it.`,
  },
  {
    id: 'software-dev',
    keywords: [
      'software development',
      'web development',
      'web application',
      'web design',
      'application development',
      'mobile app',
      'mobile apps',
      'android',
      'ios',
      'iphone',
      'app development',
      'api',
      'custom development',
      'bespoke',
    ],
    reply: `Oklut's Custom Development service delivers bespoke web, mobile and API products built around your exact requirements. We design and build custom software solutions tailored to your business needs, from web applications to mobile apps and APIs.`,
  },
  {
    id: 'cloud',
    keywords: [
      'cloud',
      'aws',
      'azure',
      'google cloud',
      'gcp',
      'digital transformation',
      'cloud solutions',
      'migration',
      'cloud migration',
      'data center',
      'data centers',
    ],
    reply: `Oklut offers Digital Transformation and Migration Services to modernize your technology, processes and culture. We help move applications, data and infrastructure to the cloud securely and cost-effectively, including cloud migrations on AWS, Azure and Google Cloud.`,
  },
  {
    id: 'consulting',
    keywords: [
      'consulting',
      'it consulting',
      'offshore',
      'consultancy',
      'shared services',
      'one-stop',
      'end-to-end',
    ],
    reply: `Oklut provides comprehensive IT services including:

• Shared Services — Centralized platforms that scale across teams.
• One-Stop Solutions — Comprehensive technology solutions under one roof.
• End-to-End Solutions — Full-lifecycle delivery from strategy through 24/7 operations.

Which service interests you?`,
  },
  {
    id: 'marketing',
    keywords: [
      'marketing',
      'digital marketing',
      'seo',
      'social media',
      'google ads',
      'ppc',
      'email marketing',
      'branding',
      'online reputation',
      'marketing automation',
      'advertising',
    ],
    reply: `Oklut Technologies focuses on technology services including custom development, cloud solutions and digital transformation. For marketing-related inquiries, please contact our team at ${CONTACT.email} and we'll be happy to discuss how we can help with your digital presence.`,
  },
  {
    id: 'process-automation',
    keywords: [
      'process automation',
      'automation',
      'workflow',
      'workflows',
      'automate',
      'manual process',
      'streamline',
    ],
    reply: `Oklut's Process Automation service helps streamline workflows and remove manual effort with intelligent automation. We design and implement automated solutions that improve efficiency and reduce operational costs.`,
  },
  {
    id: 'center-of-excellence',
    keywords: [
      'center of excellence',
      'coe',
      'engineering hub',
      'shared standards',
    ],
    reply: `Oklut's Center of Excellence service embeds a high-performing engineering hub with shared standards and reuse. We help organizations establish centers of excellence to drive innovation and maintain quality across projects.`,
  },
  {
    id: 'solution-engineering',
    keywords: [
      'solution engineering',
      'architecture',
      'scalable systems',
      'system design',
    ],
    reply: `Oklut's Solution Engineering service architects resilient, scalable systems from discovery to production. We design solutions that meet your business needs while ensuring reliability and performance.`,
  },
  {
    id: 'pilot-prototyping',
    keywords: [
      'pilot',
      'prototyping',
      'prototype',
      'proof of concept',
      'validate ideas',
      'mvp',
    ],
    reply: `Oklut's Pilot & Prototyping service helps validate ideas fast with low-risk pilots and production-grade prototypes. We build MVPs and proof-of-concepts to test concepts before full-scale development.`,
  },
  {
    id: 'one-stop-solutions',
    keywords: [
      'one-stop',
      'one stop',
      'comprehensive solutions',
      'all in one',
    ],
    reply: `Oklut's One-Stop Solutions provide comprehensive technology solutions under one roof. From strategy to execution, we handle all aspects of your technology needs.`,
  },
  {
    id: 'end-to-end-solutions',
    keywords: [
      'end-to-end',
      'end to end',
      'full lifecycle',
      'full delivery',
      'strategy to operations',
    ],
    reply: `Oklut's End-to-End Solutions provide full-lifecycle delivery from strategy and design through 24/7 operations. We manage the complete project lifecycle so you can focus on your business.`,
  },
  {
    id: 'migration-services',
    keywords: [
      'migration',
      'migrate',
      'cloud migration',
      'move to cloud',
      'data migration',
    ],
    reply: `Oklut's Migration Services help move applications, data and infrastructure to the cloud securely and cost-effectively. We ensure smooth transitions with minimal downtime.`,
  },
  {
    id: 'shared-services',
    keywords: [
      'shared services',
      'centralized',
      'platform',
      'scale across teams',
    ],
    reply: `Oklut's Shared Services provide centralized platforms that scale across teams. We help organizations establish shared service centers for efficiency and consistency.`,
  },
  {
    id: 'ai',
    keywords: [
      'ai',
      'artificial intelligence',
      'machine learning',
      'ml',
      'ai solutions',
      'ai/ml',
      'ai & robotics',
      'cognitive analytics',
      'generative ai',
      'llm',
      'chatbot',
      'genai',
      'neural',
      'data analytics',
      'predictive',
      'robotics',
    ],
    reply: `AI is a core part of how Oklut builds products. Our technology expertise includes:

• AI & Robotics — Intelligent automation and robotic process automation solutions.
• Cognitive Analytics & AI — Advanced analytics, machine learning and AI-driven insights.

We embed machine learning and data capabilities into custom software and cloud solutions. For specifics on AI solutions for your use case, our engineering team at ${CONTACT.email} will share details tailored to your project.`,
  },
  {
    id: 'projects',
    keywords: [
      'projects',
      'portfolio',
      'work',
      'what have you built',
      'insights',
      'perspectives',
      'gallery',
      'clients',
      'erp',
      'samples',
      'showcase',
      'examples',
      'case study',
    ],
    reply: `Oklut has delivered 320+ projects for 1000+ happy clients and is recognized among leading IT firms in Hyderabad. You can browse projects and insights in the "Projects & Insights" section of our homepage.`,
  },
  {
    id: 'careers',
    keywords: [
      'careers',
      'career',
      'job',
      'jobs',
      'hiring',
      'openings',
      'positions',
      'role',
      'roles',
      'apply',
      'work at oklut',
      'join',
      'internship',
      'vacancy',
      'vacancies',
      'recruit',
    ],
    async: true,
    reply: `Oklut is hiring. We're growing our engineering, cloud and AI teams with remote-friendly, senior roles. Benefits include health coverage, flexible working hours and high-growth projects. Here are the current open roles — please check the Careers page for full details and to apply.`,
  },
  {
    id: 'contact',
    keywords: [
      'contact',
      'phone',
      'number',
      'call',
      'email',
      'mail',
      'address',
      'location',
      'office',
      'where are you',
      'reach you',
      'get in touch',
      'talk to someone',
      'speak to',
      'hyderabad',
      'madhapur',
      'address line',
    ],
    reply: `You can reach Oklut Technologies directly:

📞 Phone: ${CONTACT.phone}
✉️ Email: ${CONTACT.email}
📍 Office: ${CONTACT.address}

You can also use the "Send us a message" form on our homepage, or book a free consultation.`,
  },
  {
    id: 'hours',
    keywords: ['hours', 'open hours', 'working hours', 'timing', 'when are you open', 'what time'],
    reply: `Our office hours are ${CONTACT.hours}. You can also write to ${CONTACT.email} any time and we'll get back to you within one business day.`,
  },
  {
    id: 'book',
    keywords: [
      'book',
      'consultation',
      'meeting',
      'schedule',
      'demo',
      'call with',
      'talk to an expert',
      'talk to expert',
      'senior engineer',
      'free consultation',
    ],
    reply: `You can book a free consultation with our team through the "Book a free consultation" page on our website. Just share a little about your project and we'll come prepared — typically responding within one business day.`,
  },
  {
    id: 'pricing',
    keywords: ['price', 'pricing', 'cost', 'costs', 'rates', 'rate', 'charge', 'how much', 'budget', 'quote', 'estimate'],
    reply: `Project costs at Oklut depend on scope, technology and timelines, so we don't publish fixed rates. We provide honest estimates and transparent billing on every engagement. Share your requirements and we'll send an accurate estimate — you can start with a free consultation from our website.`,
  },
  {
    id: 'help',
    keywords: ['help', 'what can you do', 'how can you help', 'what can i ask', 'menu', 'options', 'topics'],
    reply: `I can help with questions about Oklut Technologies, our services, technologies, careers and current openings, and contact information. Just ask away!`,
  },
  {
    id: 'navigation',
    keywords: ['navigate', 'how do i find', 'where is the', 'where can i', 'go to', 'find careers page', 'find contact'],
    reply: `You can find everything on our website: About and Services on the homepage, Careers at /careers, and Contact via the contact form at the bottom of the homepage. There's also a "Book a free consultation" page for new projects.`,
  },
  {
    id: 'tech-stack',
    keywords: ['tech stack', 'technology', 'technologies used', 'languages', 'frameworks', 'stack', 'react', 'node', 'python', 'javascript', 'java', '.net'],
    reply: `Oklut's technology expertise spans:

• AI & Robotics
• Business Automation
• Cloud Migrations
• Data Centers
• Cognitive Analytics & AI
• Information & Reporting Systems

Because every project is different, our teams choose the stack that best fits your product. For details relevant to your project, the team at ${CONTACT.email} can share specifics.`,
  },
  {
    id: 'technologies',
    keywords: [
      'technologies',
      'what technologies',
      'your technologies',
      'tech',
      'tools',
      'platforms',
      'list technologies',
      'all technologies',
      'show technologies',
    ],
    reply: `Oklut's core technologies:

1. AI & Robotics
2. Business Automation
3. Cloud Migrations
4. Data Centers
5. Cognitive Analytics & AI
6. Information & Reporting Systems

Type a technology name to learn more about it.`,
  },
  {
    id: 'business-automation',
    keywords: [
      'business automation',
      'automate business',
      'business process',
      'workflow automation',
    ],
    reply: `Oklut's Business Automation technology helps streamline workflows and remove manual effort with intelligent automation. We design and implement automated solutions that improve efficiency and reduce operational costs.`,
  },
  {
    id: 'data-centers',
    keywords: [
      'data center',
      'data centers',
      'server room',
      'infrastructure',
      'hosting',
    ],
    reply: `Oklut's Data Centers technology provides modern data center operations and management. We help organizations manage their infrastructure efficiently with monitoring, maintenance and optimization.`,
  },
  {
    id: 'information-reporting',
    keywords: [
      'information systems',
      'reporting systems',
      'data reporting',
      'business intelligence',
      'analytics dashboard',
    ],
    reply: `Oklut's Information & Reporting Systems technology provides data-driven decision making tools. We build systems that help organizations collect, analyze and report on their data effectively.`,
  },
  {
    id: 'security',
    keywords: ['security', 'privacy', 'data protection', 'gdpr', 'confidential'],
    reply: `Oklut takes data privacy and security seriously. You can review our Privacy Policy on the /privacy page of our website, and manage your cookie preferences from the "Cookie Preferences" link in the footer. For compliance questions, contact ${CONTACT.email}.`,
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'appreciate', 'great', 'awesome', 'perfect', 'nice'],
    reply: `You're welcome! 😊 If you have any other questions about Oklut Technologies, just ask. You can also reach our team at ${CONTACT.email} or ${CONTACT.phone}.`,
  },
]

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s+./@-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function scoreIntent(intent, text, words) {
  let score = 0
  for (const kw of intent.keywords) {
    const key = normalize(kw)
    if (!key) continue
    if (key.length <= 2) {
      if (words.includes(key)) score += 4
    } else if (words.includes(key)) {
      score += key.length * 2
    } else if (new RegExp(`\\b${escapeRegExp(key)}\\b`).test(text)) {
      score += key.length * 3
    }
  }
  return score
}

export async function getOpenRolesSummary() {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .select('title, location, employment_type, is_open, posted_at')
      .order('posted_at', { ascending: false })
    if (error) throw error
    const open = (data || []).filter((j) => j.is_open)
    if (open.length === 0) {
      return "There are no open roles listed right now. New opportunities are published on our Careers page — check /careers and apply when a role fits."
    }
    const lines = open.slice(0, 6).map((j) => `• ${j.title}${j.location ? ` — ${j.location}` : ''}${j.employment_type ? ` (${j.employment_type})` : ''}`)
    return `We currently have ${open.length} open role${open.length === 1 ? '' : 's'}:\n${lines.join('\n')}\n\nVisit the Careers page (/careers) for full details and to apply.`
  } catch {
    return "I couldn't load the live list of openings right now. Please visit our Careers page (/careers) to see current roles, or email " + CONTACT.email + " with the role you're interested in."
  }
}

export async function getChatResponse(text) {
  const normalized = normalize(text)
  const words = normalized.split(' ').filter(Boolean)
  let best = null
  let bestScore = 0

  for (const intent of KB) {
    const score = scoreIntent(intent, normalized, words)
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }

  if (!best) return FALLBACK

  if (best.async) {
    const roles = await getOpenRolesSummary()
    return `${best.reply}\n\n${roles}`
  }

  return best.reply
}
