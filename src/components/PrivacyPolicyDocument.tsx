const EMAIL = "admin@showbuz.app";

function Mail() {
  return (
    <a href={`mailto:${EMAIL}`} className="font-bold text-black no-underline">
      {EMAIL}
    </a>
  );
}

export function PrivacyPolicyDocument() {
  return (
    <article
      className="mx-auto w-full max-w-[210mm] bg-white px-[18mm] py-[16mm] text-black shadow-[0_24px_60px_rgb(0_0_0_/_0.35)] sm:px-[20mm] sm:py-[18mm]"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "10.9pt",
        lineHeight: 1.35,
      }}
    >
      <h1 className="mb-[10pt] text-[16.3pt] font-normal">ShowBuz Privacy Policy</h1>

      <p className="mb-[2pt]">
        <strong>Effective date:</strong> 31st August 2026
      </p>
      <p className="mb-[12pt]">
        <strong>Last updated:</strong> 31st August 2026
      </p>

      <p className="mb-[10pt]">
        ShowBuz (&quot;the app&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is
        a scheduling and deputy (&quot;dep&quot;) booking tool for musicians and
        other performers working in theatre and live entertainment. This Privacy
        Policy explains how we collect, use, disclose, and protect your personal
        data, and the data of individuals you log within the app.
      </p>
      <p className="mb-[10pt]">
        ShowBuz is provided by ShowBuz. We operate as the Data Controller for the
        personal data processed through our service under the UK General Data
        Protection Regulation (UK GDPR) and the Data Protection Act 2018.
      </p>
      <p className="mb-[16pt]">
        For any privacy-related inquiries, you can contact us at <Mail />.
      </p>

      <h2 className="mb-[8pt] text-[16.3pt] font-normal">
        1. Data We Collect and How We Source It
      </h2>
      <p className="mb-[12pt]">
        We process personal data from two categories of data subjects:{" "}
        <strong>Account Holders</strong> (users who register for the app) and{" "}
        <strong>Deputies / Network Performers</strong> (individuals whose details
        are inputted by Account Holders).
      </p>

      <h3 className="mb-[8pt] text-[16.3pt] font-normal">
        A. Data Collected Directly From You (Account Holders)
      </h3>
      <ul className="mb-[12pt] list-disc space-y-[8pt] pl-[18pt]">
        <li>
          <strong>Account Information:</strong> Name, email address, and secure
          authentication tokens handled by our identity provider.
        </li>
        <li>
          <strong>Show and Booking Data:</strong> Show names, venues, performance
          dates, rehearsal schedules, chair/role details, and linked
          financial/booking rates you manually enter.
        </li>
        <li>
          <strong>Device Permissions (Optional):</strong>
          <ul className="mt-[6pt] list-[circle] space-y-[6pt] pl-[18pt]">
            <li>
              <em>Calendar Access:</em> If enabled, we read and write calendar
              events (e.g., Apple Calendar) to sync your schedule locally on your
              device.
            </li>
            <li>
              <em>Contacts Access:</em> If you choose to import a dep, we only
              access the specific contact entry you select to pre-fill their
              profile. We do not download or scrape your entire contact book.
            </li>
            <li>
              <em>Location Data:</em> If you enable &quot;Travel Assist&quot;, we
              collect your device&apos;s GPS location (including in the
              background while the app is closed) to send real-time travel and
              journey notifications.
            </li>
          </ul>
        </li>
        <li>
          <strong>Push Notification Tokens:</strong> Unique device tokens
          required to deliver transactional alerts (e.g., booking confirmations).
        </li>
        <li>
          <strong>Usage and Diagnostic Data:</strong> Technical logs, device
          type, operating system version, app usage statistics, and crash reports
          processed via Sentry (which may contain temporary fragments of app
          memory at the exact moment of a crash).
        </li>
      </ul>

      <h3 className="mb-[8pt] text-[16.3pt] font-normal">
        B. Data Collected From Third Parties (Deputies / Network Performers)
      </h3>
      <ul className="mb-[16pt] list-disc space-y-[8pt] pl-[18pt]">
        <li>
          <strong>Dep Contact Details:</strong> Name, phone number, email
          address, and instrument(s) played.
        </li>
        <li>
          <strong>Source:</strong> This data is not provided by the individual
          themselves, but is inputted manually or imported from device contacts
          by an Account Holder to manage their professional network.
        </li>
      </ul>

      <h2 className="mb-[8pt] text-[16.3pt] font-normal">
        2. Legal Bases for Processing Under UK GDPR
      </h2>
      <p className="mb-[8pt]">
        We only process personal data when we have a valid legal framework. The
        legal bases we rely on are:
      </p>
      <ol className="mb-[16pt] list-decimal space-y-[8pt] pl-[18pt]">
        <li>
          <strong>Contractual Necessity (Art. 6(1)(b) UK GDPR):</strong> To set
          up your account, manage your show diary, process your workflow, and
          deliver core app services.
        </li>
        <li>
          <strong>Legitimate Interests (Art. 6(1)(f) UK GDPR):</strong>
          <ul className="mt-[6pt] list-[circle] space-y-[6pt] pl-[18pt]">
            <li>
              <em>For Account Holders:</em> To monitor app stability, fix bugs
              via diagnostic tools, and improve app functionality.
            </li>
            <li>
              <em>For Deputies / Third Parties:</em> To allow Account Holders to
              efficiently manage professional business networks and send
              freelance work offers. It is within the reasonable expectations of
              freelance performers to be contacted for work opportunities by
              colleagues.
            </li>
          </ul>
        </li>
        <li>
          <strong>Consent (Art. 6(1)(a) UK GDPR):</strong> For processing precise
          device location (Travel Assist) and sending device Push Notifications.
          This consent can be instantly revoked at any time via your
          device&apos;s operating system settings.
        </li>
      </ol>

      <h2 className="mb-[8pt] text-[16.3pt] font-normal">
        3. Communication and Our Article 14 Obligations
      </h2>
      <p className="mb-[8pt]">
        Because Account Holders input personal data belonging to third-party
        Deputies, we are required by Article 14 of the UK GDPR to inform those
        individuals that we hold their information.
      </p>
      <p className="mb-[8pt]">
        To comply with the law without disrupting your professional workflow:
      </p>
      <ul className="mb-[16pt] list-disc space-y-[8pt] pl-[18pt]">
        <li>
          <strong>Transparency at First Contact:</strong> The very first time an
          Account Holder sends an automated booking request or availability poll
          to a Dep via SMS, WhatsApp, or email, ShowBuz will append a clear,
          non-intrusive link to this Privacy Policy.
        </li>
        <li>
          <strong>Direct Opt-Out:</strong> That message will inform the Dep that
          their details are stored securely in a colleague&apos;s digital address
          book within ShowBuz, and provide them with an immediate method to
          opt-out and have their data permanently deleted from our servers.
        </li>
      </ul>

      <h2 className="mb-[8pt] text-[16.3pt] font-normal">
        4. Data Sharing and Third-Party Service Providers
      </h2>
      <p className="mb-[8pt]">
        We do not sell, rent, or trade personal data. We only share data with
        trusted service providers who act as Data Processors under strict
        contractual boundaries:
      </p>
      <ul className="mb-[16pt] list-disc space-y-[8pt] pl-[18pt]">
        <li>
          <strong>Supabase:</strong> Secure cloud database hosting and backend
          infrastructure.
        </li>
        <li>
          <strong>Sentry:</strong> Real-time software crash analysis and
          debugging logs.
        </li>
        <li>
          <strong>Twilio &amp; WhatsApp Business API:</strong> Core
          infrastructure to route SMS and instant messages to your network.
        </li>
        <li>
          <strong>Apple:</strong> Relaying push tokens and coordinating local
          device permission frameworks.
        </li>
      </ul>

      <h2 className="mb-[8pt] text-[16.3pt] font-normal">
        5. International Data Transfers
      </h2>
      <p className="mb-[8pt]">
        Some of our third-party infrastructure providers operate servers located
        outside of the United Kingdom and the European Economic Area (EEA),
        primarily in the United States.
      </p>
      <p className="mb-[16pt]">
        Whenever your data is transferred outside the UK, we ensure a legally
        compliant mechanism is in place. We secure these transfers using the{" "}
        <strong>UK International Data Transfer Agreement (IDTA)</strong> or the{" "}
        <strong>
          UK Addendum to the European Commission’s Standard Contractual Clauses
          (SCCs)
        </strong>
        , alongside technical safeguards like end-to-end transport layer
        encryption.
      </p>

      <h2 className="mb-[8pt] text-[16.3pt] font-normal">
        6. Data Retention and Deletion Timelines
      </h2>
      <p className="mb-[8pt]">
        We abide by the principle of storage limitation. Data is kept no longer
        than necessary:
      </p>
      <ul className="mb-[16pt] list-disc space-y-[8pt] pl-[18pt]">
        <li>
          <strong>Active Accounts:</strong> Personal data, show records, and
          custom dep profiles are retained as long as your account remains
          active.
        </li>
        <li>
          <strong>Account Closure:</strong> If you close your account or request
          data deletion, all personal data, show histories, and associated dep
          records will be permanently erased or anonymized from our production
          systems within <strong>30 days</strong>.
        </li>
        <li>
          <strong>Inactivity Purge:</strong> Accounts that remain completely
          inactive for a continuous period of <strong>24 months</strong> will be
          automatically flagged, notified via email, and subsequently deleted
          along with all associated records.
        </li>
        <li>
          <strong>Dep Data Removal:</strong> If an Account Holder deletes an
          individual dep from their application address book, that dep&apos;s
          record is instantly wiped from our active databases.
        </li>
      </ul>

      <h2 className="mb-[8pt] text-[16.3pt] font-normal">
        7. Your Statutory Rights
      </h2>
      <p className="mb-[8pt]">
        Under the UK GDPR, both Account Holders and Deputies possess
        comprehensive data rights. You can request to exercise these at any time
        by emailing <Mail />:
      </p>
      <ul className="mb-[10pt] list-disc space-y-[8pt] pl-[18pt]">
        <li>
          <strong>Right of Access:</strong> Request a complete copy of all
          personal data we hold about you.
        </li>
        <li>
          <strong>Right to Rectification:</strong> Request corrections to
          inaccurate or incomplete personal records.
        </li>
        <li>
          <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong>{" "}
          Request permanent deletion of your data from our systems.
        </li>
        <li>
          <strong>Right to Restrict or Object to Processing:</strong> Challenge
          our reliance on Legitimate Interests to process your data, or restrict
          how we use it.
        </li>
        <li>
          <strong>Right to Data Portability:</strong> Request a digital,
          machine-readable export of the data you provided to us.
        </li>
      </ul>
      <p className="mb-[8pt]">
        If you believe we have processed your data unlawfully, you have the right
        to lodge a formal complaint with the UK supervisory authority:
      </p>
      <ul className="mb-[16pt] list-disc space-y-[4pt] pl-[18pt]">
        <li>
          <strong>Information Commissioner’s Office (ICO)</strong>
        </li>
        <li>
          Website:{" "}
          <a
            href="https://ico.org.uk"
            className="text-[#0000ee] underline"
            rel="noreferrer"
            target="_blank"
          >
            https://ico.org.uk
          </a>
        </li>
      </ul>

      <h2 className="mb-[8pt] text-[16.3pt] font-normal">8. Security Measures</h2>
      <p className="mb-[16pt]">
        We enforce rigorous technical and organisational controls to protect
        data. This includes using Secure Socket Layer (SSL/TLS) encryption for
        all data in transit, strict access control restrictions on backend cloud
        databases, and automated dependency scanning. While we deploy
        industry-standard architecture, no digital transmission or storage engine
        is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h2 className="mb-[8pt] text-[16.3pt] font-normal">
        9. Children&apos;s Privacy
      </h2>
      <p className="mb-[16pt]">
        ShowBuz is a specialised administrative utility designed strictly for
        working professional adults in the entertainment sector. We do not
        knowingly target, market to, or collect data from individuals under the
        age of 18.
      </p>

      <h2 className="mb-[8pt] text-[16.3pt] font-normal">
        10. Modifications to This Policy
      </h2>
      <p>
        We may routinely update this policy to reflect product feature shifts or
        changes in legal regulations. Material modifications will be broadcasted
        to users via an in-app notice or directly through email. The &quot;Last
        Updated&quot; timestamp at the apex of this document will alter
        accordingly.
      </p>
    </article>
  );
}
