var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";
var users, contacts, companies, subscribers, contactSubmissions, downloads, downloadLogs, pageViews, notifications, signups, jobs, jobApplications, chatConversations, chatMessages, webinarRegistrations, teamInvitations, visitorEvents, leadScores, availabilitySlots, blockedDates, bookingSettings, consultationTypes, appointments, campaigns, emailTemplates, contactLists, listMembers, contactTags, contactTagAssignments, contactNotes, contactTasks, deals, campaignRecipients, campaignEvents, automations, automationSteps, automationEnrollments, dailyEmailDrafts, contentSources, emailSettings, customProperties, customPropertyValues;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      id: int("id").autoincrement().primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    contacts = mysqlTable("contacts", {
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
      tags: text("tags"),
      // JSON array of tags stored as text
      avatarUrl: varchar("avatarUrl", { length: 1024 }),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    companies = mysqlTable("companies", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    subscribers = mysqlTable("subscribers", {
      id: int("id").autoincrement().primaryKey(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      firstName: varchar("firstName", { length: 128 }),
      lastName: varchar("lastName", { length: 128 }),
      source: varchar("source", { length: 64 }).default("website"),
      isActive: boolean("isActive").default(true).notNull(),
      subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
      unsubscribedAt: timestamp("unsubscribedAt")
    });
    contactSubmissions = mysqlTable("contactSubmissions", {
      id: int("id").autoincrement().primaryKey(),
      firstName: varchar("firstName", { length: 128 }).notNull(),
      lastName: varchar("lastName", { length: 128 }).notNull(),
      email: varchar("email", { length: 320 }).notNull(),
      phone: varchar("phone", { length: 32 }),
      company: varchar("company", { length: 256 }),
      subject: varchar("subject", { length: 512 }),
      message: text("message").notNull(),
      status: mysqlEnum("status", ["new", "read", "replied", "archived"]).default("new").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    downloads = mysqlTable("downloads", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    downloadLogs = mysqlTable("downloadLogs", {
      id: int("id").autoincrement().primaryKey(),
      downloadId: int("downloadId").notNull(),
      email: varchar("email", { length: 320 }),
      firstName: varchar("firstName", { length: 128 }),
      lastName: varchar("lastName", { length: 128 }),
      ipAddress: varchar("ipAddress", { length: 64 }),
      userAgent: text("userAgent"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    pageViews = mysqlTable("pageViews", {
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
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    notifications = mysqlTable("notifications", {
      id: int("id").autoincrement().primaryKey(),
      type: mysqlEnum("type", ["signup", "contact", "subscriber", "download", "system"]).notNull(),
      title: varchar("title", { length: 256 }).notNull(),
      message: text("message").notNull(),
      metadata: text("metadata"),
      // JSON string for extra data
      isRead: boolean("isRead").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    signups = mysqlTable("signups", {
      id: int("id").autoincrement().primaryKey(),
      firstName: varchar("firstName", { length: 128 }).notNull(),
      lastName: varchar("lastName", { length: 128 }).notNull(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      company: varchar("company", { length: 256 }),
      phone: varchar("phone", { length: 32 }),
      interest: varchar("interest", { length: 256 }),
      source: varchar("source", { length: 64 }).default("website"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    jobs = mysqlTable("jobs", {
      id: int("id").autoincrement().primaryKey(),
      employerId: int("employerId"),
      // links to users table if logged in
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    jobApplications = mysqlTable("jobApplications", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    chatConversations = mysqlTable("chatConversations", {
      id: int("id").autoincrement().primaryKey(),
      visitorName: varchar("visitorName", { length: 256 }),
      visitorEmail: varchar("visitorEmail", { length: 320 }),
      userId: int("userId"),
      // links to users table if logged in
      pageUrl: varchar("pageUrl", { length: 1024 }),
      userAgent: text("userAgent"),
      ipAddress: varchar("ipAddress", { length: 64 }),
      status: mysqlEnum("status", ["active", "closed", "flagged"]).default("active").notNull(),
      messageCount: int("messageCount").default(0).notNull(),
      intentTags: text("intentTags"),
      // JSON array of detected intent tags
      summary: text("summary"),
      // AI-generated summary of the conversation
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    chatMessages = mysqlTable("chatMessages", {
      id: int("id").autoincrement().primaryKey(),
      conversationId: int("conversationId").notNull(),
      role: mysqlEnum("role", ["user", "assistant"]).notNull(),
      content: text("content").notNull(),
      intentTag: varchar("intentTag", { length: 128 }),
      // e.g. "pricing", "audit", "recruitment", "hub", "general"
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    webinarRegistrations = mysqlTable("webinarRegistrations", {
      id: int("id").autoincrement().primaryKey(),
      fullName: varchar("fullName", { length: 256 }).notNull(),
      email: varchar("email", { length: 320 }).notNull(),
      companyName: varchar("companyName", { length: 256 }),
      sponsoredWorkers: varchar("sponsoredWorkers", { length: 32 }),
      hasSponsorLicence: varchar("hasSponsorLicence", { length: 32 }),
      eventSlug: varchar("eventSlug", { length: 128 }).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    teamInvitations = mysqlTable("teamInvitations", {
      id: int("id").autoincrement().primaryKey(),
      email: varchar("email", { length: 320 }).notNull(),
      name: varchar("name", { length: 256 }),
      role: mysqlEnum("role", ["admin", "user"]).default("admin").notNull(),
      invitedBy: int("invitedBy").notNull(),
      // userId of inviter
      token: varchar("token", { length: 128 }).notNull().unique(),
      status: mysqlEnum("status", ["pending", "accepted", "expired", "revoked"]).default("pending").notNull(),
      expiresAt: timestamp("expiresAt").notNull(),
      acceptedAt: timestamp("acceptedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    visitorEvents = mysqlTable("visitorEvents", {
      id: int("id").autoincrement().primaryKey(),
      sessionId: varchar("sessionId", { length: 128 }).notNull(),
      email: varchar("email", { length: 320 }),
      eventType: varchar("eventType", { length: 64 }).notNull(),
      // page_view, cta_click, form_start, form_submit, chatbot_open, chatbot_message, download, video_play, pricing_view, emergency_select
      eventValue: varchar("eventValue", { length: 512 }),
      // page path, CTA label, form name, etc.
      points: int("points").default(0).notNull(),
      // scoring points for this event
      pageUrl: varchar("pageUrl", { length: 512 }),
      referrer: varchar("referrer", { length: 1024 }),
      userAgent: text("userAgent"),
      ipAddress: varchar("ipAddress", { length: 64 }),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    leadScores = mysqlTable("leadScores", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    availabilitySlots = mysqlTable("availabilitySlots", {
      id: int("id").autoincrement().primaryKey(),
      dayOfWeek: int("dayOfWeek").notNull(),
      // 0=Sunday, 1=Monday, ..., 6=Saturday
      startTime: varchar("startTime", { length: 8 }).notNull(),
      // "09:00" (24h format)
      endTime: varchar("endTime", { length: 8 }).notNull(),
      // "17:00"
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    blockedDates = mysqlTable("blockedDates", {
      id: int("id").autoincrement().primaryKey(),
      date: varchar("date", { length: 16 }).notNull(),
      // "2026-03-25" ISO format
      reason: varchar("reason", { length: 256 }),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    bookingSettings = mysqlTable("bookingSettings", {
      id: int("id").autoincrement().primaryKey(),
      slotDurationMinutes: int("slotDurationMinutes").default(30).notNull(),
      // each appointment slot length
      bufferMinutes: int("bufferMinutes").default(15).notNull(),
      // gap between appointments
      maxDailyBookings: int("maxDailyBookings").default(8).notNull(),
      // max appointments per day
      minAdvanceHours: int("minAdvanceHours").default(24).notNull(),
      // minimum hours in advance to book
      maxAdvanceDays: int("maxAdvanceDays").default(30).notNull(),
      // how far ahead can book
      confirmationEmailEnabled: boolean("confirmationEmailEnabled").default(true).notNull(),
      reminderEmailEnabled: boolean("reminderEmailEnabled").default(true).notNull(),
      reminderHoursBefore: int("reminderHoursBefore").default(24).notNull(),
      welcomeMessage: text("welcomeMessage"),
      // shown on booking page
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    consultationTypes = mysqlTable("consultationTypes", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      description: text("description"),
      durationMinutes: int("durationMinutes").default(30).notNull(),
      color: varchar("color", { length: 16 }).default("#00C3FF"),
      // for calendar display
      isActive: boolean("isActive").default(true).notNull(),
      sortOrder: int("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    appointments = mysqlTable("appointments", {
      id: int("id").autoincrement().primaryKey(),
      consultationTypeId: int("consultationTypeId").notNull(),
      consultationTypeName: varchar("consultationTypeName", { length: 256 }).notNull(),
      // denormalised for quick display
      // Booking details
      date: varchar("date", { length: 16 }).notNull(),
      // "2026-03-25" ISO format
      startTime: varchar("startTime", { length: 8 }).notNull(),
      // "09:00"
      endTime: varchar("endTime", { length: 8 }).notNull(),
      // "09:30"
      timezone: varchar("timezone", { length: 64 }).default("Europe/London").notNull(),
      // Client details
      firstName: varchar("firstName", { length: 128 }).notNull(),
      lastName: varchar("lastName", { length: 128 }).notNull(),
      email: varchar("email", { length: 320 }).notNull(),
      phone: varchar("phone", { length: 32 }),
      company: varchar("company", { length: 256 }),
      urgencyType: varchar("urgencyType", { length: 128 }),
      // links to contact form triage
      notes: text("notes"),
      // client's message/context
      // Status lifecycle
      status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled", "no_show", "rescheduled"]).default("pending").notNull(),
      cancelledBy: mysqlEnum("cancelledBy", ["client", "admin"]),
      cancellationReason: text("cancellationReason"),
      rescheduledFromId: int("rescheduledFromId"),
      // links to original appointment if rescheduled
      // Tracking
      confirmationSentAt: timestamp("confirmationSentAt"),
      reminderSentAt: timestamp("reminderSentAt"),
      leadScoreId: int("leadScoreId"),
      // link to lead scoring
      source: varchar("source", { length: 64 }).default("website"),
      // website, chatbot, contact_form, admin
      // Admin notes
      adminNotes: text("adminNotes"),
      outcome: text("outcome"),
      // post-meeting notes
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    campaigns = mysqlTable("campaigns", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      subject: varchar("subject", { length: 512 }),
      previewText: varchar("previewText", { length: 512 }),
      fromName: varchar("fromName", { length: 128 }),
      fromEmail: varchar("fromEmail", { length: 320 }),
      replyTo: varchar("replyTo", { length: 320 }),
      contentJson: json("contentJson"),
      // drag-and-drop editor blocks
      contentHtml: text("contentHtml"),
      // rendered HTML for sending
      status: mysqlEnum("status", ["draft", "scheduled", "sending", "sent", "paused", "cancelled"]).default("draft").notNull(),
      recipientListId: int("recipientListId"),
      // FK to contactLists
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    emailTemplates = mysqlTable("emailTemplates", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      category: mysqlEnum("category", ["newsletter", "promotional", "transactional", "compliance", "onboarding", "custom"]).default("custom").notNull(),
      description: text("description"),
      contentJson: json("contentJson"),
      // editor blocks
      contentHtml: text("contentHtml"),
      thumbnailUrl: varchar("thumbnailUrl", { length: 1024 }),
      isDefault: boolean("isDefault").default(false),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    contactLists = mysqlTable("contactLists", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      description: text("description"),
      type: mysqlEnum("type", ["static", "dynamic"]).default("static").notNull(),
      filterCriteria: json("filterCriteria"),
      // for dynamic lists
      memberCount: int("memberCount").default(0),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    listMembers = mysqlTable("listMembers", {
      id: int("id").autoincrement().primaryKey(),
      listId: int("listId").notNull(),
      contactId: int("contactId").notNull(),
      addedAt: timestamp("addedAt").defaultNow().notNull()
    });
    contactTags = mysqlTable("contactTags", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 128 }).notNull(),
      color: varchar("color", { length: 7 }).default("#6366f1"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    contactTagAssignments = mysqlTable("contactTagAssignments", {
      id: int("id").autoincrement().primaryKey(),
      contactId: int("contactId").notNull(),
      tagId: int("tagId").notNull()
    });
    contactNotes = mysqlTable("contactNotes", {
      id: int("id").autoincrement().primaryKey(),
      contactId: int("contactId").notNull(),
      content: text("content").notNull(),
      type: mysqlEnum("type", ["note", "call", "email", "meeting", "task"]).default("note").notNull(),
      createdBy: int("createdBy"),
      // FK to users
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    contactTasks = mysqlTable("contactTasks", {
      id: int("id").autoincrement().primaryKey(),
      contactId: int("contactId").notNull(),
      title: varchar("title", { length: 256 }).notNull(),
      description: text("description"),
      dueDate: timestamp("dueDate"),
      status: mysqlEnum("status", ["pending", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
      priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
      assignedTo: int("assignedTo"),
      // FK to users
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    deals = mysqlTable("deals", {
      id: int("id").autoincrement().primaryKey(),
      companyId: int("companyId").notNull(),
      contactId: int("contactId"),
      title: varchar("title", { length: 256 }).notNull(),
      value: int("value"),
      // in pence
      stage: mysqlEnum("stage", ["lead", "qualified", "proposal", "negotiation", "won", "lost"]).default("lead").notNull(),
      probability: int("probability").default(0),
      // 0-100 percentage
      expectedCloseDate: timestamp("expectedCloseDate"),
      product: varchar("product", { length: 256 }),
      // product/service name
      productInterest: varchar("productInterest", { length: 256 }),
      lostReason: varchar("lostReason", { length: 512 }),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    campaignRecipients = mysqlTable("campaignRecipients", {
      id: int("id").autoincrement().primaryKey(),
      campaignId: int("campaignId").notNull(),
      contactId: int("contactId").notNull(),
      email: varchar("email", { length: 320 }).notNull(),
      status: mysqlEnum("status", ["pending", "sent", "delivered", "bounced", "failed"]).default("pending").notNull(),
      sentAt: timestamp("sentAt")
    });
    campaignEvents = mysqlTable("campaignEvents", {
      id: int("id").autoincrement().primaryKey(),
      campaignId: int("campaignId").notNull(),
      contactId: int("contactId").notNull(),
      type: mysqlEnum("type", ["open", "click", "bounce", "unsubscribe", "complaint"]).notNull(),
      metadata: json("metadata"),
      // e.g. { url: "...", userAgent: "..." }
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    automations = mysqlTable("automations", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      description: text("description"),
      trigger: mysqlEnum("trigger", ["contact_created", "tag_added", "list_joined", "form_submitted", "campaign_opened", "campaign_clicked", "manual"]).notNull(),
      triggerConfig: json("triggerConfig"),
      // e.g. { tagId: 5 }
      status: mysqlEnum("status", ["active", "paused", "draft"]).default("draft").notNull(),
      enrolledCount: int("enrolledCount").default(0),
      completedCount: int("completedCount").default(0),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    automationSteps = mysqlTable("automationSteps", {
      id: int("id").autoincrement().primaryKey(),
      automationId: int("automationId").notNull(),
      stepOrder: int("stepOrder").notNull(),
      type: mysqlEnum("type", ["send_email", "wait", "add_tag", "remove_tag", "add_to_list", "remove_from_list", "update_field", "notify_team", "condition"]).notNull(),
      config: json("config"),
      // step-specific configuration
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    automationEnrollments = mysqlTable("automationEnrollments", {
      id: int("id").autoincrement().primaryKey(),
      automationId: int("automationId").notNull(),
      contactId: int("contactId").notNull(),
      currentStepId: int("currentStepId"),
      status: mysqlEnum("status", ["active", "completed", "paused", "failed"]).default("active").notNull(),
      enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
      completedAt: timestamp("completedAt")
    });
    dailyEmailDrafts = mysqlTable("dailyEmailDrafts", {
      id: int("id").autoincrement().primaryKey(),
      subject: varchar("subject", { length: 512 }).notNull(),
      contentHtml: text("contentHtml"),
      contentJson: json("contentJson"),
      status: mysqlEnum("status", ["draft", "approved", "rejected", "sent"]).default("draft").notNull(),
      scheduledFor: timestamp("scheduledFor"),
      approvedBy: int("approvedBy"),
      approvedAt: timestamp("approvedAt"),
      sentAt: timestamp("sentAt"),
      sourceItems: json("sourceItems"),
      // array of content items used
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    contentSources = mysqlTable("contentSources", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      type: mysqlEnum("type", ["rss", "website", "api", "manual"]).notNull(),
      url: varchar("url", { length: 1024 }),
      config: json("config"),
      isActive: boolean("isActive").default(true).notNull(),
      lastScannedAt: timestamp("lastScannedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    emailSettings = mysqlTable("emailSettings", {
      id: int("id").autoincrement().primaryKey(),
      settingKey: varchar("settingKey", { length: 128 }).notNull().unique(),
      settingValue: text("settingValue"),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    customProperties = mysqlTable("customProperties", {
      id: int("id").autoincrement().primaryKey(),
      entityType: mysqlEnum("entityType", ["contact", "company"]).notNull(),
      name: varchar("name", { length: 128 }).notNull(),
      label: varchar("label", { length: 256 }).notNull(),
      fieldType: mysqlEnum("fieldType", ["text", "number", "date", "select", "url", "email", "phone", "textarea"]).default("text").notNull(),
      options: json("options"),
      // for select type: ["Option A", "Option B"]
      isRequired: boolean("isRequired").default(false).notNull(),
      sortOrder: int("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    customPropertyValues = mysqlTable("customPropertyValues", {
      id: int("id").autoincrement().primaryKey(),
      propertyId: int("propertyId").notNull(),
      entityType: mysqlEnum("entityType", ["contact", "company"]).notNull(),
      entityId: int("entityId").notNull(),
      value: text("value"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
import { eq, desc, sql, and, gte, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = { openId: user.openId };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createContact(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contacts).values(data);
  return result[0].insertId;
}
async function getContacts(opts = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { limit = 50, offset = 0, search, status, source } = opts;
  const conditions = [];
  if (search) {
    conditions.push(or(
      like(contacts.firstName, `%${search}%`),
      like(contacts.lastName, `%${search}%`),
      like(contacts.email, `%${search}%`),
      like(contacts.company, `%${search}%`)
    ));
  }
  if (status) conditions.push(eq(contacts.status, status));
  if (source) conditions.push(eq(contacts.source, source));
  const where = conditions.length > 0 ? and(...conditions) : void 0;
  const items = await db.select().from(contacts).where(where).orderBy(desc(contacts.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql`count(*)` }).from(contacts).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}
async function getContactStats() {
  const db = await getDb();
  if (!db) return { total: 0, bySource: [], byStatus: [], recentCount: 0 };
  const totalResult = await db.select({ count: sql`count(*)` }).from(contacts);
  const bySource = await db.select({ source: contacts.source, count: sql`count(*)` }).from(contacts).groupBy(contacts.source);
  const byStatus = await db.select({ status: contacts.status, count: sql`count(*)` }).from(contacts).groupBy(contacts.status);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3);
  const recentResult = await db.select({ count: sql`count(*)` }).from(contacts).where(sql`${contacts.createdAt} >= ${sevenDaysAgo}`);
  return {
    total: totalResult[0]?.count ?? 0,
    bySource,
    byStatus,
    recentCount: recentResult[0]?.count ?? 0
  };
}
async function bulkImportContacts(contactsData, skipDuplicates = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  const errorDetails = [];
  const existingEmails = /* @__PURE__ */ new Set();
  if (skipDuplicates) {
    const existing = await db.select({ email: contacts.email }).from(contacts);
    existing.forEach((r) => existingEmails.add(r.email.toLowerCase()));
  }
  for (let i = 0; i < contactsData.length; i++) {
    const c = contactsData[i];
    const email = c.email.toLowerCase().trim();
    if (skipDuplicates && existingEmails.has(email)) {
      skipped++;
      continue;
    }
    try {
      await db.insert(contacts).values({
        firstName: c.firstName || "Unknown",
        lastName: c.lastName || "",
        email,
        phone: c.phone || null,
        company: c.company || null,
        jobTitle: c.jobTitle || null,
        source: c.source || "other",
        status: "new",
        tags: c.tags || null
      });
      imported++;
      existingEmails.add(email);
    } catch (err) {
      if (err?.code === "ER_DUP_ENTRY") {
        skipped++;
      } else {
        errors++;
        if (errorDetails.length < 10) errorDetails.push(`Row ${i + 1}: ${err?.message || "Unknown error"}`);
      }
    }
  }
  return { imported, skipped, errors, errorDetails, total: contactsData.length };
}
async function getContactById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
  return result[0];
}
async function updateContact(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contacts).set(data).where(eq(contacts.id, id));
}
async function deleteContact(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(contacts).where(eq(contacts.id, id));
}
async function createCompany(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(companies).values(data);
  return result[0].insertId;
}
async function getCompanies(opts = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { limit = 50, offset = 0, search } = opts;
  const where = search ? or(like(companies.name, `%${search}%`), like(companies.industry, `%${search}%`)) : void 0;
  const items = await db.select().from(companies).where(where).orderBy(desc(companies.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql`count(*)` }).from(companies).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}
async function updateCompany(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(companies).set(data).where(eq(companies.id, id));
}
async function deleteCompany(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(companies).where(eq(companies.id, id));
}
async function createSubscriber(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(subscribers).values(data).onDuplicateKeyUpdate({
    set: { isActive: true, unsubscribedAt: null }
  });
}
async function getSubscribers(opts = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { limit = 50, offset = 0, activeOnly = false } = opts;
  const where = activeOnly ? eq(subscribers.isActive, true) : void 0;
  const items = await db.select().from(subscribers).where(where).orderBy(desc(subscribers.subscribedAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql`count(*)` }).from(subscribers).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}
async function unsubscribe(email) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(subscribers).set({ isActive: false, unsubscribedAt: /* @__PURE__ */ new Date() }).where(eq(subscribers.email, email));
}
async function createContactSubmission(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contactSubmissions).values(data);
  return result[0].insertId;
}
async function getContactSubmissions(opts = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { limit = 50, offset = 0, status } = opts;
  const where = status ? eq(contactSubmissions.status, status) : void 0;
  const items = await db.select().from(contactSubmissions).where(where).orderBy(desc(contactSubmissions.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql`count(*)` }).from(contactSubmissions).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}
async function updateContactSubmissionStatus(id, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contactSubmissions).set({ status }).where(eq(contactSubmissions.id, id));
}
async function createDownload(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(downloads).values(data);
  return result[0].insertId;
}
async function getDownloads(opts = {}) {
  const db = await getDb();
  if (!db) return [];
  const where = opts.publishedOnly ? eq(downloads.isPublished, true) : void 0;
  return db.select().from(downloads).where(where).orderBy(desc(downloads.createdAt));
}
async function incrementDownloadCount(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(downloads).set({ downloadCount: sql`${downloads.downloadCount} + 1` }).where(eq(downloads.id, id));
}
async function createDownloadLog(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(downloadLogs).values(data);
}
async function updateDownload(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(downloads).set(data).where(eq(downloads.id, id));
}
async function deleteDownload(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(downloads).where(eq(downloads.id, id));
}
async function getDownloadById(id) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(downloads).where(eq(downloads.id, id)).limit(1);
  return rows[0] ?? null;
}
async function getDownloadLogs(downloadId) {
  const db = await getDb();
  if (!db) return [];
  const where = downloadId ? eq(downloadLogs.downloadId, downloadId) : void 0;
  return db.select().from(downloadLogs).where(where).orderBy(desc(downloadLogs.createdAt)).limit(100);
}
async function trackPageView(data) {
  const db = await getDb();
  if (!db) return;
  await db.insert(pageViews).values(data);
}
async function getPageViewStats(opts = {}) {
  const db = await getDb();
  if (!db) return { totalViews: 0, uniqueVisitors: 0, topPages: [], viewsByDay: [] };
  const { days = 30 } = opts;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1e3);
  const totalResult = await db.select({ count: sql`count(*)` }).from(pageViews).where(gte(pageViews.createdAt, since));
  const uniqueResult = await db.select({ count: sql`count(distinct ${pageViews.sessionId})` }).from(pageViews).where(gte(pageViews.createdAt, since));
  const topPages = await db.select({
    path: pageViews.path,
    views: sql`count(*)`
  }).from(pageViews).where(gte(pageViews.createdAt, since)).groupBy(pageViews.path).orderBy(desc(sql`count(*)`)).limit(20);
  const viewsByDay = await db.execute(sql`SELECT DATE(createdAt) as date, count(*) as views, count(distinct sessionId) as uniqueVisitors FROM pageViews WHERE createdAt >= ${since} GROUP BY DATE(createdAt) ORDER BY DATE(createdAt)`);
  const viewsByDayRows = viewsByDay?.[0] ?? [];
  return {
    totalViews: totalResult[0]?.count ?? 0,
    uniqueVisitors: uniqueResult[0]?.count ?? 0,
    topPages,
    viewsByDay: Array.isArray(viewsByDayRows) ? viewsByDayRows.map((r) => ({ date: String(r.date), views: Number(r.views), uniqueVisitors: Number(r.uniqueVisitors) })) : []
  };
}
async function getRecentVisitors(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pageViews).orderBy(desc(pageViews.createdAt)).limit(limit);
}
async function createNotification(data) {
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values(data);
}
async function getNotifications(opts = {}) {
  const db = await getDb();
  if (!db) return { items: [], unreadCount: 0 };
  const { limit = 50, unreadOnly = false } = opts;
  const where = unreadOnly ? eq(notifications.isRead, false) : void 0;
  const items = await db.select().from(notifications).where(where).orderBy(desc(notifications.createdAt)).limit(limit);
  const unreadResult = await db.select({ count: sql`count(*)` }).from(notifications).where(eq(notifications.isRead, false));
  return { items, unreadCount: unreadResult[0]?.count ?? 0 };
}
async function markNotificationRead(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}
async function markAllNotificationsRead() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.isRead, false));
}
async function createSignup(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(signups).values(data).onDuplicateKeyUpdate({
    set: { firstName: data.firstName, lastName: data.lastName, company: data.company }
  });
}
async function getSignups(opts = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { limit = 50, offset = 0 } = opts;
  const items = await db.select().from(signups).orderBy(desc(signups.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql`count(*)` }).from(signups);
  return { items, total: countResult[0]?.count ?? 0 };
}
async function createJob(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(jobs).values(data);
  return result[0].insertId;
}
async function getJobs(opts = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { limit = 50, offset = 0, search, sector, status, tier, employerId, sponsorshipOnly } = opts;
  const conditions = [];
  if (search) {
    conditions.push(or(
      like(jobs.title, `%${search}%`),
      like(jobs.company, `%${search}%`),
      like(jobs.location, `%${search}%`)
    ));
  }
  if (sector) conditions.push(eq(jobs.sector, sector));
  if (status) conditions.push(eq(jobs.status, status));
  if (tier) conditions.push(eq(jobs.tier, tier));
  if (employerId) conditions.push(eq(jobs.employerId, employerId));
  if (sponsorshipOnly) conditions.push(eq(jobs.sponsorshipOffered, true));
  const where = conditions.length > 0 ? and(...conditions) : void 0;
  const items = await db.select().from(jobs).where(where).orderBy(desc(jobs.isFeatured), desc(jobs.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql`count(*)` }).from(jobs).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}
async function getJobById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result[0];
}
async function updateJob(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(jobs).set(data).where(eq(jobs.id, id));
}
async function deleteJob(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(jobs).where(eq(jobs.id, id));
}
async function incrementJobViewCount(id) {
  const db = await getDb();
  if (!db) return;
  await db.update(jobs).set({ viewCount: sql`${jobs.viewCount} + 1` }).where(eq(jobs.id, id));
}
async function createJobApplication(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(jobApplications).values(data);
  await db.update(jobs).set({ applicationCount: sql`${jobs.applicationCount} + 1` }).where(eq(jobs.id, data.jobId));
  return result[0].insertId;
}
async function getJobApplications(opts = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { jobId, limit = 50, offset = 0 } = opts;
  const where = jobId ? eq(jobApplications.jobId, jobId) : void 0;
  const items = await db.select().from(jobApplications).where(where).orderBy(desc(jobApplications.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql`count(*)` }).from(jobApplications).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}
async function updateJobApplicationStatus(id, status, adminNotes) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updates = { status };
  if (adminNotes !== void 0) updates.adminNotes = adminNotes;
  await db.update(jobApplications).set(updates).where(eq(jobApplications.id, id));
}
async function getJobApplicationById(id) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(jobApplications).where(eq(jobApplications.id, id)).limit(1);
  return rows[0] ?? null;
}
async function getJobApplicationsFiltered(opts = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { jobId, sector, status, dateFrom, dateTo, search, limit = 50, offset = 0 } = opts;
  const conditions = [];
  if (jobId) conditions.push(eq(jobApplications.jobId, jobId));
  if (sector) conditions.push(eq(jobApplications.sector, sector));
  if (status) conditions.push(eq(jobApplications.status, status));
  if (dateFrom) conditions.push(sql`${jobApplications.createdAt} >= ${dateFrom}`);
  if (dateTo) conditions.push(sql`${jobApplications.createdAt} <= ${dateTo}`);
  if (search) conditions.push(sql`(${jobApplications.firstName} LIKE ${`%${search}%`} OR ${jobApplications.surname} LIKE ${`%${search}%`} OR ${jobApplications.email} LIKE ${`%${search}%`})`);
  const where = conditions.length > 0 ? and(...conditions) : void 0;
  const items = await db.select().from(jobApplications).where(where).orderBy(desc(jobApplications.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql`count(*)` }).from(jobApplications).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}
async function getJobStats() {
  const db = await getDb();
  if (!db) return { totalJobs: 0, activeJobs: 0, totalApplications: 0, featuredJobs: 0, pending: 0, expired: 0, closed: 0, total: 0, active: 0, featured: 0 };
  const [total, active, apps, featured, pending, expired, closed] = await Promise.all([
    db.select({ count: sql`count(*)` }).from(jobs),
    db.select({ count: sql`count(*)` }).from(jobs).where(eq(jobs.status, "active")),
    db.select({ count: sql`count(*)` }).from(jobApplications),
    db.select({ count: sql`count(*)` }).from(jobs).where(eq(jobs.isFeatured, true)),
    db.select({ count: sql`count(*)` }).from(jobs).where(eq(jobs.status, "pending")),
    db.select({ count: sql`count(*)` }).from(jobs).where(eq(jobs.status, "expired")),
    db.select({ count: sql`count(*)` }).from(jobs).where(eq(jobs.status, "closed"))
  ]);
  return {
    totalJobs: total[0]?.count ?? 0,
    activeJobs: active[0]?.count ?? 0,
    totalApplications: apps[0]?.count ?? 0,
    featuredJobs: featured[0]?.count ?? 0,
    pending: pending[0]?.count ?? 0,
    expired: expired[0]?.count ?? 0,
    closed: closed[0]?.count ?? 0,
    total: total[0]?.count ?? 0,
    active: active[0]?.count ?? 0,
    featured: featured[0]?.count ?? 0
  };
}
async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { contacts: 0, subscribers: 0, submissions: 0, signups: 0, downloads: 0, pageViews: 0, videoEarlyAccess: 0 };
  const [c, s, sub, sg, d, pv, vea] = await Promise.all([
    db.select({ count: sql`count(*)` }).from(contacts),
    db.select({ count: sql`count(*)` }).from(subscribers).where(eq(subscribers.isActive, true)),
    db.select({ count: sql`count(*)` }).from(contactSubmissions),
    db.select({ count: sql`count(*)` }).from(signups),
    db.select({ count: sql`count(*)` }).from(downloads),
    db.select({ count: sql`count(*)` }).from(pageViews),
    db.select({ count: sql`count(*)` }).from(subscribers).where(and(eq(subscribers.isActive, true), eq(subscribers.source, "hub_video_early_access")))
  ]);
  return {
    contacts: c[0]?.count ?? 0,
    subscribers: s[0]?.count ?? 0,
    submissions: sub[0]?.count ?? 0,
    signups: sg[0]?.count ?? 0,
    downloads: d[0]?.count ?? 0,
    pageViews: pv[0]?.count ?? 0,
    videoEarlyAccess: vea[0]?.count ?? 0
  };
}
async function getSubscribersBySource(source) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscribers).where(and(eq(subscribers.isActive, true), eq(subscribers.source, source))).orderBy(desc(subscribers.subscribedAt));
}
async function createChatConversation(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(chatConversations).values(data).$returningId();
  return result;
}
async function getChatConversation(id) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(chatConversations).where(eq(chatConversations.id, id)).limit(1);
  return rows[0] ?? null;
}
async function updateChatConversation(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(chatConversations).set(data).where(eq(chatConversations.id, id));
}
async function listChatConversations(opts = {}) {
  const db = await getDb();
  if (!db) return { conversations: [], total: 0 };
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;
  const rows = await db.select().from(chatConversations).orderBy(desc(chatConversations.createdAt)).limit(limit).offset(offset);
  const [total] = await db.select({ count: sql`count(*)` }).from(chatConversations);
  return { conversations: rows, total: total?.count ?? 0 };
}
async function createChatMessage(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(chatMessages).values(data).$returningId();
  await db.update(chatConversations).set({ messageCount: sql`${chatConversations.messageCount} + 1` }).where(eq(chatConversations.id, data.conversationId));
  return result;
}
async function getChatMessages(conversationId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatMessages).where(eq(chatMessages.conversationId, conversationId)).orderBy(chatMessages.createdAt);
}
async function updateConversationIntentTags(conversationId, newTag) {
  const db = await getDb();
  if (!db) return;
  const conv = await getChatConversation(conversationId);
  if (!conv) return;
  const existing = conv.intentTags ? JSON.parse(conv.intentTags) : [];
  if (!existing.includes(newTag)) {
    existing.push(newTag);
    await db.update(chatConversations).set({ intentTags: JSON.stringify(existing) }).where(eq(chatConversations.id, conversationId));
  }
}
async function createWebinarRegistration(data) {
  const db = await getDb();
  if (!db) return 0;
  const [result] = await db.insert(webinarRegistrations).values(data).$returningId();
  return result.id;
}
async function getWebinarRegistrations(eventSlug) {
  const db = await getDb();
  if (!db) return [];
  if (eventSlug) {
    return db.select().from(webinarRegistrations).where(eq(webinarRegistrations.eventSlug, eventSlug)).orderBy(desc(webinarRegistrations.createdAt));
  }
  return db.select().from(webinarRegistrations).orderBy(desc(webinarRegistrations.createdAt));
}
async function createTeamInvitation(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(teamInvitations).values(data).$returningId();
  return result.id;
}
async function listTeamInvitations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamInvitations).orderBy(desc(teamInvitations.createdAt));
}
async function getTeamInvitationByToken(token) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db.select().from(teamInvitations).where(eq(teamInvitations.token, token));
  return row ?? null;
}
async function updateTeamInvitationStatus(id, status, acceptedAt) {
  const db = await getDb();
  if (!db) return;
  const updates = { status };
  if (acceptedAt) updates.acceptedAt = acceptedAt;
  await db.update(teamInvitations).set(updates).where(eq(teamInvitations.id, id));
}
async function listTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(eq(users.role, "admin")).orderBy(desc(users.createdAt));
}
async function updateUserRole(userId, role) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, userId));
}
function getEventPoints(eventType) {
  return EVENT_POINTS[eventType] ?? 1;
}
function classifyScore(score) {
  if (score >= 50) return "hot";
  if (score >= 20) return "warm";
  return "cold";
}
async function trackVisitorEvent(data) {
  const db = await getDb();
  if (!db) return;
  const points = getEventPoints(data.eventType);
  await db.insert(visitorEvents).values({ ...data, points });
  if (data.email) {
    await upsertLeadScore(data.email, data.sessionId, data.eventType, points);
  }
}
async function upsertLeadScore(email, sessionId, eventType, points) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(leadScores).where(eq(leadScores.email, email)).limit(1);
  if (existing.length > 0) {
    const current = existing[0];
    const newTotal = current.totalScore + points;
    const updates = {
      totalScore: newTotal,
      classification: classifyScore(newTotal),
      lastEventAt: /* @__PURE__ */ new Date(),
      sessionId
    };
    if (eventType === "page_view") updates.pageViewCount = sql`${leadScores.pageViewCount} + 1`;
    if (eventType === "form_submit" || eventType === "webinar_register" || eventType === "newsletter_subscribe" || eventType === "consultation_book") updates.formSubmitCount = sql`${leadScores.formSubmitCount} + 1`;
    if (eventType === "chatbot_message") updates.chatbotMessageCount = sql`${leadScores.chatbotMessageCount} + 1`;
    if (eventType === "download") updates.downloadCount = sql`${leadScores.downloadCount} + 1`;
    await db.update(leadScores).set(updates).where(eq(leadScores.email, email));
  } else {
    await db.insert(leadScores).values({
      email,
      sessionId,
      totalScore: points,
      classification: classifyScore(points),
      pageViewCount: eventType === "page_view" ? 1 : 0,
      formSubmitCount: ["form_submit", "webinar_register", "newsletter_subscribe", "consultation_book"].includes(eventType) ? 1 : 0,
      chatbotMessageCount: eventType === "chatbot_message" ? 1 : 0,
      downloadCount: eventType === "download" ? 1 : 0,
      lastEventAt: /* @__PURE__ */ new Date(),
      firstSeenAt: /* @__PURE__ */ new Date()
    });
  }
}
async function getLeadScores(opts = {}) {
  const db = await getDb();
  if (!db) return { leads: [], total: 0 };
  const { classification, limit = 50, offset = 0, search } = opts;
  const conditions = [];
  if (classification) conditions.push(eq(leadScores.classification, classification));
  if (search) conditions.push(sql`${leadScores.email} LIKE ${`%${search}%`}`);
  const where = conditions.length > 0 ? and(...conditions) : void 0;
  const leads = await db.select().from(leadScores).where(where).orderBy(desc(leadScores.totalScore)).limit(limit).offset(offset);
  const [total] = await db.select({ count: sql`count(*)` }).from(leadScores).where(where);
  return { leads, total: total?.count ?? 0 };
}
async function getLeadScoreStats() {
  const db = await getDb();
  if (!db) return { total: 0, hot: 0, warm: 0, cold: 0 };
  const [total, hot, warm, cold] = await Promise.all([
    db.select({ count: sql`count(*)` }).from(leadScores),
    db.select({ count: sql`count(*)` }).from(leadScores).where(eq(leadScores.classification, "hot")),
    db.select({ count: sql`count(*)` }).from(leadScores).where(eq(leadScores.classification, "warm")),
    db.select({ count: sql`count(*)` }).from(leadScores).where(eq(leadScores.classification, "cold"))
  ]);
  return {
    total: total[0]?.count ?? 0,
    hot: hot[0]?.count ?? 0,
    warm: warm[0]?.count ?? 0,
    cold: cold[0]?.count ?? 0
  };
}
async function getRecentVisitorEvents(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(visitorEvents).orderBy(desc(visitorEvents.createdAt)).limit(limit);
}
async function getConsultationTypes(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  const where = activeOnly ? eq(consultationTypes.isActive, true) : void 0;
  return db.select().from(consultationTypes).where(where).orderBy(consultationTypes.sortOrder);
}
async function getConsultationTypeById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const rows = await db.select().from(consultationTypes).where(eq(consultationTypes.id, id)).limit(1);
  return rows[0];
}
async function createConsultationType(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(consultationTypes).values(data);
  return result[0].insertId;
}
async function updateConsultationType(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(consultationTypes).set(data).where(eq(consultationTypes.id, id));
}
async function deleteConsultationType(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(consultationTypes).where(eq(consultationTypes.id, id));
}
async function getAllAvailabilitySlots() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(availabilitySlots).orderBy(availabilitySlots.dayOfWeek, availabilitySlots.startTime);
}
async function createAvailabilitySlot(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(availabilitySlots).values(data);
  return result[0].insertId;
}
async function updateAvailabilitySlot(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(availabilitySlots).set(data).where(eq(availabilitySlots.id, id));
}
async function deleteAvailabilitySlot(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(availabilitySlots).where(eq(availabilitySlots.id, id));
}
async function getBlockedDates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blockedDates).orderBy(blockedDates.date);
}
async function createBlockedDate(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blockedDates).values(data);
  return result[0].insertId;
}
async function deleteBlockedDate(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blockedDates).where(eq(blockedDates.id, id));
}
async function getBookingSettings() {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(bookingSettings).limit(1);
  return rows[0] ?? null;
}
async function updateBookingSettings(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bookingSettings).set(data).where(eq(bookingSettings.id, 1));
}
async function createAppointment(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(appointments).values(data);
  return result[0].insertId;
}
async function getAppointments(opts = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { status, date, email, limit = 50, offset = 0, upcoming } = opts;
  const conditions = [];
  if (status) conditions.push(eq(appointments.status, status));
  if (date) conditions.push(eq(appointments.date, date));
  if (email) conditions.push(eq(appointments.email, email));
  if (upcoming) {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    conditions.push(gte(appointments.date, today));
    conditions.push(
      or(
        eq(appointments.status, "pending"),
        eq(appointments.status, "confirmed")
      )
    );
  }
  const where = conditions.length > 0 ? and(...conditions) : void 0;
  const items = await db.select().from(appointments).where(where).orderBy(desc(appointments.createdAt), desc(appointments.date), desc(appointments.startTime)).limit(limit).offset(offset);
  const [total] = await db.select({ count: sql`count(*)` }).from(appointments).where(where);
  return { items, total: total?.count ?? 0 };
}
async function getAppointmentById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const rows = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
  return rows[0];
}
async function updateAppointment(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(appointments).set(data).where(eq(appointments.id, id));
}
async function getAvailableSlots(dateStr, durationMinutes) {
  const db = await getDb();
  if (!db) return [];
  const blocked = await db.select().from(blockedDates).where(eq(blockedDates.date, dateStr));
  if (blocked.length > 0) return [];
  const dateObj = /* @__PURE__ */ new Date(dateStr + "T00:00:00Z");
  const dayOfWeek = dateObj.getUTCDay();
  const windows = await db.select().from(availabilitySlots).where(and(eq(availabilitySlots.dayOfWeek, dayOfWeek), eq(availabilitySlots.isActive, true)));
  if (windows.length === 0) return [];
  const settings = await getBookingSettings();
  const bufferMinutes = settings?.bufferMinutes ?? 15;
  const maxDaily = settings?.maxDailyBookings ?? 8;
  const minAdvanceHours = settings?.minAdvanceHours ?? 24;
  const now = /* @__PURE__ */ new Date();
  const minBookTime = new Date(now.getTime() + minAdvanceHours * 60 * 60 * 1e3);
  const existingBookings = await db.select().from(appointments).where(and(
    eq(appointments.date, dateStr),
    or(
      eq(appointments.status, "pending"),
      eq(appointments.status, "confirmed")
    )
  ));
  if (existingBookings.length >= maxDaily) return [];
  const slots = [];
  for (const window of windows) {
    const [wStartH, wStartM] = window.startTime.split(":").map(Number);
    const [wEndH, wEndM] = window.endTime.split(":").map(Number);
    const windowStartMin = wStartH * 60 + wStartM;
    const windowEndMin = wEndH * 60 + wEndM;
    let cursor = windowStartMin;
    while (cursor + durationMinutes <= windowEndMin) {
      const slotStart = `${String(Math.floor(cursor / 60)).padStart(2, "0")}:${String(cursor % 60).padStart(2, "0")}`;
      const slotEndMin = cursor + durationMinutes;
      const slotEnd = `${String(Math.floor(slotEndMin / 60)).padStart(2, "0")}:${String(slotEndMin % 60).padStart(2, "0")}`;
      const slotDateTime = /* @__PURE__ */ new Date(`${dateStr}T${slotStart}:00`);
      if (slotDateTime <= minBookTime) {
        cursor += durationMinutes + bufferMinutes;
        continue;
      }
      const hasConflict = existingBookings.some((booking) => {
        const [bStartH, bStartM] = booking.startTime.split(":").map(Number);
        const [bEndH, bEndM] = booking.endTime.split(":").map(Number);
        const bStartMin = bStartH * 60 + bStartM;
        const bEndMin = bEndH * 60 + bEndM + bufferMinutes;
        const sStartMin = cursor;
        const sEndMin = cursor + durationMinutes;
        return sStartMin < bEndMin && sEndMin > bStartMin;
      });
      if (!hasConflict) {
        slots.push({ startTime: slotStart, endTime: slotEnd });
      }
      cursor += durationMinutes + bufferMinutes;
    }
  }
  return slots;
}
async function getAvailableDates(year, month, durationMinutes) {
  const availableDates = [];
  const settings = await getBookingSettings();
  const maxAdvanceDays = settings?.maxAdvanceDays ?? 30;
  const now = /* @__PURE__ */ new Date();
  const maxDate = new Date(now.getTime() + maxAdvanceDays * 24 * 60 * 60 * 1e3);
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dateObj = /* @__PURE__ */ new Date(dateStr + "T23:59:59Z");
    if (dateObj < now || dateObj > maxDate) continue;
    const slots = await getAvailableSlots(dateStr, durationMinutes);
    if (slots.length > 0) {
      availableDates.push(dateStr);
    }
  }
  return availableDates;
}
async function getAppointmentStats() {
  const db = await getDb();
  if (!db) return { total: 0, upcoming: 0, completed: 0, cancelled: 0, noShow: 0, todayCount: 0 };
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const [total, upcoming, completed, cancelled, noShow, todayCount] = await Promise.all([
    db.select({ count: sql`count(*)` }).from(appointments),
    db.select({ count: sql`count(*)` }).from(appointments).where(and(gte(appointments.date, today), or(eq(appointments.status, "pending"), eq(appointments.status, "confirmed")))),
    db.select({ count: sql`count(*)` }).from(appointments).where(eq(appointments.status, "completed")),
    db.select({ count: sql`count(*)` }).from(appointments).where(eq(appointments.status, "cancelled")),
    db.select({ count: sql`count(*)` }).from(appointments).where(eq(appointments.status, "no_show")),
    db.select({ count: sql`count(*)` }).from(appointments).where(eq(appointments.date, today))
  ]);
  return {
    total: total[0]?.count ?? 0,
    upcoming: upcoming[0]?.count ?? 0,
    completed: completed[0]?.count ?? 0,
    cancelled: cancelled[0]?.count ?? 0,
    noShow: noShow[0]?.count ?? 0,
    todayCount: todayCount[0]?.count ?? 0
  };
}
async function getPopularTimeSlots() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    startTime: appointments.startTime,
    count: sql`count(*)`
  }).from(appointments).groupBy(appointments.startTime).orderBy(sql`count(*) DESC`).limit(10);
  return result;
}
async function createDeal(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(deals).values(data);
  return result[0].insertId;
}
async function getDeals(opts = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { limit = 200, offset = 0, stage, search, product } = opts;
  const conditions = [];
  if (stage) conditions.push(eq(deals.stage, stage));
  if (product) conditions.push(eq(deals.product, product));
  if (search) {
    conditions.push(or(
      like(deals.title, `%${search}%`),
      like(deals.product, `%${search}%`),
      like(deals.notes, `%${search}%`)
    ));
  }
  const where = conditions.length > 0 ? and(...conditions) : void 0;
  const items = await db.select().from(deals).where(where).orderBy(desc(deals.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql`count(*)` }).from(deals).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}
async function getDealById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(deals).where(eq(deals.id, id)).limit(1);
  return result[0];
}
async function updateDeal(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(deals).set(data).where(eq(deals.id, id));
}
async function deleteDeal(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(deals).where(eq(deals.id, id));
}
async function getDealStats() {
  const db = await getDb();
  if (!db) return { total: 0, byStage: [], totalValue: 0, weightedValue: 0, byProduct: [] };
  const totalResult = await db.select({ count: sql`count(*)` }).from(deals);
  const byStage = await db.select({
    stage: deals.stage,
    count: sql`count(*)`,
    totalValue: sql`COALESCE(SUM(value), 0)`,
    weightedValue: sql`COALESCE(SUM(value * probability / 100), 0)`
  }).from(deals).groupBy(deals.stage);
  const totalValueResult = await db.select({
    totalValue: sql`COALESCE(SUM(value), 0)`,
    weightedValue: sql`COALESCE(SUM(value * probability / 100), 0)`
  }).from(deals).where(sql`${deals.stage} NOT IN ('won', 'lost')`);
  const byProduct = await db.select({
    product: deals.product,
    count: sql`count(*)`,
    totalValue: sql`COALESCE(SUM(value), 0)`
  }).from(deals).where(sql`${deals.product} IS NOT NULL`).groupBy(deals.product);
  return {
    total: totalResult[0]?.count ?? 0,
    byStage,
    totalValue: totalValueResult[0]?.totalValue ?? 0,
    weightedValue: totalValueResult[0]?.weightedValue ?? 0,
    byProduct
  };
}
async function getCompanyById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
  return result[0];
}
async function getCompanyContacts(companyName) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contacts).where(eq(contacts.company, companyName)).orderBy(desc(contacts.createdAt));
}
async function getCompanyDeals(companyId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(deals).where(eq(deals.companyId, companyId)).orderBy(desc(deals.createdAt));
}
async function getCustomProperties(entityType) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customProperties).where(eq(customProperties.entityType, entityType)).orderBy(customProperties.sortOrder, customProperties.createdAt);
}
async function createCustomProperty(data) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.insert(customProperties).values(data);
  return Number(result[0].insertId);
}
async function updateCustomProperty(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(customProperties).set(data).where(eq(customProperties.id, id));
}
async function deleteCustomProperty(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(customPropertyValues).where(eq(customPropertyValues.propertyId, id));
  await db.delete(customProperties).where(eq(customProperties.id, id));
}
async function getPropertyValues(entityType, entityId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customPropertyValues).where(and(
    eq(customPropertyValues.entityType, entityType),
    eq(customPropertyValues.entityId, entityId)
  ));
}
async function setPropertyValue(propertyId, entityType, entityId, value) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(customPropertyValues).where(and(
    eq(customPropertyValues.propertyId, propertyId),
    eq(customPropertyValues.entityType, entityType),
    eq(customPropertyValues.entityId, entityId)
  ));
  if (existing.length > 0) {
    await db.update(customPropertyValues).set({ value }).where(eq(customPropertyValues.id, existing[0].id));
  } else {
    await db.insert(customPropertyValues).values({ propertyId, entityType, entityId, value });
  }
}
async function setBulkPropertyValues(entityType, entityId, values) {
  const db = await getDb();
  if (!db) return;
  for (const v of values) {
    await setPropertyValue(v.propertyId, entityType, entityId, v.value);
  }
}
var _db, EVENT_POINTS;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    init_schema();
    init_schema();
    _db = null;
    EVENT_POINTS = {
      page_view: 1,
      cta_click: 3,
      form_start: 5,
      form_submit: 15,
      chatbot_open: 3,
      chatbot_message: 5,
      download: 10,
      video_play: 5,
      pricing_view: 8,
      emergency_select: 20,
      webinar_register: 20,
      newsletter_subscribe: 10,
      consultation_book: 25
    };
  }
});

// server/emailCampaignDb.ts
import { drizzle as drizzle2 } from "drizzle-orm/mysql2";
import { eq as eq2, desc as desc2, asc, like as like2, and as and2, sql as sql2, count } from "drizzle-orm";
async function getDb2() {
  if (!_db2 && process.env.DATABASE_URL) {
    try {
      _db2 = drizzle2(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[EmailCampaignDB] Failed to connect:", error);
      _db2 = null;
    }
  }
  return _db2;
}
async function getCampaigns(opts = {}) {
  const db = await getDb2();
  if (!db) return { items: [], total: 0 };
  const conditions = [];
  if (opts.status) conditions.push(eq2(campaigns.status, opts.status));
  if (opts.search) conditions.push(like2(campaigns.name, `%${opts.search}%`));
  const where = conditions.length > 0 ? and2(...conditions) : void 0;
  const [items, totalResult] = await Promise.all([
    db.select().from(campaigns).where(where).orderBy(desc2(campaigns.createdAt)).limit(opts.limit ?? 50).offset(opts.offset ?? 0),
    db.select({ count: count() }).from(campaigns).where(where)
  ]);
  return { items, total: totalResult[0]?.count ?? 0 };
}
async function getCampaignById(id) {
  const db = await getDb2();
  if (!db) return null;
  const [campaign] = await db.select().from(campaigns).where(eq2(campaigns.id, id)).limit(1);
  return campaign ?? null;
}
async function createCampaign(data) {
  const db = await getDb2();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(campaigns).values(data);
  return result.insertId;
}
async function updateCampaign(id, data) {
  const db = await getDb2();
  if (!db) return;
  await db.update(campaigns).set(data).where(eq2(campaigns.id, id));
}
async function deleteCampaign(id) {
  const db = await getDb2();
  if (!db) return;
  await db.delete(campaignRecipients).where(eq2(campaignRecipients.campaignId, id));
  await db.delete(campaignEvents).where(eq2(campaignEvents.campaignId, id));
  await db.delete(campaigns).where(eq2(campaigns.id, id));
}
async function duplicateCampaign(id) {
  const db = await getDb2();
  if (!db) throw new Error("Database not available");
  const original = await getCampaignById(id);
  if (!original) throw new Error("Campaign not found");
  const { id: _id, createdAt, updatedAt, sentAt, scheduledAt, status, totalSent, totalOpened, totalClicked, totalBounced, totalUnsubscribed, ...rest } = original;
  const [result] = await db.insert(campaigns).values({
    ...rest,
    name: `${rest.name} (Copy)`,
    status: "draft"
  });
  return result.insertId;
}
async function addCampaignRecipients(campaignId, recipients) {
  const db = await getDb2();
  if (!db) return;
  if (recipients.length === 0) return;
  const values = recipients.map((r) => ({ campaignId, contactId: r.contactId, email: r.email, status: "pending" }));
  await db.insert(campaignRecipients).values(values);
  await db.update(campaigns).set({ recipientCount: recipients.length }).where(eq2(campaigns.id, campaignId));
}
async function getCampaignRecipients(campaignId, opts = {}) {
  const db = await getDb2();
  if (!db) return [];
  return db.select().from(campaignRecipients).where(eq2(campaignRecipients.campaignId, campaignId)).limit(opts.limit ?? 100).offset(opts.offset ?? 0);
}
async function recordCampaignEvent(data) {
  const db = await getDb2();
  if (!db) return;
  await db.insert(campaignEvents).values(data);
  const statField = data.type === "open" ? "totalOpened" : data.type === "click" ? "totalClicked" : data.type === "bounce" ? "totalBounced" : data.type === "unsubscribe" ? "totalUnsubscribed" : null;
  if (statField) {
    await db.update(campaigns).set({ [statField]: sql2`${campaigns[statField]} + 1` }).where(eq2(campaigns.id, data.campaignId));
  }
}
async function getCampaignEvents(campaignId, opts = {}) {
  const db = await getDb2();
  if (!db) return [];
  const conditions = [eq2(campaignEvents.campaignId, campaignId)];
  if (opts.type) conditions.push(eq2(campaignEvents.type, opts.type));
  return db.select().from(campaignEvents).where(and2(...conditions)).orderBy(desc2(campaignEvents.createdAt)).limit(opts.limit ?? 200);
}
async function getEmailTemplates(opts = {}) {
  const db = await getDb2();
  if (!db) return [];
  const conditions = [];
  if (opts.category) conditions.push(eq2(emailTemplates.category, opts.category));
  if (opts.search) conditions.push(like2(emailTemplates.name, `%${opts.search}%`));
  const where = conditions.length > 0 ? and2(...conditions) : void 0;
  return db.select().from(emailTemplates).where(where).orderBy(desc2(emailTemplates.updatedAt));
}
async function getEmailTemplateById(id) {
  const db = await getDb2();
  if (!db) return null;
  const [template] = await db.select().from(emailTemplates).where(eq2(emailTemplates.id, id)).limit(1);
  return template ?? null;
}
async function createEmailTemplate(data) {
  const db = await getDb2();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(emailTemplates).values(data);
  return result.insertId;
}
async function updateEmailTemplate(id, data) {
  const db = await getDb2();
  if (!db) return;
  await db.update(emailTemplates).set(data).where(eq2(emailTemplates.id, id));
}
async function deleteEmailTemplate(id) {
  const db = await getDb2();
  if (!db) return;
  await db.delete(emailTemplates).where(eq2(emailTemplates.id, id));
}
async function getContactLists(opts = {}) {
  const db = await getDb2();
  if (!db) return [];
  const conditions = [];
  if (opts.search) conditions.push(like2(contactLists.name, `%${opts.search}%`));
  const where = conditions.length > 0 ? and2(...conditions) : void 0;
  return db.select().from(contactLists).where(where).orderBy(desc2(contactLists.updatedAt));
}
async function getContactListById(id) {
  const db = await getDb2();
  if (!db) return null;
  const [list] = await db.select().from(contactLists).where(eq2(contactLists.id, id)).limit(1);
  return list ?? null;
}
async function createContactList(data) {
  const db = await getDb2();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(contactLists).values(data);
  return result.insertId;
}
async function updateContactList(id, data) {
  const db = await getDb2();
  if (!db) return;
  await db.update(contactLists).set(data).where(eq2(contactLists.id, id));
}
async function deleteContactList(id) {
  const db = await getDb2();
  if (!db) return;
  await db.delete(listMembers).where(eq2(listMembers.listId, id));
  await db.delete(contactLists).where(eq2(contactLists.id, id));
}
async function addListMembers(listId, contactIds) {
  const db = await getDb2();
  if (!db) return;
  if (contactIds.length === 0) return;
  const values = contactIds.map((contactId) => ({ listId, contactId }));
  await db.insert(listMembers).values(values);
  const [countResult] = await db.select({ count: count() }).from(listMembers).where(eq2(listMembers.listId, listId));
  await db.update(contactLists).set({ memberCount: countResult?.count ?? 0 }).where(eq2(contactLists.id, listId));
}
async function removeListMember(listId, contactId) {
  const db = await getDb2();
  if (!db) return;
  await db.delete(listMembers).where(and2(eq2(listMembers.listId, listId), eq2(listMembers.contactId, contactId)));
  const [countResult] = await db.select({ count: count() }).from(listMembers).where(eq2(listMembers.listId, listId));
  await db.update(contactLists).set({ memberCount: countResult?.count ?? 0 }).where(eq2(contactLists.id, listId));
}
async function getListMembers(listId) {
  const db = await getDb2();
  if (!db) return [];
  return db.select({
    listMember: listMembers,
    contact: contacts
  }).from(listMembers).innerJoin(contacts, eq2(listMembers.contactId, contacts.id)).where(eq2(listMembers.listId, listId)).orderBy(desc2(listMembers.addedAt));
}
async function getContactTags() {
  const db = await getDb2();
  if (!db) return [];
  return db.select().from(contactTags).orderBy(asc(contactTags.name));
}
async function createContactTag(data) {
  const db = await getDb2();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(contactTags).values(data);
  return result.insertId;
}
async function deleteContactTag(id) {
  const db = await getDb2();
  if (!db) return;
  await db.delete(contactTagAssignments).where(eq2(contactTagAssignments.tagId, id));
  await db.delete(contactTags).where(eq2(contactTags.id, id));
}
async function assignTagToContact(contactId, tagId) {
  const db = await getDb2();
  if (!db) return;
  await db.insert(contactTagAssignments).values({ contactId, tagId });
}
async function removeTagFromContact(contactId, tagId) {
  const db = await getDb2();
  if (!db) return;
  await db.delete(contactTagAssignments).where(and2(eq2(contactTagAssignments.contactId, contactId), eq2(contactTagAssignments.tagId, tagId)));
}
async function getContactTagAssignments(contactId) {
  const db = await getDb2();
  if (!db) return [];
  return db.select({
    assignment: contactTagAssignments,
    tag: contactTags
  }).from(contactTagAssignments).innerJoin(contactTags, eq2(contactTagAssignments.tagId, contactTags.id)).where(eq2(contactTagAssignments.contactId, contactId));
}
async function getContactNotes(contactId) {
  const db = await getDb2();
  if (!db) return [];
  return db.select().from(contactNotes).where(eq2(contactNotes.contactId, contactId)).orderBy(desc2(contactNotes.createdAt));
}
async function createContactNote(data) {
  const db = await getDb2();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(contactNotes).values(data);
  return result.insertId;
}
async function deleteContactNote(id) {
  const db = await getDb2();
  if (!db) return;
  await db.delete(contactNotes).where(eq2(contactNotes.id, id));
}
async function getContactTasks(contactId) {
  const db = await getDb2();
  if (!db) return [];
  return db.select().from(contactTasks).where(eq2(contactTasks.contactId, contactId)).orderBy(desc2(contactTasks.createdAt));
}
async function getAllTasks(opts = {}) {
  const db = await getDb2();
  if (!db) return [];
  const conditions = [];
  if (opts.status) conditions.push(eq2(contactTasks.status, opts.status));
  if (opts.priority) conditions.push(eq2(contactTasks.priority, opts.priority));
  const where = conditions.length > 0 ? and2(...conditions) : void 0;
  return db.select().from(contactTasks).where(where).orderBy(desc2(contactTasks.createdAt)).limit(opts.limit ?? 100);
}
async function createContactTask(data) {
  const db = await getDb2();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(contactTasks).values(data);
  return result.insertId;
}
async function updateContactTask(id, data) {
  const db = await getDb2();
  if (!db) return;
  await db.update(contactTasks).set(data).where(eq2(contactTasks.id, id));
}
async function deleteContactTask(id) {
  const db = await getDb2();
  if (!db) return;
  await db.delete(contactTasks).where(eq2(contactTasks.id, id));
}
async function getDeals2(opts = {}) {
  const db = await getDb2();
  if (!db) return [];
  const conditions = [];
  if (opts.companyId) conditions.push(eq2(deals.companyId, opts.companyId));
  if (opts.stage) conditions.push(eq2(deals.stage, opts.stage));
  if (opts.search) conditions.push(like2(deals.title, `%${opts.search}%`));
  const where = conditions.length > 0 ? and2(...conditions) : void 0;
  return db.select().from(deals).where(where).orderBy(desc2(deals.createdAt)).limit(opts.limit ?? 100);
}
async function getDealById2(id) {
  const db = await getDb2();
  if (!db) return null;
  const [deal] = await db.select().from(deals).where(eq2(deals.id, id)).limit(1);
  return deal ?? null;
}
async function createDeal2(data) {
  const db = await getDb2();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(deals).values(data);
  return result.insertId;
}
async function updateDeal2(id, data) {
  const db = await getDb2();
  if (!db) return;
  await db.update(deals).set(data).where(eq2(deals.id, id));
}
async function deleteDeal2(id) {
  const db = await getDb2();
  if (!db) return;
  await db.delete(deals).where(eq2(deals.id, id));
}
async function getDealStats2() {
  const db = await getDb2();
  if (!db) return { total: 0, totalValue: 0, byStage: [] };
  const [totalResult] = await db.select({ count: count(), totalValue: sql2`COALESCE(SUM(${deals.value}), 0)` }).from(deals);
  const byStage = await db.select({ stage: deals.stage, count: count(), value: sql2`COALESCE(SUM(${deals.value}), 0)` }).from(deals).groupBy(deals.stage);
  return { total: totalResult?.count ?? 0, totalValue: totalResult?.totalValue ?? 0, byStage };
}
async function getAutomations(opts = {}) {
  const db = await getDb2();
  if (!db) return [];
  const conditions = [];
  if (opts.status) conditions.push(eq2(automations.status, opts.status));
  const where = conditions.length > 0 ? and2(...conditions) : void 0;
  return db.select().from(automations).where(where).orderBy(desc2(automations.createdAt));
}
async function getAutomationById(id) {
  const db = await getDb2();
  if (!db) return null;
  const [automation] = await db.select().from(automations).where(eq2(automations.id, id)).limit(1);
  return automation ?? null;
}
async function createAutomation(data) {
  const db = await getDb2();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(automations).values(data);
  return result.insertId;
}
async function updateAutomation(id, data) {
  const db = await getDb2();
  if (!db) return;
  await db.update(automations).set(data).where(eq2(automations.id, id));
}
async function deleteAutomation(id) {
  const db = await getDb2();
  if (!db) return;
  await db.delete(automationEnrollments).where(eq2(automationEnrollments.automationId, id));
  await db.delete(automationSteps).where(eq2(automationSteps.automationId, id));
  await db.delete(automations).where(eq2(automations.id, id));
}
async function getAutomationSteps(automationId) {
  const db = await getDb2();
  if (!db) return [];
  return db.select().from(automationSteps).where(eq2(automationSteps.automationId, automationId)).orderBy(asc(automationSteps.stepOrder));
}
async function setAutomationSteps(automationId, steps) {
  const db = await getDb2();
  if (!db) return;
  await db.delete(automationSteps).where(eq2(automationSteps.automationId, automationId));
  if (steps.length > 0) {
    await db.insert(automationSteps).values(steps.map((s, i) => ({ ...s, automationId, stepOrder: i + 1 })));
  }
}
async function getDailyEmailDrafts(opts = {}) {
  const db = await getDb2();
  if (!db) return [];
  const conditions = [];
  if (opts.status) conditions.push(eq2(dailyEmailDrafts.status, opts.status));
  const where = conditions.length > 0 ? and2(...conditions) : void 0;
  return db.select().from(dailyEmailDrafts).where(where).orderBy(desc2(dailyEmailDrafts.createdAt)).limit(opts.limit ?? 30);
}
async function getDailyEmailDraftById(id) {
  const db = await getDb2();
  if (!db) return null;
  const [draft] = await db.select().from(dailyEmailDrafts).where(eq2(dailyEmailDrafts.id, id)).limit(1);
  return draft ?? null;
}
async function updateDailyEmailDraft(id, data) {
  const db = await getDb2();
  if (!db) return;
  await db.update(dailyEmailDrafts).set(data).where(eq2(dailyEmailDrafts.id, id));
}
async function getContentSources() {
  const db = await getDb2();
  if (!db) return [];
  return db.select().from(contentSources).orderBy(desc2(contentSources.createdAt));
}
async function createContentSource(data) {
  const db = await getDb2();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(contentSources).values(data);
  return result.insertId;
}
async function updateContentSource(id, data) {
  const db = await getDb2();
  if (!db) return;
  await db.update(contentSources).set(data).where(eq2(contentSources.id, id));
}
async function deleteContentSource(id) {
  const db = await getDb2();
  if (!db) return;
  await db.delete(contentSources).where(eq2(contentSources.id, id));
}
async function getEmailSettings() {
  const db = await getDb2();
  if (!db) return [];
  return db.select().from(emailSettings).orderBy(asc(emailSettings.settingKey));
}
async function getEmailSetting(key) {
  const db = await getDb2();
  if (!db) return null;
  const [setting] = await db.select().from(emailSettings).where(eq2(emailSettings.settingKey, key)).limit(1);
  return setting?.settingValue ?? null;
}
async function setEmailSetting(key, value) {
  const db = await getDb2();
  if (!db) return;
  const existing = await getEmailSetting(key);
  if (existing !== null) {
    await db.update(emailSettings).set({ settingValue: value }).where(eq2(emailSettings.settingKey, key));
  } else {
    await db.insert(emailSettings).values({ settingKey: key, settingValue: value });
  }
}
async function getCampaignAnalytics() {
  const db = await getDb2();
  if (!db) return { totalSent: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0, totalUnsubscribed: 0, campaignCount: 0 };
  const [result] = await db.select({
    campaignCount: count(),
    totalSent: sql2`COALESCE(SUM(${campaigns.totalSent}), 0)`,
    totalOpened: sql2`COALESCE(SUM(${campaigns.totalOpened}), 0)`,
    totalClicked: sql2`COALESCE(SUM(${campaigns.totalClicked}), 0)`,
    totalBounced: sql2`COALESCE(SUM(${campaigns.totalBounced}), 0)`,
    totalUnsubscribed: sql2`COALESCE(SUM(${campaigns.totalUnsubscribed}), 0)`
  }).from(campaigns).where(eq2(campaigns.status, "sent"));
  return result ?? { totalSent: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0, totalUnsubscribed: 0, campaignCount: 0 };
}
async function getContactListsForSelect() {
  const db = await getDb2();
  if (!db) return [];
  return db.select({ id: contactLists.id, name: contactLists.name, memberCount: contactLists.memberCount }).from(contactLists).orderBy(asc(contactLists.name));
}
var _db2;
var init_emailCampaignDb = __esm({
  "server/emailCampaignDb.ts"() {
    "use strict";
    init_schema();
    _db2 = null;
  }
});

// server/sendgridService.ts
var sendgridService_exports = {};
__export(sendgridService_exports, {
  processWebhookEvents: () => processWebhookEvents,
  sendCampaign: () => sendCampaign,
  sendSingleEmail: () => sendSingleEmail,
  sendTestEmail: () => sendTestEmail,
  verifyApiKey: () => verifyApiKey
});
import sgMail from "@sendgrid/mail";
import sgClient from "@sendgrid/client";
import { eq as eq3, and as and3 } from "drizzle-orm";
function wrapHtmlContent(html, previewText) {
  const previewHtml = previewText ? `<div style="display:none;font-size:1px;color:#f5f7fa;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title></title>
</head>
<body style="margin:0;padding:0;background-color:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">
  ${previewHtml}
  ${html}
  <div style="text-align:center;padding:20px;font-size:12px;color:#999;">
    <p>You received this email from Sponsor ComplIANS.</p>
    <p><a href="{{{unsubscribe}}}" style="color:#999;">Unsubscribe</a> | <a href="{{{unsubscribe_preferences}}}" style="color:#999;">Manage Preferences</a></p>
  </div>
</body>
</html>`;
}
function personaliseContent(html, recipient) {
  return html.replace(/\{\{first_name\}\}/gi, recipient.firstName || "there").replace(/\{\{last_name\}\}/gi, recipient.lastName || "").replace(/\{\{company\}\}/gi, recipient.company || "").replace(/\{\{email\}\}/gi, recipient.email || "").replace(/\{\{full_name\}\}/gi, `${recipient.firstName || ""} ${recipient.lastName || ""}`.trim() || "there");
}
async function sendSingleEmail(opts) {
  if (!SENDGRID_API_KEY) {
    return { success: false, error: "SendGrid API key not configured" };
  }
  try {
    const [response] = await sgMail.send({
      to: opts.to,
      from: { email: opts.fromEmail, name: opts.fromName },
      replyTo: opts.replyTo ? { email: opts.replyTo } : void 0,
      subject: opts.subject,
      html: opts.htmlContent
    });
    return {
      success: response.statusCode >= 200 && response.statusCode < 300,
      messageId: response.headers["x-message-id"]
    };
  } catch (err) {
    console.error("[SendGrid] Single email error:", err?.response?.body || err.message);
    return { success: false, error: err?.response?.body?.errors?.[0]?.message || err.message };
  }
}
async function sendCampaign(opts) {
  if (!SENDGRID_API_KEY) {
    return { success: false, totalSent: 0, totalFailed: opts.recipients.length, errors: ["SendGrid API key not configured"] };
  }
  const db = await getDb();
  if (!db) {
    return { success: false, totalSent: 0, totalFailed: opts.recipients.length, errors: ["Database not available"] };
  }
  await db.update(campaigns).set({ status: "sending" }).where(eq3(campaigns.id, opts.campaignId));
  const wrappedHtml = wrapHtmlContent(opts.htmlContent, opts.previewText);
  const BATCH_SIZE = 1e3;
  let totalSent = 0;
  let totalFailed = 0;
  const errors = [];
  for (let i = 0; i < opts.recipients.length; i += BATCH_SIZE) {
    const batch = opts.recipients.slice(i, i + BATCH_SIZE);
    const messages = batch.map((recipient) => ({
      to: { email: recipient.email, name: `${recipient.firstName || ""} ${recipient.lastName || ""}`.trim() || void 0 },
      from: { email: opts.fromEmail, name: opts.fromName },
      replyTo: opts.replyTo ? { email: opts.replyTo } : void 0,
      subject: opts.subject,
      html: personaliseContent(wrappedHtml, recipient),
      customArgs: {
        campaign_id: String(opts.campaignId),
        contact_id: String(recipient.contactId)
      },
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      }
    }));
    try {
      await sgMail.send(messages);
      for (const recipient of batch) {
        await db.update(campaignRecipients).set({ status: "sent", sentAt: /* @__PURE__ */ new Date() }).where(
          and3(
            eq3(campaignRecipients.campaignId, opts.campaignId),
            eq3(campaignRecipients.contactId, recipient.contactId)
          )
        );
      }
      totalSent += batch.length;
    } catch (err) {
      console.error(`[SendGrid] Batch send error (batch ${Math.floor(i / BATCH_SIZE) + 1}):`, err?.response?.body || err.message);
      const errorMsg = err?.response?.body?.errors?.[0]?.message || err.message;
      errors.push(errorMsg);
      for (const recipient of batch) {
        await db.update(campaignRecipients).set({ status: "failed" }).where(
          and3(
            eq3(campaignRecipients.campaignId, opts.campaignId),
            eq3(campaignRecipients.contactId, recipient.contactId)
          )
        );
      }
      totalFailed += batch.length;
    }
    if (i + BATCH_SIZE < opts.recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  const finalStatus = totalFailed === opts.recipients.length ? "draft" : "sent";
  await db.update(campaigns).set({
    status: finalStatus,
    sentAt: /* @__PURE__ */ new Date(),
    totalSent
  }).where(eq3(campaigns.id, opts.campaignId));
  return {
    success: totalSent > 0,
    totalSent,
    totalFailed,
    errors
  };
}
async function sendTestEmail(opts) {
  const wrappedHtml = wrapHtmlContent(opts.htmlContent, opts.previewText);
  return sendSingleEmail({
    to: opts.to,
    subject: `[TEST] ${opts.subject}`,
    htmlContent: wrappedHtml,
    fromName: opts.fromName,
    fromEmail: opts.fromEmail
  });
}
async function processWebhookEvents(events) {
  let processed = 0;
  let errorCount = 0;
  for (const event of events) {
    try {
      const campaignId = event.campaign_id ? parseInt(event.campaign_id) : null;
      const contactId = event.contact_id ? parseInt(event.contact_id) : null;
      if (!campaignId || !contactId) {
        continue;
      }
      let eventType = null;
      const metadata = {};
      switch (event.event) {
        case "open":
          eventType = "open";
          metadata.userAgent = event.useragent;
          metadata.ip = event.ip;
          break;
        case "click":
          eventType = "click";
          metadata.url = event.url;
          metadata.userAgent = event.useragent;
          metadata.ip = event.ip;
          break;
        case "bounce":
        case "dropped":
          eventType = "bounce";
          metadata.reason = event.reason;
          metadata.status = event.status;
          metadata.type = event.type;
          const db1 = await getDb();
          if (db1) {
            await db1.update(campaignRecipients).set({ status: "bounced" }).where(
              and3(
                eq3(campaignRecipients.campaignId, campaignId),
                eq3(campaignRecipients.contactId, contactId)
              )
            );
          }
          break;
        case "unsubscribe":
        case "group_unsubscribe":
          eventType = "unsubscribe";
          break;
        case "spamreport":
          eventType = "complaint";
          break;
        case "delivered":
          const db2 = await getDb();
          if (db2) {
            await db2.update(campaignRecipients).set({ status: "delivered" }).where(
              and3(
                eq3(campaignRecipients.campaignId, campaignId),
                eq3(campaignRecipients.contactId, contactId)
              )
            );
          }
          processed++;
          continue;
        default:
          continue;
      }
      if (eventType) {
        await recordCampaignEvent({
          campaignId,
          contactId,
          type: eventType,
          metadata
        });
        processed++;
      }
    } catch (err) {
      console.error("[SendGrid Webhook] Error processing event:", err);
      errorCount++;
    }
  }
  return { processed, errors: errorCount };
}
async function verifyApiKey() {
  if (!SENDGRID_API_KEY) {
    return { valid: false, error: "SendGrid API key not configured" };
  }
  try {
    const [response, body] = await sgClient.request({
      url: "/v3/scopes",
      method: "GET"
    });
    return {
      valid: response.statusCode === 200,
      scopes: body?.scopes
    };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}
var SENDGRID_API_KEY;
var init_sendgridService = __esm({
  "server/sendgridService.ts"() {
    "use strict";
    init_emailCampaignDb();
    init_db();
    init_schema();
    SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
    if (SENDGRID_API_KEY) {
      sgMail.setApiKey(SENDGRID_API_KEY);
      sgClient.setApiKey(SENDGRID_API_KEY);
    }
  }
});

// server/email.ts
var email_exports = {};
__export(email_exports, {
  notifyContactFormSubmission: () => notifyContactFormSubmission,
  notifyWebinarRegistration: () => notifyWebinarRegistration,
  sendEmailNotification: () => sendEmailNotification,
  sendVideoReleaseEmail: () => sendVideoReleaseEmail
});
import nodemailer from "nodemailer";
function getTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
  }
  return transporter;
}
async function sendEmailNotification(notification) {
  const transport = getTransporter();
  if (!transport) {
    console.warn("[Email] SMTP not configured \u2014 skipping email notification. Set SMTP_HOST, SMTP_USER, SMTP_PASS to enable.");
    return false;
  }
  try {
    await transport.sendMail({
      from: SMTP_FROM,
      to: ADMIN_EMAIL,
      subject: notification.subject,
      html: notification.html,
      text: notification.text
    });
    console.log(`[Email] Notification sent: ${notification.subject}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send notification:", error);
    return false;
  }
}
async function notifyWebinarRegistration(data) {
  const eventLabels = {
    "25-march-webinar": "25 March Webinar \u2014 Sponsor Licence Compliance",
    "hub-launch": "Sponsor ComplIANS Hub Launch",
    "new-website-launch": "New Website Launch",
    "sponsorship-files-launch": "The Sponsorship Files Podcast Launch"
  };
  const eventName = eventLabels[data.eventSlug] || data.eventSlug;
  return sendEmailNotification({
    subject: `\u{1F393} New Webinar Registration \u2014 ${eventName}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1B2A; color: #fff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1B3A5C, #0D1B2A); padding: 24px 32px;">
          <h1 style="margin: 0; font-size: 20px; color: #00C3FF;">New Webinar Registration</h1>
          <p style="margin: 4px 0 0; color: #8B9EB7; font-size: 14px;">${eventName}</p>
        </div>
        <div style="padding: 24px 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px; width: 140px;">Name</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.fullName}</td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Email</td><td style="padding: 8px 0; color: #00C3FF; font-size: 14px;"><a href="mailto:${data.email}" style="color: #00C3FF; text-decoration: none;">${data.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Company</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.companyName || "\u2014"}</td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Sponsored Workers</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.sponsoredWorkers || "\u2014"}</td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Sponsor Licence</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.hasSponsorLicence || "\u2014"}</td></tr>
          </table>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.1); color: #5A7A9A; font-size: 12px;">
          Sponsor ComplIANS \u2014 Automated Notification
        </div>
      </div>
    `,
    text: `New Webinar Registration \u2014 ${eventName}

Name: ${data.fullName}
Email: ${data.email}
Company: ${data.companyName || "N/A"}
Sponsored Workers: ${data.sponsoredWorkers || "N/A"}
Sponsor Licence: ${data.hasSponsorLicence || "N/A"}`
  });
}
async function notifyContactFormSubmission(data) {
  return sendEmailNotification({
    subject: `\u{1F4E9} New Contact Form \u2014 ${data.firstName} ${data.lastName}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1B2A; color: #fff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1B3A5C, #0D1B2A); padding: 24px 32px;">
          <h1 style="margin: 0; font-size: 20px; color: #00C3FF;">New Contact Form Submission</h1>
          <p style="margin: 4px 0 0; color: #8B9EB7; font-size: 14px;">${data.subject || "General Enquiry"}</p>
        </div>
        <div style="padding: 24px 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px; width: 140px;">Name</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.firstName} ${data.lastName}</td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Email</td><td style="padding: 8px 0; color: #00C3FF; font-size: 14px;"><a href="mailto:${data.email}" style="color: #00C3FF; text-decoration: none;">${data.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Phone</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.phone || "\u2014"}</td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Company</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.company || "\u2014"}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <p style="margin: 0 0 8px; color: #8B9EB7; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
            <p style="margin: 0; color: #fff; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.1); color: #5A7A9A; font-size: 12px;">
          Sponsor ComplIANS \u2014 Automated Notification
        </div>
      </div>
    `,
    text: `New Contact Form Submission

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || "N/A"}
Company: ${data.company || "N/A"}
Subject: ${data.subject || "N/A"}

Message:
${data.message}`
  });
}
async function sendVideoReleaseEmail(data) {
  const transport = getTransporter();
  if (!transport) {
    console.warn("[Email] SMTP not configured \u2014 skipping video release email.");
    return false;
  }
  try {
    await transport.sendMail({
      from: SMTP_FROM,
      to: data.email,
      subject: "\u{1F3AC} Your Hub Product Tour is Ready \u2014 Sponsor ComplIANS",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1B2A; color: #fff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1B3A5C, #0D1B2A); padding: 32px;">
            <h1 style="margin: 0; font-size: 24px; color: #00C3FF;">The Hub Product Tour is Live</h1>
            <p style="margin: 8px 0 0; color: #8B9EB7; font-size: 15px;">You signed up for early access \u2014 here it is.</p>
          </div>
          <div style="padding: 32px;">
            <p style="color: #CBD5E1; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
              We've just published the Sponsor ComplIANS Hub product tour. As an early access subscriber, you're the first to see it.
            </p>
            <a href="${data.videoUrl}" style="display: inline-block; background: #00C3FF; color: #0D1B2A; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px;">
              \u25B6 Watch the Product Tour
            </a>
            <p style="color: #CBD5E1; font-size: 15px; line-height: 1.7; margin: 24px 0 0;">
              Want to see it live? <a href="https://sponsorcomplians.com/contact" style="color: #00C3FF; text-decoration: underline;">Book a personalised demo</a> with our team.
            </p>
          </div>
          <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.1); color: #5A7A9A; font-size: 12px;">
            <p style="margin: 0;">Sponsor ComplIANS \u2014 UK Sponsor Licence Compliance</p>
            <p style="margin: 4px 0 0;"><a href="${data.unsubscribeUrl}" style="color: #5A7A9A; text-decoration: underline;">Unsubscribe</a> from future emails.</p>
          </div>
        </div>
      `,
      text: `The Hub Product Tour is Live

You signed up for early access \u2014 here it is.

Watch the Product Tour: ${data.videoUrl}

Want to see it live? Book a personalised demo: https://sponsorcomplians.com/contact

Unsubscribe: ${data.unsubscribeUrl}`
    });
    return true;
  } catch (error) {
    console.error(`[Email] Failed to send video release email to ${data.email}:`, error);
    return false;
  }
}
var ADMIN_EMAIL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, transporter;
var init_email = __esm({
  "server/email.ts"() {
    "use strict";
    ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL || "admin@sponsorcomplians.com";
    SMTP_HOST = process.env.SMTP_HOST || "";
    SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
    SMTP_USER = process.env.SMTP_USER || "";
    SMTP_PASS = process.env.SMTP_PASS || "";
    SMTP_FROM = process.env.SMTP_FROM || "Sponsor ComplIANS <noreply@sponsorcomplians.com>";
    transporter = null;
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  storageGet: () => storageGet,
  storagePut: () => storagePut
});
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
async function buildDownloadUrl(baseUrl, relKey, apiKey) {
  const downloadApiUrl = new URL(
    "v1/storage/downloadUrl",
    ensureTrailingSlash(baseUrl)
  );
  downloadApiUrl.searchParams.set("path", normalizeKey(relKey));
  const response = await fetch(downloadApiUrl, {
    method: "GET",
    headers: buildAuthHeaders(apiKey)
  });
  return (await response.json()).url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}
async function storageGet(relKey) {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  return {
    key,
    url: await buildDownloadUrl(baseUrl, key, apiKey)
  };
}
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_env();
  }
});

// server/vercel.ts
import "dotenv/config";
import express2 from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/stripe.ts
import Stripe from "stripe";
import express from "express";

// server/products.ts
var JOB_PRODUCTS = {
  sponsored: {
    name: "Sponsored Job Listing",
    description: "Priority placement, enhanced branding, 60-day duration, candidate shortlist dashboard",
    priceInPence: 14900,
    // £149
    tier: "sponsored",
    durationDays: 60
  },
  premium: {
    name: "Premium Job Listing",
    description: "AI candidate matching, compliance document pack, social media promotion, 90-day duration",
    priceInPence: 44900,
    // £449
    tier: "premium",
    durationDays: 90
  },
  managed: {
    name: "Managed Recruitment",
    description: "Full end-to-end compliant recruitment with dedicated consultant, screened CVs, and audit-ready file",
    priceInPence: 249500,
    // £2,495
    tier: "managed",
    durationDays: 180
    // Until filled, but cap at 180 days
  },
  sponsored_monthly: {
    name: "Sponsored Monthly (Unlimited Listings)",
    description: "Unlimited sponsored listings for one month",
    priceInPence: 34900,
    // £349/month
    tier: "sponsored",
    durationDays: 30
  },
  premium_monthly: {
    name: "Premium Monthly (Unlimited Listings)",
    description: "Unlimited premium listings for one month",
    priceInPence: 99900,
    // £999/month
    tier: "premium",
    durationDays: 30
  }
};

// server/stripe.ts
init_db();

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/stripe.ts
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover"
});
function registerStripeRoutes(app2) {
  app2.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }
      console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);
      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object;
            const jobId = session.metadata?.job_id;
            const tier = session.metadata?.tier;
            const productKey = session.metadata?.product_key;
            if (jobId && tier) {
              const product = JOB_PRODUCTS[productKey];
              const durationDays = product?.durationDays || 60;
              const expiresAt = /* @__PURE__ */ new Date();
              expiresAt.setDate(expiresAt.getDate() + durationDays);
              await updateJob(parseInt(jobId), {
                tier,
                status: "active",
                isFeatured: tier === "premium" || tier === "managed",
                stripePaymentId: session.payment_intent,
                expiresAt
              });
              await createNotification({
                type: "system",
                title: `Job Upgraded to ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
                message: `Job #${jobId} has been upgraded to the ${tier} tier. Payment: ${session.amount_total ? `\xA3${(session.amount_total / 100).toFixed(2)}` : "N/A"}.`
              });
              await notifyOwner({
                title: `\u{1F4B3} Job Listing Payment \u2014 ${tier.toUpperCase()}`,
                content: `Job #${jobId} upgraded to ${tier}
Amount: \xA3${session.amount_total ? (session.amount_total / 100).toFixed(2) : "N/A"}
Customer: ${session.customer_email || "N/A"}
Payment Intent: ${session.payment_intent}`
              }).catch(() => {
              });
            }
            break;
          }
          case "payment_intent.succeeded": {
            console.log(`[Stripe Webhook] Payment succeeded: ${event.data.object.id}`);
            break;
          }
          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err) {
        console.error("[Stripe Webhook] Error processing event:", err);
      }
      res.json({ received: true });
    }
  );
  app2.post("/api/stripe/checkout", express.json(), async (req, res) => {
    try {
      const { productKey, jobId, email, name } = req.body;
      if (!productKey || !JOB_PRODUCTS[productKey]) {
        return res.status(400).json({ error: "Invalid product key" });
      }
      const product = JOB_PRODUCTS[productKey];
      const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, "") || "";
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        currency: "gbp",
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: product.name,
                description: product.description
              },
              unit_amount: product.priceInPence
            },
            quantity: 1
          }
        ],
        customer_email: email || void 0,
        allow_promotion_codes: true,
        metadata: {
          job_id: jobId?.toString() || "",
          tier: product.tier,
          product_key: productKey,
          customer_name: name || ""
        },
        client_reference_id: jobId?.toString() || "",
        success_url: `${origin}/jobs?payment=success&tier=${product.tier}`,
        cancel_url: `${origin}/advertise?payment=cancelled`
      });
      res.json({ url: session.url });
    } catch (err) {
      console.error("[Stripe Checkout] Error creating session:", err);
      res.status(500).json({ error: err.message || "Failed to create checkout session" });
    }
  });
}

// server/sendgridWebhook.ts
init_sendgridService();
function registerSendGridWebhook(app2) {
  app2.post("/api/sendgrid/webhook", async (req, res) => {
    try {
      const events = req.body;
      if (!Array.isArray(events)) {
        console.warn("[SendGrid Webhook] Received non-array body, ignoring");
        return res.status(200).json({ ok: true });
      }
      console.log(`[SendGrid Webhook] Received ${events.length} events`);
      const result = await processWebhookEvents(events);
      console.log(`[SendGrid Webhook] Processed: ${result.processed}, Errors: ${result.errors}`);
      return res.status(200).json({
        ok: true,
        processed: result.processed,
        errors: result.errors
      });
    } catch (err) {
      console.error("[SendGrid Webhook] Fatal error:", err);
      return res.status(200).json({ ok: true, error: "Internal processing error" });
    }
  });
  console.log("[SendGrid] Webhook endpoint registered at /api/sendgrid/webhook");
}

// server/_core/systemRouter.ts
import { z } from "zod";

// shared/const.ts
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { TRPCError as TRPCError4 } from "@trpc/server";
import { z as z4 } from "zod";

// server/_core/llm.ts
init_env();
var ensureArray = (value) => Array.isArray(value) ? value : [value];
var normalizeContentPart = (part) => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }
  if (part.type === "text") {
    return part;
  }
  if (part.type === "image_url") {
    return part;
  }
  if (part.type === "file_url") {
    return part;
  }
  throw new Error("Unsupported message content part");
};
var normalizeMessage = (message) => {
  const { role, name, tool_call_id } = message;
  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
    return {
      role,
      name,
      tool_call_id,
      content
    };
  }
  const contentParts = ensureArray(message.content).map(normalizeContentPart);
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text
    };
  }
  return {
    role,
    name,
    content: contentParts
  };
};
var normalizeToolChoice = (toolChoice, tools) => {
  if (!toolChoice) return void 0;
  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }
  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }
    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }
    return {
      type: "function",
      function: { name: tools[0].function.name }
    };
  }
  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name }
    };
  }
  return toolChoice;
};
var resolveApiUrl = () => ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0 ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions` : "https://forge.manus.im/v1/chat/completions";
var assertApiKey = () => {
  if (!ENV.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};
var normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema
}) => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }
  const schema = outputSchema || output_schema;
  if (!schema) return void 0;
  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }
  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
    }
  };
};
async function invokeLLM(params) {
  assertApiKey();
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format
  } = params;
  const payload = {
    model: "gemini-2.5-flash",
    messages: messages.map(normalizeMessage)
  };
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  payload.max_tokens = 32768;
  payload.thinking = {
    "budget_tokens": 128
  };
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }
  return await response.json();
}

// server/routers.ts
init_db();
init_email();

// server/bookingRoutes.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
import { z as z2 } from "zod";
init_db();

// server/bookingEmail.ts
init_sendgridService();
async function sendBookingConfirmation(data) {
  const dateObj = /* @__PURE__ */ new Date(data.date + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1B2A; color: #fff; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1B3A5C, #0D1B2A); padding: 32px;">
        <h1 style="margin: 0; font-size: 24px; color: #00C3FF;">Booking Confirmed</h1>
        <p style="margin: 8px 0 0; color: #8B9EB7; font-size: 15px;">Your consultation has been scheduled</p>
      </div>
      <div style="padding: 32px;">
        <p style="color: #CBD5E1; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
          Hi ${data.firstName}, thank you for booking a consultation with Sponsor ComplIANS. Here are your appointment details:
        </p>
        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #8B9EB7; font-size: 14px; width: 140px; vertical-align: top;">Consultation</td>
              <td style="padding: 10px 0; color: #fff; font-size: 14px; font-weight: 600;">${data.consultationType}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8B9EB7; font-size: 14px; vertical-align: top;">Date</td>
              <td style="padding: 10px 0; color: #fff; font-size: 14px;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8B9EB7; font-size: 14px; vertical-align: top;">Time</td>
              <td style="padding: 10px 0; color: #fff; font-size: 14px;">${data.startTime} \u2013 ${data.endTime} (${data.timezone})</td>
            </tr>
            ${data.company ? `
            <tr>
              <td style="padding: 10px 0; color: #8B9EB7; font-size: 14px; vertical-align: top;">Company</td>
              <td style="padding: 10px 0; color: #fff; font-size: 14px;">${data.company}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding: 10px 0; color: #8B9EB7; font-size: 14px; vertical-align: top;">Reference</td>
              <td style="padding: 10px 0; color: #00C3FF; font-size: 14px;">#APT-${data.appointmentId}</td>
            </tr>
          </table>
        </div>
        <div style="background: rgba(0,195,255,0.1); border-left: 3px solid #00C3FF; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
          <p style="margin: 0; color: #CBD5E1; font-size: 14px; line-height: 1.6;">
            <strong style="color: #00C3FF;">What to prepare:</strong><br/>
            Please have your sponsor licence number and any relevant Home Office correspondence ready for the consultation.
          </p>
        </div>
        <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6; margin: 0;">
          Need to reschedule or cancel? Please contact us at 
          <a href="tel:02036186968" style="color: #00C3FF; text-decoration: none;">020 3618 6968</a> or reply to this email.
        </p>
      </div>
      <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.1); color: #5A7A9A; font-size: 12px;">
        <p style="margin: 0;">Sponsor ComplIANS \u2014 UK Sponsor Licence Compliance</p>
        <p style="margin: 4px 0 0;">020 3618 6968 | info@sponsorcomplians.com</p>
      </div>
    </div>
  `;
  try {
    const result = await sendSingleEmail({
      to: data.email,
      subject: `Booking Confirmed \u2014 ${data.consultationType} on ${formattedDate}`,
      htmlContent,
      fromName: "Sponsor ComplIANS",
      fromEmail: "bookings@sponsorcomplians.com",
      replyTo: "info@sponsorcomplians.com"
    });
    if (result.success) {
      console.log(`[Booking Email] Confirmation sent to ${data.email} (messageId: ${result.messageId})`);
    } else {
      console.warn(`[Booking Email] Failed to send confirmation to ${data.email}: ${result.error}`);
    }
    return result.success;
  } catch (err) {
    console.error("[Booking Email] Error sending confirmation:", err);
    return false;
  }
}

// server/bookingRoutes.ts
var bookingRouter = router({
  // PUBLIC: Get consultation types
  getConsultationTypes: publicProcedure.query(async () => {
    return getConsultationTypes(true);
  }),
  // PUBLIC: Get available dates for a month
  getAvailableDates: publicProcedure.input(z2.object({
    year: z2.number(),
    month: z2.number().min(1).max(12),
    consultationTypeId: z2.number()
  })).query(async ({ input }) => {
    const ct = await getConsultationTypeById(input.consultationTypeId);
    const duration = ct?.durationMinutes ?? 30;
    return getAvailableDates(input.year, input.month, duration);
  }),
  // PUBLIC: Get available time slots for a specific date
  getAvailableSlots: publicProcedure.input(z2.object({
    date: z2.string(),
    consultationTypeId: z2.number()
  })).query(async ({ input }) => {
    const ct = await getConsultationTypeById(input.consultationTypeId);
    const duration = ct?.durationMinutes ?? 30;
    return getAvailableSlots(input.date, duration);
  }),
  // PUBLIC: Get booking settings (welcome message, etc.)
  getSettings: publicProcedure.query(async () => {
    const settings = await getBookingSettings();
    return {
      welcomeMessage: settings?.welcomeMessage ?? "",
      slotDurationMinutes: settings?.slotDurationMinutes ?? 30,
      maxAdvanceDays: settings?.maxAdvanceDays ?? 30
    };
  }),
  // PUBLIC: Create a new appointment booking
  book: publicProcedure.input(z2.object({
    consultationTypeId: z2.number(),
    date: z2.string(),
    startTime: z2.string(),
    endTime: z2.string(),
    firstName: z2.string().min(1),
    lastName: z2.string().min(1),
    email: z2.string().email(),
    phone: z2.string().optional(),
    company: z2.string().optional(),
    urgencyType: z2.string().optional(),
    notes: z2.string().optional(),
    timezone: z2.string().optional(),
    source: z2.string().optional()
  })).mutation(async ({ input }) => {
    const ct = await getConsultationTypeById(input.consultationTypeId);
    if (!ct) throw new TRPCError3({ code: "NOT_FOUND", message: "Consultation type not found" });
    const slots = await getAvailableSlots(input.date, ct.durationMinutes);
    const slotExists = slots.some((s) => s.startTime === input.startTime && s.endTime === input.endTime);
    if (!slotExists) {
      throw new TRPCError3({ code: "CONFLICT", message: "This time slot is no longer available. Please select another time." });
    }
    const id = await createAppointment({
      consultationTypeId: input.consultationTypeId,
      consultationTypeName: ct.name,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      timezone: input.timezone ?? "Europe/London",
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone ?? null,
      company: input.company ?? null,
      urgencyType: input.urgencyType ?? null,
      notes: input.notes ?? null,
      status: "confirmed",
      source: input.source ?? "website",
      confirmationSentAt: /* @__PURE__ */ new Date()
    });
    try {
      const existingContacts = await getContacts({ search: input.email, limit: 1 });
      if (existingContacts.items.length === 0) {
        await createContact({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone ?? null,
          company: input.company ?? null,
          source: "consultation",
          status: "new",
          tags: "consultation-booking"
        });
        console.log(`[Booking] Auto-created contact for ${input.email}`);
      }
    } catch (e) {
      console.warn("[Booking] Auto-create contact failed:", e);
    }
    if (input.company) {
      try {
        const existingCompanies = await getCompanies({ search: input.company, limit: 1 });
        const exactMatch = existingCompanies.items.some(
          (c) => c.name.toLowerCase() === input.company.toLowerCase()
        );
        if (!exactMatch) {
          await createCompany({ name: input.company });
          console.log(`[Booking] Auto-created company: ${input.company}`);
        }
      } catch (e) {
        console.warn("[Booking] Auto-create company failed:", e);
      }
    }
    try {
      await sendBookingConfirmation({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        consultationType: ct.name,
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        timezone: input.timezone ?? "Europe/London",
        company: input.company,
        appointmentId: id
      });
    } catch (e) {
      console.warn("[Booking] Confirmation email failed:", e);
    }
    try {
      await trackVisitorEvent({
        sessionId: input.email,
        email: input.email,
        eventType: "consultation_book",
        eventValue: ct.name,
        pageUrl: "/book-consultation"
      });
    } catch (e) {
      console.warn("[Booking] Lead scoring failed:", e);
    }
    try {
      const isUrgent = input.urgencyType === "home_office_email";
      await notifyOwner({
        title: isUrgent ? "\u{1F6A8} URGENT Consultation Booked" : "\u{1F4C5} New Consultation Booked",
        content: `${input.firstName} ${input.lastName} (${input.email}) booked a ${ct.name} on ${input.date} at ${input.startTime}.${input.company ? ` Company: ${input.company}` : ""}${input.urgencyType ? ` Urgency: ${input.urgencyType}` : ""}${input.notes ? `
Notes: ${input.notes}` : ""}`
      });
    } catch (e) {
      console.warn("[Booking] Owner notification failed:", e);
    }
    return { id, status: "confirmed", date: input.date, startTime: input.startTime, endTime: input.endTime, consultationType: ct.name };
  }),
  // PUBLIC: Cancel an appointment (by client)
  cancel: publicProcedure.input(z2.object({
    id: z2.number(),
    email: z2.string().email(),
    reason: z2.string().optional()
  })).mutation(async ({ input }) => {
    const appt = await getAppointmentById(input.id);
    if (!appt) throw new TRPCError3({ code: "NOT_FOUND", message: "Appointment not found" });
    if (appt.email !== input.email) throw new TRPCError3({ code: "FORBIDDEN", message: "Email does not match" });
    if (appt.status === "cancelled") throw new TRPCError3({ code: "BAD_REQUEST", message: "Already cancelled" });
    await updateAppointment(input.id, {
      status: "cancelled",
      cancelledBy: "client",
      cancellationReason: input.reason ?? null
    });
    return { success: true };
  }),
  // ADMIN: Get all appointments
  list: adminProcedure.input(z2.object({
    status: z2.string().optional(),
    date: z2.string().optional(),
    upcoming: z2.boolean().optional(),
    limit: z2.number().optional(),
    offset: z2.number().optional()
  }).optional()).query(async ({ input }) => {
    return getAppointments(input ?? {});
  }),
  // ADMIN: Get appointment stats
  stats: adminProcedure.query(async () => {
    return getAppointmentStats();
  }),
  // ADMIN: Update appointment status
  updateStatus: adminProcedure.input(z2.object({
    id: z2.number(),
    status: z2.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]),
    adminNotes: z2.string().optional(),
    outcome: z2.string().optional(),
    cancellationReason: z2.string().optional()
  })).mutation(async ({ input }) => {
    const data = { status: input.status };
    if (input.adminNotes) data.adminNotes = input.adminNotes;
    if (input.outcome) data.outcome = input.outcome;
    if (input.status === "cancelled") {
      data.cancelledBy = "admin";
      data.cancellationReason = input.cancellationReason ?? "Cancelled by admin";
    }
    await updateAppointment(input.id, data);
    return { success: true };
  }),
  // ADMIN: Get popular time slots
  popularSlots: adminProcedure.query(async () => {
    return getPopularTimeSlots();
  }),
  // ADMIN: Manage availability slots
  getAvailability: adminProcedure.query(async () => {
    return getAllAvailabilitySlots();
  }),
  createAvailability: adminProcedure.input(z2.object({
    dayOfWeek: z2.number().min(0).max(6),
    startTime: z2.string(),
    endTime: z2.string()
  })).mutation(async ({ input }) => {
    const id = await createAvailabilitySlot({ ...input, isActive: true });
    return { id };
  }),
  updateAvailability: adminProcedure.input(z2.object({
    id: z2.number(),
    isActive: z2.boolean().optional(),
    startTime: z2.string().optional(),
    endTime: z2.string().optional()
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    await updateAvailabilitySlot(id, data);
    return { success: true };
  }),
  deleteAvailability: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
    await deleteAvailabilitySlot(input.id);
    return { success: true };
  }),
  // ADMIN: Manage blocked dates
  getBlockedDates: adminProcedure.query(async () => {
    return getBlockedDates();
  }),
  addBlockedDate: adminProcedure.input(z2.object({
    date: z2.string(),
    reason: z2.string().optional()
  })).mutation(async ({ input }) => {
    const id = await createBlockedDate(input);
    return { id };
  }),
  removeBlockedDate: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
    await deleteBlockedDate(input.id);
    return { success: true };
  }),
  // ADMIN: Booking settings
  getBookingSettings: adminProcedure.query(async () => {
    return getBookingSettings();
  }),
  updateBookingSettings: adminProcedure.input(z2.object({
    slotDurationMinutes: z2.number().optional(),
    bufferMinutes: z2.number().optional(),
    maxDailyBookings: z2.number().optional(),
    minAdvanceHours: z2.number().optional(),
    maxAdvanceDays: z2.number().optional(),
    confirmationEmailEnabled: z2.boolean().optional(),
    reminderEmailEnabled: z2.boolean().optional(),
    reminderHoursBefore: z2.number().optional(),
    welcomeMessage: z2.string().optional()
  })).mutation(async ({ input }) => {
    await updateBookingSettings(input);
    return { success: true };
  }),
  // ADMIN: Manage consultation types
  getAllConsultationTypes: adminProcedure.query(async () => {
    return getConsultationTypes(false);
  }),
  createConsultationType: adminProcedure.input(z2.object({
    name: z2.string().min(1),
    description: z2.string().optional(),
    durationMinutes: z2.number().optional(),
    color: z2.string().optional(),
    sortOrder: z2.number().optional()
  })).mutation(async ({ input }) => {
    const id = await createConsultationType({ ...input, isActive: true });
    return { id };
  }),
  updateConsultationType: adminProcedure.input(z2.object({
    id: z2.number(),
    name: z2.string().optional(),
    description: z2.string().optional(),
    durationMinutes: z2.number().optional(),
    color: z2.string().optional(),
    isActive: z2.boolean().optional(),
    sortOrder: z2.number().optional()
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    await updateConsultationType(id, data);
    return { success: true };
  }),
  deleteConsultationType: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
    await deleteConsultationType(input.id);
    return { success: true };
  })
});

// server/routers/emailCampaign.ts
init_emailCampaignDb();
import { z as z3 } from "zod";
var emailCampaignRouter = router({
  // ═══════════════════════════════════════════════════════════════
  // CAMPAIGNS
  // ═══════════════════════════════════════════════════════════════
  campaigns: router({
    list: adminProcedure.input(z3.object({
      limit: z3.number().min(1).max(200).optional(),
      offset: z3.number().min(0).optional(),
      status: z3.string().optional(),
      search: z3.string().optional()
    }).optional()).query(async ({ input }) => {
      return getCampaigns(input ?? {});
    }),
    getById: adminProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getCampaignById(input.id);
    }),
    create: adminProcedure.input(z3.object({
      name: z3.string().min(1),
      subject: z3.string().optional(),
      previewText: z3.string().optional(),
      fromName: z3.string().optional(),
      fromEmail: z3.string().optional(),
      replyTo: z3.string().optional(),
      contentJson: z3.any().optional(),
      contentHtml: z3.string().optional(),
      recipientListId: z3.number().optional()
    })).mutation(async ({ input }) => {
      const id = await createCampaign(input);
      return { id };
    }),
    update: adminProcedure.input(z3.object({
      id: z3.number(),
      name: z3.string().optional(),
      subject: z3.string().optional(),
      previewText: z3.string().optional(),
      fromName: z3.string().optional(),
      fromEmail: z3.string().optional(),
      replyTo: z3.string().optional(),
      contentJson: z3.any().optional(),
      contentHtml: z3.string().optional(),
      status: z3.enum(["draft", "scheduled", "sending", "sent", "paused", "cancelled"]).optional(),
      recipientListId: z3.number().optional(),
      scheduledAt: z3.string().optional()
    })).mutation(async ({ input }) => {
      const { id, scheduledAt, ...data } = input;
      const updateData = { ...data };
      if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
      await updateCampaign(id, updateData);
      return { success: true };
    }),
    delete: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      await deleteCampaign(input.id);
      return { success: true };
    }),
    duplicate: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      const newId = await duplicateCampaign(input.id);
      return { id: newId };
    }),
    // AI Subject Line Generator
    generateSubjectLines: adminProcedure.input(z3.object({
      topic: z3.string().min(1),
      tone: z3.string().optional()
    })).mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an email marketing expert for Sponsor ComplIANS, a UK sponsor licence compliance consultancy. Generate compelling email subject lines that are professional, concise, and drive opens. Return exactly 5 subject lines, one per line, numbered 1-5. No other text."
            },
            {
              role: "user",
              content: `Generate 5 email subject lines about: ${input.topic}${input.tone ? `. Tone: ${input.tone}` : ""}`
            }
          ]
        });
        const rawContent = response.choices?.[0]?.message?.content || "";
        const text2 = typeof rawContent === "string" ? rawContent : "";
        const lines = text2.split("\n").filter((l) => l.trim()).map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim());
        return { subjectLines: lines };
      } catch {
        return { subjectLines: ["Check out our latest compliance update", "Important sponsor licence news", "Your weekly compliance briefing", "Don't miss this compliance alert", "New from Sponsor ComplIANS"] };
      }
    }),
    // Campaign analytics
    analytics: adminProcedure.query(async () => {
      return getCampaignAnalytics();
    }),
    recipients: adminProcedure.input(z3.object({
      campaignId: z3.number(),
      limit: z3.number().optional(),
      offset: z3.number().optional()
    })).query(async ({ input }) => {
      return getCampaignRecipients(input.campaignId, input);
    }),
    events: adminProcedure.input(z3.object({
      campaignId: z3.number(),
      type: z3.string().optional(),
      limit: z3.number().optional()
    })).query(async ({ input }) => {
      return getCampaignEvents(input.campaignId, input);
    }),
    // Send campaign immediately
    send: adminProcedure.input(z3.object({
      campaignId: z3.number()
    })).mutation(async ({ input }) => {
      const { sendCampaign: sendCampaign2 } = await Promise.resolve().then(() => (init_sendgridService(), sendgridService_exports));
      const campaign = await getCampaignById(input.campaignId);
      if (!campaign) throw new Error("Campaign not found");
      if (!campaign.subject) throw new Error("Campaign subject is required");
      if (!campaign.contentHtml && !campaign.contentJson) throw new Error("Campaign content is required");
      let recipients = [];
      if (campaign.recipientListId) {
        const members = await getListMembers(campaign.recipientListId);
        recipients = members.map((m) => ({
          contactId: m.contact.id,
          email: m.contact.email,
          firstName: m.contact.firstName,
          lastName: m.contact.lastName,
          company: m.contact.company || void 0
        }));
      }
      if (recipients.length === 0) throw new Error("No recipients found. Please assign a contact list to this campaign.");
      await addCampaignRecipients(input.campaignId, recipients.map((r) => ({ contactId: r.contactId, email: r.email })));
      const fromName = campaign.fromName || await getEmailSetting("default_from_name") || "Sponsor ComplIANS";
      const fromEmail = campaign.fromEmail || await getEmailSetting("default_from_email") || "hello@sponsorcomplians.com";
      const replyTo = campaign.replyTo || await getEmailSetting("default_reply_to") || fromEmail;
      const result = await sendCampaign2({
        campaignId: input.campaignId,
        subject: campaign.subject,
        htmlContent: campaign.contentHtml || "<p>No content</p>",
        fromName,
        fromEmail,
        replyTo,
        previewText: campaign.previewText || void 0,
        recipients
      });
      return result;
    }),
    // Schedule campaign for later
    schedule: adminProcedure.input(z3.object({
      campaignId: z3.number(),
      scheduledAt: z3.string()
    })).mutation(async ({ input }) => {
      await updateCampaign(input.campaignId, {
        status: "scheduled",
        scheduledAt: new Date(input.scheduledAt)
      });
      return { success: true };
    }),
    // Send a test email
    sendTest: adminProcedure.input(z3.object({
      campaignId: z3.number(),
      testEmail: z3.string().email()
    })).mutation(async ({ input }) => {
      const { sendTestEmail: sendTestEmail2 } = await Promise.resolve().then(() => (init_sendgridService(), sendgridService_exports));
      const campaign = await getCampaignById(input.campaignId);
      if (!campaign) throw new Error("Campaign not found");
      const fromName = campaign.fromName || await getEmailSetting("default_from_name") || "Sponsor ComplIANS";
      const fromEmail = campaign.fromEmail || await getEmailSetting("default_from_email") || "hello@sponsorcomplians.com";
      const result = await sendTestEmail2({
        to: input.testEmail,
        subject: campaign.subject || "Test Email",
        htmlContent: campaign.contentHtml || "<p>Test email content</p>",
        fromName,
        fromEmail,
        previewText: campaign.previewText || void 0
      });
      return result;
    }),
    // Verify SendGrid API key
    verifyApiKey: adminProcedure.query(async () => {
      const { verifyApiKey: verifyApiKey2 } = await Promise.resolve().then(() => (init_sendgridService(), sendgridService_exports));
      return verifyApiKey2();
    })
  }),
  // ═══════════════════════════════════════════════════════════════
  // TEMPLATES
  // ═══════════════════════════════════════════════════════════════
  templates: router({
    list: adminProcedure.input(z3.object({
      category: z3.string().optional(),
      search: z3.string().optional()
    }).optional()).query(async ({ input }) => {
      return getEmailTemplates(input ?? {});
    }),
    getById: adminProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getEmailTemplateById(input.id);
    }),
    create: adminProcedure.input(z3.object({
      name: z3.string().min(1),
      category: z3.enum(["newsletter", "promotional", "transactional", "compliance", "onboarding", "custom"]).optional(),
      description: z3.string().optional(),
      contentJson: z3.any().optional(),
      contentHtml: z3.string().optional(),
      thumbnailUrl: z3.string().optional(),
      isDefault: z3.boolean().optional()
    })).mutation(async ({ input }) => {
      const id = await createEmailTemplate(input);
      return { id };
    }),
    update: adminProcedure.input(z3.object({
      id: z3.number(),
      name: z3.string().optional(),
      category: z3.enum(["newsletter", "promotional", "transactional", "compliance", "onboarding", "custom"]).optional(),
      description: z3.string().optional(),
      contentJson: z3.any().optional(),
      contentHtml: z3.string().optional(),
      thumbnailUrl: z3.string().optional(),
      isDefault: z3.boolean().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateEmailTemplate(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      await deleteEmailTemplate(input.id);
      return { success: true };
    }),
    duplicate: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      const original = await getEmailTemplateById(input.id);
      if (!original) throw new Error("Template not found");
      const newId = await createEmailTemplate({
        name: `${original.name} (Copy)`,
        category: original.category,
        description: original.description,
        contentJson: original.contentJson,
        contentHtml: original.contentHtml,
        thumbnailUrl: original.thumbnailUrl
      });
      return { id: newId };
    })
  }),
  // ═══════════════════════════════════════════════════════════════
  // CONTACT LISTS
  // ═══════════════════════════════════════════════════════════════
  lists: router({
    list: adminProcedure.input(z3.object({
      search: z3.string().optional()
    }).optional()).query(async ({ input }) => {
      return getContactLists(input ?? {});
    }),
    listForSelect: adminProcedure.query(async () => {
      return getContactListsForSelect();
    }),
    getById: adminProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getContactListById(input.id);
    }),
    create: adminProcedure.input(z3.object({
      name: z3.string().min(1),
      description: z3.string().optional(),
      type: z3.enum(["static", "dynamic"]).optional(),
      filterCriteria: z3.any().optional()
    })).mutation(async ({ input }) => {
      const id = await createContactList(input);
      return { id };
    }),
    update: adminProcedure.input(z3.object({
      id: z3.number(),
      name: z3.string().optional(),
      description: z3.string().optional(),
      type: z3.enum(["static", "dynamic"]).optional(),
      filterCriteria: z3.any().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateContactList(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      await deleteContactList(input.id);
      return { success: true };
    }),
    members: adminProcedure.input(z3.object({ listId: z3.number() })).query(async ({ input }) => {
      return getListMembers(input.listId);
    }),
    addMembers: adminProcedure.input(z3.object({
      listId: z3.number(),
      contactIds: z3.array(z3.number())
    })).mutation(async ({ input }) => {
      await addListMembers(input.listId, input.contactIds);
      return { success: true };
    }),
    removeMember: adminProcedure.input(z3.object({
      listId: z3.number(),
      contactId: z3.number()
    })).mutation(async ({ input }) => {
      await removeListMember(input.listId, input.contactId);
      return { success: true };
    })
  }),
  // ═══════════════════════════════════════════════════════════════
  // TAGS
  // ═══════════════════════════════════════════════════════════════
  tags: router({
    list: adminProcedure.query(async () => {
      return getContactTags();
    }),
    create: adminProcedure.input(z3.object({
      name: z3.string().min(1),
      color: z3.string().optional()
    })).mutation(async ({ input }) => {
      const id = await createContactTag(input);
      return { id };
    }),
    delete: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      await deleteContactTag(input.id);
      return { success: true };
    }),
    assignToContact: adminProcedure.input(z3.object({
      contactId: z3.number(),
      tagId: z3.number()
    })).mutation(async ({ input }) => {
      await assignTagToContact(input.contactId, input.tagId);
      return { success: true };
    }),
    removeFromContact: adminProcedure.input(z3.object({
      contactId: z3.number(),
      tagId: z3.number()
    })).mutation(async ({ input }) => {
      await removeTagFromContact(input.contactId, input.tagId);
      return { success: true };
    }),
    getForContact: adminProcedure.input(z3.object({ contactId: z3.number() })).query(async ({ input }) => {
      return getContactTagAssignments(input.contactId);
    })
  }),
  // ═══════════════════════════════════════════════════════════════
  // NOTES
  // ═══════════════════════════════════════════════════════════════
  notes: router({
    list: adminProcedure.input(z3.object({ contactId: z3.number() })).query(async ({ input }) => {
      return getContactNotes(input.contactId);
    }),
    create: adminProcedure.input(z3.object({
      contactId: z3.number(),
      content: z3.string().min(1),
      type: z3.enum(["note", "call", "email", "meeting", "task"]).optional()
    })).mutation(async ({ ctx, input }) => {
      const id = await createContactNote({ ...input, createdBy: ctx.user.id });
      return { id };
    }),
    delete: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      await deleteContactNote(input.id);
      return { success: true };
    })
  }),
  // ═══════════════════════════════════════════════════════════════
  // TASKS
  // ═══════════════════════════════════════════════════════════════
  tasks: router({
    listForContact: adminProcedure.input(z3.object({ contactId: z3.number() })).query(async ({ input }) => {
      return getContactTasks(input.contactId);
    }),
    listAll: adminProcedure.input(z3.object({
      status: z3.string().optional(),
      priority: z3.string().optional(),
      limit: z3.number().optional()
    }).optional()).query(async ({ input }) => {
      return getAllTasks(input ?? {});
    }),
    create: adminProcedure.input(z3.object({
      contactId: z3.number(),
      title: z3.string().min(1),
      description: z3.string().optional(),
      dueDate: z3.string().optional(),
      priority: z3.enum(["low", "medium", "high"]).optional()
    })).mutation(async ({ ctx, input }) => {
      const { dueDate, ...rest } = input;
      const data = { ...rest, assignedTo: ctx.user.id };
      if (dueDate) data.dueDate = new Date(dueDate);
      const id = await createContactTask(data);
      return { id };
    }),
    update: adminProcedure.input(z3.object({
      id: z3.number(),
      title: z3.string().optional(),
      description: z3.string().optional(),
      dueDate: z3.string().optional(),
      status: z3.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
      priority: z3.enum(["low", "medium", "high"]).optional()
    })).mutation(async ({ input }) => {
      const { id, dueDate, ...rest } = input;
      const data = { ...rest };
      if (dueDate) data.dueDate = new Date(dueDate);
      await updateContactTask(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      await deleteContactTask(input.id);
      return { success: true };
    })
  }),
  // ═══════════════════════════════════════════════════════════════
  // DEALS
  // ═══════════════════════════════════════════════════════════════
  deals: router({
    list: adminProcedure.input(z3.object({
      companyId: z3.number().optional(),
      stage: z3.string().optional(),
      search: z3.string().optional(),
      limit: z3.number().optional()
    }).optional()).query(async ({ input }) => {
      return getDeals2(input ?? {});
    }),
    getById: adminProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getDealById2(input.id);
    }),
    create: adminProcedure.input(z3.object({
      companyId: z3.number(),
      contactId: z3.number().optional(),
      title: z3.string().min(1),
      value: z3.number().optional(),
      stage: z3.enum(["lead", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
      expectedCloseDate: z3.string().optional(),
      productInterest: z3.string().optional(),
      notes: z3.string().optional()
    })).mutation(async ({ input }) => {
      const { expectedCloseDate, ...rest } = input;
      const data = { ...rest };
      if (expectedCloseDate) data.expectedCloseDate = new Date(expectedCloseDate);
      const id = await createDeal2(data);
      return { id };
    }),
    update: adminProcedure.input(z3.object({
      id: z3.number(),
      title: z3.string().optional(),
      value: z3.number().optional(),
      stage: z3.enum(["lead", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
      expectedCloseDate: z3.string().optional(),
      productInterest: z3.string().optional(),
      notes: z3.string().optional()
    })).mutation(async ({ input }) => {
      const { id, expectedCloseDate, ...rest } = input;
      const data = { ...rest };
      if (expectedCloseDate) data.expectedCloseDate = new Date(expectedCloseDate);
      await updateDeal2(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      await deleteDeal2(input.id);
      return { success: true };
    }),
    stats: adminProcedure.query(async () => {
      return getDealStats2();
    })
  }),
  // ═══════════════════════════════════════════════════════════════
  // AUTOMATIONS
  // ═══════════════════════════════════════════════════════════════
  automations: router({
    list: adminProcedure.input(z3.object({
      status: z3.string().optional()
    }).optional()).query(async ({ input }) => {
      return getAutomations(input ?? {});
    }),
    getById: adminProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      const automation = await getAutomationById(input.id);
      const steps = automation ? await getAutomationSteps(input.id) : [];
      return { automation, steps };
    }),
    create: adminProcedure.input(z3.object({
      name: z3.string().min(1),
      description: z3.string().optional(),
      trigger: z3.enum(["contact_created", "tag_added", "list_joined", "form_submitted", "campaign_opened", "campaign_clicked", "manual"]),
      triggerConfig: z3.any().optional(),
      status: z3.enum(["active", "paused", "draft"]).optional()
    })).mutation(async ({ input }) => {
      const id = await createAutomation(input);
      return { id };
    }),
    update: adminProcedure.input(z3.object({
      id: z3.number(),
      name: z3.string().optional(),
      description: z3.string().optional(),
      trigger: z3.enum(["contact_created", "tag_added", "list_joined", "form_submitted", "campaign_opened", "campaign_clicked", "manual"]).optional(),
      triggerConfig: z3.any().optional(),
      status: z3.enum(["active", "paused", "draft"]).optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateAutomation(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      await deleteAutomation(input.id);
      return { success: true };
    }),
    setSteps: adminProcedure.input(z3.object({
      automationId: z3.number(),
      steps: z3.array(z3.object({
        type: z3.enum(["send_email", "wait", "add_tag", "remove_tag", "add_to_list", "remove_from_list", "update_field", "notify_team", "condition"]),
        config: z3.any().optional()
      }))
    })).mutation(async ({ input }) => {
      await setAutomationSteps(input.automationId, input.steps.map((s, i) => ({
        automationId: input.automationId,
        stepOrder: i + 1,
        type: s.type,
        config: s.config
      })));
      return { success: true };
    })
  }),
  // ═══════════════════════════════════════════════════════════════
  // DAILY EMAIL AI
  // ═══════════════════════════════════════════════════════════════
  dailyEmail: router({
    list: adminProcedure.input(z3.object({
      status: z3.string().optional(),
      limit: z3.number().optional()
    }).optional()).query(async ({ input }) => {
      return getDailyEmailDrafts(input ?? {});
    }),
    getById: adminProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getDailyEmailDraftById(input.id);
    }),
    approve: adminProcedure.input(z3.object({
      id: z3.number(),
      subject: z3.string().optional(),
      scheduledFor: z3.string().optional()
    })).mutation(async ({ ctx, input }) => {
      const data = {
        status: "approved",
        approvedBy: ctx.user.id,
        approvedAt: /* @__PURE__ */ new Date()
      };
      if (input.subject) data.subject = input.subject;
      if (input.scheduledFor) data.scheduledFor = new Date(input.scheduledFor);
      await updateDailyEmailDraft(input.id, data);
      return { success: true };
    }),
    reject: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      await updateDailyEmailDraft(input.id, { status: "rejected" });
      return { success: true };
    }),
    regenerate: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      await updateDailyEmailDraft(input.id, { status: "rejected" });
      return { success: true, message: "Regeneration triggered. New draft will appear shortly." };
    })
  }),
  // ═══════════════════════════════════════════════════════════════
  // CONTENT SOURCES
  // ═══════════════════════════════════════════════════════════════
  contentSources: router({
    list: adminProcedure.query(async () => {
      return getContentSources();
    }),
    create: adminProcedure.input(z3.object({
      name: z3.string().min(1),
      type: z3.enum(["rss", "website", "api", "manual"]),
      url: z3.string().optional(),
      config: z3.any().optional(),
      isActive: z3.boolean().optional()
    })).mutation(async ({ input }) => {
      const id = await createContentSource(input);
      return { id };
    }),
    update: adminProcedure.input(z3.object({
      id: z3.number(),
      name: z3.string().optional(),
      type: z3.enum(["rss", "website", "api", "manual"]).optional(),
      url: z3.string().optional(),
      config: z3.any().optional(),
      isActive: z3.boolean().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateContentSource(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      await deleteContentSource(input.id);
      return { success: true };
    })
  }),
  // ═══════════════════════════════════════════════════════════════
  // EMAIL SETTINGS
  // ═══════════════════════════════════════════════════════════════
  settings: router({
    list: adminProcedure.query(async () => {
      return getEmailSettings();
    }),
    get: adminProcedure.input(z3.object({ key: z3.string() })).query(async ({ input }) => {
      return getEmailSetting(input.key);
    }),
    set: adminProcedure.input(z3.object({
      key: z3.string(),
      value: z3.string()
    })).mutation(async ({ input }) => {
      await setEmailSetting(input.key, input.value);
      return { success: true };
    })
  })
});

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(() => ({ success: true }))
  }),
  // ─── Dashboard Stats (Admin) ───
  dashboard: router({
    stats: adminProcedure.query(async () => {
      return getDashboardStats();
    })
  }),
  // ─── CRM Contacts (Admin) ───
  contacts: router({
    list: adminProcedure.input(z4.object({
      limit: z4.number().min(1).max(200).optional(),
      offset: z4.number().min(0).optional(),
      search: z4.string().optional(),
      status: z4.string().optional(),
      source: z4.string().optional()
    }).optional()).query(async ({ input }) => {
      return getContacts(input ?? {});
    }),
    getById: adminProcedure.input(z4.object({ id: z4.number() })).query(async ({ input }) => {
      return getContactById(input.id);
    }),
    stats: adminProcedure.query(async () => {
      return getContactStats();
    }),
    bulkImport: adminProcedure.input(z4.object({
      contacts: z4.array(z4.object({
        firstName: z4.string(),
        lastName: z4.string(),
        email: z4.string().email(),
        phone: z4.string().optional(),
        company: z4.string().optional(),
        jobTitle: z4.string().optional(),
        source: z4.enum(["contact_form", "newsletter", "signup", "download", "manual", "other"]).optional(),
        tags: z4.string().optional()
      })),
      skipDuplicates: z4.boolean().optional()
    })).mutation(async ({ input }) => {
      return bulkImportContacts(input.contacts, input.skipDuplicates ?? true);
    }),
    create: adminProcedure.input(z4.object({
      firstName: z4.string().min(1),
      lastName: z4.string().min(1),
      email: z4.string().email(),
      phone: z4.string().optional(),
      company: z4.string().optional(),
      jobTitle: z4.string().optional(),
      source: z4.enum(["contact_form", "newsletter", "signup", "download", "manual", "other"]).optional(),
      status: z4.enum(["new", "contacted", "qualified", "converted", "archived"]).optional(),
      notes: z4.string().optional()
    })).mutation(async ({ input }) => {
      const id = await createContact(input);
      return { id };
    }),
    update: adminProcedure.input(z4.object({
      id: z4.number(),
      firstName: z4.string().optional(),
      lastName: z4.string().optional(),
      email: z4.string().email().optional(),
      phone: z4.string().nullable().optional(),
      company: z4.string().nullable().optional(),
      jobTitle: z4.string().nullable().optional(),
      status: z4.enum(["new", "contacted", "qualified", "converted", "archived"]).optional(),
      notes: z4.string().nullable().optional(),
      avatarUrl: z4.string().nullable().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateContact(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z4.object({ id: z4.number() })).mutation(async ({ input }) => {
      await deleteContact(input.id);
      return { success: true };
    }),
    getPropertyValues: adminProcedure.input(z4.object({ contactId: z4.number() })).query(async ({ input }) => {
      return getPropertyValues("contact", input.contactId);
    }),
    setPropertyValues: adminProcedure.input(z4.object({
      contactId: z4.number(),
      values: z4.array(z4.object({ propertyId: z4.number(), value: z4.string().nullable() }))
    })).mutation(async ({ input }) => {
      await setBulkPropertyValues("contact", input.contactId, input.values);
      return { success: true };
    }),
    uploadAvatar: adminProcedure.input(z4.object({
      id: z4.number(),
      fileBase64: z4.string(),
      contentType: z4.string(),
      fileName: z4.string()
    })).mutation(async ({ input }) => {
      const { storagePut: storagePut2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      const buffer = Buffer.from(input.fileBase64, "base64");
      const suffix = Math.random().toString(36).substring(2, 8);
      const key = `avatars/contacts/${input.id}-${suffix}-${input.fileName}`;
      const { url } = await storagePut2(key, buffer, input.contentType);
      await updateContact(input.id, { avatarUrl: url });
      return { url };
    })
  }),
  // ─── Custom Properties (Admin) ───
  customProperties: router({
    list: adminProcedure.input(z4.object({ entityType: z4.enum(["contact", "company"]) })).query(async ({ input }) => {
      return getCustomProperties(input.entityType);
    }),
    create: adminProcedure.input(z4.object({
      entityType: z4.enum(["contact", "company"]),
      name: z4.string().min(1),
      label: z4.string().min(1),
      fieldType: z4.enum(["text", "number", "date", "select", "url", "email", "phone", "textarea"]).optional(),
      options: z4.any().optional(),
      isRequired: z4.boolean().optional(),
      sortOrder: z4.number().optional()
    })).mutation(async ({ input }) => {
      const id = await createCustomProperty(input);
      return { id };
    }),
    update: adminProcedure.input(z4.object({
      id: z4.number(),
      name: z4.string().optional(),
      label: z4.string().optional(),
      fieldType: z4.enum(["text", "number", "date", "select", "url", "email", "phone", "textarea"]).optional(),
      options: z4.any().optional(),
      isRequired: z4.boolean().optional(),
      sortOrder: z4.number().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCustomProperty(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z4.object({ id: z4.number() })).mutation(async ({ input }) => {
      await deleteCustomProperty(input.id);
      return { success: true };
    })
  }),
  // ─── Smart Enrichment (Admin) ───
  enrichment: router({
    enrichContact: adminProcedure.input(z4.object({
      firstName: z4.string().optional(),
      lastName: z4.string().optional(),
      email: z4.string().optional(),
      company: z4.string().optional(),
      jobTitle: z4.string().optional()
    })).mutation(async ({ input }) => {
      const searchContext = [
        input.firstName && input.lastName ? `${input.firstName} ${input.lastName}` : "",
        input.email || "",
        input.company || "",
        input.jobTitle || ""
      ].filter(Boolean).join(", ");
      if (!searchContext.trim()) {
        throw new TRPCError4({ code: "BAD_REQUEST", message: "Provide at least a name, email, or company to enrich." });
      }
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a business data enrichment assistant. Given information about a person, search your knowledge to find and return additional professional details. Return ONLY a JSON object with these fields (use null for unknown values):
{
  "firstName": string | null,
  "lastName": string | null,
  "email": string | null,
  "phone": string | null,
  "company": string | null,
  "jobTitle": string | null,
  "linkedinUrl": string | null,
  "companyWebsite": string | null,
  "companyIndustry": string | null,
  "companySize": string | null,
  "companyAddress": string | null,
  "companyPhone": string | null,
  "bio": string | null
}
Do NOT wrap in markdown code blocks. Return raw JSON only.`
          },
          {
            role: "user",
            content: `Enrich this contact: ${searchContext}. Find their professional details, company information, LinkedIn profile, and any other publicly available business information.`
          }
        ]
      });
      try {
        const content = String(response.choices?.[0]?.message?.content || "{}");
        const cleaned = content.replace(/```json\n?|```\n?/g, "").trim();
        return JSON.parse(cleaned);
      } catch {
        return { error: "Could not parse enrichment data" };
      }
    }),
    enrichCompany: adminProcedure.input(z4.object({
      name: z4.string().optional(),
      website: z4.string().optional(),
      industry: z4.string().optional()
    })).mutation(async ({ input }) => {
      const searchContext = [
        input.name || "",
        input.website || "",
        input.industry || ""
      ].filter(Boolean).join(", ");
      if (!searchContext.trim()) {
        throw new TRPCError4({ code: "BAD_REQUEST", message: "Provide at least a company name or website to enrich." });
      }
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a business data enrichment assistant. Given information about a company, search your knowledge to find and return additional details. Return ONLY a JSON object with these fields (use null for unknown values):
{
  "name": string | null,
  "website": string | null,
  "industry": string | null,
  "size": string | null,
  "phone": string | null,
  "address": string | null,
  "description": string | null,
  "linkedinUrl": string | null,
  "foundedYear": string | null,
  "revenue": string | null,
  "employeeCount": string | null,
  "headquarters": string | null,
  "specialties": string | null
}
Do NOT wrap in markdown code blocks. Return raw JSON only.`
          },
          {
            role: "user",
            content: `Enrich this company: ${searchContext}. This is a UK-based business. Find their website, industry, size, address, LinkedIn page, and any other publicly available business information.`
          }
        ]
      });
      try {
        const content = String(response.choices?.[0]?.message?.content || "{}");
        const cleaned = content.replace(/```json\n?|```\n?/g, "").trim();
        return JSON.parse(cleaned);
      } catch {
        return { error: "Could not parse enrichment data" };
      }
    })
  }),
  // ─── Companies (Admin) ───
  companies: router({
    list: adminProcedure.input(z4.object({
      limit: z4.number().min(1).max(200).optional(),
      offset: z4.number().min(0).optional(),
      search: z4.string().optional()
    }).optional()).query(async ({ input }) => {
      return getCompanies(input ?? {});
    }),
    create: adminProcedure.input(z4.object({
      name: z4.string().min(1),
      website: z4.string().optional(),
      industry: z4.string().optional(),
      size: z4.string().optional(),
      phone: z4.string().optional(),
      address: z4.string().optional(),
      notes: z4.string().optional()
    })).mutation(async ({ input }) => {
      const id = await createCompany(input);
      return { id };
    }),
    update: adminProcedure.input(z4.object({
      id: z4.number(),
      name: z4.string().optional(),
      website: z4.string().nullable().optional(),
      industry: z4.string().nullable().optional(),
      size: z4.string().nullable().optional(),
      phone: z4.string().nullable().optional(),
      address: z4.string().nullable().optional(),
      notes: z4.string().nullable().optional(),
      avatarUrl: z4.string().nullable().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCompany(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z4.object({ id: z4.number() })).mutation(async ({ input }) => {
      await deleteCompany(input.id);
      return { success: true };
    }),
    getById: adminProcedure.input(z4.object({ id: z4.number() })).query(async ({ input }) => {
      return getCompanyById(input.id);
    }),
    getContacts: adminProcedure.input(z4.object({ companyName: z4.string() })).query(async ({ input }) => {
      return getCompanyContacts(input.companyName);
    }),
    getDeals: adminProcedure.input(z4.object({ companyId: z4.number() })).query(async ({ input }) => {
      return getCompanyDeals(input.companyId);
    }),
    uploadAvatar: adminProcedure.input(z4.object({
      id: z4.number(),
      fileBase64: z4.string(),
      contentType: z4.string(),
      fileName: z4.string()
    })).mutation(async ({ input }) => {
      const { storagePut: storagePut2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      const buffer = Buffer.from(input.fileBase64, "base64");
      const suffix = Math.random().toString(36).substring(2, 8);
      const key = `avatars/companies/${input.id}-${suffix}-${input.fileName}`;
      const { url } = await storagePut2(key, buffer, input.contentType);
      await updateCompany(input.id, { avatarUrl: url });
      return { url };
    })
  }),
  // ─── Deals / Pipeline (Admin) ───
  deals: router({
    list: adminProcedure.input(z4.object({
      limit: z4.number().min(1).max(500).optional(),
      offset: z4.number().min(0).optional(),
      stage: z4.string().optional(),
      search: z4.string().optional(),
      product: z4.string().optional()
    }).optional()).query(async ({ input }) => {
      return getDeals(input ?? {});
    }),
    getById: adminProcedure.input(z4.object({ id: z4.number() })).query(async ({ input }) => {
      return getDealById(input.id);
    }),
    stats: adminProcedure.query(async () => {
      return getDealStats();
    }),
    create: adminProcedure.input(z4.object({
      companyId: z4.number(),
      contactId: z4.number().optional(),
      title: z4.string().min(1),
      value: z4.number().optional(),
      stage: z4.enum(["lead", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
      probability: z4.number().min(0).max(100).optional(),
      expectedCloseDate: z4.date().optional(),
      product: z4.string().optional(),
      productInterest: z4.string().optional(),
      notes: z4.string().optional()
    })).mutation(async ({ input }) => {
      const id = await createDeal(input);
      return { id };
    }),
    update: adminProcedure.input(z4.object({
      id: z4.number(),
      companyId: z4.number().optional(),
      contactId: z4.number().nullable().optional(),
      title: z4.string().optional(),
      value: z4.number().nullable().optional(),
      stage: z4.enum(["lead", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
      probability: z4.number().min(0).max(100).nullable().optional(),
      expectedCloseDate: z4.date().nullable().optional(),
      product: z4.string().nullable().optional(),
      productInterest: z4.string().nullable().optional(),
      lostReason: z4.string().nullable().optional(),
      notes: z4.string().nullable().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateDeal(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z4.object({ id: z4.number() })).mutation(async ({ input }) => {
      await deleteDeal(input.id);
      return { success: true };
    })
  }),
  // ─── Subscribers (Admin view + Public subscribe) ───
  subscribers: router({
    list: adminProcedure.input(z4.object({
      limit: z4.number().min(1).max(200).optional(),
      offset: z4.number().min(0).optional(),
      activeOnly: z4.boolean().optional()
    }).optional()).query(async ({ input }) => {
      return getSubscribers(input ?? {});
    }),
    subscribe: publicProcedure.input(z4.object({
      email: z4.string().email(),
      firstName: z4.string().optional(),
      lastName: z4.string().optional(),
      source: z4.string().optional()
    })).mutation(async ({ input }) => {
      await createSubscriber(input);
      await createContact({
        firstName: input.firstName || "Subscriber",
        lastName: input.lastName || "",
        email: input.email,
        source: "newsletter"
      }).catch(() => {
      });
      await createNotification({
        type: "subscriber",
        title: "New Newsletter Subscriber",
        message: `${input.email} subscribed to the newsletter${input.firstName ? ` (${input.firstName})` : ""}.`
      });
      await notifyOwner({
        title: "\u{1F4EC} New Newsletter Subscriber",
        content: `Email: ${input.email}
Name: ${input.firstName || "N/A"} ${input.lastName || ""}
Source: ${input.source || "website"}`
      }).catch(() => {
      });
      return { success: true };
    }),
    unsubscribe: publicProcedure.input(z4.object({
      email: z4.string().email()
    })).mutation(async ({ input }) => {
      await unsubscribe(input.email);
      return { success: true };
    })
  }),
  // ─── Contact Submissions (Admin view + Public submit) ───
  submissions: router({
    list: adminProcedure.input(z4.object({
      limit: z4.number().min(1).max(200).optional(),
      offset: z4.number().min(0).optional(),
      status: z4.string().optional()
    }).optional()).query(async ({ input }) => {
      return getContactSubmissions(input ?? {});
    }),
    updateStatus: adminProcedure.input(z4.object({
      id: z4.number(),
      status: z4.enum(["new", "read", "replied", "archived"])
    })).mutation(async ({ input }) => {
      await updateContactSubmissionStatus(input.id, input.status);
      return { success: true };
    }),
    submit: publicProcedure.input(z4.object({
      firstName: z4.string().min(1),
      lastName: z4.string().min(1),
      email: z4.string().email(),
      phone: z4.string().optional(),
      company: z4.string().optional(),
      subject: z4.string().optional(),
      message: z4.string().min(1)
    })).mutation(async ({ input }) => {
      const id = await createContactSubmission(input);
      await createContact({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        company: input.company,
        source: "contact_form"
      }).catch(() => {
      });
      await createNotification({
        type: "contact",
        title: "New Contact Form Submission",
        message: `${input.firstName} ${input.lastName} (${input.email}) submitted a contact form. Subject: ${input.subject || "N/A"}`
      });
      await notifyOwner({
        title: "\u{1F4E9} New Contact Form Submission",
        content: `From: ${input.firstName} ${input.lastName}
Email: ${input.email}
Phone: ${input.phone || "N/A"}
Company: ${input.company || "N/A"}
Subject: ${input.subject || "N/A"}
Message: ${input.message}`
      }).catch(() => {
      });
      await notifyContactFormSubmission(input).catch(() => {
      });
      return { id, success: true };
    })
  }),
  // ─── Signups (Admin view + Public signup) ───
  signups: router({
    list: adminProcedure.input(z4.object({
      limit: z4.number().min(1).max(200).optional(),
      offset: z4.number().min(0).optional()
    }).optional()).query(async ({ input }) => {
      return getSignups(input ?? {});
    }),
    register: publicProcedure.input(z4.object({
      firstName: z4.string().min(1),
      lastName: z4.string().min(1),
      email: z4.string().email(),
      company: z4.string().optional(),
      phone: z4.string().optional(),
      interest: z4.string().optional(),
      source: z4.string().optional()
    })).mutation(async ({ input }) => {
      await createSignup(input);
      await createContact({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        company: input.company,
        source: "signup"
      }).catch(() => {
      });
      await createNotification({
        type: "signup",
        title: "New Signup",
        message: `${input.firstName} ${input.lastName} (${input.email}) signed up. Company: ${input.company || "N/A"}. Interest: ${input.interest || "N/A"}.`
      });
      await notifyOwner({
        title: "\u{1F389} New Signup",
        content: `Name: ${input.firstName} ${input.lastName}
Email: ${input.email}
Company: ${input.company || "N/A"}
Phone: ${input.phone || "N/A"}
Interest: ${input.interest || "N/A"}
Source: ${input.source || "website"}`
      }).catch(() => {
      });
      return { success: true };
    })
  }),
  // ─── Downloads (Admin manage + Public view) ───
  downloads: router({
    list: publicProcedure.query(async () => {
      return getDownloads({ publishedOnly: true });
    }),
    listAll: adminProcedure.query(async () => {
      return getDownloads();
    }),
    create: adminProcedure.input(z4.object({
      title: z4.string().min(1),
      description: z4.string().optional(),
      fileUrl: z4.string().url(),
      fileType: z4.string().optional(),
      fileSize: z4.string().optional(),
      thumbnailUrl: z4.string().optional(),
      category: z4.string().optional(),
      isPublished: z4.boolean().optional()
    })).mutation(async ({ input }) => {
      const id = await createDownload(input);
      return { id };
    }),
    track: publicProcedure.input(z4.object({
      downloadId: z4.number(),
      email: z4.string().email().optional(),
      firstName: z4.string().optional(),
      lastName: z4.string().optional()
    })).mutation(async ({ input, ctx }) => {
      await incrementDownloadCount(input.downloadId);
      await createDownloadLog({
        downloadId: input.downloadId,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        ipAddress: ctx.req.ip || ctx.req.headers["x-forwarded-for"] || "",
        userAgent: ctx.req.headers["user-agent"] || ""
      });
      if (input.email) {
        await createContact({
          firstName: input.firstName || "Downloader",
          lastName: input.lastName || "",
          email: input.email,
          source: "download"
        }).catch(() => {
        });
        await createNotification({
          type: "download",
          title: "New Download",
          message: `${input.email} downloaded a resource.`
        });
      }
      return { success: true };
    }),
    // Admin: upload file to S3 and create download record
    upload: adminProcedure.input(z4.object({
      title: z4.string().min(1),
      description: z4.string().optional(),
      fileName: z4.string(),
      fileBase64: z4.string(),
      contentType: z4.string(),
      fileType: z4.string().optional(),
      fileSize: z4.string().optional(),
      category: z4.string().optional(),
      isPublished: z4.boolean().optional()
    })).mutation(async ({ input }) => {
      const { storagePut: storagePut2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      const buffer = Buffer.from(input.fileBase64, "base64");
      const suffix = Math.random().toString(36).substring(2, 8);
      const key = `lead-magnets/${Date.now()}-${suffix}-${input.fileName}`;
      const { url } = await storagePut2(key, buffer, input.contentType);
      const id = await createDownload({
        title: input.title,
        description: input.description,
        fileUrl: url,
        fileType: input.fileType || input.fileName.split(".").pop() || "file",
        fileSize: input.fileSize,
        category: input.category,
        isPublished: input.isPublished ?? true
      });
      return { id, url };
    }),
    // Admin: update download metadata
    update: adminProcedure.input(z4.object({
      id: z4.number(),
      title: z4.string().min(1).optional(),
      description: z4.string().optional(),
      category: z4.string().optional(),
      isPublished: z4.boolean().optional(),
      fileUrl: z4.string().optional(),
      fileType: z4.string().optional(),
      fileSize: z4.string().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateDownload(id, data);
      return { success: true };
    }),
    // Admin: delete download
    delete: adminProcedure.input(z4.object({
      id: z4.number()
    })).mutation(async ({ input }) => {
      await deleteDownload(input.id);
      return { success: true };
    }),
    // Admin: get single download by ID
    getById: adminProcedure.input(z4.object({
      id: z4.number()
    })).query(async ({ input }) => {
      return getDownloadById(input.id);
    }),
    logs: adminProcedure.input(z4.object({
      downloadId: z4.number().optional()
    }).optional()).query(async ({ input }) => {
      return getDownloadLogs(input?.downloadId);
    })
  }),
  // ─── Visitor Tracking ───
  tracking: router({
    trackView: publicProcedure.input(z4.object({
      path: z4.string(),
      referrer: z4.string().optional(),
      sessionId: z4.string().optional()
    })).mutation(async ({ input, ctx }) => {
      const ua = ctx.req.headers["user-agent"] || "";
      const ip = ctx.req.ip || ctx.req.headers["x-forwarded-for"] || "";
      await trackPageView({
        path: input.path,
        referrer: input.referrer,
        userAgent: ua,
        ipAddress: ip,
        sessionId: input.sessionId
      });
      return { success: true };
    }),
    stats: adminProcedure.input(z4.object({
      days: z4.number().min(1).max(365).optional()
    }).optional()).query(async ({ input }) => {
      return getPageViewStats(input ?? {});
    }),
    recentVisitors: adminProcedure.input(z4.object({
      limit: z4.number().min(1).max(200).optional()
    }).optional()).query(async ({ input }) => {
      return getRecentVisitors(input?.limit);
    })
  }),
  // ─── Jobs (Public + Admin) ───
  jobs: router({
    // Public: list active jobs
    list: publicProcedure.input(z4.object({
      limit: z4.number().min(1).max(200).optional(),
      offset: z4.number().min(0).optional(),
      search: z4.string().optional(),
      sector: z4.string().optional(),
      sponsorshipOnly: z4.boolean().optional()
    }).optional()).query(async ({ input }) => {
      return getJobs({ ...input, status: "active" });
    }),
    // Public: get single job
    getById: publicProcedure.input(z4.object({ id: z4.number() })).query(async ({ input }) => {
      const job = await getJobById(input.id);
      if (job) await incrementJobViewCount(input.id);
      return job;
    }),
    // Public: apply to a job (comprehensive 10-step form)
    submitApplication: publicProcedure.input(z4.object({
      jobId: z4.number(),
      jobTitle: z4.string().optional(),
      employerName: z4.string().optional(),
      sector: z4.string().optional(),
      sectorVariantStep6: z4.string().optional(),
      sectorVariantStep7: z4.string().optional(),
      availableStartDate: z4.string().optional(),
      surname: z4.string().min(1),
      firstName: z4.string().min(1),
      nationalInsuranceNumber: z4.string().optional(),
      addressLine1: z4.string().min(1),
      addressLine2: z4.string().optional(),
      postcode: z4.string().min(1),
      country: z4.string().min(1),
      mobile: z4.string().min(1),
      email: z4.string().email(),
      rightToWork: z4.string().min(1),
      hasUkDrivingLicence: z4.string().optional(),
      employmentHistory: z4.any().optional(),
      addressHistory: z4.any().optional(),
      qualifications: z4.any().optional(),
      sectorCertifications: z4.any().optional(),
      sectorExperience: z4.any().optional(),
      hasValidDrivingLicence: z4.string().optional(),
      hasVehicleAccess: z4.string().optional(),
      hasBusinessInsurance: z4.string().optional(),
      livesWithin10Miles: z4.string().optional(),
      willingToRelocate: z4.string().optional(),
      canStartWithin4Weeks: z4.string().optional(),
      references: z4.any().optional(),
      screeningQ1: z4.string().optional(),
      screeningQ2: z4.string().optional(),
      screeningQ3: z4.string().optional(),
      hasCriminalConviction: z4.string().optional(),
      criminalConvictionDetails: z4.string().optional(),
      cvUrl: z4.string().optional(),
      declarationAccepted: z4.boolean(),
      printName: z4.string().optional(),
      declarationDate: z4.string().optional()
    })).mutation(async ({ input }) => {
      const id = await createJobApplication(input);
      await createContact({
        firstName: input.firstName,
        lastName: input.surname,
        email: input.email,
        phone: input.mobile,
        source: "other"
      }).catch(() => {
      });
      const job = await getJobById(input.jobId);
      await createNotification({
        type: "system",
        title: "New Job Application (10-Step Form)",
        message: `${input.firstName} ${input.surname} (${input.email}) applied to "${job?.title || input.jobTitle || "Unknown"}" at ${job?.company || input.employerName || "Unknown"}. Sector: ${input.sector || "N/A"}.`
      });
      await notifyOwner({
        title: "\u{1F4BC} New Job Application",
        content: `Job: ${job?.title || input.jobTitle || "Unknown"} at ${job?.company || input.employerName || "Unknown"}
Applicant: ${input.firstName} ${input.surname}
Email: ${input.email}
Phone: ${input.mobile}
Sector: ${input.sector || "N/A"}
Start Date: ${input.availableStartDate || "N/A"}`
      }).catch(() => {
      });
      return { id, success: true };
    }),
    // Public: upload CV file
    uploadCV: publicProcedure.input(z4.object({
      fileName: z4.string(),
      fileBase64: z4.string(),
      contentType: z4.string()
    })).mutation(async ({ input }) => {
      const { storagePut: storagePut2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      const buffer = Buffer.from(input.fileBase64, "base64");
      const suffix = Math.random().toString(36).substring(2, 8);
      const key = `cv-uploads/${Date.now()}-${suffix}-${input.fileName}`;
      const { url } = await storagePut2(key, buffer, input.contentType);
      return { url };
    }),
    // Admin: list applications with filters
    listApplications: protectedProcedure.input(z4.object({
      jobId: z4.number().optional(),
      sector: z4.string().optional(),
      status: z4.string().optional(),
      search: z4.string().optional(),
      limit: z4.number().optional(),
      offset: z4.number().optional()
    }).optional()).query(async ({ input }) => {
      return getJobApplicationsFiltered(input ?? {});
    }),
    // Admin: get single application
    getApplication: protectedProcedure.input(z4.object({ id: z4.number() })).query(async ({ input }) => {
      return getJobApplicationById(input.id);
    }),
    // Admin: update application status
    updateApplicationStatus: protectedProcedure.input(z4.object({
      id: z4.number(),
      status: z4.enum(["new", "reviewed", "shortlisted", "interviewed", "offered", "rejected"]),
      adminNotes: z4.string().optional()
    })).mutation(async ({ input }) => {
      await updateJobApplicationStatus(input.id, input.status, input.adminNotes);
      return { success: true };
    }),
    // Public: post a free job (creates as pending)
    postFree: publicProcedure.input(z4.object({
      title: z4.string().min(1),
      company: z4.string().min(1),
      location: z4.string().min(1),
      salaryMin: z4.number().optional(),
      salaryMax: z4.number().optional(),
      salaryType: z4.enum(["annual", "hourly", "daily"]).optional(),
      jobType: z4.enum(["full_time", "part_time", "contract", "temporary"]),
      sector: z4.string().min(1),
      sponsorshipOffered: z4.boolean(),
      sponsorLicenceStatus: z4.string().min(1),
      cosAvailability: z4.string().min(1),
      homeOfficeInspection: z4.string().min(1),
      inspectionOutcomeDetail: z4.string().optional(),
      socCode: z4.string().optional(),
      description: z4.string().min(10),
      requirements: z4.string().optional(),
      benefits: z4.string().optional(),
      contactEmail: z4.string().email(),
      contactPhone: z4.string().optional(),
      applyUrl: z4.string().optional()
    })).mutation(async ({ input }) => {
      const id = await createJob({ ...input, tier: "free", status: "pending" });
      const flaggedValues = ["Yes \u2014 but currently suspended", "No \u2014 I don't have one yet", "No \u2014 I need to request more", "Yes \u2014 licence downgraded", "Yes \u2014 licence revoked (now reinstated)"];
      const hasFlagged = flaggedValues.some((v) => v === input.sponsorLicenceStatus || v === input.cosAvailability || v === input.homeOfficeInspection);
      const flagNote = hasFlagged ? " \u26A0\uFE0F COMPLIANCE FLAGS DETECTED \u2014 requires extra scrutiny." : "";
      await createNotification({
        type: "system",
        title: `New Job Posted${hasFlagged ? " \u26A0\uFE0F" : ""}`,
        message: `"${input.title}" at ${input.company} (${input.location}) \u2014 Free tier, pending review.${flagNote}`
      });
      await notifyOwner({
        title: `\u{1F195} New Job Posted${hasFlagged ? " \u26A0\uFE0F FLAGGED" : ""}`,
        content: `Title: ${input.title}
Company: ${input.company}
Location: ${input.location}
Sector: ${input.sector}
Contact: ${input.contactEmail}
Tier: Free (pending review)

Compliance Pre-Qualification:
- Sponsor Licence: ${input.sponsorLicenceStatus}
- CoS Availability: ${input.cosAvailability}
- Home Office Inspection: ${input.homeOfficeInspection}${input.inspectionOutcomeDetail ? "\n- Inspection Detail: " + input.inspectionOutcomeDetail : ""}${flagNote}`
      }).catch(() => {
      });
      return { id, success: true, complianceReviewNote: "Your compliance status will be reviewed as part of the approval process. Our team will assess your sponsor licence status, CoS availability, and Home Office inspection history before publishing your listing." };
    }),
    // Admin: list all jobs (any status)
    listAll: adminProcedure.input(z4.object({
      limit: z4.number().min(1).max(200).optional(),
      offset: z4.number().min(0).optional(),
      search: z4.string().optional(),
      sector: z4.string().optional(),
      status: z4.string().optional(),
      tier: z4.string().optional()
    }).optional()).query(async ({ input }) => {
      return getJobs(input ?? {});
    }),
    // Admin: update job
    update: adminProcedure.input(z4.object({
      id: z4.number(),
      title: z4.string().optional(),
      company: z4.string().optional(),
      location: z4.string().optional(),
      salaryMin: z4.number().nullable().optional(),
      salaryMax: z4.number().nullable().optional(),
      salaryType: z4.enum(["annual", "hourly", "daily"]).optional(),
      jobType: z4.enum(["full_time", "part_time", "contract", "temporary"]).optional(),
      sector: z4.string().optional(),
      sponsorshipOffered: z4.boolean().optional(),
      sponsorLicenceStatus: z4.string().nullable().optional(),
      cosAvailability: z4.string().nullable().optional(),
      homeOfficeInspection: z4.string().nullable().optional(),
      inspectionOutcomeDetail: z4.string().nullable().optional(),
      description: z4.string().optional(),
      requirements: z4.string().nullable().optional(),
      benefits: z4.string().nullable().optional(),
      contactEmail: z4.string().email().optional(),
      tier: z4.enum(["free", "sponsored", "premium", "managed"]).optional(),
      status: z4.enum(["draft", "pending", "active", "expired", "closed"]).optional(),
      isFeatured: z4.boolean().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateJob(id, data);
      return { success: true };
    }),
    // Admin: delete job
    delete: adminProcedure.input(z4.object({ id: z4.number() })).mutation(async ({ input }) => {
      await deleteJob(input.id);
      return { success: true };
    }),
    // Admin: job stats
    stats: adminProcedure.query(async () => {
      return getJobStats();
    }),
    // Admin: list applications (legacy - use jobs.listApplications instead)
    applications: adminProcedure.input(z4.object({
      jobId: z4.number().optional(),
      limit: z4.number().min(1).max(200).optional(),
      offset: z4.number().min(0).optional()
    }).optional()).query(async ({ input }) => {
      return getJobApplications(input ?? {});
    })
  }),
  // ─── Notifications (Admin) ───
  notifications: router({
    list: adminProcedure.input(z4.object({
      limit: z4.number().min(1).max(200).optional(),
      unreadOnly: z4.boolean().optional()
    }).optional()).query(async ({ input }) => {
      return getNotifications(input ?? {});
    }),
    markRead: adminProcedure.input(z4.object({ id: z4.number() })).mutation(async ({ input }) => {
      await markNotificationRead(input.id);
      return { success: true };
    }),
    markAllRead: adminProcedure.mutation(async () => {
      await markAllNotificationsRead();
      return { success: true };
    })
  }),
  // ─── IANS AI Chatbot ───
  chatbot: router({
    startConversation: publicProcedure.input(z4.object({
      visitorName: z4.string().optional(),
      visitorEmail: z4.string().optional(),
      pageUrl: z4.string().optional(),
      userAgent: z4.string().optional()
    })).mutation(async ({ input, ctx }) => {
      try {
        const result = await createChatConversation({
          visitorName: input.visitorName ?? null,
          visitorEmail: input.visitorEmail ?? null,
          userId: ctx.user?.id ?? null,
          pageUrl: input.pageUrl ?? null,
          userAgent: input.userAgent ?? null,
          ipAddress: ctx.req.ip ?? null
        });
        return { conversationId: result.id };
      } catch (err) {
        console.error("[IANS] Failed to start conversation:", err);
        return { conversationId: 0 };
      }
    }),
    logMessage: publicProcedure.input(z4.object({
      conversationId: z4.number(),
      role: z4.enum(["user", "assistant"]),
      content: z4.string(),
      intentTag: z4.string().optional()
    })).mutation(async ({ input }) => {
      try {
        if (input.conversationId <= 0) return { success: false };
        await createChatMessage({
          conversationId: input.conversationId,
          role: input.role,
          content: input.content,
          intentTag: input.intentTag ?? null
        });
        if (input.intentTag) {
          await updateConversationIntentTags(input.conversationId, input.intentTag);
        }
        return { success: true };
      } catch (err) {
        console.error("[IANS] Failed to log message:", err);
        return { success: false };
      }
    }),
    ask: publicProcedure.input(z4.object({
      message: z4.string().min(1).max(2e3),
      conversationId: z4.number().optional(),
      history: z4.array(z4.object({
        role: z4.enum(["user", "assistant"]),
        content: z4.string()
      })).max(20).optional()
    })).mutation(async ({ input }) => {
      const systemPrompt = `Your name is IANS. You are the AI compliance assistant for Sponsor ComplIANS. When introducing yourself, say "I'm IANS, your compliance assistant from Sponsor ComplIANS." Never refer to yourself as "the chatbot" or "the assistant" \u2014 always use "IANS".

=== COMPANY IDENTITY ===
Sponsor ComplIANS is a UK-based sponsor licence compliance consultancy headquartered at 915 High Road, North Finchley, London N12 8QJ. We provide end-to-end compliance, recruitment, and HR solutions for UK employers who hold or are applying for a Home Office sponsor licence.

Contact: admin@sponsorcomplians.com | 020 3618 6968 | www.sponsorcomplians.com
LinkedIn: linkedin.com/company/sponsorcomplians | Instagram: instagram.com/sponsorcomplians | YouTube: youtube.com/channel/UCWCUNlwdJzgHtkC-pzKWJbg

Key Differentiators:
- All solutions built on real audit data from over 100 UK sponsor compliance audits
- 100% audit pass rate across all clients we have prepared for Home Office compliance visits
- 65-document compliance framework (SW001-SW065) for every sponsored worker
- We audit across all 12 compliance areas the Home Office assesses
- Proprietary data: 80% of revocations are recruitment-related, 64.7% of failures are HR-related
- 500+ UK sponsor licence holders supported
- 500+ sponsored workers hired through our compliant recruitment process
- \xA322M+ in estimated business risk avoided

=== PRODUCTS AND SERVICES ===

**Product 1: Sponsor Compliance Audit** (/sponsor-compliance-audit)
Comprehensive review covering all 12 compliance areas and 65 document types per sponsored worker.
Who it's for: Any UK employer with a sponsor licence wanting to identify compliance gaps before the Home Office does.
Includes: Full audit across 12 areas (record keeping, HR systems, compliance readiness, CoS management, genuine vacancy, pay and NMW compliance, right to work, monitoring and reporting, job role matching, key personnel, absence tracking, change control), 65 documents checked per worker (SW001-SW065), risk scoring, prioritised action plan, compliance visit preparation, mock interviews for Authorising Officer and sponsored workers.
Process: DISCOVER (audit entire operation) \u2192 DIAGNOSE (pinpoint every breach) \u2192 DEMONSTRATE (build lasting compliance).
Proof: 100% pass rate. One client with 120 workers: 7,200 documents reviewed, 44 breaches found across 11 areas. A care provider maintained A-rating, decision in 3 weeks (typical: 3 months).
Turnaround: Standard 5-10 working days. Urgent (imminent Home Office visit): 48 hours.
Delivery: Remote and on-site across England, Wales, Scotland, and Northern Ireland.
CTA: Book a free compliance audit call.

**Product 2: Skilled Worker Recruitment Solutions** (/skilled-worker-recruitment-solutions)
End-to-end recruitment for sponsor licence holders hiring under the Skilled Worker visa route.
Includes: Job design and SOC code validation, genuine vacancy testing, compliant sourcing, application screening against 65-document framework, structured interview documentation, CoS assignment checks, compliant onboarding, post-placement monitoring.
8-step process: Workforce Planning \u2192 Job Design & SOC Validation \u2192 Compliant Sourcing \u2192 Application Screening \u2192 Interview & Assessment \u2192 CoS Assignment \u2192 Compliant Onboarding \u2192 Ongoing Monitoring.
Pricing:
- Sponsorship On Demand: \xA32,495/hire (or 20% of salary if \xA330,000+) \u2014 1-3 urgent hires
- Sponsorship as a Service: \xA37,000/hire (3-month minimum) \u2014 up to 10 hires in 3 months
- Sponsorship RPO & Workforce MSP: \xA316,500/month (6-month minimum) \u2014 up to 50 hires in 6 months
Special offer: First compliant hire is FREE.
Industries: Healthcare, IT & Digital, Engineering & Manufacturing, Construction, Hospitality, Business & Finance, Creative & Design, Technical Trades.
IMPORTANT: New overseas recruitment for care workers closed as of July 2025. Existing sponsored care workers in the UK are not affected.

**Product 3: Sponsor-Ready HR Service** (/sponsor-ready-hr-service)
HR compliance services embedding Home Office sponsor duties into daily HR operations.
Includes: Right-to-work check management with three-stage visa expiry monitoring (60, 30, 15 days), record-keeping aligned to 65-document framework, monthly salary compliance monitoring, sponsored worker onboarding, change reporting within 10 working days via SMS, absence tracking, training for AOs/Key Contacts/Level 1 Users, ongoing compliance monitoring.
Framework: Policy \u2192 Process \u2192 Control \u2192 Evidence.
Pricing:
- Comply Starter: \xA315 PEPM (1-10 workers) \u2014 annual health check, biannual reviews, core templates, email support
- Comply Pro: \xA320 PEPM (11-50 workers) \u2014 quarterly reviews, coaching calls, customisable documents, optional crisis support
- Comply Enterprise: \xA325 PEPM (50+ workers) \u2014 monthly audit-grade reviews, dedicated advisor, 4hr SLA, full crisis support including revocation defence
- PEPM = Per Employee Per Month (based on sponsored workers). All: 12-month minimum contract.
Key stat: 64.7% of compliance failures are HR-related. 10/12 high-severity risks are HR-related. 77 specific HR compliance risk areas identified.

**Product 4: Sponsor ComplIANS Hub** (/sponsor-complians-hub)
Purpose-built compliance management software platform. Launching 1 April 2026.
Features: Sponsored worker management with real-time compliance status, salary compliance monitoring (actual pay vs CoS salary), right-to-work tracking with automated visa expiry alerts, document management with compliance scoring, 12-stage sponsorship lifecycle tracking, compliance alerts for every deadline and gap, audit-ready report generation in seconds.
Real-world proof: Divine Health Services runs 65 sponsored workers through the Hub at 100% salary compliance. Home Office checked 10 December 2025, documentation submitted within 14 days. Home Office confirmed 6 January 2026: "We are satisfied with your representations, and no further action is required."
Pricing: Founding Member rate \xA329/worker/month (50% off standard \xA358/worker/month). Locked in for life \u2014 price never increases. Founding Member pricing closes 1 April 2026 when the Hub goes live. No payment required today \u2014 register for the free webinar on 25 March 2026 to claim your Founding Member spot.
Free Webinar: 25 March 2026 at 1:00 PM GMT. "The Sponsor Compliance Crisis Is Already Here." Register at /events/25-march-webinar. All attendees receive the recording within 24 hours.

**Product 5: The Sponsorship Files** (/the-sponsorship-files | sponsorshipfiles.com)
AI-native investigative documentary podcast examining UK immigration enforcement, sponsor licence revocations, NHS workforce crises, and policy changes. Every claim source-cited.
Stats: 30,000+ downloads, 11 series arcs, 97 episodes planned.
Key data: 1,948 licences revoked YE June 2025, 898,000 net migration YE June 2023, 78,330 care roles unfilled Jan 2026, 34,000 health workers in visa limbo, ~50% application refusal rate, salary threshold \xA341,700 (up 59%), civil penalties \xA345,000 first breach / \xA360,000 repeat.
Available: sponsorshipfiles.com, Apple Podcasts, Spotify.

**Product 6: Provider Websites** (/provider-websites)
Compliance-ready website design for care providers and sponsor licence holders.
Includes: Compliance showcase pages, CQC-aligned service pages, careers pages with SOC codes and sponsorship badges, verified testimonial integration, blog and GEO-optimised content.
Case study: Built Divine Health Services website (sponsorcompliansdivinecare.com) \u2014 CQC-regulated homecare provider with 65 sponsored workers. Home Office confirmed compliance satisfaction.

**Product 7: ComplIANS Jobs** (/jobs and /advertise)
The UK's only job board built specifically for sponsor licence holders.
Differentiators: Only verified sponsors can post, every listing shows SOC code/salary threshold/RQF level/sponsorship status, recruitment audit trail built automatically, premium listings include SOC validation and Compliance Document Pack, candidates are immigration-verified and qualifications-screened.
Candidate channels: 500+ sponsor client network, Sponsorship Files podcast audience (30,000+), compliance webinar and newsletter community (2,500+).
Pricing: Free \xA30 (3 listings/month, 30 days), Sponsored \xA3149/listing or \xA3349/month unlimited (60 days), Premium \xA3449/listing or \xA3999/month unlimited (90 days, AI matching, Compliance Document Pack), Managed Recruitment from \xA32,495/hire.

=== 65-DOCUMENT COMPLIANCE FRAMEWORK (SW001-SW065) ===
Proprietary framework. For every sponsored worker, 65 documents across 7 compliance areas:
- Immigration Monitoring (SW004-SW009, 6 docs): Three-stage visa expiry alerts at 60, 30, 15 days.
- Contact & Address Records (SW010-SW012, 3 docs): Two proofs of address, sponsorship application form.
- Record Keeping & Recruitment (SW013-SW030, 18 docs): Passport, CoS, Home Office decision letter, visa vignette, BRP, RTW online check, DBS, interview questions, payslips, offer letter, contract, job description, qualifications, references, IELTS evidence, police clearance, medical certificates.
- Migrant Tracking & Monitoring (SW031-SW035, 5 docs): Next of kin, change of contact, address history, absence records, annual leave.
- Reporting Duties (SW036, 1 doc): Migrant activity report.
- Qualifications, Skills & Experience (SW037-SW063, 27 docs): QSE checklist, induction, 17 Care Certificate modules, medication competency, shadowing feedback, sign-off letter, completion certificate, further training, spot check form, supervision record, staff appraisal.
- Other (SW064-SW065, 2 docs): Migrant monitoring declaration, e-visa immigration status.

=== HOME OFFICE TWO-PHASE ENFORCEMENT MODEL ===
Based on our observations over 24 months of real compliance cases:

Phase 1 \u2014 The Money Stage: Home Office emails sponsors requesting financial documents to verify salary compliance. They analyse payslips, RTI submissions, P60s, bank statements to check payments match CoS salary declarations. The Home Office does NOT have direct access to HMRC records \u2014 they request documents from the sponsor.
Phase 1 documents requested: (1) Signed contracts, (2) Payslips first 3 months and last 6 months, (3) NI numbers, (4) Unredacted bank statements last 6 months, (5) Monthly salary breakdowns, (6) Full Pay Run/RTI submissions last 6 months, (7) Prepaid card payment evidence, (8) Cheque payment evidence, (9) P60s.

Phase 2 \u2014 The Records Stage: On-site compliance visit examining files, contracts, RTW checks, job descriptions, training logs, HR systems. Officers interview the Authorising Officer and sponsored workers.

CRITICAL: Trying to correct records AFTER being contacted by the Home Office is NOT treated as compliance \u2014 it is seen as too late. Under paragraph C1.6 of the Sponsor Guidance (Part 3), sponsor duties begin from the day the licence is granted.

=== KEY STATISTICS ===
Proprietary: 100+ audits conducted, 80% revocations from recruitment failures, 64.7% failures are HR-related, 77 HR risk areas, 10/12 high-severity risks are HR-related, 100% pass rate, 500+ workers hired compliantly, \xA322M+ risk avoided, 65 docs per worker, 12 compliance areas, 16 issue types, 7,200 docs reviewed for one client, 44 breaches in one audit, A-rating in 3 weeks, no organisation achieved full compliance in any area.
External: 1,948 licences revoked YE June 2025, 898,000 net migration YE June 2023, 78,330 care roles unfilled, 34,000 health workers in visa limbo, ~50% application refusal rate, salary threshold \xA341,700 (up 59%), civil penalties \xA345,000/\xA360,000, care worker visa route closed July 2025, Immigration Salary List expires 31 December 2026.

=== COMMON Q&A ===

Q: What is a sponsor licence?
A: An authorisation from the UK Home Office allowing an employer to hire workers from outside the UK under specific immigration routes, most commonly the Skilled Worker visa.

Q: What happens if my licence is revoked?
A: You can no longer sponsor workers. All sponsored workers have permission curtailed within 60 days. You cannot reapply during the cooling-off period (usually 12 months). Triggers reputational damage and operational disruption.

Q: How often does the Home Office visit?
A: Any time, including unannounced. More likely after licence grant, CoS allocation request, key personnel change, or suspected non-compliance. Be audit-ready at all times.

Q: Most common reasons for revocation?
A: Poor/non-genuine recruitment (35%), failure to conduct RTW checks (25%), inadequate record-keeping (20%), monitoring/reporting failures (8%), CoS management errors (7%), other (5%). Recruitment failures account for 80% of all revocations.

Q: How much does an audit cost?
A: Depends on organisation size, number of sponsored workers, and complexity. We offer a free initial audit call to assess your situation.

Q: Can you help if the Home Office has already contacted us?
A: Yes. Urgent audit and preparation in as little as 48 hours. But proactive compliance before contact is best. Correcting records after contact is explicitly not treated as compliance (paragraph C1.6).

Q: Do you only work with care providers?
A: No. All sectors \u2014 healthcare, IT, engineering, construction, hospitality, business services, creative industries, technical trades. Deep expertise in care sector (highest enforcement rates).

Q: Can you help me get a sponsor licence?
A: Our core expertise is helping existing holders maintain compliance. For initial applications, consult a qualified immigration solicitor. Once you have your licence, we build compliance infrastructure from day one.

Q: What is the 65-document framework?
A: Our proprietary framework from auditing 100+ UK sponsors. 65 document types coded SW001-SW065 covering immigration monitoring, contact records, recruitment evidence, migrant tracking, reporting duties, qualifications/training, and compliance declarations.

Q: What about the Home Office salary email?
A: Act immediately. This is Phase 1 enforcement. They will request payslips, RTI, P60s, bank statements, contracts. Ensure salary payments match CoS declarations before responding. Contact us urgently.

Q: What is the 10-day reporting rule?
A: Report changes to the Home Office within 10 working days via SMS: absences of 10+ consecutive days without permission, workers leaving, significant changes to duties/salary, business address/ownership changes, suspected visa breaches.

Q: How much do recruitment services cost?
A: Sponsorship On Demand \xA32,495/hire, Sponsorship as a Service \xA37,000/hire, RPO & Workforce MSP \xA316,500/month. Free first hire available.

Q: How much is the HR service?
A: Comply Starter \xA315 PEPM (1-10 workers), Comply Pro \xA320 PEPM (11-50), Comply Enterprise \xA325 PEPM (50+). 12-month minimum.

Q: Can I post jobs for free?
A: Yes. Up to 3 vacancies/month free on ComplIANS Jobs (30 days). Upgrade: Sponsored \xA3149/listing, Premium \xA3449/listing, Managed Recruitment from \xA32,495/hire.

=== CASE STUDIES ===

Divine Health Services: CQC-regulated homecare, Worcestershire. 65 sponsored workers, 104+ clients, 2,419 weekly care hours. Home Office check 10 Dec 2025, docs submitted within 14 days via Hub. Confirmed 6 Jan 2026: "We are satisfied with your representations, and no further action is required." 100% salary compliance, zero RTW alerts.

Care Provider with 120 Workers: 7,200 documents reviewed. Found 44 breaches across 11 areas, 30 major, 8 workers underpaid, 66 unreported changes, 54 missing contracts, 46 incomplete RTW docs, 13 CoS role mismatches. All corrected, 3 days mock interview training, team of 10 reviewing files for 10 days. Home Office visit: 4 hours. Officer said: "I have never seen this level of compliance before." A-rating maintained, decision in 3 weeks.

Testimonials:
- Paul Snuggs, CEO, Timeless Group: "ComplIANS were absolute gamechangers."
- Graze Zinyama, Director, Amber Rose Healthcare: "Deeply practical and solution focused. Real peace of mind."
- Pauline Obaze, CEO, Gims Care Solutions: "Transformed complex compliance obligations into something actionable."
- Sulata Rai, HR Officer, Gims Care Solutions: "Uncovered compliance gaps we hadn't even considered."
- Sylvia Munensa, CEO, Silverjen: "Centralised everything... built to reflect exactly what the Home Office expects."
- Adebola Folarin, CEO, Fresh Tree Care Services: "Everything has become much more manageable."

=== BEHAVIOUR RULES ===

1. Always offer to connect with the team. End substantive responses with: "Would you like to speak with our team? You can [book a free consultation](/book-consultation) or call 020 3618 6968."
2. Qualify the prospect when appropriate. Ask: "Do you currently hold a sponsor licence?" and "How many sponsored workers do you have?"
3. Route to the right service:
   - Worried about compliance visit \u2192 Sponsor Compliance Audit
   - Need to hire sponsored workers \u2192 Skilled Worker Recruitment or ComplIANS Jobs
   - HR systems not working / documents missing \u2192 Sponsor-Ready HR Service
   - Want software to track compliance \u2192 Sponsor ComplIANS Hub
   - Need a website showing compliance \u2192 Provider Websites
   - Received Home Office email about salary \u2192 URGENT \u2014 Sponsor Compliance Audit
4. Home Office salary email = URGENT. Explain Phase 1 enforcement, reassure, strongly encourage immediate contact: "This is time-sensitive. We recommend contacting us today. Call 020 3618 6968 or email admin@sponsorcomplians.com."
5. Care worker sponsorship: New overseas recruitment closed July 2025. Existing sponsored care workers unaffected. Care providers may need compliance help for existing workers.
6. If you don't know: "That's a great question \u2014 I want to make sure you get the most accurate answer. Let me connect you with our compliance team at admin@sponsorcomplians.com or 020 3618 6968."
7. Never promise specific outcomes. Say "our clients have achieved" or "based on our experience" not "we guarantee."
8. Use the free audit as primary conversion: "We offer a free initial compliance audit call \u2014 would you like to book one?"
9. On competitors/pricing: Focus on value and differentiation. Emphasise 65-document framework, 100% pass rate, real case study outcomes. Provide pricing openly.
10. Candidates looking for work: Direct to ComplIANS Jobs at /jobs.
11. Never give specific legal advice. Say: "We're compliance specialists, not immigration lawyers. For specific legal questions, we'd recommend consulting a qualified immigration solicitor. However, we can help you with the compliance systems, processes, and documentation that protect your sponsor licence."
12. After your FIRST substantive response (not the welcome message), naturally ask for the visitor's email: "By the way, if you'd like me to send you a summary of this conversation or our compliance resources, what's the best email to reach you at?" Do this once per conversation, not repeatedly.
13. Actively promote the 25 March webinar when relevant: "We're running a free webinar on 25 March \u2014 'The Sponsor Compliance Crisis Is Already Here.' It covers everything you need to know before the April deadline. You can register at /events/25-march-webinar."
14. When discussing Hub pricing, always mention the Founding Member rate: "\xA329/worker/month \u2014 50% off the standard rate, locked in for life. Register for the webinar to claim your spot."

=== TONE ===
Authoritative and knowledgeable. Warm but professional. Solution-oriented. Data-driven (reference proprietary statistics). Urgent when appropriate. Use British English spelling. Be concise (2-4 sentences per response, expand only when detailed pricing or process information is requested).

At the end of every response, silently classify the user's intent into ONE of these tags (do NOT show this to the user):
[INTENT: pricing | audit | recruitment | hub | compliance | general | support | booking | urgent | jobs | podcast | website | hr]
Return this tag on a new line at the very end of your response.`;
      const messages = [
        { role: "system", content: systemPrompt }
      ];
      if (input.history) {
        for (const msg of input.history.slice(-10)) {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
      messages.push({ role: "user", content: input.message });
      try {
        const result = await invokeLLM({ messages });
        let rawReply = typeof result.choices[0]?.message?.content === "string" ? result.choices[0].message.content : Array.isArray(result.choices[0]?.message?.content) ? result.choices[0].message.content.filter((p) => p.type === "text").map((p) => p.text).join("") : "I apologise, I'm having trouble responding right now. Please try again or contact us at 020 3618 6968.";
        let intentTag = "general";
        const intentMatch = rawReply.match(/\[INTENT:\s*(\w+)\s*\]/i);
        if (intentMatch) {
          intentTag = intentMatch[1].toLowerCase();
          rawReply = rawReply.replace(/\n?\[INTENT:\s*\w+\s*\]/i, "").trim();
        }
        return { reply: rawReply, intentTag };
      } catch (err) {
        console.error("[IANS] LLM error:", err);
        return { reply: "I apologise, I'm temporarily unavailable. Please contact our team directly at 020 3618 6968 or admin@sponsorcomplians.com for assistance.", intentTag: "support" };
      }
    }),
    // Admin: list conversations
    listConversations: adminProcedure.input(z4.object({
      limit: z4.number().min(1).max(100).optional(),
      offset: z4.number().min(0).optional()
    }).optional()).query(async ({ input }) => {
      return listChatConversations(input ?? {});
    }),
    // Admin: get conversation messages
    getConversation: adminProcedure.input(z4.object({
      id: z4.number()
    })).query(async ({ input }) => {
      const conversation = await getChatConversation(input.id);
      const messages = await getChatMessages(input.id);
      return { conversation, messages };
    }),
    // Admin: flag/close conversation
    updateConversationStatus: adminProcedure.input(z4.object({
      id: z4.number(),
      status: z4.enum(["active", "closed", "flagged"])
    })).mutation(async ({ input }) => {
      await updateChatConversation(input.id, { status: input.status });
      return { success: true };
    })
  }),
  // ─── Webinar Registrations ───
  webinar: router({
    register: publicProcedure.input(z4.object({
      fullName: z4.string().min(1),
      email: z4.string().email(),
      companyName: z4.string().optional(),
      sponsoredWorkers: z4.string().optional(),
      hasSponsorLicence: z4.string().optional(),
      eventSlug: z4.string().min(1)
    })).mutation(async ({ input }) => {
      const id = await createWebinarRegistration(input);
      const nameParts = input.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || input.fullName;
      const lastName = nameParts.slice(1).join(" ") || "";
      await createContact({
        firstName,
        lastName,
        email: input.email,
        company: input.companyName,
        source: "other"
      }).catch(() => {
      });
      await createNotification({
        type: "signup",
        title: "New Webinar Registration",
        message: `${input.fullName} (${input.email}) registered for ${input.eventSlug}.`
      });
      await notifyOwner({
        title: "\u{1F393} New Webinar Registration",
        content: `Name: ${input.fullName}
Email: ${input.email}
Company: ${input.companyName || "N/A"}
Event: ${input.eventSlug}`
      }).catch(() => {
      });
      await notifyWebinarRegistration(input).catch(() => {
      });
      return { id, success: true };
    }),
    list: adminProcedure.input(z4.object({
      eventSlug: z4.string().optional()
    }).optional()).query(async ({ input }) => {
      return getWebinarRegistrations(input?.eventSlug);
    })
  }),
  // ─── Team Management (Admin) ───
  team: router({
    members: adminProcedure.query(async () => {
      return listTeamMembers();
    }),
    invitations: adminProcedure.query(async () => {
      return listTeamInvitations();
    }),
    invite: adminProcedure.input(z4.object({
      email: z4.string().email(),
      name: z4.string().optional(),
      role: z4.enum(["admin", "user"]).default("admin")
    })).mutation(async ({ ctx, input }) => {
      const crypto = await import("crypto");
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
      const id = await createTeamInvitation({
        email: input.email,
        name: input.name ?? null,
        role: input.role,
        invitedBy: ctx.user.id,
        token,
        status: "pending",
        expiresAt
      });
      await createNotification({
        type: "system",
        title: "Team Invitation Sent",
        message: `Invitation sent to ${input.email} as ${input.role}.`
      });
      return { id, token, expiresAt };
    }),
    revokeInvitation: adminProcedure.input(z4.object({ id: z4.number() })).mutation(async ({ input }) => {
      await updateTeamInvitationStatus(input.id, "revoked");
      return { success: true };
    }),
    removeMember: adminProcedure.input(z4.object({ userId: z4.number() })).mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) throw new TRPCError4({ code: "BAD_REQUEST", message: "Cannot remove yourself" });
      await updateUserRole(input.userId, "user");
      return { success: true };
    }),
    acceptInvitation: publicProcedure.input(z4.object({ token: z4.string() })).mutation(async ({ input }) => {
      const invitation = await getTeamInvitationByToken(input.token);
      if (!invitation) throw new TRPCError4({ code: "NOT_FOUND", message: "Invalid invitation" });
      if (invitation.status !== "pending") throw new TRPCError4({ code: "BAD_REQUEST", message: `Invitation is ${invitation.status}` });
      if (/* @__PURE__ */ new Date() > invitation.expiresAt) {
        await updateTeamInvitationStatus(invitation.id, "expired");
        throw new TRPCError4({ code: "BAD_REQUEST", message: "Invitation has expired" });
      }
      await updateTeamInvitationStatus(invitation.id, "accepted", /* @__PURE__ */ new Date());
      return { success: true, email: invitation.email, role: invitation.role };
    })
  }),
  // ─── Video Release Notifications (Admin) ───
  videoRelease: router({
    sendNotifications: adminProcedure.input(z4.object({
      videoUrl: z4.string().url()
    })).mutation(async ({ input }) => {
      const { sendVideoReleaseEmail: sendVideoReleaseEmail2 } = await Promise.resolve().then(() => (init_email(), email_exports));
      const earlyAccessSubs = await getSubscribersBySource("hub_video_early_access");
      if (earlyAccessSubs.length === 0) {
        return { sent: 0, failed: 0, total: 0, message: "No early access subscribers found." };
      }
      let sent = 0;
      let failed = 0;
      for (const sub of earlyAccessSubs) {
        const success = await sendVideoReleaseEmail2({
          email: sub.email,
          videoUrl: input.videoUrl,
          unsubscribeUrl: `https://sponsorcomplians.com/unsubscribe?email=${encodeURIComponent(sub.email)}`
        });
        if (success) sent++;
        else failed++;
      }
      return { sent, failed, total: earlyAccessSubs.length, message: `Sent ${sent} of ${earlyAccessSubs.length} emails.` };
    }),
    subscriberCount: adminProcedure.query(async () => {
      const subs = await getSubscribersBySource("hub_video_early_access");
      return { count: subs.length, subscribers: subs.map((s) => ({ email: s.email, subscribedAt: s.subscribedAt })) };
    })
  }),
  // ─── Visitor Behaviour Scoring ───
  visitorScoring: router({
    trackEvent: publicProcedure.input(z4.object({
      sessionId: z4.string(),
      email: z4.string().optional(),
      eventType: z4.string(),
      eventValue: z4.string().optional(),
      pageUrl: z4.string().optional(),
      referrer: z4.string().optional()
    })).mutation(async ({ input, ctx }) => {
      const ua = ctx.req.headers["user-agent"] || "";
      const ip = ctx.req.ip || ctx.req.headers["x-forwarded-for"] || "";
      await trackVisitorEvent({
        sessionId: input.sessionId,
        email: input.email || void 0,
        eventType: input.eventType,
        eventValue: input.eventValue,
        pageUrl: input.pageUrl,
        referrer: input.referrer,
        userAgent: ua,
        ipAddress: ip
      });
      return { success: true };
    }),
    leads: adminProcedure.input(z4.object({
      classification: z4.string().optional(),
      limit: z4.number().min(1).max(200).optional(),
      offset: z4.number().min(0).optional(),
      search: z4.string().optional()
    }).optional()).query(async ({ input }) => {
      return getLeadScores(input ?? {});
    }),
    stats: adminProcedure.query(async () => {
      return getLeadScoreStats();
    }),
    recentEvents: adminProcedure.input(z4.object({
      limit: z4.number().min(1).max(200).optional()
    }).optional()).query(async ({ input }) => {
      return getRecentVisitorEvents(input?.limit ?? 50);
    })
  }),
  // ─── Appointment Booking System ───
  booking: bookingRouter,
  // ─── Email Campaign System ───
  emailCampaign: emailCampaignRouter
});

// server/_core/context.ts
init_db();
import { createRemoteJWKSet, jwtVerify } from "jose";
var jwks = null;
function getJWKS() {
  const issuer = process.env.CLERK_ISSUER_URL || "";
  if (!jwks && issuer) {
    jwks = createRemoteJWKSet(
      new URL(`${issuer}/.well-known/jwks.json`)
    );
  }
  return jwks;
}
async function createContext(opts) {
  let user = null;
  try {
    const authHeader = opts.req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const keys = getJWKS();
      const issuer = process.env.CLERK_ISSUER_URL || "";
      if (!keys) {
        console.warn("[Auth] JWKS not available \u2014 CLERK_ISSUER_URL:", issuer ? "set" : "MISSING");
      } else {
        const { payload } = await jwtVerify(token, keys, {
          issuer
        });
        const clerkUserId = payload.sub;
        if (clerkUserId) {
          user = await getUserByOpenId(clerkUserId) ?? null;
          if (!user) {
            await upsertUser({
              openId: clerkUserId,
              name: null,
              email: null,
              loginMethod: "clerk",
              lastSignedIn: /* @__PURE__ */ new Date()
            });
            user = await getUserByOpenId(clerkUserId) ?? null;
          } else {
            await upsertUser({
              openId: clerkUserId,
              lastSignedIn: /* @__PURE__ */ new Date()
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("[Auth] JWT verification failed:", err);
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/vercel.ts
var app = express2();
registerStripeRoutes(app);
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ limit: "50mb", extended: true }));
registerSendGridWebhook(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
var vercel_default = app;
export {
  vercel_default as default
};
