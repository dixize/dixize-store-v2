require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();

  console.log("Подключение к Neon OK");

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN
        CREATE TYPE "OrderStatus" AS ENUM (
          'NEW',
          'IN_PROGRESS',
          'COMPLETED',
          'CANCELLED'
        );
      END IF;
    END
    $$;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT PRIMARY KEY,
      "email" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "role" "Role" NOT NULL DEFAULT 'USER',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS "Order" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "projectType" TEXT NOT NULL,
      "addons" TEXT[] NOT NULL,
      "comment" TEXT,
      "totalPrice" INTEGER NOT NULL,
      "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT "Order_userId_fkey"
        FOREIGN KEY ("userId")
        REFERENCES "User"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS "Order_userId_idx"
    ON "Order"("userId");
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS "Project" (
      "id" TEXT PRIMARY KEY,
      "title" TEXT NOT NULL,
      "titleEn" TEXT NOT NULL DEFAULT '',
      "description" TEXT NOT NULL,
      "descriptionEn" TEXT NOT NULL DEFAULT '',
      "category" TEXT NOT NULL DEFAULT 'web',
      "categoryEn" TEXT NOT NULL DEFAULT '',
      "url" TEXT NOT NULL DEFAULT '',
      "visual" TEXT NOT NULL DEFAULT 'visual-store',
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("База данных готова.");
  await client.end();
}

main().catch(async (error) => {
  console.error("ОШИБКА:");
  console.error(error);
  await client.end().catch(() => {});
  process.exit(1);
});