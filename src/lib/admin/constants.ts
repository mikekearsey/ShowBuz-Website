/** Catalog nights you add in Admin. Scrapes never delete existing rows. */
export const ADMIN_SOURCE = "admin";

/**
 * Catalog nights you remove in Admin. The row stays so a later scrape cannot
 * put the same curtain back (unique on production + time + venue).
 */
export const ADMIN_SUPPRESSED_SOURCE = "admin_suppressed";

export const ADMIN_COOKIE = "sbz_admin";
export const LONDON_TZ = "Europe/London";
