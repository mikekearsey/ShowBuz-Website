export const SHOWBUZ_APP_CALLBACK = "depbookv3://auth/callback";

export function showbuzAppHref(extraQuery?: Record<string, string>): string {
  if (typeof window === "undefined") {
    const params = new URLSearchParams(extraQuery ?? {});
    const query = params.toString();
    return `${SHOWBUZ_APP_CALLBACK}${query ? `?${query}` : ""}`;
  }
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(extraQuery ?? {})) {
    params.set(key, value);
  }
  const query = params.toString();
  return `${SHOWBUZ_APP_CALLBACK}${query ? `?${query}` : ""}${window.location.hash}`;
}

export function hrefHasAuthToken(href: string): boolean {
  return /(?:^|[?#&])(?:code|token_hash|access_token)=/.test(href);
}
