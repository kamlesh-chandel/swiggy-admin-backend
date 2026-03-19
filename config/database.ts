import type { Core } from "@strapi/strapi";

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Database => {
  return {
    connection: {
      client: "postgres",
      connection: {
        connectionString: env("DATABASE_URL"),

        // 👇 THIS LINE FIXES TYPESCRIPT ERROR
        host: env("DATABASE_HOST", ""),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", ""),
        user: env("DATABASE_USERNAME", ""),
        password: env("DATABASE_PASSWORD", ""),

        ssl: {
          rejectUnauthorized: false,
        },
      },
      pool: {
        min: 2,
        max: 10,
      },
      acquireConnectionTimeout: 60000,
    },
  };
};

export default config;
