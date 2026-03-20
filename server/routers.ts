import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import { notifyWebinarRegistration, notifyContactFormSubmission } from "./email";
import { bookingRouter } from "./bookingRoutes";
import { emailCampaignRouter } from "./routers/emailCampaign";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Dashboard Stats (Admin) ───
  dashboard: router({
    stats: adminProcedure.query(async () => {
      return db.getDashboardStats();
    }),
  }),

  // ─── CRM Contacts (Admin) ───
  contacts: router({
    list: adminProcedure.input(z.object({
      limit: z.number().min(1).max(200).optional(),
      offset: z.number().min(0).optional(),
      search: z.string().optional(),
      status: z.string().optional(),
      source: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getContacts(input ?? {});
    }),
    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getContactById(input.id);
    }),
    stats: adminProcedure.query(async () => {
      return db.getContactStats();
    }),
    bulkImport: adminProcedure.input(z.object({
      contacts: z.array(z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        company: z.string().optional(),
        jobTitle: z.string().optional(),
        source: z.enum(["contact_form", "newsletter", "signup", "download", "manual", "other"]).optional(),
        tags: z.string().optional(),
      })),
      skipDuplicates: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      return db.bulkImportContacts(input.contacts, input.skipDuplicates ?? true);
    }),
    create: adminProcedure.input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      company: z.string().optional(),
      jobTitle: z.string().optional(),
      source: z.enum(["contact_form", "newsletter", "signup", "download", "manual", "other"]).optional(),
      status: z.enum(["new", "contacted", "qualified", "converted", "archived"]).optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await db.createContact(input);
      return { id };
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().nullable().optional(),
      company: z.string().nullable().optional(),
      jobTitle: z.string().nullable().optional(),
      status: z.enum(["new", "contacted", "qualified", "converted", "archived"]).optional(),
      notes: z.string().nullable().optional(),
      avatarUrl: z.string().nullable().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateContact(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteContact(input.id);
      return { success: true };
    }),
    getPropertyValues: adminProcedure.input(z.object({ contactId: z.number() })).query(async ({ input }) => {
      return db.getPropertyValues("contact", input.contactId);
    }),
    setPropertyValues: adminProcedure.input(z.object({
      contactId: z.number(),
      values: z.array(z.object({ propertyId: z.number(), value: z.string().nullable() })),
    })).mutation(async ({ input }) => {
      await db.setBulkPropertyValues("contact", input.contactId, input.values);
      return { success: true };
    }),
    uploadAvatar: adminProcedure.input(z.object({
      id: z.number(),
      fileBase64: z.string(),
      contentType: z.string(),
      fileName: z.string(),
    })).mutation(async ({ input }) => {
      const { storagePut } = await import("./storage");
      const buffer = Buffer.from(input.fileBase64, "base64");
      const suffix = Math.random().toString(36).substring(2, 8);
      const key = `avatars/contacts/${input.id}-${suffix}-${input.fileName}`;
      const { url } = await storagePut(key, buffer, input.contentType);
      await db.updateContact(input.id, { avatarUrl: url });
      return { url };
    }),
  }),

  // ─── Custom Properties (Admin) ───
  customProperties: router({
    list: adminProcedure.input(z.object({ entityType: z.enum(["contact", "company"]) })).query(async ({ input }) => {
      return db.getCustomProperties(input.entityType);
    }),
    create: adminProcedure.input(z.object({
      entityType: z.enum(["contact", "company"]),
      name: z.string().min(1),
      label: z.string().min(1),
      fieldType: z.enum(["text", "number", "date", "select", "url", "email", "phone", "textarea"]).optional(),
      options: z.any().optional(),
      isRequired: z.boolean().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => {
      const id = await db.createCustomProperty(input);
      return { id };
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      label: z.string().optional(),
      fieldType: z.enum(["text", "number", "date", "select", "url", "email", "phone", "textarea"]).optional(),
      options: z.any().optional(),
      isRequired: z.boolean().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateCustomProperty(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteCustomProperty(input.id);
      return { success: true };
    }),
  }),

  // ─── Smart Enrichment (Admin) ───
  enrichment: router({
    enrichContact: adminProcedure.input(z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().optional(),
      company: z.string().optional(),
      jobTitle: z.string().optional(),
    })).mutation(async ({ input }) => {
      const searchContext = [
        input.firstName && input.lastName ? `${input.firstName} ${input.lastName}` : "",
        input.email || "",
        input.company || "",
        input.jobTitle || "",
      ].filter(Boolean).join(", ");

      if (!searchContext.trim()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Provide at least a name, email, or company to enrich." });
      }

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a business data enrichment assistant. Given information about a person, search your knowledge to find and return additional professional details. Return ONLY a JSON object with these fields (use null for unknown values):\n{\n  "firstName": string | null,\n  "lastName": string | null,\n  "email": string | null,\n  "phone": string | null,\n  "company": string | null,\n  "jobTitle": string | null,\n  "linkedinUrl": string | null,\n  "companyWebsite": string | null,\n  "companyIndustry": string | null,\n  "companySize": string | null,\n  "companyAddress": string | null,\n  "companyPhone": string | null,\n  "bio": string | null\n}\nDo NOT wrap in markdown code blocks. Return raw JSON only.`,
          },
          {
            role: "user",
            content: `Enrich this contact: ${searchContext}. Find their professional details, company information, LinkedIn profile, and any other publicly available business information.`,
          },
        ],
      });

      try {
        const content = String(response.choices?.[0]?.message?.content || "{}");
        const cleaned = content.replace(/```json\n?|```\n?/g, "").trim();
        return JSON.parse(cleaned);
      } catch {
        return { error: "Could not parse enrichment data" };
      }
    }),

    enrichCompany: adminProcedure.input(z.object({
      name: z.string().optional(),
      website: z.string().optional(),
      industry: z.string().optional(),
    })).mutation(async ({ input }) => {
      const searchContext = [
        input.name || "",
        input.website || "",
        input.industry || "",
      ].filter(Boolean).join(", ");

      if (!searchContext.trim()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Provide at least a company name or website to enrich." });
      }

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a business data enrichment assistant. Given information about a company, search your knowledge to find and return additional details. Return ONLY a JSON object with these fields (use null for unknown values):\n{\n  "name": string | null,\n  "website": string | null,\n  "industry": string | null,\n  "size": string | null,\n  "phone": string | null,\n  "address": string | null,\n  "description": string | null,\n  "linkedinUrl": string | null,\n  "foundedYear": string | null,\n  "revenue": string | null,\n  "employeeCount": string | null,\n  "headquarters": string | null,\n  "specialties": string | null\n}\nDo NOT wrap in markdown code blocks. Return raw JSON only.`,
          },
          {
            role: "user",
            content: `Enrich this company: ${searchContext}. This is a UK-based business. Find their website, industry, size, address, LinkedIn page, and any other publicly available business information.`,
          },
        ],
      });

      try {
        const content = String(response.choices?.[0]?.message?.content || "{}");
        const cleaned = content.replace(/```json\n?|```\n?/g, "").trim();
        return JSON.parse(cleaned);
      } catch {
        return { error: "Could not parse enrichment data" };
      }
    }),
  }),

  // ─── Companies (Admin) ───
  companies: router({
    list: adminProcedure.input(z.object({
      limit: z.number().min(1).max(200).optional(),
      offset: z.number().min(0).optional(),
      search: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getCompanies(input ?? {});
    }),
    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      website: z.string().optional(),
      industry: z.string().optional(),
      size: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await db.createCompany(input);
      return { id };
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      website: z.string().nullable().optional(),
      industry: z.string().nullable().optional(),
      size: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
      address: z.string().nullable().optional(),
      notes: z.string().nullable().optional(),
      avatarUrl: z.string().nullable().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateCompany(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteCompany(input.id);
      return { success: true };
    }),
    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getCompanyById(input.id);
    }),
    getContacts: adminProcedure.input(z.object({ companyName: z.string() })).query(async ({ input }) => {
      return db.getCompanyContacts(input.companyName);
    }),
    getDeals: adminProcedure.input(z.object({ companyId: z.number() })).query(async ({ input }) => {
      return db.getCompanyDeals(input.companyId);
    }),
    uploadAvatar: adminProcedure.input(z.object({
      id: z.number(),
      fileBase64: z.string(),
      contentType: z.string(),
      fileName: z.string(),
    })).mutation(async ({ input }) => {
      const { storagePut } = await import("./storage");
      const buffer = Buffer.from(input.fileBase64, "base64");
      const suffix = Math.random().toString(36).substring(2, 8);
      const key = `avatars/companies/${input.id}-${suffix}-${input.fileName}`;
      const { url } = await storagePut(key, buffer, input.contentType);
      await db.updateCompany(input.id, { avatarUrl: url });
      return { url };
    }),
  }),

  // ─── Deals / Pipeline (Admin) ───
  deals: router({
    list: adminProcedure.input(z.object({
      limit: z.number().min(1).max(500).optional(),
      offset: z.number().min(0).optional(),
      stage: z.string().optional(),
      search: z.string().optional(),
      product: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getDeals(input ?? {});
    }),
    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getDealById(input.id);
    }),
    stats: adminProcedure.query(async () => {
      return db.getDealStats();
    }),
    create: adminProcedure.input(z.object({
      companyId: z.number(),
      contactId: z.number().optional(),
      title: z.string().min(1),
      value: z.number().optional(),
      stage: z.enum(["lead", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
      probability: z.number().min(0).max(100).optional(),
      expectedCloseDate: z.date().optional(),
      product: z.string().optional(),
      productInterest: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await db.createDeal(input);
      return { id };
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      companyId: z.number().optional(),
      contactId: z.number().nullable().optional(),
      title: z.string().optional(),
      value: z.number().nullable().optional(),
      stage: z.enum(["lead", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
      probability: z.number().min(0).max(100).nullable().optional(),
      expectedCloseDate: z.date().nullable().optional(),
      product: z.string().nullable().optional(),
      productInterest: z.string().nullable().optional(),
      lostReason: z.string().nullable().optional(),
      notes: z.string().nullable().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateDeal(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteDeal(input.id);
      return { success: true };
    }),
  }),

  // ─── Subscribers (Admin view + Public subscribe) ───
  subscribers: router({
    list: adminProcedure.input(z.object({
      limit: z.number().min(1).max(200).optional(),
      offset: z.number().min(0).optional(),
      activeOnly: z.boolean().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getSubscribers(input ?? {});
    }),
    subscribe: publicProcedure.input(z.object({
      email: z.string().email(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      source: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.createSubscriber(input);
      // Also create a contact
      await db.createContact({
        firstName: input.firstName || "Subscriber",
        lastName: input.lastName || "",
        email: input.email,
        source: "newsletter",
      }).catch(() => {}); // Ignore if duplicate
      // Create notification
      await db.createNotification({
        type: "subscriber",
        title: "New Newsletter Subscriber",
        message: `${input.email} subscribed to the newsletter${input.firstName ? ` (${input.firstName})` : ""}.`,
      });
      // Notify owner
      await notifyOwner({
        title: "📬 New Newsletter Subscriber",
        content: `Email: ${input.email}\nName: ${input.firstName || "N/A"} ${input.lastName || ""}\nSource: ${input.source || "website"}`,
      }).catch(() => {});
      return { success: true };
    }),
    unsubscribe: publicProcedure.input(z.object({
      email: z.string().email(),
    })).mutation(async ({ input }) => {
      await db.unsubscribe(input.email);
      return { success: true };
    }),
  }),

  // ─── Contact Submissions (Admin view + Public submit) ───
  submissions: router({
    list: adminProcedure.input(z.object({
      limit: z.number().min(1).max(200).optional(),
      offset: z.number().min(0).optional(),
      status: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getContactSubmissions(input ?? {});
    }),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["new", "read", "replied", "archived"]),
    })).mutation(async ({ input }) => {
      await db.updateContactSubmissionStatus(input.id, input.status);
      return { success: true };
    }),
    submit: publicProcedure.input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      company: z.string().optional(),
      subject: z.string().optional(),
      message: z.string().min(1),
    })).mutation(async ({ input }) => {
      const id = await db.createContactSubmission(input);
      // Also create a CRM contact
      await db.createContact({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        company: input.company,
        source: "contact_form",
      }).catch(() => {});
      // Create notification
      await db.createNotification({
        type: "contact",
        title: "New Contact Form Submission",
        message: `${input.firstName} ${input.lastName} (${input.email}) submitted a contact form. Subject: ${input.subject || "N/A"}`,
      });
      // Notify owner
      await notifyOwner({
        title: "📩 New Contact Form Submission",
        content: `From: ${input.firstName} ${input.lastName}\nEmail: ${input.email}\nPhone: ${input.phone || "N/A"}\nCompany: ${input.company || "N/A"}\nSubject: ${input.subject || "N/A"}\nMessage: ${input.message}`,
      }).catch(() => {});
      // Email notification
      await notifyContactFormSubmission(input).catch(() => {});
      return { id, success: true };
    }),
  }),

  // ─── Signups (Admin view + Public signup) ───
  signups: router({
    list: adminProcedure.input(z.object({
      limit: z.number().min(1).max(200).optional(),
      offset: z.number().min(0).optional(),
    }).optional()).query(async ({ input }) => {
      return db.getSignups(input ?? {});
    }),
    register: publicProcedure.input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      company: z.string().optional(),
      phone: z.string().optional(),
      interest: z.string().optional(),
      source: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.createSignup(input);
      // Also create a CRM contact
      await db.createContact({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        company: input.company,
        source: "signup",
      }).catch(() => {});
      // Create notification
      await db.createNotification({
        type: "signup",
        title: "New Signup",
        message: `${input.firstName} ${input.lastName} (${input.email}) signed up. Company: ${input.company || "N/A"}. Interest: ${input.interest || "N/A"}.`,
      });
      // Notify owner
      await notifyOwner({
        title: "🎉 New Signup",
        content: `Name: ${input.firstName} ${input.lastName}\nEmail: ${input.email}\nCompany: ${input.company || "N/A"}\nPhone: ${input.phone || "N/A"}\nInterest: ${input.interest || "N/A"}\nSource: ${input.source || "website"}`,
      }).catch(() => {});
      return { success: true };
    }),
  }),

  // ─── Downloads (Admin manage + Public view) ───
  downloads: router({
    list: publicProcedure.query(async () => {
      return db.getDownloads({ publishedOnly: true });
    }),
    listAll: adminProcedure.query(async () => {
      return db.getDownloads();
    }),
    create: adminProcedure.input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      fileUrl: z.string().url(),
      fileType: z.string().optional(),
      fileSize: z.string().optional(),
      thumbnailUrl: z.string().optional(),
      category: z.string().optional(),
      isPublished: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const id = await db.createDownload(input);
      return { id };
    }),
    track: publicProcedure.input(z.object({
      downloadId: z.number(),
      email: z.string().email().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
      await db.incrementDownloadCount(input.downloadId);
      await db.createDownloadLog({
        downloadId: input.downloadId,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        ipAddress: ctx.req.ip || ctx.req.headers['x-forwarded-for'] as string || "",
        userAgent: ctx.req.headers['user-agent'] || "",
      });
      if (input.email) {
        await db.createContact({
          firstName: input.firstName || "Downloader",
          lastName: input.lastName || "",
          email: input.email,
          source: "download",
        }).catch(() => {});
        await db.createNotification({
          type: "download",
          title: "New Download",
          message: `${input.email} downloaded a resource.`,
        });
      }
      return { success: true };
    }),
    // Admin: upload file to S3 and create download record
    upload: adminProcedure.input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      fileName: z.string(),
      fileBase64: z.string(),
      contentType: z.string(),
      fileType: z.string().optional(),
      fileSize: z.string().optional(),
      category: z.string().optional(),
      isPublished: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { storagePut } = await import("./storage");
      const buffer = Buffer.from(input.fileBase64, "base64");
      const suffix = Math.random().toString(36).substring(2, 8);
      const key = `lead-magnets/${Date.now()}-${suffix}-${input.fileName}`;
      const { url } = await storagePut(key, buffer, input.contentType);
      const id = await db.createDownload({
        title: input.title,
        description: input.description,
        fileUrl: url,
        fileType: input.fileType || input.fileName.split(".").pop() || "file",
        fileSize: input.fileSize,
        category: input.category,
        isPublished: input.isPublished ?? true,
      });
      return { id, url };
    }),
    // Admin: update download metadata
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      isPublished: z.boolean().optional(),
      fileUrl: z.string().optional(),
      fileType: z.string().optional(),
      fileSize: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateDownload(id, data);
      return { success: true };
    }),
    // Admin: delete download
    delete: adminProcedure.input(z.object({
      id: z.number(),
    })).mutation(async ({ input }) => {
      await db.deleteDownload(input.id);
      return { success: true };
    }),
    // Admin: get single download by ID
    getById: adminProcedure.input(z.object({
      id: z.number(),
    })).query(async ({ input }) => {
      return db.getDownloadById(input.id);
    }),
    logs: adminProcedure.input(z.object({
      downloadId: z.number().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getDownloadLogs(input?.downloadId);
    }),
  }),

  // ─── Visitor Tracking ───
  tracking: router({
    trackView: publicProcedure.input(z.object({
      path: z.string(),
      referrer: z.string().optional(),
      sessionId: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
      const ua = ctx.req.headers['user-agent'] || "";
      const ip = ctx.req.ip || ctx.req.headers['x-forwarded-for'] as string || "";
      await db.trackPageView({
        path: input.path,
        referrer: input.referrer,
        userAgent: ua,
        ipAddress: ip,
        sessionId: input.sessionId,
      });
      return { success: true };
    }),
    stats: adminProcedure.input(z.object({
      days: z.number().min(1).max(365).optional(),
    }).optional()).query(async ({ input }) => {
      return db.getPageViewStats(input ?? {});
    }),
    recentVisitors: adminProcedure.input(z.object({
      limit: z.number().min(1).max(200).optional(),
    }).optional()).query(async ({ input }) => {
      return db.getRecentVisitors(input?.limit);
    }),
  }),

  // ─── Jobs (Public + Admin) ───
  jobs: router({
    // Public: list active jobs
    list: publicProcedure.input(z.object({
      limit: z.number().min(1).max(200).optional(),
      offset: z.number().min(0).optional(),
      search: z.string().optional(),
      sector: z.string().optional(),
      sponsorshipOnly: z.boolean().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getJobs({ ...input, status: "active" });
    }),
    // Public: get single job
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const job = await db.getJobById(input.id);
      if (job) await db.incrementJobViewCount(input.id);
      return job;
    }),
    // Public: apply to a job (comprehensive 10-step form)
    submitApplication: publicProcedure.input(z.object({
      jobId: z.number(),
      jobTitle: z.string().optional(),
      employerName: z.string().optional(),
      sector: z.string().optional(),
      sectorVariantStep6: z.string().optional(),
      sectorVariantStep7: z.string().optional(),
      availableStartDate: z.string().optional(),
      surname: z.string().min(1),
      firstName: z.string().min(1),
      nationalInsuranceNumber: z.string().optional(),
      addressLine1: z.string().min(1),
      addressLine2: z.string().optional(),
      postcode: z.string().min(1),
      country: z.string().min(1),
      mobile: z.string().min(1),
      email: z.string().email(),
      rightToWork: z.string().min(1),
      hasUkDrivingLicence: z.string().optional(),
      employmentHistory: z.any().optional(),
      addressHistory: z.any().optional(),
      qualifications: z.any().optional(),
      sectorCertifications: z.any().optional(),
      sectorExperience: z.any().optional(),
      hasValidDrivingLicence: z.string().optional(),
      hasVehicleAccess: z.string().optional(),
      hasBusinessInsurance: z.string().optional(),
      livesWithin10Miles: z.string().optional(),
      willingToRelocate: z.string().optional(),
      canStartWithin4Weeks: z.string().optional(),
      references: z.any().optional(),
      screeningQ1: z.string().optional(),
      screeningQ2: z.string().optional(),
      screeningQ3: z.string().optional(),
      hasCriminalConviction: z.string().optional(),
      criminalConvictionDetails: z.string().optional(),
      cvUrl: z.string().optional(),
      declarationAccepted: z.boolean(),
      printName: z.string().optional(),
      declarationDate: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await db.createJobApplication(input as any);
      // Create CRM contact
      await db.createContact({
        firstName: input.firstName,
        lastName: input.surname,
        email: input.email,
        phone: input.mobile,
        source: "other",
      }).catch(() => {});
      // Notify
      const job = await db.getJobById(input.jobId);
      await db.createNotification({
        type: "system",
        title: "New Job Application (10-Step Form)",
        message: `${input.firstName} ${input.surname} (${input.email}) applied to "${job?.title || input.jobTitle || "Unknown"}" at ${job?.company || input.employerName || "Unknown"}. Sector: ${input.sector || "N/A"}.`,
      });
      await notifyOwner({
        title: "\uD83D\uDCBC New Job Application",
        content: `Job: ${job?.title || input.jobTitle || "Unknown"} at ${job?.company || input.employerName || "Unknown"}\nApplicant: ${input.firstName} ${input.surname}\nEmail: ${input.email}\nPhone: ${input.mobile}\nSector: ${input.sector || "N/A"}\nStart Date: ${input.availableStartDate || "N/A"}`,
      }).catch(() => {});
      return { id, success: true };
    }),
    // Public: upload CV file
    uploadCV: publicProcedure.input(z.object({
      fileName: z.string(),
      fileBase64: z.string(),
      contentType: z.string(),
    })).mutation(async ({ input }) => {
      const { storagePut } = await import("./storage");
      const buffer = Buffer.from(input.fileBase64, "base64");
      const suffix = Math.random().toString(36).substring(2, 8);
      const key = `cv-uploads/${Date.now()}-${suffix}-${input.fileName}`;
      const { url } = await storagePut(key, buffer, input.contentType);
      return { url };
    }),
    // Admin: list applications with filters
    listApplications: protectedProcedure.input(z.object({
      jobId: z.number().optional(),
      sector: z.string().optional(),
      status: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getJobApplicationsFiltered(input ?? {});
    }),
    // Admin: get single application
    getApplication: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getJobApplicationById(input.id);
    }),
    // Admin: update application status
    updateApplicationStatus: protectedProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["new", "reviewed", "shortlisted", "interviewed", "offered", "rejected"]),
      adminNotes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.updateJobApplicationStatus(input.id, input.status, input.adminNotes);
      return { success: true };
    }),
    // Public: post a free job (creates as pending)
    postFree: publicProcedure.input(z.object({
      title: z.string().min(1),
      company: z.string().min(1),
      location: z.string().min(1),
      salaryMin: z.number().optional(),
      salaryMax: z.number().optional(),
      salaryType: z.enum(["annual", "hourly", "daily"]).optional(),
      jobType: z.enum(["full_time", "part_time", "contract", "temporary"]),
      sector: z.string().min(1),
      sponsorshipOffered: z.boolean(),
      sponsorLicenceStatus: z.string().min(1),
      cosAvailability: z.string().min(1),
      homeOfficeInspection: z.string().min(1),
      inspectionOutcomeDetail: z.string().optional(),
      socCode: z.string().optional(),
      description: z.string().min(10),
      requirements: z.string().optional(),
      benefits: z.string().optional(),
      contactEmail: z.string().email(),
      contactPhone: z.string().optional(),
      applyUrl: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await db.createJob({ ...input, tier: "free", status: "pending" });
      // Determine if compliance flags warrant extra scrutiny
      const flaggedValues = ["Yes — but currently suspended", "No — I don't have one yet", "No — I need to request more", "Yes — licence downgraded", "Yes — licence revoked (now reinstated)"];
      const hasFlagged = flaggedValues.some(v => v === input.sponsorLicenceStatus || v === input.cosAvailability || v === input.homeOfficeInspection);
      const flagNote = hasFlagged ? " ⚠️ COMPLIANCE FLAGS DETECTED — requires extra scrutiny." : "";
      await db.createNotification({
        type: "system",
        title: `New Job Posted${hasFlagged ? " ⚠️" : ""}`,
        message: `"${input.title}" at ${input.company} (${input.location}) — Free tier, pending review.${flagNote}`,
      });
      await notifyOwner({
        title: `\uD83C\uDD95 New Job Posted${hasFlagged ? " ⚠️ FLAGGED" : ""}`,
        content: `Title: ${input.title}\nCompany: ${input.company}\nLocation: ${input.location}\nSector: ${input.sector}\nContact: ${input.contactEmail}\nTier: Free (pending review)\n\nCompliance Pre-Qualification:\n- Sponsor Licence: ${input.sponsorLicenceStatus}\n- CoS Availability: ${input.cosAvailability}\n- Home Office Inspection: ${input.homeOfficeInspection}${input.inspectionOutcomeDetail ? "\n- Inspection Detail: " + input.inspectionOutcomeDetail : ""}${flagNote}`,
      }).catch(() => {});
      return { id, success: true, complianceReviewNote: "Your compliance status will be reviewed as part of the approval process. Our team will assess your sponsor licence status, CoS availability, and Home Office inspection history before publishing your listing." };
    }),
    // Admin: list all jobs (any status)
    listAll: adminProcedure.input(z.object({
      limit: z.number().min(1).max(200).optional(),
      offset: z.number().min(0).optional(),
      search: z.string().optional(),
      sector: z.string().optional(),
      status: z.string().optional(),
      tier: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getJobs(input ?? {});
    }),
    // Admin: update job
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      company: z.string().optional(),
      location: z.string().optional(),
      salaryMin: z.number().nullable().optional(),
      salaryMax: z.number().nullable().optional(),
      salaryType: z.enum(["annual", "hourly", "daily"]).optional(),
      jobType: z.enum(["full_time", "part_time", "contract", "temporary"]).optional(),
      sector: z.string().optional(),
      sponsorshipOffered: z.boolean().optional(),
      sponsorLicenceStatus: z.string().nullable().optional(),
      cosAvailability: z.string().nullable().optional(),
      homeOfficeInspection: z.string().nullable().optional(),
      inspectionOutcomeDetail: z.string().nullable().optional(),
      description: z.string().optional(),
      requirements: z.string().nullable().optional(),
      benefits: z.string().nullable().optional(),
      contactEmail: z.string().email().optional(),
      tier: z.enum(["free", "sponsored", "premium", "managed"]).optional(),
      status: z.enum(["draft", "pending", "active", "expired", "closed"]).optional(),
      isFeatured: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateJob(id, data);
      return { success: true };
    }),
    // Admin: delete job
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteJob(input.id);
      return { success: true };
    }),
    // Admin: job stats
    stats: adminProcedure.query(async () => {
      return db.getJobStats();
    }),
    // Admin: list applications (legacy - use jobs.listApplications instead)
    applications: adminProcedure.input(z.object({
      jobId: z.number().optional(),
      limit: z.number().min(1).max(200).optional(),
      offset: z.number().min(0).optional(),
    }).optional()).query(async ({ input }) => {
      return db.getJobApplications(input ?? {});
    }),
  }),

  // ─── Notifications (Admin) ───
  notifications: router({
    list: adminProcedure.input(z.object({
      limit: z.number().min(1).max(200).optional(),
      unreadOnly: z.boolean().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getNotifications(input ?? {});
    }),
    markRead: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.markNotificationRead(input.id);
      return { success: true };
    }),
    markAllRead: adminProcedure.mutation(async () => {
      await db.markAllNotificationsRead();
      return { success: true };
    }),
  }),

  // ─── IANS AI Chatbot ───
  chatbot: router({
    startConversation: publicProcedure.input(z.object({
      visitorName: z.string().optional(),
      visitorEmail: z.string().optional(),
      pageUrl: z.string().optional(),
      userAgent: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
      try {
        const result = await db.createChatConversation({
          visitorName: input.visitorName ?? null,
          visitorEmail: input.visitorEmail ?? null,
          userId: ctx.user?.id ?? null,
          pageUrl: input.pageUrl ?? null,
          userAgent: input.userAgent ?? null,
          ipAddress: ctx.req.ip ?? null,
        });
        return { conversationId: result.id };
      } catch (err) {
        console.error("[IANS] Failed to start conversation:", err);
        return { conversationId: 0 };
      }
    }),

    logMessage: publicProcedure.input(z.object({
      conversationId: z.number(),
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      intentTag: z.string().optional(),
    })).mutation(async ({ input }) => {
      try {
        if (input.conversationId <= 0) return { success: false };
        await db.createChatMessage({
          conversationId: input.conversationId,
          role: input.role,
          content: input.content,
          intentTag: input.intentTag ?? null,
        });
        if (input.intentTag) {
          await db.updateConversationIntentTags(input.conversationId, input.intentTag);
        }
        return { success: true };
      } catch (err) {
        console.error("[IANS] Failed to log message:", err);
        return { success: false };
      }
    }),

    ask: publicProcedure.input(z.object({
      message: z.string().min(1).max(2000),
      conversationId: z.number().optional(),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).max(20).optional(),
    })).mutation(async ({ input }) => {
      const systemPrompt = `Your name is IANS. You are the AI compliance assistant for Sponsor ComplIANS. When introducing yourself, say "I'm IANS, your compliance assistant from Sponsor ComplIANS." Never refer to yourself as "the chatbot" or "the assistant" — always use "IANS".

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
- £22M+ in estimated business risk avoided

=== PRODUCTS AND SERVICES ===

**Product 1: Sponsor Compliance Audit** (/sponsor-compliance-audit)
Comprehensive review covering all 12 compliance areas and 65 document types per sponsored worker.
Who it's for: Any UK employer with a sponsor licence wanting to identify compliance gaps before the Home Office does.
Includes: Full audit across 12 areas (record keeping, HR systems, compliance readiness, CoS management, genuine vacancy, pay and NMW compliance, right to work, monitoring and reporting, job role matching, key personnel, absence tracking, change control), 65 documents checked per worker (SW001-SW065), risk scoring, prioritised action plan, compliance visit preparation, mock interviews for Authorising Officer and sponsored workers.
Process: DISCOVER (audit entire operation) → DIAGNOSE (pinpoint every breach) → DEMONSTRATE (build lasting compliance).
Proof: 100% pass rate. One client with 120 workers: 7,200 documents reviewed, 44 breaches found across 11 areas. A care provider maintained A-rating, decision in 3 weeks (typical: 3 months).
Turnaround: Standard 5-10 working days. Urgent (imminent Home Office visit): 48 hours.
Delivery: Remote and on-site across England, Wales, Scotland, and Northern Ireland.
CTA: Book a free compliance audit call.

**Product 2: Skilled Worker Recruitment Solutions** (/skilled-worker-recruitment-solutions)
End-to-end recruitment for sponsor licence holders hiring under the Skilled Worker visa route.
Includes: Job design and SOC code validation, genuine vacancy testing, compliant sourcing, application screening against 65-document framework, structured interview documentation, CoS assignment checks, compliant onboarding, post-placement monitoring.
8-step process: Workforce Planning → Job Design & SOC Validation → Compliant Sourcing → Application Screening → Interview & Assessment → CoS Assignment → Compliant Onboarding → Ongoing Monitoring.
Pricing:
- Sponsorship On Demand: £2,495/hire (or 20% of salary if £30,000+) — 1-3 urgent hires
- Sponsorship as a Service: £7,000/hire (3-month minimum) — up to 10 hires in 3 months
- Sponsorship RPO & Workforce MSP: £16,500/month (6-month minimum) — up to 50 hires in 6 months
Special offer: First compliant hire is FREE.
Industries: Healthcare, IT & Digital, Engineering & Manufacturing, Construction, Hospitality, Business & Finance, Creative & Design, Technical Trades.
IMPORTANT: New overseas recruitment for care workers closed as of July 2025. Existing sponsored care workers in the UK are not affected.

**Product 3: Sponsor-Ready HR Service** (/sponsor-ready-hr-service)
HR compliance services embedding Home Office sponsor duties into daily HR operations.
Includes: Right-to-work check management with three-stage visa expiry monitoring (60, 30, 15 days), record-keeping aligned to 65-document framework, monthly salary compliance monitoring, sponsored worker onboarding, change reporting within 10 working days via SMS, absence tracking, training for AOs/Key Contacts/Level 1 Users, ongoing compliance monitoring.
Framework: Policy → Process → Control → Evidence.
Pricing:
- Comply Starter: £15 PEPM (1-10 workers) — annual health check, biannual reviews, core templates, email support
- Comply Pro: £20 PEPM (11-50 workers) — quarterly reviews, coaching calls, customisable documents, optional crisis support
- Comply Enterprise: £25 PEPM (50+ workers) — monthly audit-grade reviews, dedicated advisor, 4hr SLA, full crisis support including revocation defence
- PEPM = Per Employee Per Month (based on sponsored workers). All: 12-month minimum contract.
Key stat: 64.7% of compliance failures are HR-related. 10/12 high-severity risks are HR-related. 77 specific HR compliance risk areas identified.

**Product 4: Sponsor ComplIANS Hub** (/sponsor-complians-hub)
Purpose-built compliance management software platform. Launching 1 April 2026.
Features: Sponsored worker management with real-time compliance status, salary compliance monitoring (actual pay vs CoS salary), right-to-work tracking with automated visa expiry alerts, document management with compliance scoring, 12-stage sponsorship lifecycle tracking, compliance alerts for every deadline and gap, audit-ready report generation in seconds.
Real-world proof: Divine Health Services runs 65 sponsored workers through the Hub at 100% salary compliance. Home Office checked 10 December 2025, documentation submitted within 14 days. Home Office confirmed 6 January 2026: "We are satisfied with your representations, and no further action is required."
Pricing: Founding Member rate £29/worker/month (50% off standard £58/worker/month). Locked in for life — price never increases. Founding Member pricing closes 1 April 2026 when the Hub goes live. No payment required today — register for the free webinar on 25 March 2026 to claim your Founding Member spot.
Free Webinar: 25 March 2026 at 1:00 PM GMT. "The Sponsor Compliance Crisis Is Already Here." Register at /events/25-march-webinar. All attendees receive the recording within 24 hours.

**Product 5: The Sponsorship Files** (/the-sponsorship-files | sponsorshipfiles.com)
AI-native investigative documentary podcast examining UK immigration enforcement, sponsor licence revocations, NHS workforce crises, and policy changes. Every claim source-cited.
Stats: 30,000+ downloads, 11 series arcs, 97 episodes planned.
Key data: 1,948 licences revoked YE June 2025, 898,000 net migration YE June 2023, 78,330 care roles unfilled Jan 2026, 34,000 health workers in visa limbo, ~50% application refusal rate, salary threshold £41,700 (up 59%), civil penalties £45,000 first breach / £60,000 repeat.
Available: sponsorshipfiles.com, Apple Podcasts, Spotify.

**Product 6: Provider Websites** (/provider-websites)
Compliance-ready website design for care providers and sponsor licence holders.
Includes: Compliance showcase pages, CQC-aligned service pages, careers pages with SOC codes and sponsorship badges, verified testimonial integration, blog and GEO-optimised content.
Case study: Built Divine Health Services website (sponsorcompliansdivinecare.com) — CQC-regulated homecare provider with 65 sponsored workers. Home Office confirmed compliance satisfaction.

**Product 7: ComplIANS Jobs** (/jobs and /advertise)
The UK's only job board built specifically for sponsor licence holders.
Differentiators: Only verified sponsors can post, every listing shows SOC code/salary threshold/RQF level/sponsorship status, recruitment audit trail built automatically, premium listings include SOC validation and Compliance Document Pack, candidates are immigration-verified and qualifications-screened.
Candidate channels: 500+ sponsor client network, Sponsorship Files podcast audience (30,000+), compliance webinar and newsletter community (2,500+).
Pricing: Free £0 (3 listings/month, 30 days), Sponsored £149/listing or £349/month unlimited (60 days), Premium £449/listing or £999/month unlimited (90 days, AI matching, Compliance Document Pack), Managed Recruitment from £2,495/hire.

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

Phase 1 — The Money Stage: Home Office emails sponsors requesting financial documents to verify salary compliance. They analyse payslips, RTI submissions, P60s, bank statements to check payments match CoS salary declarations. The Home Office does NOT have direct access to HMRC records — they request documents from the sponsor.
Phase 1 documents requested: (1) Signed contracts, (2) Payslips first 3 months and last 6 months, (3) NI numbers, (4) Unredacted bank statements last 6 months, (5) Monthly salary breakdowns, (6) Full Pay Run/RTI submissions last 6 months, (7) Prepaid card payment evidence, (8) Cheque payment evidence, (9) P60s.

Phase 2 — The Records Stage: On-site compliance visit examining files, contracts, RTW checks, job descriptions, training logs, HR systems. Officers interview the Authorising Officer and sponsored workers.

CRITICAL: Trying to correct records AFTER being contacted by the Home Office is NOT treated as compliance — it is seen as too late. Under paragraph C1.6 of the Sponsor Guidance (Part 3), sponsor duties begin from the day the licence is granted.

=== KEY STATISTICS ===
Proprietary: 100+ audits conducted, 80% revocations from recruitment failures, 64.7% failures are HR-related, 77 HR risk areas, 10/12 high-severity risks are HR-related, 100% pass rate, 500+ workers hired compliantly, £22M+ risk avoided, 65 docs per worker, 12 compliance areas, 16 issue types, 7,200 docs reviewed for one client, 44 breaches in one audit, A-rating in 3 weeks, no organisation achieved full compliance in any area.
External: 1,948 licences revoked YE June 2025, 898,000 net migration YE June 2023, 78,330 care roles unfilled, 34,000 health workers in visa limbo, ~50% application refusal rate, salary threshold £41,700 (up 59%), civil penalties £45,000/£60,000, care worker visa route closed July 2025, Immigration Salary List expires 31 December 2026.

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
A: No. All sectors — healthcare, IT, engineering, construction, hospitality, business services, creative industries, technical trades. Deep expertise in care sector (highest enforcement rates).

Q: Can you help me get a sponsor licence?
A: Our core expertise is helping existing holders maintain compliance. For initial applications, consult a qualified immigration solicitor. Once you have your licence, we build compliance infrastructure from day one.

Q: What is the 65-document framework?
A: Our proprietary framework from auditing 100+ UK sponsors. 65 document types coded SW001-SW065 covering immigration monitoring, contact records, recruitment evidence, migrant tracking, reporting duties, qualifications/training, and compliance declarations.

Q: What about the Home Office salary email?
A: Act immediately. This is Phase 1 enforcement. They will request payslips, RTI, P60s, bank statements, contracts. Ensure salary payments match CoS declarations before responding. Contact us urgently.

Q: What is the 10-day reporting rule?
A: Report changes to the Home Office within 10 working days via SMS: absences of 10+ consecutive days without permission, workers leaving, significant changes to duties/salary, business address/ownership changes, suspected visa breaches.

Q: How much do recruitment services cost?
A: Sponsorship On Demand £2,495/hire, Sponsorship as a Service £7,000/hire, RPO & Workforce MSP £16,500/month. Free first hire available.

Q: How much is the HR service?
A: Comply Starter £15 PEPM (1-10 workers), Comply Pro £20 PEPM (11-50), Comply Enterprise £25 PEPM (50+). 12-month minimum.

Q: Can I post jobs for free?
A: Yes. Up to 3 vacancies/month free on ComplIANS Jobs (30 days). Upgrade: Sponsored £149/listing, Premium £449/listing, Managed Recruitment from £2,495/hire.

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
   - Worried about compliance visit → Sponsor Compliance Audit
   - Need to hire sponsored workers → Skilled Worker Recruitment or ComplIANS Jobs
   - HR systems not working / documents missing → Sponsor-Ready HR Service
   - Want software to track compliance → Sponsor ComplIANS Hub
   - Need a website showing compliance → Provider Websites
   - Received Home Office email about salary → URGENT — Sponsor Compliance Audit
4. Home Office salary email = URGENT. Explain Phase 1 enforcement, reassure, strongly encourage immediate contact: "This is time-sensitive. We recommend contacting us today. Call 020 3618 6968 or email admin@sponsorcomplians.com."
5. Care worker sponsorship: New overseas recruitment closed July 2025. Existing sponsored care workers unaffected. Care providers may need compliance help for existing workers.
6. If you don't know: "That's a great question — I want to make sure you get the most accurate answer. Let me connect you with our compliance team at admin@sponsorcomplians.com or 020 3618 6968."
7. Never promise specific outcomes. Say "our clients have achieved" or "based on our experience" not "we guarantee."
8. Use the free audit as primary conversion: "We offer a free initial compliance audit call — would you like to book one?"
9. On competitors/pricing: Focus on value and differentiation. Emphasise 65-document framework, 100% pass rate, real case study outcomes. Provide pricing openly.
10. Candidates looking for work: Direct to ComplIANS Jobs at /jobs.
11. Never give specific legal advice. Say: "We're compliance specialists, not immigration lawyers. For specific legal questions, we'd recommend consulting a qualified immigration solicitor. However, we can help you with the compliance systems, processes, and documentation that protect your sponsor licence."
12. After your FIRST substantive response (not the welcome message), naturally ask for the visitor's email: "By the way, if you'd like me to send you a summary of this conversation or our compliance resources, what's the best email to reach you at?" Do this once per conversation, not repeatedly.
13. Actively promote the 25 March webinar when relevant: "We're running a free webinar on 25 March — 'The Sponsor Compliance Crisis Is Already Here.' It covers everything you need to know before the April deadline. You can register at /events/25-march-webinar."
14. When discussing Hub pricing, always mention the Founding Member rate: "£29/worker/month — 50% off the standard rate, locked in for life. Register for the webinar to claim your spot."

=== TONE ===
Authoritative and knowledgeable. Warm but professional. Solution-oriented. Data-driven (reference proprietary statistics). Urgent when appropriate. Use British English spelling. Be concise (2-4 sentences per response, expand only when detailed pricing or process information is requested).

At the end of every response, silently classify the user's intent into ONE of these tags (do NOT show this to the user):
[INTENT: pricing | audit | recruitment | hub | compliance | general | support | booking | urgent | jobs | podcast | website | hr]
Return this tag on a new line at the very end of your response.`;

      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: systemPrompt },
      ];

      if (input.history) {
        for (const msg of input.history.slice(-10)) {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
      messages.push({ role: "user", content: input.message });

      try {
        const result = await invokeLLM({ messages });
        let rawReply = typeof result.choices[0]?.message?.content === "string"
          ? result.choices[0].message.content
          : Array.isArray(result.choices[0]?.message?.content)
            ? result.choices[0].message.content.filter((p: any) => p.type === "text").map((p: any) => p.text).join("")
            : "I apologise, I'm having trouble responding right now. Please try again or contact us at 020 3618 6968.";

        // Extract intent tag from the response
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
    listConversations: adminProcedure.input(z.object({
      limit: z.number().min(1).max(100).optional(),
      offset: z.number().min(0).optional(),
    }).optional()).query(async ({ input }) => {
      return db.listChatConversations(input ?? {});
    }),

    // Admin: get conversation messages
    getConversation: adminProcedure.input(z.object({
      id: z.number(),
    })).query(async ({ input }) => {
      const conversation = await db.getChatConversation(input.id);
      const messages = await db.getChatMessages(input.id);
      return { conversation, messages };
    }),

    // Admin: flag/close conversation
    updateConversationStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["active", "closed", "flagged"]),
    })).mutation(async ({ input }) => {
      await db.updateChatConversation(input.id, { status: input.status });
      return { success: true };
    }),
  }),

  // ─── Webinar Registrations ───
  webinar: router({
    register: publicProcedure.input(z.object({
      fullName: z.string().min(1),
      email: z.string().email(),
      companyName: z.string().optional(),
      sponsoredWorkers: z.string().optional(),
      hasSponsorLicence: z.string().optional(),
      eventSlug: z.string().min(1),
    })).mutation(async ({ input }) => {
      const id = await db.createWebinarRegistration(input);
      // Create a contact from the registration
      const nameParts = input.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || input.fullName;
      const lastName = nameParts.slice(1).join(" ") || "";
      await db.createContact({
        firstName,
        lastName,
        email: input.email,
        company: input.companyName,
        source: "other",
      }).catch(() => {});
      // Notification
      await db.createNotification({
        type: "signup",
        title: "New Webinar Registration",
        message: `${input.fullName} (${input.email}) registered for ${input.eventSlug}.`,
      });
      await notifyOwner({
        title: "\uD83C\uDF93 New Webinar Registration",
        content: `Name: ${input.fullName}\nEmail: ${input.email}\nCompany: ${input.companyName || "N/A"}\nEvent: ${input.eventSlug}`,
      }).catch(() => {});
      // Email notification
      await notifyWebinarRegistration(input).catch(() => {});
      return { id, success: true };
    }),
    list: adminProcedure.input(z.object({
      eventSlug: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getWebinarRegistrations(input?.eventSlug);
    }),
  }),

  // ─── Team Management (Admin) ───
  team: router({
    members: adminProcedure.query(async () => {
      return db.listTeamMembers();
    }),
    invitations: adminProcedure.query(async () => {
      return db.listTeamInvitations();
    }),
    invite: adminProcedure.input(z.object({
      email: z.string().email(),
      name: z.string().optional(),
      role: z.enum(["admin", "user"]).default("admin"),
    })).mutation(async ({ ctx, input }) => {
      const crypto = await import("crypto");
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const id = await db.createTeamInvitation({
        email: input.email,
        name: input.name ?? null,
        role: input.role,
        invitedBy: ctx.user.id,
        token,
        status: "pending",
        expiresAt,
      });
      await db.createNotification({
        type: "system",
        title: "Team Invitation Sent",
        message: `Invitation sent to ${input.email} as ${input.role}.`,
      });
      return { id, token, expiresAt };
    }),
    revokeInvitation: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.updateTeamInvitationStatus(input.id, "revoked");
      return { success: true };
    }),
    removeMember: adminProcedure.input(z.object({ userId: z.number() })).mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot remove yourself" });
      await db.updateUserRole(input.userId, "user");
      return { success: true };
    }),
    acceptInvitation: publicProcedure.input(z.object({ token: z.string() })).mutation(async ({ input }) => {
      const invitation = await db.getTeamInvitationByToken(input.token);
      if (!invitation) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid invitation" });
      if (invitation.status !== "pending") throw new TRPCError({ code: "BAD_REQUEST", message: `Invitation is ${invitation.status}` });
      if (new Date() > invitation.expiresAt) {
        await db.updateTeamInvitationStatus(invitation.id, "expired");
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation has expired" });
      }
      await db.updateTeamInvitationStatus(invitation.id, "accepted", new Date());
      return { success: true, email: invitation.email, role: invitation.role };
    }),
  }),

  // ─── Video Release Notifications (Admin) ───
  videoRelease: router({
    sendNotifications: adminProcedure.input(z.object({
      videoUrl: z.string().url(),
    })).mutation(async ({ input }) => {
      const { sendVideoReleaseEmail } = await import("./email");
      const earlyAccessSubs = await db.getSubscribersBySource("hub_video_early_access");
      if (earlyAccessSubs.length === 0) {
        return { sent: 0, failed: 0, total: 0, message: "No early access subscribers found." };
      }
      let sent = 0;
      let failed = 0;
      for (const sub of earlyAccessSubs) {
        const success = await sendVideoReleaseEmail({
          email: sub.email,
          videoUrl: input.videoUrl,
          unsubscribeUrl: `https://sponsorcomplians.com/unsubscribe?email=${encodeURIComponent(sub.email)}`,
        });
        if (success) sent++;
        else failed++;
      }
      return { sent, failed, total: earlyAccessSubs.length, message: `Sent ${sent} of ${earlyAccessSubs.length} emails.` };
    }),
    subscriberCount: adminProcedure.query(async () => {
      const subs = await db.getSubscribersBySource("hub_video_early_access");
      return { count: subs.length, subscribers: subs.map(s => ({ email: s.email, subscribedAt: s.subscribedAt })) };
    }),
  }),

  // ─── Visitor Behaviour Scoring ───
  visitorScoring: router({
    trackEvent: publicProcedure.input(z.object({
      sessionId: z.string(),
      email: z.string().optional(),
      eventType: z.string(),
      eventValue: z.string().optional(),
      pageUrl: z.string().optional(),
      referrer: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
      const ua = ctx.req.headers['user-agent'] || "";
      const ip = ctx.req.ip || ctx.req.headers['x-forwarded-for'] as string || "";
      await db.trackVisitorEvent({
        sessionId: input.sessionId,
        email: input.email || undefined,
        eventType: input.eventType,
        eventValue: input.eventValue,
        pageUrl: input.pageUrl,
        referrer: input.referrer,
        userAgent: ua,
        ipAddress: ip,
      });
      return { success: true };
    }),
    leads: adminProcedure.input(z.object({
      classification: z.string().optional(),
      limit: z.number().min(1).max(200).optional(),
      offset: z.number().min(0).optional(),
      search: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getLeadScores(input ?? {});
    }),
    stats: adminProcedure.query(async () => {
      return db.getLeadScoreStats();
    }),
    recentEvents: adminProcedure.input(z.object({
      limit: z.number().min(1).max(200).optional(),
    }).optional()).query(async ({ input }) => {
      return db.getRecentVisitorEvents(input?.limit ?? 50);
    }),
  }),

  // ─── Appointment Booking System ───
  booking: bookingRouter,

  // ─── Email Campaign System ───
  emailCampaign: emailCampaignRouter,
});

export type AppRouter = typeof appRouter;
