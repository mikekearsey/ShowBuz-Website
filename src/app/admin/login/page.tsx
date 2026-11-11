import { PasswordInput } from "@/components/admin/PasswordInput";
import { loginAction } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reason?: string; next?: string }>;
}) {
  const { error, reason, next } = await searchParams;
  const nextValue =
    next && next.startsWith("/admin") && !next.startsWith("/admin/login")
      ? next
      : "";

  return (
    <main className="admin-login">
      <p className="admin-kicker">ShowBuz</p>
      <h1>Admin</h1>
      <p className="admin-lead">
        Sign in with the ShowBuz account listed in ADMIN_EMAILS.
      </p>
      {reason === "idle" ? (
        <p className="admin-banner ok" role="status">
          You were signed out after 30 minutes without activity.
        </p>
      ) : null}
      {error ? (
        <p className="admin-banner error" role="alert">
          {error === "missing"
            ? "Enter email and password."
            : error === "config"
              ? "Admin is not configured. Set ADMIN_EMAILS."
              : "Could not sign in. Check the account is allowed for Admin."}
        </p>
      ) : null}
      <form action={loginAction} className="admin-form">
        {nextValue ? (
          <input type="hidden" name="next" value={nextValue} />
        ) : null}
        <label>
          Email
          <input type="email" name="email" autoComplete="username" required />
        </label>
        <label>
          Password
          <PasswordInput
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
