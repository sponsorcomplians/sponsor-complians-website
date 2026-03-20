CREATE TABLE `chatConversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorName` varchar(256),
	`visitorEmail` varchar(320),
	`userId` int,
	`pageUrl` varchar(1024),
	`userAgent` text,
	`ipAddress` varchar(64),
	`status` enum('active','closed','flagged') NOT NULL DEFAULT 'active',
	`messageCount` int NOT NULL DEFAULT 0,
	`intentTags` text,
	`summary` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatConversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`intentTag` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
