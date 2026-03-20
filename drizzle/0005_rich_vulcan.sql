ALTER TABLE `deals` ADD `probability` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `deals` ADD `product` varchar(256);--> statement-breakpoint
ALTER TABLE `deals` ADD `lostReason` varchar(512);