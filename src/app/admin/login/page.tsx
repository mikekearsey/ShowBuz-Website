import { loginAction } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="admin-login">
      <p className="admin-kicker">ShowBuz</p>
      <h1>Admin</h1>
      <p className="admin-lead">
        Sign in with the ShowBuz account listed in ADMIN_EMAILS.
      </p>
      {error ? (
        <p className="admin-banner error" role="alert">
          {error === "missing"
            ? "Enter email and password."
            : error === "config"
              ? "Admin is not configured. Set ADMIN_EMAILS and ADMIN_SESSION_SECRET."
            : "Could not sign in. Check the account is allowed for Admin."}
        </p>
      ) : null}
      <form action={loginAction} className="admin-form">
        <label>
          Email
          <input type="email" name="email" autoComplete="username" required />
        </label>
        <label>
          Password
          <input
            type="password"
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
