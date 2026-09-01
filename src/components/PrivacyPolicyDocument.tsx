const EMAIL = "admin@showbuz.app";

function Mail() {
  return <a href={`mailto:${EMAIL}`}>{EMAIL}</a>;
}

export function PrivacyPolicyDocument() {
  return (
    <article className="legal-doc">
      <h1>ShowBuz Privacy Policy</h1>
      <p className="meta">
        Effective date: September 1, 2026 · Last updated: September 1, 2026
      </p>

      <p>
        ShowBuz (&quot;the app&quot;, &quot;we&quot;, &quot;us&quot;) is a
        scheduling and deputy (&quot;dep&quot;) booking tool for musicians and
        other performers working in theatre and live entertainment. This policy
        explains what personal data ShowBuz collects, how it is used, and the
        choices available to you.
      </p>

      <p>
        ShowBuz is provided by ShowBuz, who is the data controller for the
        purposes of UK GDPR and the Data Protection Act 2018.
      </p>

      <h2>1. Data We Collect</h2>

      <p>
        <strong>Account information.</strong> When you create a ShowBuz account,
        we collect your name and email address, and authentication information
        handled via our authentication provider.
      </p>

      <p>
        <strong>Show and booking data.</strong> Information you enter about
        shows you&apos;re involved in: show name, venue, schedule, chair/role
        details, and related booking information.
      </p>

      <p>
        <strong>Contact details of deps and other performers.</strong> ShowBuz
        lets you build a personal address book of deputies (&quot;deps&quot;) you
        work with, including their name, phone number, email address, and the
        instrument(s) they play. This information is entered by you, about other
        individuals, for the purpose of contacting them regarding cover work. You
        are responsible for having an appropriate basis (such as their consent to
        be contacted, or an existing professional relationship) for storing and
        using their contact details within the app. When a booking request is
        sent to a dep, their name and contact details are used to deliver that
        request via the message channels described below.
      </p>

      <p>
        <strong>Calendar access.</strong> If you enable calendar sync, ShowBuz
        reads and/or writes calendar events (Apple Calendar) to keep your
        performance schedule up to date on your device&apos;s calendar. This
        requires your explicit permission, granted through iOS system settings,
        and can be revoked at any time.
      </p>

      <p>
        <strong>Contacts access.</strong> If you choose to import a dep from your
        phone&apos;s contacts, ShowBuz reads the specific contact you select
        (name, phone, email) to pre-fill their details in the app. ShowBuz does
        not access your full contacts list without your action.
      </p>

      <p>
        <strong>Location data.</strong> If you enable Travel Assist (live
        train/journey planning), ShowBuz uses your device&apos;s location,
        including in the background if you grant that permission, to provide
        relevant travel information for your upcoming performances. This feature
        is optional and location access can be disabled at any time in iOS
        settings.
      </p>

      <p>
        <strong>Push notification tokens.</strong> To deliver notifications
        (e.g. a dep responding to a request, a day-of-show reminder), we store a
        device push token associated with your account.
      </p>

      <p>
        <strong>Crash and diagnostic data.</strong> If the app crashes or
        encounters an error, we collect diagnostic information (device type, OS
        version, and the state of the app at the time of the crash) via our
        crash-reporting provider, Sentry, to help us fix issues. This may
        occasionally include fragments of other data present in the app&apos;s
        memory at the time of the crash.
      </p>

      <p>
        <strong>Usage data.</strong> Basic information about how the app is used,
        to help us understand which features are useful and identify problems.
      </p>

      <h2>2. How We Use This Data</h2>
      <ul>
        <li>
          To provide the core functionality of the app: managing your shows,
          diary, and dep booking workflow.
        </li>
        <li>
          To send booking requests, availability polls, and related messages to
          deps on your behalf, via SMS, WhatsApp, and/or email as applicable.
        </li>
        <li>
          To sync your schedule with your device calendar, where enabled.
        </li>
        <li>
          To provide travel/journey information, where Travel Assist is enabled.
        </li>
        <li>
          To send you notifications relevant to your bookings and schedule.
        </li>
        <li>To diagnose and fix technical problems.</li>
        <li>
          To communicate with you about your account or the service, where
          necessary.
        </li>
      </ul>

      <h2>3. Legal Basis for Processing (UK GDPR)</h2>
      <ul>
        <li>
          <strong>Contract:</strong> processing your account and show data is
          necessary to provide the service you&apos;ve signed up for.
        </li>
        <li>
          <strong>Legitimate interests:</strong> diagnostic/crash data and basic
          usage data, to maintain and improve the app.
        </li>
        <li>
          <strong>Consent:</strong> location access and push notifications, which
          require your explicit permission and can be withdrawn at any time via
          iOS settings.
        </li>
      </ul>

      <h2>4. Third-Party Service Providers</h2>
      <p>
        ShowBuz uses the following third-party services to operate. Each
        processes data only as necessary to provide their specific function:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — database hosting and backend
          infrastructure.
        </li>
        <li>
          <strong>Sentry</strong> — crash and error reporting.
        </li>
        <li>
          <strong>Twilio and WhatsApp</strong> — delivery of SMS/WhatsApp
          messages to deps.
        </li>
        <li>
          <strong>Apple</strong> — push notification delivery, and
          calendar/contacts access where you grant permission.
        </li>
      </ul>
      <p>
        These providers may process data outside the UK/EEA. Where this occurs,
        we rely on appropriate safeguards such as Standard Contractual Clauses.
      </p>

      <h2>5. Data Sharing</h2>
      <p>We do not sell your personal data. Data is shared only:</p>
      <ul>
        <li>
          With the third-party service providers listed above, to operate the
          app.
        </li>
        <li>
          With a dep you contact, to the extent necessary to send them a booking
          request (they will see the show/performance details relevant to that
          request).
        </li>
        <li>
          With a travel companion or family member you explicitly invite to share
          a trip or show, where the app&apos;s sharing features are used.
        </li>
        <li>Where required by law.</li>
      </ul>

      <h2>6. Data Retention</h2>
      <p>
        We retain your account and show data for as long as your account is
        active. Dep contact details you&apos;ve entered are retained until you
        delete them or close your account. You can request deletion of your
        account and associated data at any time (see Section 8).
      </p>

      <h2>7. Children&apos;s Privacy</h2>
      <p>
        ShowBuz is intended for use by working professionals and is not directed
        at children. We do not knowingly collect data from anyone under 18.
      </p>

      <h2>8. Your Rights</h2>
      <p>
        Under UK GDPR, you have the right to access, correct, delete, or export
        your personal data, and to object to or restrict certain processing. To
        exercise any of these rights, contact us at <Mail />.
      </p>
      <p>
        If you&apos;re not satisfied with how we&apos;ve handled your data, you
        have the right to complain to the UK Information Commissioner&apos;s
        Office (ICO) at{" "}
        <a href="https://ico.org.uk" rel="noreferrer" target="_blank">
          ico.org.uk
        </a>
        .
      </p>

      <h2>9. Security</h2>
      <p>
        We take reasonable technical and organizational measures to protect your
        data, including encrypted connections and access controls on our backend
        infrastructure. No system is completely secure, and we cannot guarantee
        absolute security.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Material changes will be
        reflected by an updated &quot;Last updated&quot; date above.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        Questions about this policy or your data can be sent to <Mail />.
      </p>
    </article>
  );
}
