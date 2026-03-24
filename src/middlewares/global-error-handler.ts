import type { Context, Next } from "koa";

export default () => {
  return async (ctx: Context, next: Next) => {
    try {
      await next();

      // Handle Strapi structured errors (like 403 from policies)
      //hello
if (typeof ctx.body === "object" && ctx.body !== null && "error" in ctx.body) {
  const body = ctx.body as {
    error?: {
      status?: number;
      message?: string;
    };
  };

  const status = body.error?.status || ctx.status || 500;

  ctx.status = status;

  ctx.body = {
    success: false,
    errorCode: mapErrorCode(status),
    message: getMessage(status, body.error?.message),
  };
}
    } catch (error: any) {
      const status = error.status || error.statusCode || 500;

      ctx.status = status;

      ctx.body = {
        success: false,
        errorCode: mapErrorCode(status),
        message: getMessage(status, error.message),
      };
    }
  };
};

function mapErrorCode(status: number): string {
  switch (status) {
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "PERMISSION_DENIED";
    case 400:
      return "BAD_REQUEST";
    case 404:
      return "NOT_FOUND";
    default:
      return "SERVER_ERROR";
  }
}

function getMessage(status: number, defaultMessage?: string): string {
  if (status === 403) {
    return "You do not have permission to access this resource";
  }

  if (status === 401) {
    return "Authentication required";
  }

  return defaultMessage || "Something went wrong";
}
