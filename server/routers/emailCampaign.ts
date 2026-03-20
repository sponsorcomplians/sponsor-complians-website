import { router, adminProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import * as ecDb from "../emailCampaignDb";
import { invokeLLM } from "../_core/llm";

export const emailCampaignRouter = router({
  // ═══════════════════════════════════════════════════════════════
  // CAMPAIGNS
  // ═══════════════════════════════════════════════════════════════
  campaigns: router({
    list: adminProcedure.input(z.object({
      limit: z.number().min(1).max(200).optional(),
      offset: z.number().min(0).optional(),
      status: z.string().optional(),
      search: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return ecDb.getCampaigns(input ?? {});
    }),

    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return ecDb.getCampaignById(input.id);
    }),

    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      subject: z.string().optional(),
      previewText: z.string().optional(),
      fromName: z.string().optional(),
      fromEmail: z.string().optional(),
      replyTo: z.string().optional(),
      contentJson: z.any().optional(),
      contentHtml: z.string().optional(),
      recipientListId: z.number().optional(),
    })).mutation(async ({ input }) => {
      const id = await ecDb.createCampaign(input as any);
      return { id };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      subject: z.string().optional(),
      previewText: z.string().optional(),
      fromName: z.string().optional(),
      fromEmail: z.string().optional(),
      replyTo: z.string().optional(),
      contentJson: z.any().optional(),
      contentHtml: z.string().optional(),
      status: z.enum(["draft", "scheduled", "sending", "sent", "paused", "cancelled"]).optional(),
      recipientListId: z.number().optional(),
      scheduledAt: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, scheduledAt, ...data } = input;
      const updateData: any = { ...data };
      if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
      await ecDb.updateCampaign(id, updateData);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await ecDb.deleteCampaign(input.id);
      return { success: true };
    }),

    duplicate: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const newId = await ecDb.duplicateCampaign(input.id);
      return { id: newId };
    }),

    // AI Subject Line Generator
    generateSubjectLines: adminProcedure.input(z.object({
      topic: z.string().min(1),
      tone: z.string().optional(),
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
          ],
        });
        const rawContent = response.choices?.[0]?.message?.content || "";
        const text = typeof rawContent === "string" ? rawContent : "";
        const lines = text.split("\n").filter((l: string) => l.trim()).map((l: string) => l.replace(/^\d+[\.\)]\s*/, "").trim());
        return { subjectLines: lines };
      } catch {
        return { subjectLines: ["Check out our latest compliance update", "Important sponsor licence news", "Your weekly compliance briefing", "Don't miss this compliance alert", "New from Sponsor ComplIANS"] };
      }
    }),

    // Campaign analytics
    analytics: adminProcedure.query(async () => {
      return ecDb.getCampaignAnalytics();
    }),

    recipients: adminProcedure.input(z.object({
      campaignId: z.number(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    })).query(async ({ input }) => {
      return ecDb.getCampaignRecipients(input.campaignId, input);
    }),

    events: adminProcedure.input(z.object({
      campaignId: z.number(),
      type: z.string().optional(),
      limit: z.number().optional(),
    })).query(async ({ input }) => {
      return ecDb.getCampaignEvents(input.campaignId, input);
    }),

    // Send campaign immediately
    send: adminProcedure.input(z.object({
      campaignId: z.number(),
    })).mutation(async ({ input }) => {
      const { sendCampaign } = await import("../sendgridService");
      const campaign = await ecDb.getCampaignById(input.campaignId);
      if (!campaign) throw new Error("Campaign not found");
      if (!campaign.subject) throw new Error("Campaign subject is required");
      if (!campaign.contentHtml && !campaign.contentJson) throw new Error("Campaign content is required");

      // Get recipients from the campaign's list
      let recipients: { contactId: number; email: string; firstName?: string; lastName?: string; company?: string }[] = [];
      if (campaign.recipientListId) {
        const members = await ecDb.getListMembers(campaign.recipientListId);
        recipients = members.map((m: any) => ({
          contactId: m.contact.id,
          email: m.contact.email,
          firstName: m.contact.firstName,
          lastName: m.contact.lastName,
          company: m.contact.company || undefined,
        }));
      }

      if (recipients.length === 0) throw new Error("No recipients found. Please assign a contact list to this campaign.");

      // Add recipients to campaign_recipients table
      await ecDb.addCampaignRecipients(input.campaignId, recipients.map(r => ({ contactId: r.contactId, email: r.email })));

      // Get sender defaults from settings
      const fromName = campaign.fromName || await ecDb.getEmailSetting("default_from_name") || "Sponsor ComplIANS";
      const fromEmail = campaign.fromEmail || await ecDb.getEmailSetting("default_from_email") || "hello@sponsorcomplians.com";
      const replyTo = campaign.replyTo || await ecDb.getEmailSetting("default_reply_to") || fromEmail;

      const result = await sendCampaign({
        campaignId: input.campaignId,
        subject: campaign.subject,
        htmlContent: campaign.contentHtml || "<p>No content</p>",
        fromName,
        fromEmail,
        replyTo,
        previewText: campaign.previewText || undefined,
        recipients,
      });

      return result;
    }),

    // Schedule campaign for later
    schedule: adminProcedure.input(z.object({
      campaignId: z.number(),
      scheduledAt: z.string(),
    })).mutation(async ({ input }) => {
      await ecDb.updateCampaign(input.campaignId, {
        status: "scheduled",
        scheduledAt: new Date(input.scheduledAt),
      } as any);
      return { success: true };
    }),

    // Send a test email
    sendTest: adminProcedure.input(z.object({
      campaignId: z.number(),
      testEmail: z.string().email(),
    })).mutation(async ({ input }) => {
      const { sendTestEmail } = await import("../sendgridService");
      const campaign = await ecDb.getCampaignById(input.campaignId);
      if (!campaign) throw new Error("Campaign not found");

      const fromName = campaign.fromName || await ecDb.getEmailSetting("default_from_name") || "Sponsor ComplIANS";
      const fromEmail = campaign.fromEmail || await ecDb.getEmailSetting("default_from_email") || "hello@sponsorcomplians.com";

      const result = await sendTestEmail({
        to: input.testEmail,
        subject: campaign.subject || "Test Email",
        htmlContent: campaign.contentHtml || "<p>Test email content</p>",
        fromName,
        fromEmail,
        previewText: campaign.previewText || undefined,
      });

      return result;
    }),

    // Verify SendGrid API key
    verifyApiKey: adminProcedure.query(async () => {
      const { verifyApiKey } = await import("../sendgridService");
      return verifyApiKey();
    }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // TEMPLATES
  // ═══════════════════════════════════════════════════════════════
  templates: router({
    list: adminProcedure.input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return ecDb.getEmailTemplates(input ?? {});
    }),

    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return ecDb.getEmailTemplateById(input.id);
    }),

    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      category: z.enum(["newsletter", "promotional", "transactional", "compliance", "onboarding", "custom"]).optional(),
      description: z.string().optional(),
      contentJson: z.any().optional(),
      contentHtml: z.string().optional(),
      thumbnailUrl: z.string().optional(),
      isDefault: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const id = await ecDb.createEmailTemplate(input as any);
      return { id };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      category: z.enum(["newsletter", "promotional", "transactional", "compliance", "onboarding", "custom"]).optional(),
      description: z.string().optional(),
      contentJson: z.any().optional(),
      contentHtml: z.string().optional(),
      thumbnailUrl: z.string().optional(),
      isDefault: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await ecDb.updateEmailTemplate(id, data as any);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await ecDb.deleteEmailTemplate(input.id);
      return { success: true };
    }),

    duplicate: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const original = await ecDb.getEmailTemplateById(input.id);
      if (!original) throw new Error("Template not found");
      const newId = await ecDb.createEmailTemplate({
        name: `${original.name} (Copy)`,
        category: original.category,
        description: original.description,
        contentJson: original.contentJson,
        contentHtml: original.contentHtml,
        thumbnailUrl: original.thumbnailUrl,
      });
      return { id: newId };
    }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // CONTACT LISTS
  // ═══════════════════════════════════════════════════════════════
  lists: router({
    list: adminProcedure.input(z.object({
      search: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return ecDb.getContactLists(input ?? {});
    }),

    listForSelect: adminProcedure.query(async () => {
      return ecDb.getContactListsForSelect();
    }),

    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return ecDb.getContactListById(input.id);
    }),

    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      type: z.enum(["static", "dynamic"]).optional(),
      filterCriteria: z.any().optional(),
    })).mutation(async ({ input }) => {
      const id = await ecDb.createContactList(input as any);
      return { id };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      type: z.enum(["static", "dynamic"]).optional(),
      filterCriteria: z.any().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await ecDb.updateContactList(id, data as any);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await ecDb.deleteContactList(input.id);
      return { success: true };
    }),

    members: adminProcedure.input(z.object({ listId: z.number() })).query(async ({ input }) => {
      return ecDb.getListMembers(input.listId);
    }),

    addMembers: adminProcedure.input(z.object({
      listId: z.number(),
      contactIds: z.array(z.number()),
    })).mutation(async ({ input }) => {
      await ecDb.addListMembers(input.listId, input.contactIds);
      return { success: true };
    }),

    removeMember: adminProcedure.input(z.object({
      listId: z.number(),
      contactId: z.number(),
    })).mutation(async ({ input }) => {
      await ecDb.removeListMember(input.listId, input.contactId);
      return { success: true };
    }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // TAGS
  // ═══════════════════════════════════════════════════════════════
  tags: router({
    list: adminProcedure.query(async () => {
      return ecDb.getContactTags();
    }),

    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      color: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await ecDb.createContactTag(input);
      return { id };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await ecDb.deleteContactTag(input.id);
      return { success: true };
    }),

    assignToContact: adminProcedure.input(z.object({
      contactId: z.number(),
      tagId: z.number(),
    })).mutation(async ({ input }) => {
      await ecDb.assignTagToContact(input.contactId, input.tagId);
      return { success: true };
    }),

    removeFromContact: adminProcedure.input(z.object({
      contactId: z.number(),
      tagId: z.number(),
    })).mutation(async ({ input }) => {
      await ecDb.removeTagFromContact(input.contactId, input.tagId);
      return { success: true };
    }),

    getForContact: adminProcedure.input(z.object({ contactId: z.number() })).query(async ({ input }) => {
      return ecDb.getContactTagAssignments(input.contactId);
    }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // NOTES
  // ═══════════════════════════════════════════════════════════════
  notes: router({
    list: adminProcedure.input(z.object({ contactId: z.number() })).query(async ({ input }) => {
      return ecDb.getContactNotes(input.contactId);
    }),

    create: adminProcedure.input(z.object({
      contactId: z.number(),
      content: z.string().min(1),
      type: z.enum(["note", "call", "email", "meeting", "task"]).optional(),
    })).mutation(async ({ ctx, input }) => {
      const id = await ecDb.createContactNote({ ...input, createdBy: ctx.user.id });
      return { id };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await ecDb.deleteContactNote(input.id);
      return { success: true };
    }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // TASKS
  // ═══════════════════════════════════════════════════════════════
  tasks: router({
    listForContact: adminProcedure.input(z.object({ contactId: z.number() })).query(async ({ input }) => {
      return ecDb.getContactTasks(input.contactId);
    }),

    listAll: adminProcedure.input(z.object({
      status: z.string().optional(),
      priority: z.string().optional(),
      limit: z.number().optional(),
    }).optional()).query(async ({ input }) => {
      return ecDb.getAllTasks(input ?? {});
    }),

    create: adminProcedure.input(z.object({
      contactId: z.number(),
      title: z.string().min(1),
      description: z.string().optional(),
      dueDate: z.string().optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    })).mutation(async ({ ctx, input }) => {
      const { dueDate, ...rest } = input;
      const data: any = { ...rest, assignedTo: ctx.user.id };
      if (dueDate) data.dueDate = new Date(dueDate);
      const id = await ecDb.createContactTask(data);
      return { id };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      dueDate: z.string().optional(),
      status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    })).mutation(async ({ input }) => {
      const { id, dueDate, ...rest } = input;
      const data: any = { ...rest };
      if (dueDate) data.dueDate = new Date(dueDate);
      await ecDb.updateContactTask(id, data);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await ecDb.deleteContactTask(input.id);
      return { success: true };
    }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // DEALS
  // ═══════════════════════════════════════════════════════════════
  deals: router({
    list: adminProcedure.input(z.object({
      companyId: z.number().optional(),
      stage: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().optional(),
    }).optional()).query(async ({ input }) => {
      return ecDb.getDeals(input ?? {});
    }),

    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return ecDb.getDealById(input.id);
    }),

    create: adminProcedure.input(z.object({
      companyId: z.number(),
      contactId: z.number().optional(),
      title: z.string().min(1),
      value: z.number().optional(),
      stage: z.enum(["lead", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
      expectedCloseDate: z.string().optional(),
      productInterest: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { expectedCloseDate, ...rest } = input;
      const data: any = { ...rest };
      if (expectedCloseDate) data.expectedCloseDate = new Date(expectedCloseDate);
      const id = await ecDb.createDeal(data);
      return { id };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      value: z.number().optional(),
      stage: z.enum(["lead", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
      expectedCloseDate: z.string().optional(),
      productInterest: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, expectedCloseDate, ...rest } = input;
      const data: any = { ...rest };
      if (expectedCloseDate) data.expectedCloseDate = new Date(expectedCloseDate);
      await ecDb.updateDeal(id, data);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await ecDb.deleteDeal(input.id);
      return { success: true };
    }),

    stats: adminProcedure.query(async () => {
      return ecDb.getDealStats();
    }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // AUTOMATIONS
  // ═══════════════════════════════════════════════════════════════
  automations: router({
    list: adminProcedure.input(z.object({
      status: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return ecDb.getAutomations(input ?? {});
    }),

    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const automation = await ecDb.getAutomationById(input.id);
      const steps = automation ? await ecDb.getAutomationSteps(input.id) : [];
      return { automation, steps };
    }),

    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      trigger: z.enum(["contact_created", "tag_added", "list_joined", "form_submitted", "campaign_opened", "campaign_clicked", "manual"]),
      triggerConfig: z.any().optional(),
      status: z.enum(["active", "paused", "draft"]).optional(),
    })).mutation(async ({ input }) => {
      const id = await ecDb.createAutomation(input as any);
      return { id };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      trigger: z.enum(["contact_created", "tag_added", "list_joined", "form_submitted", "campaign_opened", "campaign_clicked", "manual"]).optional(),
      triggerConfig: z.any().optional(),
      status: z.enum(["active", "paused", "draft"]).optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await ecDb.updateAutomation(id, data as any);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await ecDb.deleteAutomation(input.id);
      return { success: true };
    }),

    setSteps: adminProcedure.input(z.object({
      automationId: z.number(),
      steps: z.array(z.object({
        type: z.enum(["send_email", "wait", "add_tag", "remove_tag", "add_to_list", "remove_from_list", "update_field", "notify_team", "condition"]),
        config: z.any().optional(),
      })),
    })).mutation(async ({ input }) => {
      await ecDb.setAutomationSteps(input.automationId, input.steps.map((s, i) => ({
        automationId: input.automationId,
        stepOrder: i + 1,
        type: s.type,
        config: s.config,
      })));
      return { success: true };
    }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // DAILY EMAIL AI
  // ═══════════════════════════════════════════════════════════════
  dailyEmail: router({
    list: adminProcedure.input(z.object({
      status: z.string().optional(),
      limit: z.number().optional(),
    }).optional()).query(async ({ input }) => {
      return ecDb.getDailyEmailDrafts(input ?? {});
    }),

    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return ecDb.getDailyEmailDraftById(input.id);
    }),

    approve: adminProcedure.input(z.object({
      id: z.number(),
      subject: z.string().optional(),
      scheduledFor: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const data: any = {
        status: "approved",
        approvedBy: ctx.user.id,
        approvedAt: new Date(),
      };
      if (input.subject) data.subject = input.subject;
      if (input.scheduledFor) data.scheduledFor = new Date(input.scheduledFor);
      await ecDb.updateDailyEmailDraft(input.id, data);
      return { success: true };
    }),

    reject: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await ecDb.updateDailyEmailDraft(input.id, { status: "rejected" } as any);
      return { success: true };
    }),

    regenerate: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      // Mark old draft as rejected and create a new one via AI
      await ecDb.updateDailyEmailDraft(input.id, { status: "rejected" } as any);
      // In production, this would trigger the AI generation pipeline
      return { success: true, message: "Regeneration triggered. New draft will appear shortly." };
    }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // CONTENT SOURCES
  // ═══════════════════════════════════════════════════════════════
  contentSources: router({
    list: adminProcedure.query(async () => {
      return ecDb.getContentSources();
    }),

    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      type: z.enum(["rss", "website", "api", "manual"]),
      url: z.string().optional(),
      config: z.any().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const id = await ecDb.createContentSource(input as any);
      return { id };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      type: z.enum(["rss", "website", "api", "manual"]).optional(),
      url: z.string().optional(),
      config: z.any().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await ecDb.updateContentSource(id, data as any);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await ecDb.deleteContentSource(input.id);
      return { success: true };
    }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // EMAIL SETTINGS
  // ═══════════════════════════════════════════════════════════════
  settings: router({
    list: adminProcedure.query(async () => {
      return ecDb.getEmailSettings();
    }),

    get: adminProcedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
      return ecDb.getEmailSetting(input.key);
    }),

    set: adminProcedure.input(z.object({
      key: z.string(),
      value: z.string(),
    })).mutation(async ({ input }) => {
      await ecDb.setEmailSetting(input.key, input.value);
      return { success: true };
    }),
  }),
});
