# Email Campaign UI Spec (Reference)

## Design
- Dark navy theme (#0f172a / #1e293b)
- Accent teal (#0d9488 / #14b8a6)
- Glass-effect KPI cards
- Same style as existing admin dashboard sidebar (dark navy #0B1929)
- Add new sidebar items: Campaigns, Templates, Automations, Analytics, AI Daily Email

## Pages to Build (in priority order)

### 1. Campaign Dashboard (/admin/campaigns)
- KPI cards: Total Subscribers, Emails Sent, Open Rate, Click Rate, Unsubscribe Rate
- Recent Campaigns table with status, recipients, open/click rates
- Quick Actions: Create Campaign, View All, Manage Lists, Analytics
- Upcoming scheduled campaigns sidebar

### 2. Campaign Builder (/admin/campaigns/new, /admin/campaigns/:id/edit)
- Step 1: Setup (name, subject, AI subject gen, from, recipients)
- Step 2: Design (block-based email editor, templates, Quick Links, personalisation)
- Step 3: Review & Send (summary, schedule, spam check)

### 3. Templates Library (/admin/templates)
- Grid view, CRUD, categories

### 4. Enhanced Contacts (/admin/contacts/:id profile page)
- Full CRM profile with activity timeline, email history, notes, tasks, tags

### 5. Enhanced Companies (/admin/companies/:id profile page)
- Company details, associated contacts, deals pipeline

### 6. Automations (/admin/automations)
- List of automations with visual builder
- Pre-built: Welcome Series, Webinar Follow-up, Re-engagement, Blog Digest, Event Reminder

### 7. Analytics (/admin/analytics)
- KPIs, campaign performance table, charts
- Individual campaign reports

### 8. AI Daily Email (/admin/daily-email)
- Content sources config, daily drafts, approval workflow

### 9. Settings (/admin/email-settings)
- Default from/reply-to, company address, GDPR settings

## Quick Links for Email Builder
- Homepage, Audit, Recruitment, HR Services, Hub, Hub Demo, Podcast, Blog, Events, Newsletter, Book Consultation, Contact, Jobs, Careers, Provider Websites, Privacy, Terms

## Social Links
- LinkedIn, Facebook, Instagram, YouTube
