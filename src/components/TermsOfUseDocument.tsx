const EMAIL = "admin@showbuz.app";

function Mail() {
  return <a href={`mailto:${EMAIL}`}>{EMAIL}</a>;
}

export function TermsOfUseDocument() {
  return (
    <article className="legal-doc">
      <h1>ShowBuz Terms of Use</h1>
      <p className="meta">
        Effective date: September 1, 2026 · Last updated: September 1, 2026
      </p>

      <p>
        These Terms of Use (&quot;Terms&quot;) govern your access to and use of
        ShowBuz (the &quot;App&quot;), provided by ShowBuz (&quot;we&quot;,
        &quot;us&quot;, &quot;our&quot;). By creating an account or using the
        App, you agree to these Terms. If you do not agree, do not use the App.
      </p>

      <h2>1. What ShowBuz Is</h2>
      <p>
        ShowBuz is a scheduling and deputy (&quot;dep&quot;) booking tool for
        musicians and performers working in theatre and live entertainment,
        including features to manage show diaries, request and confirm cover
        (&quot;dep&quot;) bookings, track invoicing status, sync with your device
        calendar, and (where enabled) view travel information and show schedule
        data.
      </p>

      <h2>2. Eligibility and Accounts</h2>
      <ul>
        <li>You must be at least 18 years old to create an account.</li>
        <li>
          You are responsible for keeping your account credentials secure and for
          all activity under your account.
        </li>
        <li>
          You must provide accurate information when creating your account and
          when entering show, booking, or contact information.
        </li>
      </ul>

      <h2>3. Your Responsibility for Contact Data You Enter</h2>
      <p>
        ShowBuz allows you to store contact details (name, phone number, email,
        instrument) of deps and other individuals you work with, and to use that
        information to send them booking requests and related messages via SMS,
        WhatsApp, and/or email.{" "}
        <strong>
          You are solely responsible for having an appropriate basis to store and
          use another person&apos;s contact details
        </strong>{" "}
        — such as an existing professional relationship or their agreement to be
        contacted — and for complying with applicable data protection and
        electronic communications law when doing so. We provide the tool; how you
        use it with respect to third parties&apos; personal data is your
        responsibility.
      </p>

      <div className="important">
        <strong>4. Schedule and Venue Data — Important Disclaimer</strong>
        <p>
          Where ShowBuz displays show dates, times, or venue information sourced
          from external websites, ticketing platforms, or automated
          data-gathering processes, this information is provided for convenience
          only and{" "}
          <strong>
            is not guaranteed to be accurate, complete, or current
          </strong>
          . Show schedules can change at short notice, source websites can be
          wrong or out of date, and automated data collection — however carefully
          built — cannot guarantee perfect accuracy. You are responsible for
          independently verifying any date, time, or venue information that is
          critical to you (for example, before travelling to a performance or
          confirming a booking) directly with the official source, such as the
          venue or production&apos;s own box office. We are not liable for any
          loss, cost, or missed performance arising from reliance on schedule or
          venue data displayed in the App.
        </p>
      </div>

      <h2>5. Pricing and In-App Purchases</h2>
      <p>
        ShowBuz is currently free to use. We plan to introduce optional in-app
        purchases in the future, which may unlock additional features or
        functionality. Where offered, in-app purchases will be processed through
        Apple&apos;s App Store payment system, and are subject to Apple&apos;s
        own terms and refund policies in addition to these Terms — we do not
        process payments directly or hold your payment details.
      </p>
      <p>
        We will clearly indicate what any purchase unlocks and its price before
        you are charged. We do not guarantee that any feature currently available
        for free will remain free indefinitely, but we will not retroactively
        charge you for a feature you already have access to under your current
        plan without clear notice.
      </p>
      <p>
        Refunds for in-app purchases are handled by Apple in accordance with the
        App Store&apos;s refund policies, not directly by us.
      </p>

      <h2>6. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          Use the App to send unsolicited, abusive, or harassing messages to any
          person.
        </li>
        <li>
          Use the App for any unlawful purpose, or in a way that infringes
          another person&apos;s rights, including their data protection rights.
        </li>
        <li>
          Attempt to interfere with, disrupt, or gain unauthorized access to the
          App or its underlying systems.
        </li>
        <li>
          Use automated means to scrape, extract, or bulk-download data from the
          App beyond normal personal use.
        </li>
      </ul>

      <h2>7. Third-Party Services and Integrations</h2>
      <p>
        The App relies on third-party services (including but not limited to
        Supabase, Sentry, Apple push notifications and calendar services, and
        messaging providers such as Twilio and WhatsApp) to operate. We are not
        responsible for outages, errors, or changes in these third-party
        services that affect the App&apos;s functionality, though we will make
        reasonable efforts to address any resulting disruption.
      </p>

      <h2>8. Availability and Changes to the App</h2>
      <p>
        We aim to keep the App available and functioning correctly, but we do not
        guarantee uninterrupted or error-free operation. We may update, modify,
        or discontinue features of the App at any time, and will use reasonable
        efforts to communicate material changes.
      </p>

      <h2>9. Intellectual Property</h2>
      <p>
        The App, including its design, branding, and underlying software, is
        owned by us or our licensors. You retain ownership of the data you enter
        into the App (show details, dep contacts, notes, etc.), and grant us a
        license to process that data solely for the purpose of providing the
        App&apos;s functionality to you.
      </p>

      <h2>10. Termination</h2>
      <p>
        You may stop using the App and delete your account at any time. We may
        suspend or terminate your access if you breach these Terms, misuse the
        App, or use it in a way that harms other users or the service.
      </p>

      <h2>11. Disclaimer of Warranties</h2>
      <p>
        The App is provided &quot;as is&quot; and &quot;as available.&quot; To
        the fullest extent permitted by law, we disclaim all warranties, express
        or implied, including any warranty that the App will be error-free,
        uninterrupted, or fit for a particular purpose — including, without
        limitation, the schedule/venue data disclaimer in Section 4 above.
      </p>

      <h2>12. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for any
        indirect, incidental, or consequential loss arising from your use of the
        App, including but not limited to lost bookings, missed performances, or
        costs arising from inaccurate schedule data or failed message delivery.
        Nothing in these Terms limits liability that cannot be excluded under
        applicable law, such as liability for death or personal injury caused by
        negligence, or fraud.
      </p>

      <h2>13. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be
        reflected by an updated &quot;Last updated&quot; date above, and where
        appropriate, we will notify you directly.
      </p>

      <h2>14. Governing Law</h2>
      <p>
        These Terms are governed by the laws of England and Wales, and any
        disputes will be subject to the exclusive jurisdiction of the courts of
        England and Wales.
      </p>

      <h2>15. Contact Us</h2>
      <p>
        Questions about these Terms can be sent to <Mail />.
      </p>

      <div className="note">
        This document was drafted to reflect ShowBuz&apos;s actual features as of
        August 2026, and is intended as a starting point to satisfy Apple&apos;s
        TestFlight/App Store Connect requirements. It has not been reviewed by a
        lawyer. A legal review is strongly recommended before wider release —
        particularly given the App facilitates messaging to third parties and
        displays schedule data sourced from external websites, both of which
        carry real liability considerations worth a professional&apos;s
        sign-off.
      </div>
    </article>
  );
}
