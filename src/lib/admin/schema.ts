type CodedError = Error & { code?: string };

export function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function errorCode(error: unknown): string {
  if (error instanceof Error && "code" in error) {
    return String((error as CodedError).code ?? "").toLowerCase();
  }
  return "";
}

/** Column, table, or RPC is not on this database yet. */
export function isMissingSchema(error: unknown): boolean {
  const message = errorText(error).toLowerCase();
  const code = errorCode(error);
  return (
    code === "42703" ||
    code === "42p01" ||
    code === "pgrst202" ||
    code === "pgrst204" ||
    code === "pgrst205" ||
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("could not find the function") ||
    message.includes("could not find the table")
  );
}

export function plainAdminError(error: unknown): string {
  const message = errorText(error).trim();
  const lower = message.toLowerCase();
  if (!message) return "Something went wrong. Try again.";
  if (lower.includes("sign in required")) return "Sign in required.";
  if (
    lower.includes("could not find the function") ||
    lower.includes("could not find the table") ||
    lower.includes("schema cache") ||
    lower.includes("pgrst202") ||
    lower.includes("pgrst204") ||
    lower.includes("pgrst205")
  ) {
    return "That action is not available on the server yet.";
  }
  if (lower.includes("must be https")) {
    return "The address must start with https://.";
  }
  if (lower.includes("admin only") || lower.includes("unauthorized")) {
    return "The server refused that. Admin access is required.";
  }
  if (message.length > 320) return "Could not finish that. Try again.";
  return message;
}
