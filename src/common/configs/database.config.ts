import { registerAs } from "@nestjs/config";

export default registerAs(
  "database",
  (): Record<string, unknown> => ({
    name: process.env.DATABASE_NAME,
    host: process.env.DATABASE_URL,
  }),
);
