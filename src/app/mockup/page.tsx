import { redirect } from "next/navigation";

/** The preview went live as the home page (9 Nov 2026). */
export default function MockupPage() {
  redirect("/");
}
