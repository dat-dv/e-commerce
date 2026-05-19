"use server";

import { headers } from "next/headers";

const SUPPORTED_LANGUAGES = ["en", "vi"] as const;
const DEFAULT_LANG = SUPPORTED_LANGUAGES[0];

export async function getServerSubdomain() {
  try {
    const headerStore = await headers();
    const host = headerStore.get("host") ?? undefined;
    if (!host) return DEFAULT_LANG;

    const subdomain = host.split(".")[0];
    if (
      SUPPORTED_LANGUAGES.includes(
        subdomain as (typeof SUPPORTED_LANGUAGES)[number],
      )
    ) {
      return subdomain as (typeof SUPPORTED_LANGUAGES)[number];
    }
  } catch {
    // ignore
  }
  return DEFAULT_LANG;
}
