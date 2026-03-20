CREATE TABLE `customProperties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` enum('contact','company') NOT NULL,
	`name` varchar(128) NOT NULL,
	`label` varchar(256) NOT NULL,
	`fieldType` enum('text','number','date','select','url','email','phone','textarea') NOT NULL DEFAULT 'text',
	`options` json,
	`isRequired` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customProperties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customPropertyValues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`entityType` enum('contact','company') NOT NULL,
	`entityId` int NOT NULL,
	`value` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customPropertyValues_id` PRIMARY KEY(`id`)
);
