CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consultationTypeId` int NOT NULL,
	`consultationTypeName` varchar(256) NOT NULL,
	`date` varchar(16) NOT NULL,
	`startTime` varchar(8) NOT NULL,
	`endTime` varchar(8) NOT NULL,
	`timezone` varchar(64) NOT NULL DEFAULT 'Europe/London',
	`firstName` varchar(128) NOT NULL,
	`lastName` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32),
	`company` varchar(256),
	`urgencyType` varchar(128),
	`notes` text,
	`status` enum('pending','confirmed','completed','cancelled','no_show','rescheduled') NOT NULL DEFAULT 'pending',
	`cancelledBy` enum('client','admin'),
	`cancellationReason` text,
	`rescheduledFromId` int,
	`confirmationSentAt` timestamp,
	`reminderSentAt` timestamp,
	`leadScoreId` int,
	`source` varchar(64) DEFAULT 'website',
	`adminNotes` text,
	`outcome` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `automationEnrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`automationId` int NOT NULL,
	`contactId` int NOT NULL,
	`currentStepId` int,
	`status` enum('active','completed','paused','failed') NOT NULL DEFAULT 'active',
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `automationEnrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `automationSteps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`automationId` int NOT NULL,
	`stepOrder` int NOT NULL,
	`type` enum('send_email','wait','add_tag','remove_tag','add_to_list','remove_from_list','update_field','notify_team','condition') NOT NULL,
	`config` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `automationSteps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `automations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`trigger` enum('contact_created','tag_added','list_joined','form_submitted','campaign_opened','campaign_clicked','manual') NOT NULL,
	`triggerConfig` json,
	`status` enum('active','paused','draft') NOT NULL DEFAULT 'draft',
	`enrolledCount` int DEFAULT 0,
	`completedCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `automations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `availabilitySlots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dayOfWeek` int NOT NULL,
	`startTime` varchar(8) NOT NULL,
	`endTime` varchar(8) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `availabilitySlots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blockedDates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(16) NOT NULL,
	`reason` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blockedDates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookingSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slotDurationMinutes` int NOT NULL DEFAULT 30,
	`bufferMinutes` int NOT NULL DEFAULT 15,
	`maxDailyBookings` int NOT NULL DEFAULT 8,
	`minAdvanceHours` int NOT NULL DEFAULT 24,
	`maxAdvanceDays` int NOT NULL DEFAULT 30,
	`confirmationEmailEnabled` boolean NOT NULL DEFAULT true,
	`reminderEmailEnabled` boolean NOT NULL DEFAULT true,
	`reminderHoursBefore` int NOT NULL DEFAULT 24,
	`welcomeMessage` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookingSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaignEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`contactId` int NOT NULL,
	`type` enum('open','click','bounce','unsubscribe','complaint') NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `campaignEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaignRecipients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`contactId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`status` enum('pending','sent','delivered','bounced','failed') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	CONSTRAINT `campaignRecipients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`subject` varchar(512),
	`previewText` varchar(512),
	`fromName` varchar(128),
	`fromEmail` varchar(320),
	`replyTo` varchar(320),
	`contentJson` json,
	`contentHtml` text,
	`status` enum('draft','scheduled','sending','sent','paused','cancelled') NOT NULL DEFAULT 'draft',
	`recipientListId` int,
	`recipientCount` int DEFAULT 0,
	`scheduledAt` timestamp,
	`sentAt` timestamp,
	`totalSent` int DEFAULT 0,
	`totalOpened` int DEFAULT 0,
	`totalClicked` int DEFAULT 0,
	`totalBounced` int DEFAULT 0,
	`totalUnsubscribed` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consultationTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`durationMinutes` int NOT NULL DEFAULT 30,
	`color` varchar(16) DEFAULT '#00C3FF',
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultationTypes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contactLists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`type` enum('static','dynamic') NOT NULL DEFAULT 'static',
	`filterCriteria` json,
	`memberCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contactLists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contactNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactId` int NOT NULL,
	`content` text NOT NULL,
	`type` enum('note','call','email','meeting','task') NOT NULL DEFAULT 'note',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contactTagAssignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactId` int NOT NULL,
	`tagId` int NOT NULL,
	CONSTRAINT `contactTagAssignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contactTags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`color` varchar(7) DEFAULT '#6366f1',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactTags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contactTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`dueDate` timestamp,
	`status` enum('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`assignedTo` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contactTasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentSources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`type` enum('rss','website','api','manual') NOT NULL,
	`url` varchar(1024),
	`config` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastScannedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contentSources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyEmailDrafts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subject` varchar(512) NOT NULL,
	`contentHtml` text,
	`contentJson` json,
	`status` enum('draft','approved','rejected','sent') NOT NULL DEFAULT 'draft',
	`scheduledFor` timestamp,
	`approvedBy` int,
	`approvedAt` timestamp,
	`sentAt` timestamp,
	`sourceItems` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyEmailDrafts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`contactId` int,
	`title` varchar(256) NOT NULL,
	`value` int,
	`stage` enum('lead','qualified','proposal','negotiation','won','lost') NOT NULL DEFAULT 'lead',
	`expectedCloseDate` timestamp,
	`productInterest` varchar(256),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(128) NOT NULL,
	`settingValue` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailSettings_settingKey_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
CREATE TABLE `emailTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`category` enum('newsletter','promotional','transactional','compliance','onboarding','custom') NOT NULL DEFAULT 'custom',
	`description` text,
	`contentJson` json,
	`contentHtml` text,
	`thumbnailUrl` varchar(1024),
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leadScores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`sessionId` varchar(128),
	`totalScore` int NOT NULL DEFAULT 0,
	`classification` enum('cold','warm','hot') NOT NULL DEFAULT 'cold',
	`pageViewCount` int NOT NULL DEFAULT 0,
	`formSubmitCount` int NOT NULL DEFAULT 0,
	`chatbotMessageCount` int NOT NULL DEFAULT 0,
	`downloadCount` int NOT NULL DEFAULT 0,
	`lastEventAt` timestamp NOT NULL DEFAULT (now()),
	`firstSeenAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leadScores_id` PRIMARY KEY(`id`),
	CONSTRAINT `leadScores_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `listMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listId` int NOT NULL,
	`contactId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `listMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teamInvitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(256),
	`role` enum('admin','user') NOT NULL DEFAULT 'admin',
	`invitedBy` int NOT NULL,
	`token` varchar(128) NOT NULL,
	`status` enum('pending','accepted','expired','revoked') NOT NULL DEFAULT 'pending',
	`expiresAt` timestamp NOT NULL,
	`acceptedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `teamInvitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `teamInvitations_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `visitorEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`email` varchar(320),
	`eventType` varchar(64) NOT NULL,
	`eventValue` varchar(512),
	`points` int NOT NULL DEFAULT 0,
	`pageUrl` varchar(512),
	`referrer` varchar(1024),
	`userAgent` text,
	`ipAddress` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitorEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webinarRegistrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(256) NOT NULL,
	`email` varchar(320) NOT NULL,
	`companyName` varchar(256),
	`sponsoredWorkers` varchar(32),
	`hasSponsorLicence` varchar(32),
	`eventSlug` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webinarRegistrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `jobApplications` MODIFY COLUMN `status` enum('new','reviewed','shortlisted','interviewed','offered','rejected') NOT NULL DEFAULT 'new';--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `jobTitle` varchar(256);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `employerName` varchar(256);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `sector` varchar(128);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `sectorVariantStep6` varchar(128);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `sectorVariantStep7` varchar(128);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `availableStartDate` varchar(32);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `surname` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `nationalInsuranceNumber` varchar(32);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `addressLine1` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `addressLine2` varchar(256);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `postcode` varchar(16) NOT NULL;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `country` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `mobile` varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `rightToWork` text NOT NULL;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `hasUkDrivingLicence` varchar(8);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `employmentHistory` json;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `addressHistory` json;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `qualifications` json;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `sectorCertifications` json;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `sectorExperience` json;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `hasValidDrivingLicence` varchar(8);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `hasVehicleAccess` varchar(8);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `hasBusinessInsurance` varchar(8);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `livesWithin10Miles` varchar(8);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `willingToRelocate` varchar(8);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `canStartWithin4Weeks` varchar(8);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `references` json;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `screeningQ1` text;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `screeningQ2` text;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `screeningQ3` text;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `hasCriminalConviction` varchar(8);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `criminalConvictionDetails` text;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `declarationAccepted` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `printName` varchar(256);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `declarationDate` varchar(32);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `adminNotes` text;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `jobs` ADD `sponsorLicenceStatus` varchar(128);--> statement-breakpoint
ALTER TABLE `jobs` ADD `cosAvailability` varchar(128);--> statement-breakpoint
ALTER TABLE `jobs` ADD `homeOfficeInspection` varchar(128);--> statement-breakpoint
ALTER TABLE `jobs` ADD `inspectionOutcomeDetail` text;--> statement-breakpoint
ALTER TABLE `jobApplications` DROP COLUMN `lastName`;--> statement-breakpoint
ALTER TABLE `jobApplications` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `jobApplications` DROP COLUMN `coverLetter`;