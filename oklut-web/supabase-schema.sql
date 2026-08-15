-- Oklut Technologies Website Database Schema
-- Run this in Supabase Dashboard → SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- SERVICES TABLE
-- ============================================
create table public.services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon text, -- lucide icon name or SVG
  features text[],
  order_index integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_services_order on public.services(order_index);
create index idx_services_active on public.services(is_active);

-- ============================================
-- PROJECTS / PORTFOLIO TABLE
-- ============================================
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  short_description text,
  description text,
  client_name text,
  project_url text,
  github_url text,
  image_url text,
  technologies text[],
  category text,
  featured boolean default false,
  order_index integer default 0,
  is_published boolean default true,
  completed_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_projects_slug on public.projects(slug);
create index idx_projects_featured on public.projects(featured);
create index idx_projects_published on public.projects(is_published);
create index idx_projects_order on public.projects(order_index);

-- ============================================
-- TEAM MEMBERS TABLE
-- ============================================
create table public.team_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  bio text,
  avatar_url text,
  email text,
  linkedin_url text,
  twitter_url text,
  github_url text,
  order_index integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_team_order on public.team_members(order_index);
create index idx_team_active on public.team_members(is_active);

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  client_role text,
  client_company text,
  client_avatar_url text,
  content text not null,
  rating integer default 5 check (rating >= 1 and rating <= 5),
  project_id uuid references public.projects(id) on delete set null,
  is_featured boolean default false,
  is_published boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_testimonials_featured on public.testimonials(is_featured);
create index idx_testimonials_published on public.testimonials(is_published);

-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================
create table public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  company text,
  subject text,
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  replied_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_messages_status on public.contact_messages(status);
create index idx_messages_created on public.contact_messages(created_at desc);

-- ============================================
-- CONSULTATIONS TABLE
-- ============================================
create table public.consultations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text not null,
  company text,
  service text,
  preferred_date date,
  preferred_time text,
  budget text,
  requirements text,
  status text default 'new' check (status in ('new', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_consultations_status on public.consultations(status);
create index idx_consultations_created on public.consultations(created_at desc);

-- ============================================
-- SITE SETTINGS TABLE
-- ============================================
create table public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value jsonb not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_settings_key on public.site_settings(key);

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
create table public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  author_id uuid references public.team_members(id) on delete set null,
  tags text[],
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_blog_slug on public.blog_posts(slug);
create index idx_blog_published on public.blog_posts(is_published, published_at desc);

-- ============================================
-- JOB POSTINGS TABLE
-- ============================================
create table public.job_postings (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  department text,
  location text,
  employment_type text, -- Full-time | Part-time | Contract
  remote boolean default false,
  salary_min integer,
  salary_max integer,
  experience_level text, -- Entry | Mid | Senior
  summary text,
  responsibilities text[],
  requirements text[],
  nice_to_have text[],
  is_open boolean default true,
  posted_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_jobs_open on public.job_postings(is_open);
create index idx_jobs_posted on public.job_postings(posted_at desc);
create index idx_jobs_dept on public.job_postings(department);

-- ============================================
-- JOB APPLICATIONS TABLE
-- ============================================
create table public.job_applications (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references public.job_postings(id) on delete cascade,
  applicant_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  linkedin_url text,
  portfolio_url text,
  resume_url text,
  cover_letter text,
  status text default 'new' check (status in ('new', 'reviewed', 'interview', 'offered', 'rejected', 'withdrawn')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_applications_job on public.job_applications(job_id);
create index idx_applications_status on public.job_applications(status);
create index idx_applications_created on public.job_applications(created_at desc);

-- ============================================
-- RESUME STORAGE (Supabase Storage bucket)
-- Run after tables are created.
-- ============================================
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

-- Public read so reviewers can open resumes
create policy "Public read resumes" on storage.objects
  for select using (bucket_id = 'resumes');

-- Only signed-in applicants can upload resumes
create policy "Authenticated upload resumes" on storage.objects
  for insert with check (bucket_id = 'resumes' and auth.role() = 'authenticated');

-- Applicants can update/delete only their own uploads
create policy "Owner update resumes" on storage.objects
  for update using (bucket_id = 'resumes' and owner = auth.uid())
  with check (bucket_id = 'resumes' and owner = auth.uid());

create policy "Owner delete resumes" on storage.objects
  for delete using (bucket_id = 'resumes' and owner = auth.uid());

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.team_members enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_messages enable row level security;
alter table public.consultations enable row level security;
alter table public.site_settings enable row level security;
alter table public.blog_posts enable row level security;
alter table public.job_postings enable row level security;
alter table public.job_applications enable row level security;

-- Public read access for published content
create policy "Public read services" on public.services
  for select using (is_active = true);

create policy "Public read projects" on public.projects
  for select using (is_published = true);

create policy "Public read team" on public.team_members
  for select using (is_active = true);

create policy "Public read testimonials" on public.testimonials
  for select using (is_published = true);

create policy "Public read blog" on public.blog_posts
  for select using (is_published = true);

create policy "Public read site settings" on public.site_settings
  for select using (true);

-- Contact messages: allow inserts from anyone (contact form)
create policy "Anyone can insert messages" on public.contact_messages
  for insert with check (true);

-- Consultations: allow anyone to book a consultation
create policy "Anyone can insert consultations" on public.consultations
  for insert with check (true);

-- Job postings: public read for open roles
create policy "Public read open jobs" on public.job_postings
  for select using (is_open = true);

-- Job applications: anyone can submit, but only see their own
create policy "Anyone can insert applications" on public.job_applications
  for insert with check (true);

create policy "Public read own applications" on public.job_applications
  for select using (auth.uid() = applicant_id);

-- Admin policies (require service_role key)
create policy "Admin all services" on public.services
  for all using (auth.role() = 'service_role');

create policy "Admin all projects" on public.projects
  for all using (auth.role() = 'service_role');

create policy "Admin all team" on public.team_members
  for all using (auth.role() = 'service_role');

create policy "Admin all testimonials" on public.testimonials
  for all using (auth.role() = 'service_role');

create policy "Admin all messages" on public.contact_messages
  for all using (auth.role() = 'service_role');

create policy "Admin all consultations" on public.consultations
  for all using (auth.role() = 'service_role');

create policy "Admin all settings" on public.site_settings
  for all using (auth.role() = 'service_role');

create policy "Admin all blog" on public.blog_posts
  for all using (auth.role() = 'service_role');

create policy "Admin all jobs" on public.job_postings
  for all using (auth.role() = 'service_role');

create policy "Admin all applications" on public.job_applications
  for all using (auth.role() = 'service_role');

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger services_updated_at
  before update on public.services
  for each row execute function public.handle_updated_at();

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

create trigger team_updated_at
  before update on public.team_members
  for each row execute function public.handle_updated_at();

create trigger testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.handle_updated_at();

create trigger messages_updated_at
  before update on public.contact_messages
  for each row execute function public.handle_updated_at();

create trigger consultations_updated_at
  before update on public.consultations
  for each row execute function public.handle_updated_at();

create trigger settings_updated_at
  before update on public.site_settings
  for each row execute function public.handle_updated_at();

create trigger blog_updated_at
  before update on public.blog_posts
  for each row execute function public.handle_updated_at();

create trigger jobs_updated_at
  before update on public.job_postings
  for each row execute function public.handle_updated_at();

create trigger applications_updated_at
  before update on public.job_applications
  for each row execute function public.handle_updated_at();

-- ============================================
-- SAMPLE DATA (Optional - run after tables created)
-- ============================================

-- Services
insert into public.services (title, description, icon, features, order_index) values
('Custom Software Development', 'End-to-end development of scalable web and mobile applications tailored to your business needs.', 'Code', ARRAY['React/Next.js', 'Node.js/Python', 'PostgreSQL', 'AWS/Cloud'], 1),
('Cloud Infrastructure & DevOps', 'Design, deploy, and manage secure cloud architectures with CI/CD pipelines.', 'Cloud', ARRAY['AWS/GCP/Azure', 'Kubernetes', 'Terraform', 'Monitoring'], 2),
('AI & Machine Learning', 'Integrate intelligent features - from LLMs to custom ML models - into your products.', 'Brain', ARRAY['LLM Fine-tuning', 'RAG Systems', 'Computer Vision', 'MLOps'], 3),
('Product Strategy & Design', 'Transform ideas into validated products through research, UX/UI, and rapid prototyping.', 'Figma', ARRAY['User Research', 'Design Systems', 'Prototyping', 'Usability Testing'], 4);

-- Sample Projects
insert into public.projects (title, slug, short_description, description, client_name, technologies, category, featured, order_index) values
('FinTech Dashboard', 'fintech-dashboard', 'Real-time financial analytics platform', 'Built a comprehensive dashboard for a Series B fintech startup handling 1M+ transactions daily.', 'FinanceFlow Inc', ARRAY['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'], 'Web App', true, 1),
('E-commerce Platform', 'ecommerce-platform', 'Headless commerce with multi-vendor support', 'Scalable e-commerce solution supporting 500+ vendors and 100k+ monthly orders.', 'ShopSphere', ARRAY['Next.js', 'GraphQL', 'Stripe', 'Kubernetes'], 'E-commerce', true, 2),
('Healthcare Patient Portal', 'healthcare-portal', 'HIPAA-compliant patient management system', 'Secure portal for 50+ clinics with appointment scheduling, telehealth, and records.', 'MedConnect', ARRAY['React Native', 'Firebase', 'FHIR', 'TypeScript'], 'Healthcare', false, 3);

-- Team Members
insert into public.team_members (name, role, bio, order_index) values
('Sarah Chen', 'CEO & Co-Founder', 'Former Google engineer with 15+ years building scalable systems. Passionate about developer experience.', 1),
('Marcus Johnson', 'CTO & Co-Founder', 'Architect of distributed systems at scale. Open source contributor. Rust enthusiast.', 2),
('Emily Rodriguez', 'VP of Engineering', 'Led engineering at 3 unicorn startups. Expert in team building and delivery excellence.', 3),
('David Park', 'Principal Engineer', 'Full-stack specialist. Author of "Modern React Patterns". Conference speaker.', 4);

-- Testimonials
insert into public.testimonials (client_name, client_role, client_company, content, rating, is_featured) values
('Alex Thompson', 'VP Engineering', 'TechCorp', 'Oklut delivered our core platform 3 months ahead of schedule. Their technical depth is unmatched.', 5, true),
('Maria Santos', 'Founder', 'StartupXYZ', 'Best agency partnership we have ever had. They think like product owners, not just contractors.', 5, true),
('James Wilson', 'CTO', 'EnterpriseCo', 'The team''s expertise in cloud architecture saved us 40% on infrastructure costs.', 5, false);

-- Site Settings
insert into public.site_settings (key, value, description) values
('site_title', '"Oklut Technologies"', 'Site title for SEO and header'),
('site_description', '"Building the future of technology. Custom software, cloud infrastructure, AI/ML, and product strategy."', 'Meta description for SEO'),
('contact_email', '"hello@oklut.tech"', 'Primary contact email'),
('social_links', '{"twitter": "https://twitter.com/okluttech", "linkedin": "https://linkedin.com/company/oklut", "github": "https://github.com/oklut"}', 'Social media links'),
('hero', '{"headline": "We Build Technology That Matters", "subheadline": "From concept to scale — custom software, cloud infrastructure, and AI solutions for ambitious teams.", "cta_text": "Start a Project", "cta_link": "#contact"}', 'Hero section content');

-- Job Postings
insert into public.job_postings (title, slug, department, location, employment_type, remote, experience_level, summary, responsibilities, requirements, nice_to_have, is_open, posted_at) values
('Senior Frontend Engineer', 'senior-frontend-engineer', 'Engineering', 'Hyderabad, India', 'Full-time', true, 'Senior', 'Own the client-side experience across our flagship products. You will work in React, ship design systems, and mentor other engineers.', ARRAY['Build and maintain React applications at scale', 'Lead frontend architecture decisions', 'Collaborate closely with design and product', 'Mentor mid-level engineers'], ARRAY['5+ years of frontend experience', 'Deep React and TypeScript expertise', 'Experience with state management and testing', 'Strong product and UX instincts'], ARRAY['Supabase or Postgres experience', 'Design system contributions', 'Open-source involvement'], true, now() - interval '2 days'),
('Backend Engineer (Node.js)', 'backend-engineer-nodejs', 'Engineering', 'Hyderabad, India', 'Full-time', true, 'Mid', 'Build resilient APIs and data pipelines that power fintech, healthtech, and e-commerce clients.', ARRAY['Design and ship Node.js/TypeScript services', 'Model Postgres schemas and migrations', 'Write comprehensive automated tests', 'Improve observability and reliability'], ARRAY['4+ years building backend services', 'Node.js and TypeScript proficiency', 'Solid SQL and Postgres skills', 'Familiarity with AWS or GCP'], ARRAY['Serverless experience', 'Event-driven architecture', 'Terraform experience'], true, now() - interval '5 days'),
('AI / ML Engineer', 'ai-ml-engineer', 'Engineering', 'Hyderabad, India', 'Full-time', false, 'Senior', 'Build LLM-powered features and ML systems — from RAG pipelines to fine-tuned models — for ambitious clients.', ARRAY['Design RAG and agent systems', 'Fine-tune open-source LLMs', 'Evaluate model quality rigorously', 'Productionize ML services'], ARRAY['Experience with LLM APIs and prompt engineering', 'Python and ML frameworks', 'Understanding of evaluation and guardrails', 'Comfort with cloud ML tooling'], ARRAY['Vector databases', 'MLOps experience', 'Published research'], true, now() - interval '9 days'),
('Product Designer', 'product-designer', 'Design', 'Hyderabad, India', 'Contract', true, 'Mid', 'Shape product strategy and craft polished UI/UX for early-stage and growth-stage startups.', ARRAY['Lead UX research and usability testing', 'Design product flows and prototypes', 'Build and maintain design systems', 'Partner with engineering to ship'], ARRAY['Portfolio of shipped products', 'Proficiency in Figma', 'Strong interaction and visual design skills', 'Client-facing communication skills'], ARRAY['Motion design', 'Design engineering', 'Workshop facilitation'], true, now() - interval '14 days');

-- ============================================
-- HELPFUL VIEWS
-- ============================================
create view public.featured_projects as
  select * from public.projects
  where is_published = true and featured = true
  order by order_index;

create view public.published_blog as
  select * from public.blog_posts
  where is_published = true
  order by published_at desc;

create view public.active_services as
  select * from public.services
  where is_active = true
  order by order_index;

create view public.open_jobs as
  select * from public.job_postings
  where is_open = true
  order by posted_at desc;