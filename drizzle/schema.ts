import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * CRM Contacts — every person who interacts with the site
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 128 }).notNull(),
  lastName: varchar("lastName", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  company: varchar("company", { length: 256 }),
  jobTitle: varchar("jobTitle", { length: 256 }),
  source: mysqlEnum("source", ["contact_form", "newsletter", "signup", "download", "manual", "consultation", "other"]).default("other").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted", "archived"]).default("new").notNull(),
  notes: text("notes"),
  tags: text("tags"), // JSON array of tags stored as text
  avatarUrl: varchar("avatarUrl", { length: 1024 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * Companies — organisations linked to contacts
 */
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  website: varchar("website", { length: 512 }),
  industry: varchar("industry", { length: 128 }),
  size: varchar("size", { length: 64 }),
  phone: varchar("phone", { length: 32 }),
  address: text("address"),
  notes: text("notes"),
  avatarUrl: varchar("avatarUrl", { length: 1024 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

/**
 * Newsletter Subscribers
 */
export const subscribers = mysqlTable("subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  firstName: varchar("firstName", { length: 128 }),
  lastName: varchar("lastName", { length: 128 }),
  source: varchar("source", { length: 64 }).default("website"),
  isActive: boolean("isActive").default(true).notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;

/**
 * Contact Form Submissions
 */
export const contactSubmissions = mysqlTable("contactSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 128 }).notNull(),
  lastName: varchar("lastName", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  company: varchar("company", { length: 256 }),
  subject: varchar("subject", { length: 512 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied", "archived"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

/**
 * Downloadable Resources
 */
export const downloads = mysqlTable("downloads", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  fileUrl: varchar("fileUrl", { length: 1024 }).notNull(),
  fileType: varchar("fileType", { length: 32 }),
  fileSize: varchar("fileSize", { length: 32 }),
  thumbnailUrl: varchar("thumbnailUrl", { length: 1024 }),
  category: varchar("category", { length: 128 }),
  isPublished: boolean("isPublished").default(true).notNull(),
  downloadCount: int("downloadCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Download = typeof downloads.$inferSelect;
export type InsertDownload = typeof downloads.$inferInsert;

/**
 * Download Log — tracks who downloaded what
 */
export const downloadLogs = mysqlTable("downloadLogs", {
  id: int("id").autoincrement().primaryKey(),
  downloadId: int("downloadId").notNull(),
  email: varchar("email", { length: 320 }),
  firstName: varchar("firstName", { length: 128 }),
  lastName: varchar("lastName", { length: 128 }),
  ipAddress: varchar("ipAddress", { length: 64 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DownloadLog = typeof downloadLogs.$inferSelect;
export type InsertDownloadLog = typeof downloadLogs.$inferInsert;

/**
 * Page Views — visitor tracking
 */
export const pageViews = mysqlTable("pageViews", {
  id: int("id").autoincrement().primaryKey(),
  path: varchar("path", { length: 512 }).notNull(),
  referrer: varchar("referrer", { length: 1024 }),
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 64 }),
  sessionId: varchar("sessionId", { length: 128 }),
  country: varchar("country", { length: 64 }),
  city: varchar("city", { length: 128 }),
  device: varchar("device", { length: 32 }),
  browser: varchar("browser", { length: 64 }),
  os: varchar("os", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;

/**
 * Admin Notifications — alerts for the site owner
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["signup", "contact", "subscriber", "download", "system"]).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  message: text("message").notNull(),
  metadata: text("metadata"), // JSON string for extra data
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Signups — users who sign up for the platform / Hub early access
 */
export const signups = mysqlTable("signups", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 128 }).notNull(),
  lastName: varchar("lastName", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  company: varchar("company", { length: 256 }),
  phone: varchar("phone", { length: 32 }),
  interest: varchar("interest", { length: 256 }),
  source: varchar("source", { length: 64 }).default("website"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Signup = typeof signups.$inferSelect;
export type InsertSignup = typeof signups.$inferInsert;

/**
 * Job Listings — employer-posted vacancies
 */
export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  employerId: int("employerId"), // links to users table if logged in
  title: varchar("title", { length: 256 }).notNull(),
  company: varchar("company", { length: 256 }).notNull(),
  location: varchar("location", { length: 256 }).notNull(),
  salaryMin: int("salaryMin"),
  salaryMax: int("salaryMax"),
  salaryType: mysqlEnum("salaryType", ["annual", "hourly", "daily"]).default("annual"),
  jobType: mysqlEnum("jobType", ["full_time", "part_time", "contract", "temporary"]).default("full_time").notNull(),
  sector: varchar("sector", { length: 128 }).notNull(),
  sponsorshipOffered: boolean("sponsorshipOffered").default(true).notNull(),
  sponsorLicenceStatus: varchar("sponsorLicenceStatus", { length: 128 }),
  cosAvailability: varchar("cosAvailability", { length: 128 }),
  homeOfficeInspection: varchar("homeOfficeInspection", { length: 128 }),
  inspectionOutcomeDetail: text("inspectionOutcomeDetail"),
  socCode: varchar("socCode", { length: 32 }),
  description: text("description").notNull(),
  requirements: text("requirements"),
  benefits: text("benefits"),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 32 }),
  applyUrl: varchar("applyUrl", { length: 1024 }),
  tier: mysqlEnum("tier", ["free", "sponsored", "premium", "managed"]).default("free").notNull(),
  status: mysqlEnum("status", ["draft", "pending", "active", "expired", "closed"]).default("pending").notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  applicationCount: int("applicationCount").default(0).notNull(),
  stripePaymentId: varchar("stripePaymentId", { length: 256 }),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

/**
 * Job Applications — comprehensive 10-step application form data
 */
export const jobApplications = mysqlTable("jobApplications", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  jobTitle: varchar("jobTitle", { length: 256 }),
  employerName: varchar("employerName", { length: 256 }),
  sector: varchar("sector", { length: 128 }),
  sectorVariantStep6: varchar("sectorVariantStep6", { length: 128 }),
  sectorVariantStep7: varchar("sectorVariantStep7", { length: 128 }),

  // Step 1: Position & Availability
  availableStartDate: varchar("availableStartDate", { length: 32 }),

  // Step 2: Personal Information
  surname: varchar("surname", { length: 128 }).notNull(),
  firstName: varchar("firstName", { length: 128 }).notNull(),
  nationalInsuranceNumber: varchar("nationalInsuranceNumber", { length: 32 }),
  addressLine1: varchar("addressLine1", { length: 256 }).notNull(),
  addressLine2: varchar("addressLine2", { length: 256 }),
  postcode: varchar("postcode", { length: 16 }).notNull(),
  country: varchar("country", { length: 128 }).notNull(),
  mobile: varchar("mobile", { length: 32 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  rightToWork: text("rightToWork").notNull(),
  hasUkDrivingLicence: varchar("hasUkDrivingLicence", { length: 8 }),

  // Step 3: Employment History (JSON array)
  employmentHistory: json("employmentHistory"),

  // Step 4: Address History (JSON array)
  addressHistory: json("addressHistory"),

  // Step 5: Education & Qualifications (JSON array)
  qualifications: json("qualifications"),

  // Step 6: Sector-Specific Certifications (JSON)
  sectorCertifications: json("sectorCertifications"),

  // Step 7: Sector-Specific Experience (JSON)
  sectorExperience: json("sectorExperience"),

  // Step 8: Driving & Location
  hasValidDrivingLicence: varchar("hasValidDrivingLicence", { length: 8 }),
  hasVehicleAccess: varchar("hasVehicleAccess", { length: 8 }),
  hasBusinessInsurance: varchar("hasBusinessInsurance", { length: 8 }),
  livesWithin10Miles: varchar("livesWithin10Miles", { length: 8 }),
  willingToRelocate: varchar("willingToRelocate", { length: 8 }),
  canStartWithin4Weeks: varchar("canStartWithin4Weeks", { length: 8 }),

  // Step 9: References (JSON array of 2)
  references: json("references"),

  // Step 10: Screening & Declaration
  screeningQ1: text("screeningQ1"),
  screeningQ2: text("screeningQ2"),
  screeningQ3: text("screeningQ3"),
  hasCriminalConviction: varchar("hasCriminalConviction", { length: 8 }),
  criminalConvictionDetails: text("criminalConvictionDetails"),
  cvUrl: varchar("cvUrl", { length: 1024 }),
  declarationAccepted: boolean("declarationAccepted").default(false).notNull(),
  printName: varchar("printName", { length: 256 }),
  declarationDate: varchar("declarationDate", { length: 32 }),

  // Admin
  status: mysqlEnum("status", ["new", "reviewed", "shortlisted", "interviewed", "offered", "rejected"]).default("new").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = typeof jobApplications.$inferInsert;

/**
 * Chat Conversations — tracks every IANS chatbot conversation
 */
export const chatConversations = mysqlTable("chatConversations", {
  id: int("id").autoincrement().primaryKey(),
  visitorName: varchar("visitorName", { length: 256 }),
  visitorEmail: varchar("visitorEmail", { length: 320 }),
  userId: int("userId"), // links to users table if logged in
  pageUrl: varchar("pageUrl", { length: 1024 }),
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 64 }),
  status: mysqlEnum("status", ["active", "closed", "flagged"]).default("active").notNull(),
  messageCount: int("messageCount").default(0).notNull(),
  intentTags: text("intentTags"), // JSON array of detected intent tags
  summary: text("summary"), // AI-generated summary of the conversation
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = typeof chatConversations.$inferInsert;

/**
 * Chat Messages — individual messages within a conversation
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  intentTag: varchar("intentTag", { length: 128 }), // e.g. "pricing", "audit", "recruitment", "hub", "general"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Webinar Registrations — attendees for the 25 March webinar and future events
 */
export const webinarRegistrations = mysqlTable("webinarRegistrations", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  companyName: varchar("companyName", { length: 256 }),
  sponsoredWorkers: varchar("sponsoredWorkers", { length: 32 }),
  hasSponsorLicence: varchar("hasSponsorLicence", { length: 32 }),
  eventSlug: varchar("eventSlug", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WebinarRegistration = typeof webinarRegistrations.$inferSelect;
export type InsertWebinarRegistration = typeof webinarRegistrations.$inferInsert;

/**
 * Team Invitations — invite new team members to manage the backend
 */
export const teamInvitations = mysqlTable("teamInvitations", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 256 }),
  role: mysqlEnum("role", ["admin", "user"]).default("admin").notNull(),
  invitedBy: int("invitedBy").notNull(), // userId of inviter
  token: varchar("token", { length: 128 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "accepted", "expired", "revoked"]).default("pending").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  acceptedAt: timestamp("acceptedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TeamInvitation = typeof teamInvitations.$inferSelect;
export type InsertTeamInvitation = typeof teamInvitations.$inferInsert;

/**
 * Visitor Events — granular interaction tracking for lead scoring
 * Each event has a type and point value used to compute a visitor's lead score.
 * Events are linked by sessionId (anonymous) or email (identified).
 */
export const visitorEvents = mysqlTable("visitorEvents", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }),
  eventType: varchar("eventType", { length: 64 }).notNull(), // page_view, cta_click, form_start, form_submit, chatbot_open, chatbot_message, download, video_play, pricing_view, emergency_select
  eventValue: varchar("eventValue", { length: 512 }), // page path, CTA label, form name, etc.
  points: int("points").default(0).notNull(), // scoring points for this event
  pageUrl: varchar("pageUrl", { length: 512 }),
  referrer: varchar("referrer", { length: 1024 }),
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VisitorEvent = typeof visitorEvents.$inferSelect;
export type InsertVisitorEvent = typeof visitorEvents.$inferInsert;

/**
 * Lead Scores — aggregated scoring per identified visitor
 * Updated whenever new events come in. Classification:
 *   Cold: 0-19 | Warm: 20-49 | Hot: 50+
 */
export const leadScores = mysqlTable("leadScores", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  sessionId: varchar("sessionId", { length: 128 }),
  totalScore: int("totalScore").default(0).notNull(),
  classification: mysqlEnum("classification", ["cold", "warm", "hot"]).default("cold").notNull(),
  pageViewCount: int("pageViewCount").default(0).notNull(),
  formSubmitCount: int("formSubmitCount").default(0).notNull(),
  chatbotMessageCount: int("chatbotMessageCount").default(0).notNull(),
  downloadCount: int("downloadCount").default(0).notNull(),
  lastEventAt: timestamp("lastEventAt").defaultNow().notNull(),
  firstSeenAt: timestamp("firstSeenAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LeadScore = typeof leadScores.$inferSelect;
export type InsertLeadScore = typeof leadScores.$inferInsert;

/**
 * Availability Slots — recurring weekly availability windows set by admin
 * Each row = one time block on a specific day of the week (e.g., Monday 09:00-12:00)
 */
export const availabilitySlots = mysqlTable("availabilitySlots", {
  id: int("id").autoincrement().primaryKey(),
  dayOfWeek: int("dayOfWeek").notNull(), // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: varchar("startTime", { length: 8 }).notNull(), // "09:00" (24h format)
  endTime: varchar("endTime", { length: 8 }).notNull(), // "17:00"
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AvailabilitySlot = typeof availabilitySlots.$inferSelect;
export type InsertAvailabilitySlot = typeof availabilitySlots.$inferInsert;

/**
 * Blocked Dates — specific dates blocked off (holidays, leave, etc.)
 */
export const blockedDates = mysqlTable("blockedDates", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 16 }).notNull(), // "2026-03-25" ISO format
  reason: varchar("reason", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlockedDate = typeof blockedDates.$inferSelect;
export type InsertBlockedDate = typeof blockedDates.$inferInsert;

/**
 * Booking Settings — global configuration for the booking system
 * Single-row table (id=1 always) storing all booking rules
 */
export const bookingSettings = mysqlTable("bookingSettings", {
  id: int("id").autoincrement().primaryKey(),
  slotDurationMinutes: int("slotDurationMinutes").default(30).notNull(), // each appointment slot length
  bufferMinutes: int("bufferMinutes").default(15).notNull(), // gap between appointments
  maxDailyBookings: int("maxDailyBookings").default(8).notNull(), // max appointments per day
  minAdvanceHours: int("minAdvanceHours").default(24).notNull(), // minimum hours in advance to book
  maxAdvanceDays: int("maxAdvanceDays").default(30).notNull(), // how far ahead can book
  confirmationEmailEnabled: boolean("confirmationEmailEnabled").default(true).notNull(),
  reminderEmailEnabled: boolean("reminderEmailEnabled").default(true).notNull(),
  reminderHoursBefore: int("reminderHoursBefore").default(24).notNull(),
  welcomeMessage: text("welcomeMessage"), // shown on booking page
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BookingSetting = typeof bookingSettings.$inferSelect;
export type InsertBookingSetting = typeof bookingSettings.$inferInsert;

/**
 * Consultation Types — different types of consultations offered
 */
export const consultationTypes = mysqlTable("consultationTypes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  durationMinutes: int("durationMinutes").default(30).notNull(),
  color: varchar("color", { length: 16 }).default("#00C3FF"), // for calendar display
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ConsultationType = typeof consultationTypes.$inferSelect;
export type InsertConsultationType = typeof consultationTypes.$inferInsert;

/**
 * Appointments — the core booking records
 * Full lifecycle: pending → confirmed → completed | cancelled | no_show
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  consultationTypeId: int("consultationTypeId").notNull(),
  consultationTypeName: varchar("consultationTypeName", { length: 256 }).notNull(), // denormalised for quick display

  // Booking details
  date: varchar("date", { length: 16 }).notNull(), // "2026-03-25" ISO format
  startTime: varchar("startTime", { length: 8 }).notNull(), // "09:00"
  endTime: varchar("endTime", { length: 8 }).notNull(), // "09:30"
  timezone: varchar("timezone", { length: 64 }).default("Europe/London").notNull(),

  // Client details
  firstName: varchar("firstName", { length: 128 }).notNull(),
  lastName: varchar("lastName", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  company: varchar("company", { length: 256 }),
  urgencyType: varchar("urgencyType", { length: 128 }), // links to contact form triage
  notes: text("notes"), // client's message/context

  // Status lifecycle
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled", "no_show", "rescheduled"]).default("pending").notNull(),
  cancelledBy: mysqlEnum("cancelledBy", ["client", "admin"]),
  cancellationReason: text("cancellationReason"),
  rescheduledFromId: int("rescheduledFromId"), // links to original appointment if rescheduled

  // Tracking
  confirmationSentAt: timestamp("confirmationSentAt"),
  reminderSentAt: timestamp("reminderSentAt"),
  leadScoreId: int("leadScoreId"), // link to lead scoring
  source: varchar("source", { length: 64 }).default("website"), // website, chatbot, contact_form, admin
  
  // Admin notes
  adminNotes: text("adminNotes"),
  outcome: text("outcome"), // post-meeting notes

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;


/* ═══════════════════════════════════════════════════════════════
   EMAIL CAMPAIGN SYSTEM TABLES
   ═══════════════════════════════════════════════════════════════ */

/**
 * Email Campaigns — the core campaign entity
 */
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  subject: varchar("subject", { length: 512 }),
  previewText: varchar("previewText", { length: 512 }),
  fromName: varchar("fromName", { length: 128 }),
  fromEmail: varchar("fromEmail", { length: 320 }),
  replyTo: varchar("replyTo", { length: 320 }),
  contentJson: json("contentJson"), // drag-and-drop editor blocks
  contentHtml: text("contentHtml"),  // rendered HTML for sending
  status: mysqlEnum("status", ["draft", "scheduled", "sending", "sent", "paused", "cancelled"]).default("draft").notNull(),
  recipientListId: int("recipientListId"), // FK to contactLists
  recipientCount: int("recipientCount").default(0),
  scheduledAt: timestamp("scheduledAt"),
  sentAt: timestamp("sentAt"),
  // Stats (cached from campaign_events for quick access)
  totalSent: int("totalSent").default(0),
  totalOpened: int("totalOpened").default(0),
  totalClicked: int("totalClicked").default(0),
  totalBounced: int("totalBounced").default(0),
  totalUnsubscribed: int("totalUnsubscribed").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

/**
 * Email Templates — reusable email designs
 */
export const emailTemplates = mysqlTable("emailTemplates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  category: mysqlEnum("category", ["newsletter", "promotional", "transactional", "compliance", "onboarding", "custom"]).default("custom").notNull(),
  description: text("description"),
  contentJson: json("contentJson"), // editor blocks
  contentHtml: text("contentHtml"),
  thumbnailUrl: varchar("thumbnailUrl", { length: 1024 }),
  isDefault: boolean("isDefault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = typeof emailTemplates.$inferInsert;

/**
 * Contact Lists — segmented groups for targeting
 */
export const contactLists = mysqlTable("contactLists", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["static", "dynamic"]).default("static").notNull(),
  filterCriteria: json("filterCriteria"), // for dynamic lists
  memberCount: int("memberCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactList = typeof contactLists.$inferSelect;
export type InsertContactList = typeof contactLists.$inferInsert;

/**
 * List Members — many-to-many between contacts and lists
 */
export const listMembers = mysqlTable("listMembers", {
  id: int("id").autoincrement().primaryKey(),
  listId: int("listId").notNull(),
  contactId: int("contactId").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type ListMember = typeof listMembers.$inferSelect;
export type InsertListMember = typeof listMembers.$inferInsert;

/**
 * Contact Tags — flexible labelling system
 */
export const contactTags = mysqlTable("contactTags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  color: varchar("color", { length: 7 }).default("#6366f1"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactTag = typeof contactTags.$inferSelect;
export type InsertContactTag = typeof contactTags.$inferInsert;

/**
 * Contact-Tag assignments (many-to-many)
 */
export const contactTagAssignments = mysqlTable("contactTagAssignments", {
  id: int("id").autoincrement().primaryKey(),
  contactId: int("contactId").notNull(),
  tagId: int("tagId").notNull(),
});

export type ContactTagAssignment = typeof contactTagAssignments.$inferSelect;

/**
 * Contact Notes — activity log for CRM
 */
export const contactNotes = mysqlTable("contactNotes", {
  id: int("id").autoincrement().primaryKey(),
  contactId: int("contactId").notNull(),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["note", "call", "email", "meeting", "task"]).default("note").notNull(),
  createdBy: int("createdBy"), // FK to users
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactNote = typeof contactNotes.$inferSelect;
export type InsertContactNote = typeof contactNotes.$inferInsert;

/**
 * Contact Tasks — follow-up actions
 */
export const contactTasks = mysqlTable("contactTasks", {
  id: int("id").autoincrement().primaryKey(),
  contactId: int("contactId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  dueDate: timestamp("dueDate"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  assignedTo: int("assignedTo"), // FK to users
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactTask = typeof contactTasks.$inferSelect;
export type InsertContactTask = typeof contactTasks.$inferInsert;

/**
 * Deals — sales pipeline for companies
 */
export const deals = mysqlTable("deals", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  contactId: int("contactId"),
  title: varchar("title", { length: 256 }).notNull(),
  value: int("value"), // in pence
  stage: mysqlEnum("stage", ["lead", "qualified", "proposal", "negotiation", "won", "lost"]).default("lead").notNull(),
  probability: int("probability").default(0), // 0-100 percentage
  expectedCloseDate: timestamp("expectedCloseDate"),
  product: varchar("product", { length: 256 }), // product/service name
  productInterest: varchar("productInterest", { length: 256 }),
  lostReason: varchar("lostReason", { length: 512 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = typeof deals.$inferInsert;

/**
 * Campaign Recipients — tracks who received each campaign
 */
export const campaignRecipients = mysqlTable("campaignRecipients", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  contactId: int("contactId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "delivered", "bounced", "failed"]).default("pending").notNull(),
  sentAt: timestamp("sentAt"),
});

export type CampaignRecipient = typeof campaignRecipients.$inferSelect;
export type InsertCampaignRecipient = typeof campaignRecipients.$inferInsert;

/**
 * Campaign Events — opens, clicks, bounces, unsubscribes
 */
export const campaignEvents = mysqlTable("campaignEvents", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  contactId: int("contactId").notNull(),
  type: mysqlEnum("type", ["open", "click", "bounce", "unsubscribe", "complaint"]).notNull(),
  metadata: json("metadata"), // e.g. { url: "...", userAgent: "..." }
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CampaignEvent = typeof campaignEvents.$inferSelect;
export type InsertCampaignEvent = typeof campaignEvents.$inferInsert;

/**
 * Automations — workflow definitions
 */
export const automations = mysqlTable("automations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  trigger: mysqlEnum("trigger", ["contact_created", "tag_added", "list_joined", "form_submitted", "campaign_opened", "campaign_clicked", "manual"]).notNull(),
  triggerConfig: json("triggerConfig"), // e.g. { tagId: 5 }
  status: mysqlEnum("status", ["active", "paused", "draft"]).default("draft").notNull(),
  enrolledCount: int("enrolledCount").default(0),
  completedCount: int("completedCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Automation = typeof automations.$inferSelect;
export type InsertAutomation = typeof automations.$inferInsert;

/**
 * Automation Steps — individual actions in a workflow
 */
export const automationSteps = mysqlTable("automationSteps", {
  id: int("id").autoincrement().primaryKey(),
  automationId: int("automationId").notNull(),
  stepOrder: int("stepOrder").notNull(),
  type: mysqlEnum("type", ["send_email", "wait", "add_tag", "remove_tag", "add_to_list", "remove_from_list", "update_field", "notify_team", "condition"]).notNull(),
  config: json("config"), // step-specific configuration
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AutomationStep = typeof automationSteps.$inferSelect;
export type InsertAutomationStep = typeof automationSteps.$inferInsert;

/**
 * Automation Enrollments — contacts currently in an automation
 */
export const automationEnrollments = mysqlTable("automationEnrollments", {
  id: int("id").autoincrement().primaryKey(),
  automationId: int("automationId").notNull(),
  contactId: int("contactId").notNull(),
  currentStepId: int("currentStepId"),
  status: mysqlEnum("status", ["active", "completed", "paused", "failed"]).default("active").notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type AutomationEnrollment = typeof automationEnrollments.$inferSelect;
export type InsertAutomationEnrollment = typeof automationEnrollments.$inferInsert;

/**
 * Daily Email Drafts — AI-generated daily emails
 */
export const dailyEmailDrafts = mysqlTable("dailyEmailDrafts", {
  id: int("id").autoincrement().primaryKey(),
  subject: varchar("subject", { length: 512 }).notNull(),
  contentHtml: text("contentHtml"),
  contentJson: json("contentJson"),
  status: mysqlEnum("status", ["draft", "approved", "rejected", "sent"]).default("draft").notNull(),
  scheduledFor: timestamp("scheduledFor"),
  approvedBy: int("approvedBy"),
  approvedAt: timestamp("approvedAt"),
  sentAt: timestamp("sentAt"),
  sourceItems: json("sourceItems"), // array of content items used
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyEmailDraft = typeof dailyEmailDrafts.$inferSelect;
export type InsertDailyEmailDraft = typeof dailyEmailDrafts.$inferInsert;

/**
 * Content Sources — RSS feeds, websites, etc. for AI content scanning
 */
export const contentSources = mysqlTable("contentSources", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  type: mysqlEnum("type", ["rss", "website", "api", "manual"]).notNull(),
  url: varchar("url", { length: 1024 }),
  config: json("config"),
  isActive: boolean("isActive").default(true).notNull(),
  lastScannedAt: timestamp("lastScannedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContentSource = typeof contentSources.$inferSelect;
export type InsertContentSource = typeof contentSources.$inferInsert;

/**
 * Email Settings — global email configuration
 */
export const emailSettings = mysqlTable("emailSettings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 128 }).notNull().unique(),
  settingValue: text("settingValue"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailSetting = typeof emailSettings.$inferSelect;
export type InsertEmailSetting = typeof emailSettings.$inferInsert;


/**
 * Custom Properties — user-defined fields for contacts and companies
 */
export const customProperties = mysqlTable("customProperties", {
  id: int("id").autoincrement().primaryKey(),
  entityType: mysqlEnum("entityType", ["contact", "company"]).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  label: varchar("label", { length: 256 }).notNull(),
  fieldType: mysqlEnum("fieldType", ["text", "number", "date", "select", "url", "email", "phone", "textarea"]).default("text").notNull(),
  options: json("options"), // for select type: ["Option A", "Option B"]
  isRequired: boolean("isRequired").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomProperty = typeof customProperties.$inferSelect;
export type InsertCustomProperty = typeof customProperties.$inferInsert;

/**
 * Custom Property Values — stores the actual values for custom properties
 */
export const customPropertyValues = mysqlTable("customPropertyValues", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  entityType: mysqlEnum("entityType", ["contact", "company"]).notNull(),
  entityId: int("entityId").notNull(),
  value: text("value"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomPropertyValue = typeof customPropertyValues.$inferSelect;
export type InsertCustomPropertyValue = typeof customPropertyValues.$inferInsert;
