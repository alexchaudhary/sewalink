import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://neondb_owner:npg_EDkNoQUI72GT@ep-noisy-field-aopyq3ms.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
});