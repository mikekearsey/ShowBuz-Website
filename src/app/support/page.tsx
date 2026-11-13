import type { Metadata } from "next";
import { Footer } from "@/components/DownloadCta";
import { Header } from "@/components/Header";

const EMAIL = "admin@showbuz.app";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Help with ShowBuz, the diary and dep booking app for theatre musicians.",
};

function Mail() {
  return <a href={`mailto:${EMAIL}`}>{EMAIL}</a>;
}

export default function SupportPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 bg-white">
        <article className="legal-doc">
          <h1>ShowBuz Support</h1>

          <p>
            ShowBuz is a diary and dep booking app for theatre musicians. If you
            hold a chair, it keeps every curtain of your show in one diary and
            helps you book deps for the curtains you&apos;re off. If you dep, it
            shows the curtains you&apos;ve been asked to cover and lets you
            accept or decline in one tap.
          </p>

          <h2>Get help</h2>
          <p>
            Email <Mail />. We aim to reply within two working days. If
            something looks wrong, a screenshot helps a lot.
          </p>
          <p>
            New to ShowBuz? The <a href="/guide">How to use</a> guide walks
            through the app step by step.
          </p>

          <h2>Delete your account</h2>
          <p>
            In the app, go to <strong>Settings → Account → Delete my
            account</strong>. The app explains what will happen before you
            confirm:
          </p>
          <ul>
            <li>Your login stops working straight away, on every device.</li>
            <li>
              Shows you run are archived. Any deps booked on your future
              curtains are told those dates are released.
            </li>
            <li>
              If you dep for other chairs, your future bookings are withdrawn
              and each chair is told.
            </li>
            <li>Your data is erased within 30 days.</li>
          </ul>
          <p>
            You can&apos;t undo this in the app. If you can&apos;t sign in, or
            deleted your account by mistake, email <Mail />.
          </p>
          <p>
            If a chair added your details to ShowBuz and you don&apos;t have an
            account, you can{" "}
            <a href="/privacy#opt-out">remove your contact details here</a>.
          </p>

          <h2>Privacy and terms</h2>
          <p>
            Read our <a href="/privacy">Privacy Policy</a> and{" "}
            <a href="/terms">Terms of Use</a>. ShowBuz is provided by Mike
            Kearsey Limited.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
