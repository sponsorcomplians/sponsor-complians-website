import { drizzle } from "drizzle-orm/mysql2";
import { eq, desc, asc, like, and, or, sql, count, inArray } from "drizzle-orm";
import {
  campaigns, InsertCampaign, Campaign,
  emailTemplates, InsertEmailTemplate, EmailTemplate,
  contactLists, InsertContactList, ContactList,
  listMembers, InsertListMember, ListMember,
  contactTags, InsertContactTag, ContactTag,
  contactTagAssignments,
  contactNotes, InsertContactNote, ContactNote,
  contactTasks, InsertContactTask, ContactTask,
  deals, InsertDeal, Deal,
  campaignRecipients, InsertCampaignRecipient, CampaignRecipient,
  campaignEvents, InsertCampaignEvent, CampaignEvent,
  automations, InsertAutomation, Automation,
  automationSteps, InsertAutomationStep, AutomationStep,
  automationEnrollments, InsertAutomationEnrollment, AutomationEnrollment,
  dailyEmailDrafts, InsertDailyEmailDraft, DailyEmailDraft,
  contentSources, InsertContentSource, ContentSource,
  emailSettings, InsertEmailSetting, EmailSetting,
  contacts,
  companies,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[EmailCampaignDB] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ═══════════════════════════════════════════════════════════════
// CAMPAIGNS
// ═══════════════════════════════════════════════════════════════

export async function getCampaigns(opts: { limit?: number; offset?: number; status?: string; search?: string } = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const conditions = [];
  if (opts.status) conditions.push(eq(campaigns.status, opts.status as any));
  if (opts.search) conditions.push(like(campaigns.name, `%${opts.search}%`));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [items, totalResult] = await Promise.all([
    db.select().from(campaigns).where(where).orderBy(desc(campaigns.createdAt)).limit(opts.limit ?? 50).offset(opts.offset ?? 0),
    db.select({ count: count() }).from(campaigns).where(where),
  ]);
  return { items, total: totalResult[0]?.count ?? 0 };
}

export async function getCampaignById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
  return campaign ?? null;
}

export async function createCampaign(data: Omit<InsertCampaign, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(campaigns).values(data as any);
  return result.insertId;
}

export async function updateCampaign(id: number, data: Partial<InsertCampaign>) {
  const db = await getDb();
  if (!db) return;
  await db.update(campaigns).set(data as any).where(eq(campaigns.id, id));
}

export async function deleteCampaign(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(campaignRecipients).where(eq(campaignRecipients.campaignId, id));
  await db.delete(campaignEvents).where(eq(campaignEvents.campaignId, id));
  await db.delete(campaigns).where(eq(campaigns.id, id));
}

export async function duplicateCampaign(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const original = await getCampaignById(id);
  if (!original) throw new Error("Campaign not found");
  const { id: _id, createdAt, updatedAt, sentAt, scheduledAt, status, totalSent, totalOpened, totalClicked, totalBounced, totalUnsubscribed, ...rest } = original;
  const [result] = await db.insert(campaigns).values({
    ...rest,
    name: `${rest.name} (Copy)`,
    status: "draft",
  } as any);
  return result.insertId;
}

// ═══════════════════════════════════════════════════════════════
// CAMPAIGN RECIPIENTS & EVENTS
// ═══════════════════════════════════════════════════════════════

export async function addCampaignRecipients(campaignId: number, recipients: { contactId: number; email: string }[]) {
  const db = await getDb();
  if (!db) return;
  if (recipients.length === 0) return;
  const values = recipients.map(r => ({ campaignId, contactId: r.contactId, email: r.email, status: "pending" as const }));
  await db.insert(campaignRecipients).values(values as any);
  await db.update(campaigns).set({ recipientCount: recipients.length } as any).where(eq(campaigns.id, campaignId));
}

export async function getCampaignRecipients(campaignId: number, opts: { limit?: number; offset?: number } = {}) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(campaignRecipients).where(eq(campaignRecipients.campaignId, campaignId)).limit(opts.limit ?? 100).offset(opts.offset ?? 0);
}

export async function recordCampaignEvent(data: InsertCampaignEvent) {
  const db = await getDb();
  if (!db) return;
  await db.insert(campaignEvents).values(data as any);
  // Update campaign stats
  const statField = data.type === "open" ? "totalOpened" : data.type === "click" ? "totalClicked" : data.type === "bounce" ? "totalBounced" : data.type === "unsubscribe" ? "totalUnsubscribed" : null;
  if (statField) {
    await db.update(campaigns).set({ [statField]: sql`${campaigns[statField as keyof typeof campaigns]} + 1` } as any).where(eq(campaigns.id, data.campaignId));
  }
}

export async function getCampaignEvents(campaignId: number, opts: { type?: string; limit?: number } = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(campaignEvents.campaignId, campaignId)];
  if (opts.type) conditions.push(eq(campaignEvents.type, opts.type as any));
  return db.select().from(campaignEvents).where(and(...conditions)).orderBy(desc(campaignEvents.createdAt)).limit(opts.limit ?? 200);
}

// ═══════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════════

export async function getEmailTemplates(opts: { category?: string; search?: string } = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts.category) conditions.push(eq(emailTemplates.category, opts.category as any));
  if (opts.search) conditions.push(like(emailTemplates.name, `%${opts.search}%`));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(emailTemplates).where(where).orderBy(desc(emailTemplates.updatedAt));
}

export async function getEmailTemplateById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [template] = await db.select().from(emailTemplates).where(eq(emailTemplates.id, id)).limit(1);
  return template ?? null;
}

export async function createEmailTemplate(data: Omit<InsertEmailTemplate, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(emailTemplates).values(data as any);
  return result.insertId;
}

export async function updateEmailTemplate(id: number, data: Partial<InsertEmailTemplate>) {
  const db = await getDb();
  if (!db) return;
  await db.update(emailTemplates).set(data as any).where(eq(emailTemplates.id, id));
}

export async function deleteEmailTemplate(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(emailTemplates).where(eq(emailTemplates.id, id));
}

// ═══════════════════════════════════════════════════════════════
// CONTACT LISTS
// ═══════════════════════════════════════════════════════════════

export async function getContactLists(opts: { search?: string } = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts.search) conditions.push(like(contactLists.name, `%${opts.search}%`));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(contactLists).where(where).orderBy(desc(contactLists.updatedAt));
}

export async function getContactListById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [list] = await db.select().from(contactLists).where(eq(contactLists.id, id)).limit(1);
  return list ?? null;
}

export async function createContactList(data: Omit<InsertContactList, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(contactLists).values(data as any);
  return result.insertId;
}

export async function updateContactList(id: number, data: Partial<InsertContactList>) {
  const db = await getDb();
  if (!db) return;
  await db.update(contactLists).set(data as any).where(eq(contactLists.id, id));
}

export async function deleteContactList(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(listMembers).where(eq(listMembers.listId, id));
  await db.delete(contactLists).where(eq(contactLists.id, id));
}

export async function addListMembers(listId: number, contactIds: number[]) {
  const db = await getDb();
  if (!db) return;
  if (contactIds.length === 0) return;
  const values = contactIds.map(contactId => ({ listId, contactId }));
  await db.insert(listMembers).values(values as any);
  // Update member count
  const [countResult] = await db.select({ count: count() }).from(listMembers).where(eq(listMembers.listId, listId));
  await db.update(contactLists).set({ memberCount: countResult?.count ?? 0 } as any).where(eq(contactLists.id, listId));
}

export async function removeListMember(listId: number, contactId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(listMembers).where(and(eq(listMembers.listId, listId), eq(listMembers.contactId, contactId)));
  const [countResult] = await db.select({ count: count() }).from(listMembers).where(eq(listMembers.listId, listId));
  await db.update(contactLists).set({ memberCount: countResult?.count ?? 0 } as any).where(eq(contactLists.id, listId));
}

export async function getListMembers(listId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    listMember: listMembers,
    contact: contacts,
  }).from(listMembers)
    .innerJoin(contacts, eq(listMembers.contactId, contacts.id))
    .where(eq(listMembers.listId, listId))
    .orderBy(desc(listMembers.addedAt));
}

// ═══════════════════════════════════════════════════════════════
// CONTACT TAGS
// ═══════════════════════════════════════════════════════════════

export async function getContactTags() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactTags).orderBy(asc(contactTags.name));
}

export async function createContactTag(data: Omit<InsertContactTag, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(contactTags).values(data as any);
  return result.insertId;
}

export async function deleteContactTag(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(contactTagAssignments).where(eq(contactTagAssignments.tagId, id));
  await db.delete(contactTags).where(eq(contactTags.id, id));
}

export async function assignTagToContact(contactId: number, tagId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(contactTagAssignments).values({ contactId, tagId } as any);
}

export async function removeTagFromContact(contactId: number, tagId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(contactTagAssignments).where(and(eq(contactTagAssignments.contactId, contactId), eq(contactTagAssignments.tagId, tagId)));
}

export async function getContactTagAssignments(contactId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    assignment: contactTagAssignments,
    tag: contactTags,
  }).from(contactTagAssignments)
    .innerJoin(contactTags, eq(contactTagAssignments.tagId, contactTags.id))
    .where(eq(contactTagAssignments.contactId, contactId));
}

// ═══════════════════════════════════════════════════════════════
// CONTACT NOTES
// ═══════════════════════════════════════════════════════════════

export async function getContactNotes(contactId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactNotes).where(eq(contactNotes.contactId, contactId)).orderBy(desc(contactNotes.createdAt));
}

export async function createContactNote(data: Omit<InsertContactNote, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(contactNotes).values(data as any);
  return result.insertId;
}

export async function deleteContactNote(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(contactNotes).where(eq(contactNotes.id, id));
}

// ═══════════════════════════════════════════════════════════════
// CONTACT TASKS
// ═══════════════════════════════════════════════════════════════

export async function getContactTasks(contactId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactTasks).where(eq(contactTasks.contactId, contactId)).orderBy(desc(contactTasks.createdAt));
}

export async function getAllTasks(opts: { status?: string; priority?: string; limit?: number } = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts.status) conditions.push(eq(contactTasks.status, opts.status as any));
  if (opts.priority) conditions.push(eq(contactTasks.priority, opts.priority as any));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(contactTasks).where(where).orderBy(desc(contactTasks.createdAt)).limit(opts.limit ?? 100);
}

export async function createContactTask(data: Omit<InsertContactTask, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(contactTasks).values(data as any);
  return result.insertId;
}

export async function updateContactTask(id: number, data: Partial<InsertContactTask>) {
  const db = await getDb();
  if (!db) return;
  await db.update(contactTasks).set(data as any).where(eq(contactTasks.id, id));
}

export async function deleteContactTask(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(contactTasks).where(eq(contactTasks.id, id));
}

// ═══════════════════════════════════════════════════════════════
// DEALS
// ═══════════════════════════════════════════════════════════════

export async function getDeals(opts: { companyId?: number; stage?: string; search?: string; limit?: number } = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts.companyId) conditions.push(eq(deals.companyId, opts.companyId));
  if (opts.stage) conditions.push(eq(deals.stage, opts.stage as any));
  if (opts.search) conditions.push(like(deals.title, `%${opts.search}%`));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(deals).where(where).orderBy(desc(deals.createdAt)).limit(opts.limit ?? 100);
}

export async function getDealById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [deal] = await db.select().from(deals).where(eq(deals.id, id)).limit(1);
  return deal ?? null;
}

export async function createDeal(data: Omit<InsertDeal, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(deals).values(data as any);
  return result.insertId;
}

export async function updateDeal(id: number, data: Partial<InsertDeal>) {
  const db = await getDb();
  if (!db) return;
  await db.update(deals).set(data as any).where(eq(deals.id, id));
}

export async function deleteDeal(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(deals).where(eq(deals.id, id));
}

export async function getDealStats() {
  const db = await getDb();
  if (!db) return { total: 0, totalValue: 0, byStage: [] };
  const [totalResult] = await db.select({ count: count(), totalValue: sql<number>`COALESCE(SUM(${deals.value}), 0)` }).from(deals);
  const byStage = await db.select({ stage: deals.stage, count: count(), value: sql<number>`COALESCE(SUM(${deals.value}), 0)` }).from(deals).groupBy(deals.stage);
  return { total: totalResult?.count ?? 0, totalValue: totalResult?.totalValue ?? 0, byStage };
}

// ═══════════════════════════════════════════════════════════════
// AUTOMATIONS
// ═══════════════════════════════════════════════════════════════

export async function getAutomations(opts: { status?: string } = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts.status) conditions.push(eq(automations.status, opts.status as any));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(automations).where(where).orderBy(desc(automations.createdAt));
}

export async function getAutomationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [automation] = await db.select().from(automations).where(eq(automations.id, id)).limit(1);
  return automation ?? null;
}

export async function createAutomation(data: Omit<InsertAutomation, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(automations).values(data as any);
  return result.insertId;
}

export async function updateAutomation(id: number, data: Partial<InsertAutomation>) {
  const db = await getDb();
  if (!db) return;
  await db.update(automations).set(data as any).where(eq(automations.id, id));
}

export async function deleteAutomation(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(automationEnrollments).where(eq(automationEnrollments.automationId, id));
  await db.delete(automationSteps).where(eq(automationSteps.automationId, id));
  await db.delete(automations).where(eq(automations.id, id));
}

// Automation Steps
export async function getAutomationSteps(automationId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(automationSteps).where(eq(automationSteps.automationId, automationId)).orderBy(asc(automationSteps.stepOrder));
}

export async function setAutomationSteps(automationId: number, steps: Omit<InsertAutomationStep, "id" | "createdAt">[]) {
  const db = await getDb();
  if (!db) return;
  await db.delete(automationSteps).where(eq(automationSteps.automationId, automationId));
  if (steps.length > 0) {
    await db.insert(automationSteps).values(steps.map((s, i) => ({ ...s, automationId, stepOrder: i + 1 })) as any);
  }
}

// ═══════════════════════════════════════════════════════════════
// DAILY EMAIL DRAFTS
// ═══════════════════════════════════════════════════════════════

export async function getDailyEmailDrafts(opts: { status?: string; limit?: number } = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts.status) conditions.push(eq(dailyEmailDrafts.status, opts.status as any));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(dailyEmailDrafts).where(where).orderBy(desc(dailyEmailDrafts.createdAt)).limit(opts.limit ?? 30);
}

export async function getDailyEmailDraftById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [draft] = await db.select().from(dailyEmailDrafts).where(eq(dailyEmailDrafts.id, id)).limit(1);
  return draft ?? null;
}

export async function createDailyEmailDraft(data: Omit<InsertDailyEmailDraft, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(dailyEmailDrafts).values(data as any);
  return result.insertId;
}

export async function updateDailyEmailDraft(id: number, data: Partial<InsertDailyEmailDraft>) {
  const db = await getDb();
  if (!db) return;
  await db.update(dailyEmailDrafts).set(data as any).where(eq(dailyEmailDrafts.id, id));
}

// ═══════════════════════════════════════════════════════════════
// CONTENT SOURCES
// ═══════════════════════════════════════════════════════════════

export async function getContentSources() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contentSources).orderBy(desc(contentSources.createdAt));
}

export async function createContentSource(data: Omit<InsertContentSource, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(contentSources).values(data as any);
  return result.insertId;
}

export async function updateContentSource(id: number, data: Partial<InsertContentSource>) {
  const db = await getDb();
  if (!db) return;
  await db.update(contentSources).set(data as any).where(eq(contentSources.id, id));
}

export async function deleteContentSource(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(contentSources).where(eq(contentSources.id, id));
}

// ═══════════════════════════════════════════════════════════════
// EMAIL SETTINGS
// ═══════════════════════════════════════════════════════════════

export async function getEmailSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emailSettings).orderBy(asc(emailSettings.settingKey));
}

export async function getEmailSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const [setting] = await db.select().from(emailSettings).where(eq(emailSettings.settingKey, key)).limit(1);
  return setting?.settingValue ?? null;
}

export async function setEmailSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) return;
  const existing = await getEmailSetting(key);
  if (existing !== null) {
    await db.update(emailSettings).set({ settingValue: value } as any).where(eq(emailSettings.settingKey, key));
  } else {
    await db.insert(emailSettings).values({ settingKey: key, settingValue: value } as any);
  }
}

// ═══════════════════════════════════════════════════════════════
// ANALYTICS HELPERS
// ═══════════════════════════════════════════════════════════════

export async function getCampaignAnalytics() {
  const db = await getDb();
  if (!db) return { totalSent: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0, totalUnsubscribed: 0, campaignCount: 0 };
  const [result] = await db.select({
    campaignCount: count(),
    totalSent: sql<number>`COALESCE(SUM(${campaigns.totalSent}), 0)`,
    totalOpened: sql<number>`COALESCE(SUM(${campaigns.totalOpened}), 0)`,
    totalClicked: sql<number>`COALESCE(SUM(${campaigns.totalClicked}), 0)`,
    totalBounced: sql<number>`COALESCE(SUM(${campaigns.totalBounced}), 0)`,
    totalUnsubscribed: sql<number>`COALESCE(SUM(${campaigns.totalUnsubscribed}), 0)`,
  }).from(campaigns).where(eq(campaigns.status, "sent"));
  return result ?? { totalSent: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0, totalUnsubscribed: 0, campaignCount: 0 };
}

export async function getContactListsForSelect() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: contactLists.id, name: contactLists.name, memberCount: contactLists.memberCount }).from(contactLists).orderBy(asc(contactLists.name));
}
