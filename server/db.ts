import { eq, desc, sql, and, gte, lte, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  contacts, InsertContact,
  companies, InsertCompany,
  subscribers, InsertSubscriber,
  contactSubmissions, InsertContactSubmission,
  downloads, InsertDownload,
  downloadLogs, InsertDownloadLog,
  pageViews, InsertPageView,
  notifications, InsertNotification,
  signups, InsertSignup,
  jobs, InsertJob,
  jobApplications, InsertJobApplication,
  chatConversations, InsertChatConversation,
  chatMessages, InsertChatMessage,
  webinarRegistrations, InsertWebinarRegistration,
  teamInvitations, InsertTeamInvitation,
  visitorEvents, InsertVisitorEvent,
  leadScores, InsertLeadScore,
  customProperties, InsertCustomProperty,
  customPropertyValues, InsertCustomPropertyValue,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
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

// ─── Users ───
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) { values.lastSignedIn = new Date(); }
    if (Object.keys(updateSet).length === 0) { updateSet.lastSignedIn = new Date(); }
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Contacts (CRM) ───
export async function createContact(data: InsertContact) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contacts).values(data);
  return result[0].insertId;
}

export async function getContacts(opts: { limit?: number; offset?: number; search?: string; status?: string; source?: string } = {}) {
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
  if (status) conditions.push(eq(contacts.status, status as any));
  if (source) conditions.push(eq(contacts.source, source as any));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const items = await db.select().from(contacts).where(where).orderBy(desc(contacts.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(contacts).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}

export async function getContactStats() {
  const db = await getDb();
  if (!db) return { total: 0, bySource: [], byStatus: [], recentCount: 0 };
  const totalResult = await db.select({ count: sql<number>`count(*)` }).from(contacts);
  const bySource = await db.select({ source: contacts.source, count: sql<number>`count(*)` }).from(contacts).groupBy(contacts.source);
  const byStatus = await db.select({ status: contacts.status, count: sql<number>`count(*)` }).from(contacts).groupBy(contacts.status);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentResult = await db.select({ count: sql<number>`count(*)` }).from(contacts).where(sql`${contacts.createdAt} >= ${sevenDaysAgo}`);
  return {
    total: totalResult[0]?.count ?? 0,
    bySource,
    byStatus,
    recentCount: recentResult[0]?.count ?? 0,
  };
}

export async function bulkImportContacts(contactsData: Array<{
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source?: string;
  tags?: string;
}>, skipDuplicates: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let imported = 0;
  let skipped = 0;
  let errors = 0;
  const errorDetails: string[] = [];

  // Get existing emails for deduplication
  const existingEmails = new Set<string>();
  if (skipDuplicates) {
    const existing = await db.select({ email: contacts.email }).from(contacts);
    existing.forEach(r => existingEmails.add(r.email.toLowerCase()));
  }

  // Process in batches of 50
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
        source: (c.source as any) || "other",
        status: "new",
        tags: c.tags || null,
      });
      imported++;
      existingEmails.add(email);
    } catch (err: any) {
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

export async function getContactById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
  return result[0];
}

export async function updateContact(id: number, data: Partial<InsertContact>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contacts).set(data).where(eq(contacts.id, id));
}

export async function deleteContact(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(contacts).where(eq(contacts.id, id));
}

// ─── Companies ───
export async function createCompany(data: InsertCompany) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(companies).values(data);
  return result[0].insertId;
}

export async function getCompanies(opts: { limit?: number; offset?: number; search?: string } = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { limit = 50, offset = 0, search } = opts;
  const where = search ? or(like(companies.name, `%${search}%`), like(companies.industry, `%${search}%`)) : undefined;
  const items = await db.select().from(companies).where(where).orderBy(desc(companies.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(companies).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}

export async function updateCompany(id: number, data: Partial<InsertCompany>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(companies).set(data).where(eq(companies.id, id));
}

export async function deleteCompany(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(companies).where(eq(companies.id, id));
}

// ─── Subscribers ───
export async function createSubscriber(data: InsertSubscriber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Use upsert to handle duplicate emails
  await db.insert(subscribers).values(data).onDuplicateKeyUpdate({
    set: { isActive: true, unsubscribedAt: null },
  });
}

export async function getSubscribers(opts: { limit?: number; offset?: number; activeOnly?: boolean } = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { limit = 50, offset = 0, activeOnly = false } = opts;
  const where = activeOnly ? eq(subscribers.isActive, true) : undefined;
  const items = await db.select().from(subscribers).where(where).orderBy(desc(subscribers.subscribedAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(subscribers).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}

export async function unsubscribe(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(subscribers).set({ isActive: false, unsubscribedAt: new Date() }).where(eq(subscribers.email, email));
}

// ─── Contact Submissions ───
export async function createContactSubmission(data: InsertContactSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contactSubmissions).values(data);
  return result[0].insertId;
}

export async function getContactSubmissions(opts: { limit?: number; offset?: number; status?: string } = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { limit = 50, offset = 0, status } = opts;
  const where = status ? eq(contactSubmissions.status, status as any) : undefined;
  const items = await db.select().from(contactSubmissions).where(where).orderBy(desc(contactSubmissions.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(contactSubmissions).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}

export async function updateContactSubmissionStatus(id: number, status: "new" | "read" | "replied" | "archived") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contactSubmissions).set({ status }).where(eq(contactSubmissions.id, id));
}

// ─── Downloads ───
export async function createDownload(data: InsertDownload) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(downloads).values(data);
  return result[0].insertId;
}

export async function getDownloads(opts: { publishedOnly?: boolean } = {}) {
  const db = await getDb();
  if (!db) return [];
  const where = opts.publishedOnly ? eq(downloads.isPublished, true) : undefined;
  return db.select().from(downloads).where(where).orderBy(desc(downloads.createdAt));
}

export async function incrementDownloadCount(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(downloads).set({ downloadCount: sql`${downloads.downloadCount} + 1` }).where(eq(downloads.id, id));
}

export async function createDownloadLog(data: InsertDownloadLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(downloadLogs).values(data);
}

export async function updateDownload(id: number, data: Partial<InsertDownload>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(downloads).set(data).where(eq(downloads.id, id));
}

export async function deleteDownload(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(downloads).where(eq(downloads.id, id));
}

export async function getDownloadById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(downloads).where(eq(downloads.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getDownloadLogs(downloadId?: number) {
  const db = await getDb();
  if (!db) return [];
  const where = downloadId ? eq(downloadLogs.downloadId, downloadId) : undefined;
  return db.select().from(downloadLogs).where(where).orderBy(desc(downloadLogs.createdAt)).limit(100);
}

// ─── Page Views (Visitor Tracking) ───
export async function trackPageView(data: InsertPageView) {
  const db = await getDb();
  if (!db) return;
  await db.insert(pageViews).values(data);
}

export async function getPageViewStats(opts: { days?: number } = {}) {
  const db = await getDb();
  if (!db) return { totalViews: 0, uniqueVisitors: 0, topPages: [], viewsByDay: [] };
  const { days = 30 } = opts;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const totalResult = await db.select({ count: sql<number>`count(*)` }).from(pageViews).where(gte(pageViews.createdAt, since));
  const uniqueResult = await db.select({ count: sql<number>`count(distinct ${pageViews.sessionId})` }).from(pageViews).where(gte(pageViews.createdAt, since));
  const topPages = await db.select({
    path: pageViews.path,
    views: sql<number>`count(*)`,
  }).from(pageViews).where(gte(pageViews.createdAt, since)).groupBy(pageViews.path).orderBy(desc(sql`count(*)`)).limit(20);
  const viewsByDay = await db.execute(sql`SELECT DATE(createdAt) as date, count(*) as views, count(distinct sessionId) as uniqueVisitors FROM pageViews WHERE createdAt >= ${since} GROUP BY DATE(createdAt) ORDER BY DATE(createdAt)`);

  const viewsByDayRows = (viewsByDay as any)?.[0] ?? [];
  return {
    totalViews: totalResult[0]?.count ?? 0,
    uniqueVisitors: uniqueResult[0]?.count ?? 0,
    topPages,
    viewsByDay: Array.isArray(viewsByDayRows) ? viewsByDayRows.map((r: any) => ({ date: String(r.date), views: Number(r.views), uniqueVisitors: Number(r.uniqueVisitors) })) : [],
  };
}

export async function getRecentVisitors(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pageViews).orderBy(desc(pageViews.createdAt)).limit(limit);
}

// ─── Notifications ───
export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values(data);
}

export async function getNotifications(opts: { limit?: number; unreadOnly?: boolean } = {}) {
  const db = await getDb();
  if (!db) return { items: [], unreadCount: 0 };
  const { limit = 50, unreadOnly = false } = opts;
  const where = unreadOnly ? eq(notifications.isRead, false) : undefined;
  const items = await db.select().from(notifications).where(where).orderBy(desc(notifications.createdAt)).limit(limit);
  const unreadResult = await db.select({ count: sql<number>`count(*)` }).from(notifications).where(eq(notifications.isRead, false));
  return { items, unreadCount: unreadResult[0]?.count ?? 0 };
}

export async function markNotificationRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

export async function markAllNotificationsRead() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.isRead, false));
}

// ─── Signups ───
export async function createSignup(data: InsertSignup) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(signups).values(data).onDuplicateKeyUpdate({
    set: { firstName: data.firstName, lastName: data.lastName, company: data.company },
  });
}

export async function getSignups(opts: { limit?: number; offset?: number } = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { limit = 50, offset = 0 } = opts;
  const items = await db.select().from(signups).orderBy(desc(signups.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(signups);
  return { items, total: countResult[0]?.count ?? 0 };
}

// ─── Jobs ───
export async function createJob(data: InsertJob) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(jobs).values(data);
  return result[0].insertId;
}

export async function getJobs(opts: { limit?: number; offset?: number; search?: string; sector?: string; status?: string; tier?: string; employerId?: number; sponsorshipOnly?: boolean } = {}) {
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
  if (status) conditions.push(eq(jobs.status, status as any));
  if (tier) conditions.push(eq(jobs.tier, tier as any));
  if (employerId) conditions.push(eq(jobs.employerId, employerId));
  if (sponsorshipOnly) conditions.push(eq(jobs.sponsorshipOffered, true));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const items = await db.select().from(jobs).where(where).orderBy(desc(jobs.isFeatured), desc(jobs.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(jobs).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}

export async function getJobById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result[0];
}

export async function updateJob(id: number, data: Partial<InsertJob>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(jobs).set(data).where(eq(jobs.id, id));
}

export async function deleteJob(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(jobs).where(eq(jobs.id, id));
}

export async function incrementJobViewCount(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(jobs).set({ viewCount: sql`${jobs.viewCount} + 1` }).where(eq(jobs.id, id));
}

// ─── Job Applications ───
export async function createJobApplication(data: InsertJobApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(jobApplications).values(data);
  // Increment application count on the job
  await db.update(jobs).set({ applicationCount: sql`${jobs.applicationCount} + 1` }).where(eq(jobs.id, data.jobId));
  return result[0].insertId;
}

export async function getJobApplications(opts: { jobId?: number; limit?: number; offset?: number } = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { jobId, limit = 50, offset = 0 } = opts;
  const where = jobId ? eq(jobApplications.jobId, jobId) : undefined;
  const items = await db.select().from(jobApplications).where(where).orderBy(desc(jobApplications.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(jobApplications).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}

export async function updateJobApplicationStatus(id: number, status: "new" | "reviewed" | "shortlisted" | "interviewed" | "offered" | "rejected", adminNotes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updates: Record<string, unknown> = { status };
  if (adminNotes !== undefined) updates.adminNotes = adminNotes;
  await db.update(jobApplications).set(updates).where(eq(jobApplications.id, id));
}

export async function getJobApplicationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(jobApplications).where(eq(jobApplications.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getJobApplicationsFiltered(opts: {
  jobId?: number;
  sector?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { jobId, sector, status, dateFrom, dateTo, search, limit = 50, offset = 0 } = opts;
  const conditions = [];
  if (jobId) conditions.push(eq(jobApplications.jobId, jobId));
  if (sector) conditions.push(eq(jobApplications.sector, sector));
  if (status) conditions.push(eq(jobApplications.status, status as any));
  if (dateFrom) conditions.push(sql`${jobApplications.createdAt} >= ${dateFrom}`);
  if (dateTo) conditions.push(sql`${jobApplications.createdAt} <= ${dateTo}`);
  if (search) conditions.push(sql`(${jobApplications.firstName} LIKE ${`%${search}%`} OR ${jobApplications.surname} LIKE ${`%${search}%`} OR ${jobApplications.email} LIKE ${`%${search}%`})`);
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const items = await db.select().from(jobApplications).where(where).orderBy(desc(jobApplications.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(jobApplications).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}

export async function getJobStats() {
  const db = await getDb();
  if (!db) return { totalJobs: 0, activeJobs: 0, totalApplications: 0, featuredJobs: 0, pending: 0, expired: 0, closed: 0, total: 0, active: 0, featured: 0 };
  const [total, active, apps, featured, pending, expired, closed] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(jobs),
    db.select({ count: sql<number>`count(*)` }).from(jobs).where(eq(jobs.status, "active")),
    db.select({ count: sql<number>`count(*)` }).from(jobApplications),
    db.select({ count: sql<number>`count(*)` }).from(jobs).where(eq(jobs.isFeatured, true)),
    db.select({ count: sql<number>`count(*)` }).from(jobs).where(eq(jobs.status, "pending")),
    db.select({ count: sql<number>`count(*)` }).from(jobs).where(eq(jobs.status, "expired")),
    db.select({ count: sql<number>`count(*)` }).from(jobs).where(eq(jobs.status, "closed")),
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
    featured: featured[0]?.count ?? 0,
  };
}

// ─── Dashboard Stats ───
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { contacts: 0, subscribers: 0, submissions: 0, signups: 0, downloads: 0, pageViews: 0, videoEarlyAccess: 0 };
  const [c, s, sub, sg, d, pv, vea] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(contacts),
    db.select({ count: sql<number>`count(*)` }).from(subscribers).where(eq(subscribers.isActive, true)),
    db.select({ count: sql<number>`count(*)` }).from(contactSubmissions),
    db.select({ count: sql<number>`count(*)` }).from(signups),
    db.select({ count: sql<number>`count(*)` }).from(downloads),
    db.select({ count: sql<number>`count(*)` }).from(pageViews),
    db.select({ count: sql<number>`count(*)` }).from(subscribers).where(and(eq(subscribers.isActive, true), eq(subscribers.source, "hub_video_early_access"))),
  ]);
  return {
    contacts: c[0]?.count ?? 0,
    subscribers: s[0]?.count ?? 0,
    submissions: sub[0]?.count ?? 0,
    signups: sg[0]?.count ?? 0,
    downloads: d[0]?.count ?? 0,
    pageViews: pv[0]?.count ?? 0,
    videoEarlyAccess: vea[0]?.count ?? 0,
  };
}


// ─── Subscribers by Source ───
export async function getSubscribersBySource(source: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscribers).where(and(eq(subscribers.isActive, true), eq(subscribers.source, source))).orderBy(desc(subscribers.subscribedAt));
}

// ─── Chat Conversations ───

export async function createChatConversation(data: InsertChatConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(chatConversations).values(data).$returningId();
  return result;
}

export async function getChatConversation(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(chatConversations).where(eq(chatConversations.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function updateChatConversation(id: number, data: Partial<InsertChatConversation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(chatConversations).set(data).where(eq(chatConversations.id, id));
}

export async function listChatConversations(opts: { limit?: number; offset?: number } = {}) {
  const db = await getDb();
  if (!db) return { conversations: [], total: 0 };
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;
  const rows = await db.select().from(chatConversations).orderBy(desc(chatConversations.createdAt)).limit(limit).offset(offset);
  const [total] = await db.select({ count: sql<number>`count(*)` }).from(chatConversations);
  return { conversations: rows, total: total?.count ?? 0 };
}

export async function createChatMessage(data: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(chatMessages).values(data).$returningId();
  // Increment message count on conversation
  await db.update(chatConversations)
    .set({ messageCount: sql`${chatConversations.messageCount} + 1` })
    .where(eq(chatConversations.id, data.conversationId));
  return result;
}

export async function getChatMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatMessages).where(eq(chatMessages.conversationId, conversationId)).orderBy(chatMessages.createdAt);
}

export async function updateConversationIntentTags(conversationId: number, newTag: string) {
  const db = await getDb();
  if (!db) return;
  const conv = await getChatConversation(conversationId);
  if (!conv) return;
  const existing: string[] = conv.intentTags ? JSON.parse(conv.intentTags) : [];
  if (!existing.includes(newTag)) {
    existing.push(newTag);
    await db.update(chatConversations).set({ intentTags: JSON.stringify(existing) }).where(eq(chatConversations.id, conversationId));
  }
}


/* ─── Webinar Registrations ─── */
export async function createWebinarRegistration(data: Omit<InsertWebinarRegistration, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return 0;
  const [result] = await db.insert(webinarRegistrations).values(data).$returningId();
  return result.id;
}

export async function getWebinarRegistrations(eventSlug?: string) {
  const db = await getDb();
  if (!db) return [];
  if (eventSlug) {
    return db.select().from(webinarRegistrations).where(eq(webinarRegistrations.eventSlug, eventSlug)).orderBy(desc(webinarRegistrations.createdAt));
  }
  return db.select().from(webinarRegistrations).orderBy(desc(webinarRegistrations.createdAt));
}

/* ─── Team Invitations ─── */
export async function createTeamInvitation(data: Omit<InsertTeamInvitation, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(teamInvitations).values(data).$returningId();
  return result.id;
}
export async function listTeamInvitations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamInvitations).orderBy(desc(teamInvitations.createdAt));
}
export async function getTeamInvitationByToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db.select().from(teamInvitations).where(eq(teamInvitations.token, token));
  return row ?? null;
}
export async function updateTeamInvitationStatus(id: number, status: "pending" | "accepted" | "expired" | "revoked", acceptedAt?: Date) {
  const db = await getDb();
  if (!db) return;
  const updates: any = { status };
  if (acceptedAt) updates.acceptedAt = acceptedAt;
  await db.update(teamInvitations).set(updates).where(eq(teamInvitations.id, id));
}
export async function listTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(eq(users.role, "admin")).orderBy(desc(users.createdAt));
}
export async function updateUserRole(userId: number, role: "admin" | "user") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

/* ─── Visitor Events & Lead Scoring ─── */

/** Point values for each event type */
const EVENT_POINTS: Record<string, number> = {
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
  consultation_book: 25,
};

export function getEventPoints(eventType: string): number {
  return EVENT_POINTS[eventType] ?? 1;
}

function classifyScore(score: number): "cold" | "warm" | "hot" {
  if (score >= 50) return "hot";
  if (score >= 20) return "warm";
  return "cold";
}

export async function trackVisitorEvent(data: {
  sessionId: string;
  email?: string;
  eventType: string;
  eventValue?: string;
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
}) {
  const db = await getDb();
  if (!db) return;
  const points = getEventPoints(data.eventType);
  await db.insert(visitorEvents).values({ ...data, points });

  // If we have an email, update the lead score
  if (data.email) {
    await upsertLeadScore(data.email, data.sessionId, data.eventType, points);
  }
}

export async function upsertLeadScore(email: string, sessionId: string, eventType: string, points: number) {
  const db = await getDb();
  if (!db) return;

  const existing = await db.select().from(leadScores).where(eq(leadScores.email, email)).limit(1);

  if (existing.length > 0) {
    const current = existing[0];
    const newTotal = current.totalScore + points;
    const updates: Record<string, unknown> = {
      totalScore: newTotal,
      classification: classifyScore(newTotal),
      lastEventAt: new Date(),
      sessionId,
    };
    // Increment specific counters
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
      lastEventAt: new Date(),
      firstSeenAt: new Date(),
    });
  }
}

export async function getLeadScores(opts: { classification?: string; limit?: number; offset?: number; search?: string } = {}) {
  const db = await getDb();
  if (!db) return { leads: [], total: 0 };
  const { classification, limit = 50, offset = 0, search } = opts;
  const conditions = [];
  if (classification) conditions.push(eq(leadScores.classification, classification as "cold" | "warm" | "hot"));
  if (search) conditions.push(sql`${leadScores.email} LIKE ${`%${search}%`}`);
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const leads = await db.select().from(leadScores).where(where).orderBy(desc(leadScores.totalScore)).limit(limit).offset(offset);
  const [total] = await db.select({ count: sql<number>`count(*)` }).from(leadScores).where(where);
  return { leads, total: total?.count ?? 0 };
}

export async function getLeadScoreStats() {
  const db = await getDb();
  if (!db) return { total: 0, hot: 0, warm: 0, cold: 0 };
  const [total, hot, warm, cold] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(leadScores),
    db.select({ count: sql<number>`count(*)` }).from(leadScores).where(eq(leadScores.classification, "hot")),
    db.select({ count: sql<number>`count(*)` }).from(leadScores).where(eq(leadScores.classification, "warm")),
    db.select({ count: sql<number>`count(*)` }).from(leadScores).where(eq(leadScores.classification, "cold")),
  ]);
  return {
    total: total[0]?.count ?? 0,
    hot: hot[0]?.count ?? 0,
    warm: warm[0]?.count ?? 0,
    cold: cold[0]?.count ?? 0,
  };
}

export async function getRecentVisitorEvents(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(visitorEvents).orderBy(desc(visitorEvents.createdAt)).limit(limit);
}

// ─── Appointment Booking System ───
import {
  availabilitySlots, InsertAvailabilitySlot,
  blockedDates, InsertBlockedDate,
  bookingSettings,
  consultationTypes, InsertConsultationType,
  appointments, InsertAppointment,
} from "../drizzle/schema";

// --- Consultation Types ---
export async function getConsultationTypes(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  const where = activeOnly ? eq(consultationTypes.isActive, true) : undefined;
  return db.select().from(consultationTypes).where(where).orderBy(consultationTypes.sortOrder);
}

export async function getConsultationTypeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(consultationTypes).where(eq(consultationTypes.id, id)).limit(1);
  return rows[0];
}

export async function createConsultationType(data: InsertConsultationType) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(consultationTypes).values(data);
  return result[0].insertId;
}

export async function updateConsultationType(id: number, data: Partial<InsertConsultationType>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(consultationTypes).set(data).where(eq(consultationTypes.id, id));
}

export async function deleteConsultationType(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(consultationTypes).where(eq(consultationTypes.id, id));
}

// --- Availability Slots ---
export async function getAvailabilitySlots() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(availabilitySlots).where(eq(availabilitySlots.isActive, true)).orderBy(availabilitySlots.dayOfWeek, availabilitySlots.startTime);
}

export async function getAllAvailabilitySlots() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(availabilitySlots).orderBy(availabilitySlots.dayOfWeek, availabilitySlots.startTime);
}

export async function createAvailabilitySlot(data: InsertAvailabilitySlot) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(availabilitySlots).values(data);
  return result[0].insertId;
}

export async function updateAvailabilitySlot(id: number, data: Partial<InsertAvailabilitySlot>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(availabilitySlots).set(data).where(eq(availabilitySlots.id, id));
}

export async function deleteAvailabilitySlot(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(availabilitySlots).where(eq(availabilitySlots.id, id));
}

// --- Blocked Dates ---
export async function getBlockedDates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blockedDates).orderBy(blockedDates.date);
}

export async function createBlockedDate(data: InsertBlockedDate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blockedDates).values(data);
  return result[0].insertId;
}

export async function deleteBlockedDate(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blockedDates).where(eq(blockedDates.id, id));
}

// --- Booking Settings ---
export async function getBookingSettings() {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(bookingSettings).limit(1);
  return rows[0] ?? null;
}

export async function updateBookingSettings(data: Partial<typeof bookingSettings.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bookingSettings).set(data).where(eq(bookingSettings.id, 1));
}

// --- Appointments ---
export async function createAppointment(data: InsertAppointment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(appointments).values(data);
  return result[0].insertId;
}

export async function getAppointments(opts: {
  status?: string;
  date?: string;
  email?: string;
  limit?: number;
  offset?: number;
  upcoming?: boolean;
} = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { status, date, email, limit = 50, offset = 0, upcoming } = opts;
  const conditions = [];
  if (status) conditions.push(eq(appointments.status, status as any));
  if (date) conditions.push(eq(appointments.date, date));
  if (email) conditions.push(eq(appointments.email, email));
  if (upcoming) {
    const today = new Date().toISOString().split("T")[0];
    conditions.push(gte(appointments.date, today));
    conditions.push(
      or(
        eq(appointments.status, "pending"),
        eq(appointments.status, "confirmed")
      )!
    );
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const items = await db.select().from(appointments).where(where).orderBy(desc(appointments.createdAt), desc(appointments.date), desc(appointments.startTime)).limit(limit).offset(offset);
  const [total] = await db.select({ count: sql<number>`count(*)` }).from(appointments).where(where);
  return { items, total: total?.count ?? 0 };
}

export async function getAppointmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
  return rows[0];
}

export async function updateAppointment(id: number, data: Partial<InsertAppointment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(appointments).set(data).where(eq(appointments.id, id));
}

// --- Availability Engine: compute open time slots for a given date ---
export async function getAvailableSlots(dateStr: string, durationMinutes: number) {
  const db = await getDb();
  if (!db) return [];

  // 1. Check if date is blocked
  const blocked = await db.select().from(blockedDates).where(eq(blockedDates.date, dateStr));
  if (blocked.length > 0) return [];

  // 2. Get day of week (0=Sunday)
  const dateObj = new Date(dateStr + "T00:00:00Z");
  const dayOfWeek = dateObj.getUTCDay();

  // 3. Get availability windows for this day
  const windows = await db.select().from(availabilitySlots)
    .where(and(eq(availabilitySlots.dayOfWeek, dayOfWeek), eq(availabilitySlots.isActive, true)));
  if (windows.length === 0) return [];

  // 4. Get booking settings
  const settings = await getBookingSettings();
  const bufferMinutes = settings?.bufferMinutes ?? 15;
  const maxDaily = settings?.maxDailyBookings ?? 8;
  const minAdvanceHours = settings?.minAdvanceHours ?? 24;

  // 5. Check min advance time
  const now = new Date();
  const minBookTime = new Date(now.getTime() + minAdvanceHours * 60 * 60 * 1000);
  
  // 6. Get existing bookings for this date (exclude cancelled/rescheduled)
  const existingBookings = await db.select().from(appointments)
    .where(and(
      eq(appointments.date, dateStr),
      or(
        eq(appointments.status, "pending"),
        eq(appointments.status, "confirmed")
      )
    ));

  // 7. Check daily limit
  if (existingBookings.length >= maxDaily) return [];

  // 8. Generate all possible slots from availability windows
  const slots: { startTime: string; endTime: string }[] = [];

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

      // Check min advance time
      const slotDateTime = new Date(`${dateStr}T${slotStart}:00`);
      if (slotDateTime <= minBookTime) {
        cursor += durationMinutes + bufferMinutes;
        continue;
      }

      // Check for conflicts with existing bookings (including buffer)
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

// --- Get available dates for a month (returns dates with at least 1 open slot) ---
export async function getAvailableDates(year: number, month: number, durationMinutes: number) {
  const availableDates: string[] = [];
  const settings = await getBookingSettings();
  const maxAdvanceDays = settings?.maxAdvanceDays ?? 30;
  const now = new Date();
  const maxDate = new Date(now.getTime() + maxAdvanceDays * 24 * 60 * 60 * 1000);

  // Get all days in the month
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dateObj = new Date(dateStr + "T23:59:59Z");
    
    // Skip past dates and dates beyond max advance
    if (dateObj < now || dateObj > maxDate) continue;

    const slots = await getAvailableSlots(dateStr, durationMinutes);
    if (slots.length > 0) {
      availableDates.push(dateStr);
    }
  }

  return availableDates;
}

// --- Appointment Stats for admin dashboard ---
export async function getAppointmentStats() {
  const db = await getDb();
  if (!db) return { total: 0, upcoming: 0, completed: 0, cancelled: 0, noShow: 0, todayCount: 0 };
  const today = new Date().toISOString().split("T")[0];
  const [total, upcoming, completed, cancelled, noShow, todayCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(appointments),
    db.select({ count: sql<number>`count(*)` }).from(appointments).where(and(gte(appointments.date, today), or(eq(appointments.status, "pending"), eq(appointments.status, "confirmed")))),
    db.select({ count: sql<number>`count(*)` }).from(appointments).where(eq(appointments.status, "completed")),
    db.select({ count: sql<number>`count(*)` }).from(appointments).where(eq(appointments.status, "cancelled")),
    db.select({ count: sql<number>`count(*)` }).from(appointments).where(eq(appointments.status, "no_show")),
    db.select({ count: sql<number>`count(*)` }).from(appointments).where(eq(appointments.date, today)),
  ]);
  return {
    total: total[0]?.count ?? 0,
    upcoming: upcoming[0]?.count ?? 0,
    completed: completed[0]?.count ?? 0,
    cancelled: cancelled[0]?.count ?? 0,
    noShow: noShow[0]?.count ?? 0,
    todayCount: todayCount[0]?.count ?? 0,
  };
}

// --- Popular time slots analytics ---
export async function getPopularTimeSlots() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    startTime: appointments.startTime,
    count: sql<number>`count(*)`,
  }).from(appointments).groupBy(appointments.startTime).orderBy(sql`count(*) DESC`).limit(10);
  return result;
}


// ─── Deals / Pipeline ───
import { deals, InsertDeal } from "../drizzle/schema";

export async function createDeal(data: InsertDeal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(deals).values(data);
  return result[0].insertId;
}

export async function getDeals(opts: { limit?: number; offset?: number; stage?: string; search?: string; product?: string } = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { limit = 200, offset = 0, stage, search, product } = opts;
  const conditions = [];
  if (stage) conditions.push(eq(deals.stage, stage as any));
  if (product) conditions.push(eq(deals.product, product));
  if (search) {
    conditions.push(or(
      like(deals.title, `%${search}%`),
      like(deals.product, `%${search}%`),
      like(deals.notes, `%${search}%`)
    ));
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const items = await db.select().from(deals).where(where).orderBy(desc(deals.createdAt)).limit(limit).offset(offset);
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(deals).where(where);
  return { items, total: countResult[0]?.count ?? 0 };
}

export async function getDealById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(deals).where(eq(deals.id, id)).limit(1);
  return result[0];
}

export async function updateDeal(id: number, data: Partial<InsertDeal>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(deals).set(data).where(eq(deals.id, id));
}

export async function deleteDeal(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(deals).where(eq(deals.id, id));
}

export async function getDealStats() {
  const db = await getDb();
  if (!db) return { total: 0, byStage: [], totalValue: 0, weightedValue: 0, byProduct: [] };
  const totalResult = await db.select({ count: sql<number>`count(*)` }).from(deals);
  const byStage = await db.select({
    stage: deals.stage,
    count: sql<number>`count(*)`,
    totalValue: sql<number>`COALESCE(SUM(value), 0)`,
    weightedValue: sql<number>`COALESCE(SUM(value * probability / 100), 0)`,
  }).from(deals).groupBy(deals.stage);
  const totalValueResult = await db.select({
    totalValue: sql<number>`COALESCE(SUM(value), 0)`,
    weightedValue: sql<number>`COALESCE(SUM(value * probability / 100), 0)`,
  }).from(deals).where(sql`${deals.stage} NOT IN ('won', 'lost')`);
  const byProduct = await db.select({
    product: deals.product,
    count: sql<number>`count(*)`,
    totalValue: sql<number>`COALESCE(SUM(value), 0)`,
  }).from(deals).where(sql`${deals.product} IS NOT NULL`).groupBy(deals.product);
  return {
    total: totalResult[0]?.count ?? 0,
    byStage,
    totalValue: totalValueResult[0]?.totalValue ?? 0,
    weightedValue: totalValueResult[0]?.weightedValue ?? 0,
    byProduct,
  };
}

export async function getCompanyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
  return result[0];
}

export async function getCompanyContacts(companyName: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contacts).where(eq(contacts.company, companyName)).orderBy(desc(contacts.createdAt));
}

export async function getCompanyDeals(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(deals).where(eq(deals.companyId, companyId)).orderBy(desc(deals.createdAt));
}


/* ═══════════════════════════════════════════════════════════════
   CUSTOM PROPERTIES
   ═══════════════════════════════════════════════════════════════ */

export async function getCustomProperties(entityType: "contact" | "company") {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customProperties)
    .where(eq(customProperties.entityType, entityType))
    .orderBy(customProperties.sortOrder, customProperties.createdAt);
}

export async function createCustomProperty(data: Omit<InsertCustomProperty, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.insert(customProperties).values(data);
  return Number(result[0].insertId);
}

export async function updateCustomProperty(id: number, data: Partial<InsertCustomProperty>) {
  const db = await getDb();
  if (!db) return;
  await db.update(customProperties).set(data).where(eq(customProperties.id, id));
}

export async function deleteCustomProperty(id: number) {
  const db = await getDb();
  if (!db) return;
  // Delete all values for this property first
  await db.delete(customPropertyValues).where(eq(customPropertyValues.propertyId, id));
  await db.delete(customProperties).where(eq(customProperties.id, id));
}

export async function getPropertyValues(entityType: "contact" | "company", entityId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customPropertyValues)
    .where(and(
      eq(customPropertyValues.entityType, entityType),
      eq(customPropertyValues.entityId, entityId),
    ));
}

export async function setPropertyValue(propertyId: number, entityType: "contact" | "company", entityId: number, value: string | null) {
  const db = await getDb();
  if (!db) return;
  // Check if value already exists
  const existing = await db.select().from(customPropertyValues)
    .where(and(
      eq(customPropertyValues.propertyId, propertyId),
      eq(customPropertyValues.entityType, entityType),
      eq(customPropertyValues.entityId, entityId),
    ));
  if (existing.length > 0) {
    await db.update(customPropertyValues).set({ value }).where(eq(customPropertyValues.id, existing[0].id));
  } else {
    await db.insert(customPropertyValues).values({ propertyId, entityType, entityId, value });
  }
}

export async function setBulkPropertyValues(entityType: "contact" | "company", entityId: number, values: { propertyId: number; value: string | null }[]) {
  const db = await getDb();
  if (!db) return;
  for (const v of values) {
    await setPropertyValue(v.propertyId, entityType, entityId, v.value);
  }
}
