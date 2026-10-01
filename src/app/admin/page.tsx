import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "./actions";
import { listProductions } from "@/lib/admin/catalog";
import { adminCookieName, readAdminEmail } from "@/lib/admin/session";

export default async function AdminHomePage() {
  const jar = await cookies();
  const email = await readAdminEmail(jar.get(adminCookieName)?.value);
  if (!email) redirect("/admin/login");

  const productions = await listProductions();

  return (
    <main>
      <header className="admin-top">
        <div>
          <p className="admin-kicker">ShowBuz Admin</p>
          <h1>Shows</h1>
          <p className="admin-lead">
            Every production in the catalog, with published start and finish
            dates.
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="admin-ghost">
            Sign out {email}
          </button>
        </form>
      </header>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Show</th>
              <th>Kind</th>
              <th>Venue / summary</th>
              <th>Start</th>
              <th>Finish</th>
              <th>Scrape</th>
            </tr>
          </thead>
          <tbody>
            {productions.map((show) => (
              <tr key={show.id}>
                <td>
                  <Link href={`/admin/shows/${show.id}`}>{show.name}</Link>
                </td>
                <td>{show.listing_kind}</td>
                <td>{show.venue_summary ?? "—"}</td>
                <td>{show.run_start_date ?? "—"}</td>
                <td>{show.run_end_date ?? "—"}</td>
                <td>
                  <span className={`admin-status ${show.scrape_status}`}>
                    {show.scrape_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="admin-footnote">{productions.length} shows in the catalog.</p>
    </main>
  );
}
