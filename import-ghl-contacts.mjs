import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";
import { createReadStream } from "fs";
import { parse } from "csv-parse";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Parse DATABASE_URL
const url = new URL(DATABASE_URL);
const dbConfig = {
  host: url.hostname,
  port: parseInt(url.port || "3306"),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: true },
  connectTimeout: 30000,
};

function titleCase(str) {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function main() {
  console.log("Connecting to database...");
  const conn = await mysql.createConnection(dbConfig);
  console.log("Connected!");

  // 1. Get existing emails to deduplicate
  console.log("Fetching existing contacts for deduplication...");
  const [existingRows] = await conn.execute("SELECT email FROM contacts");
  const existingEmails = new Set(existingRows.map((r) => r.email.toLowerCase()));
  console.log(`Found ${existingEmails.size} existing contacts`);

  // 2. Get existing tags
  console.log("Fetching existing tags...");
  const [existingTags] = await conn.execute("SELECT id, name FROM contactTags");
  const tagMap = new Map(existingTags.map((t) => [t.name.toLowerCase(), t.id]));
  console.log(`Found ${tagMap.size} existing tags`);

  // 3. Parse CSV
  console.log("Parsing CSV file...");
  const records = [];
  const parser = createReadStream(
    "/home/ubuntu/upload/Export_Contacts_undefined_Mar_2026_3_01_PM.csv"
  ).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    })
  );

  for await (const record of parser) {
    records.push(record);
  }
  console.log(`Parsed ${records.length} rows from CSV`);

  // 4. Filter and prepare contacts
  let skippedNoEmail = 0;
  let skippedDuplicate = 0;
  let imported = 0;
  let tagAssignments = 0;
  let newTagsCreated = 0;
  const contactsToInsert = [];

  for (const row of records) {
    const email = (row["Email"] || "").trim().toLowerCase();

    // Skip rows without email
    if (!email) {
      skippedNoEmail++;
      continue;
    }

    // Skip duplicates
    if (existingEmails.has(email)) {
      skippedDuplicate++;
      continue;
    }

    // Mark as seen to avoid CSV-internal duplicates
    existingEmails.add(email);

    const firstName = titleCase(row["First Name"] || "");
    const lastName = titleCase(row["Last Name"] || "");
    const phone = (row["Phone"] || "").trim() || null;
    const company = titleCase(row["Business Name"] || "") || null;
    const createdAt = row["Created"] ? new Date(row["Created"]) : new Date();
    const tags = (row["Tags"] || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Determine source based on tags
    let source = "other";
    if (tags.some((t) => t.includes("newsletter") || t.includes("subscribe"))) {
      source = "newsletter";
    } else if (tags.some((t) => t.includes("website") || t.includes("landing"))) {
      source = "contact_form";
    } else if (tags.some((t) => t.includes("download") || t.includes("resource"))) {
      source = "download";
    }

    contactsToInsert.push({
      firstName: firstName || "Unknown",
      lastName: lastName || "",
      email,
      phone,
      company,
      source,
      status: "new",
      tags: tags.length > 0 ? JSON.stringify(tags) : null,
      createdAt,
      rawTags: tags,
    });
  }

  console.log(`\nImport summary:`);
  console.log(`  Total CSV rows: ${records.length}`);
  console.log(`  Skipped (no email): ${skippedNoEmail}`);
  console.log(`  Skipped (duplicate): ${skippedDuplicate}`);
  console.log(`  To import: ${contactsToInsert.length}`);

  // 5. Batch insert contacts (100 at a time)
  const BATCH_SIZE = 100;
  const insertedContactIds = []; // { id, rawTags }

  for (let i = 0; i < contactsToInsert.length; i += BATCH_SIZE) {
    const batch = contactsToInsert.slice(i, i + BATCH_SIZE);

    for (const contact of batch) {
      try {
        const [result] = await conn.execute(
          `INSERT INTO contacts (firstName, lastName, email, phone, company, source, status, tags, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            contact.firstName,
            contact.lastName,
            contact.email,
            contact.phone,
            contact.company,
            contact.source,
            contact.status,
            contact.tags,
            contact.createdAt,
          ]
        );
        imported++;
        insertedContactIds.push({
          id: result.insertId,
          rawTags: contact.rawTags,
        });
      } catch (err) {
        // Skip on duplicate key or other errors
        if (err.code === "ER_DUP_ENTRY") {
          skippedDuplicate++;
        } else {
          console.error(`Error inserting ${contact.email}:`, err.message);
        }
      }
    }

    if ((i + BATCH_SIZE) % 500 === 0 || i + BATCH_SIZE >= contactsToInsert.length) {
      console.log(
        `  Inserted ${Math.min(i + BATCH_SIZE, contactsToInsert.length)}/${contactsToInsert.length}...`
      );
    }
  }

  // 6. Create new tags and assign them
  console.log("\nProcessing tags...");
  const tagColors = [
    "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6",
    "#8b5cf6", "#ef4444", "#14b8a6", "#f97316", "#06b6d4",
  ];
  let colorIdx = 0;

  for (const { id: contactId, rawTags } of insertedContactIds) {
    for (const tagName of rawTags) {
      const tagKey = tagName.toLowerCase();

      // Create tag if it doesn't exist
      if (!tagMap.has(tagKey)) {
        try {
          const color = tagColors[colorIdx % tagColors.length];
          colorIdx++;
          const [result] = await conn.execute(
            "INSERT INTO contactTags (name, color) VALUES (?, ?)",
            [tagName, color]
          );
          tagMap.set(tagKey, result.insertId);
          newTagsCreated++;
        } catch (err) {
          if (err.code === "ER_DUP_ENTRY") {
            // Another concurrent insert created it, fetch it
            const [rows] = await conn.execute(
              "SELECT id FROM contactTags WHERE name = ?",
              [tagName]
            );
            if (rows.length > 0) tagMap.set(tagKey, rows[0].id);
          }
        }
      }

      // Assign tag to contact
      const tagId = tagMap.get(tagKey);
      if (tagId) {
        try {
          await conn.execute(
            "INSERT INTO contactTagAssignments (contactId, tagId) VALUES (?, ?)",
            [contactId, tagId]
          );
          tagAssignments++;
        } catch (err) {
          // Skip duplicates
        }
      }
    }
  }

  console.log(`\n✅ Import complete!`);
  console.log(`  Contacts imported: ${imported}`);
  console.log(`  New tags created: ${newTagsCreated}`);
  console.log(`  Tag assignments: ${tagAssignments}`);
  console.log(`  Skipped (no email): ${skippedNoEmail}`);
  console.log(`  Skipped (duplicate): ${skippedDuplicate}`);

  // Final count
  const [countResult] = await conn.execute("SELECT COUNT(*) as count FROM contacts");
  console.log(`  Total contacts in database: ${countResult[0].count}`);

  await conn.end();
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
