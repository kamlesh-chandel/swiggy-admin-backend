import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  "strapi::logger",
  "global::global-error-handler",
  "strapi::errors",
  "strapi::security",
  ,
  {
    name: "strapi::cors",
    config: {
      origin: ["*"], // for testing
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];

export default config;
