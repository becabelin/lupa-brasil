import { cookies } from "next/headers";

const COOKIE_NAME = "pg2026_admin";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin2026";
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  return value === getAdminPassword();
}

export { COOKIE_NAME };
