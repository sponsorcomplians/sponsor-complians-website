CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`website` varchar(512),
	`industry` varchar(128),
	`size` varchar(64),
	`phone` varchar(32),
	`address` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contactSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(128) NOT NULL,
	`lastName` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32),
	`company` varchar(256),
	`subject` varchar(512),
	`message` text NOT NULL,
	`status` enum('new','read','replied','archived') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactSubmissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(128) NOT NULL,
	`lastName` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32),
	`company` varchar(256),
	`jobTitle` varchar(256),
	`source` enum('contact_form','newsletter','signup','download','manual','other') NOT NULL DEFAULT 'other',
	`status` enum('new','contacted','qualified','converted','archived') NOT NULL DEFAULT 'new',
	`notes` text,
	`tags` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `downloadLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`downloadId` int NOT NULL,
	`email` varchar(320),
	`firstName` varchar(128),
	`lastName` varchar(128),
	`ipAddress` varchar(64),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `downloadLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `downloads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`fileUrl` varchar(1024) NOT NULL,
	`fileType` varchar(32),
	`fileSize` varchar(32),
	`thumbnailUrl` varchar(1024),
	`category` varchar(128),
	`isPublished` boolean NOT NULL DEFAULT true,
	`downloadCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `downloads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('signup','contact','subscriber','download','system') NOT NULL,
	`title` varchar(256) NOT NULL,
	`message` text NOT NULL,
	`metadata` text,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pageViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`path` varchar(512) NOT NULL,
	`referrer` varchar(1024),
	`userAgent` text,
	`ipAddress` varchar(64),
	`sessionId` varchar(128),
	`country` varchar(64),
	`city` varchar(128),
	`device` varchar(32),
	`browser` varchar(64),
	`os` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pageViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `signups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(128) NOT NULL,
	`lastName` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(256),
	`phone` varchar(32),
	`interest` varchar(256),
	`source` varchar(64) DEFAULT 'website',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `signups_id` PRIMARY KEY(`id`),
	CONSTRAINT `signups_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`firstName` varchar(128),
	`lastName` varchar(128),
	`source` varchar(64) DEFAULT 'website',
	`isActive` boolean NOT NULL DEFAULT true,
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	`unsubscribedAt` timestamp,
	CONSTRAINT `subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscribers_email_unique` UNIQUE(`email`)
);
