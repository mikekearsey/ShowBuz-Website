import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  addCurtain,
  getProduction,
  refreshProduction,
  restoreCurtain,
  signInWithPassword,
  suppressCurtain,
} from "@/lib/admin/catalog";
import { adminCookieName, createAdminToken, isAllowedAdminEmail } from "@/lib/admin/session";

async function requireConfiguredAdmin(email: string) {
  if (!isAllowedAdminEmail(email)) {
    throw new Error("This account is not allowed to use Admin.");
  }
}

export async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    redirect("/admin/login?error=missing");
  }
  try {
    const session = await signInWithPassword(email, password);
    await requireConfiguredAdmin(session.email);
    const token = await createAdminToken(session.email);
    const jar = await cookies();
    jar.set(adminCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch {
    redirect("/admin/login?error=auth");
  }
  redirect("/admin");
}

export async function logoutAction() {
  "use server";
  const jar = await cookies();
  jar.delete(adminCookieName);
  redirect("/admin/login");
}

export async function refreshShowAction(formData: FormData) {
  "use server";
  const id = String(formData.get("productionId") ?? "");
  const production = await getProduction(id);
  if (!production) redirect("/admin");
  try {
    await refreshProduction(production);
  } catch {
    redirect(`/admin/shows/${id}?error=refresh`);
  }
  redirect(`/admin/shows/${id}?ok=refresh`);
}

export async function addCurtainAction(formData: FormData) {
  "use server";
  const productionId = String(formData.get("productionId") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const venueName = String(formData.get("venueName") ?? "");
  const venueCity = String(formData.get("venueCity") ?? "");
  const venueAddress = String(formData.get("venueAddress") ?? "");
  if (!productionId || !date || !time) {
    redirect(`/admin/shows/${productionId}?error=curtain`);
  }
  try {
    await addCurtain({
      productionId,
      date,
      time,
      venueName,
      venueCity,
      venueAddress,
    });
  } catch {
    redirect(`/admin/shows/${productionId}?error=curtain`);
  }
  redirect(`/admin/shows/${productionId}?ok=add`);
}

export async function deleteCurtainAction(formData: FormData) {
  "use server";
  const productionId = String(formData.get("productionId") ?? "");
  const curtainId = String(formData.get("curtainId") ?? "");
  if (!productionId || !curtainId) {
    redirect("/admin");
  }
  try {
    await suppressCurtain(curtainId);
  } catch {
    redirect(`/admin/shows/${productionId}?error=delete`);
  }
  redirect(`/admin/shows/${productionId}?ok=delete`);
}

export async function restoreCurtainAction(formData: FormData) {
  "use server";
  const productionId = String(formData.get("productionId") ?? "");
  const curtainId = String(formData.get("curtainId") ?? "");
  if (!productionId || !curtainId) {
    redirect("/admin");
  }
  try {
    await restoreCurtain(curtainId);
  } catch {
    redirect(`/admin/shows/${productionId}?error=restore`);
  }
  redirect(`/admin/shows/${productionId}?ok=restore`);
}
