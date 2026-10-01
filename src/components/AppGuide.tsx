import { ContactEmail } from "./ContactEmail";
import { PhoneFrame } from "./PhoneFrame";

type Shot = {
  src: string;
  alt: string;
  caption: string;
};

type Guide = {
  id: string;
  where: string;
  title: string;
  steps: string[];
  shot?: Shot;
};

const DAY_VIEW: Shot = {
  src: "/app-screen.png",
  alt: "ShowBuz Day view. West Side Story at Theatre Royal. Friday 28 August 2026, 19:30. Confirmed off and Re-confirming John. Views: Day, Week, Month, Year, List view. Tabs: Diary, Deps, Settings.",
  caption:
    "Day view in Diary. Views along the top: Day, Week, Month, Year, List view. This night shows Confirmed off and Re-confirming John. Bottom tabs: Diary, Deps, Settings.",
};

const chairGuides: Guide[] = [
  {
    id: "get-the-show-in",
    where: "Settings",
    title: "Add a show to the diary",
    steps: [
      "Open Settings (bottom right).",
      "Add show.",
      "Type or search the show name. The published schedule fills the diary.",
      "Open Diary to see the dates.",
    ],
  },
  {
    id: "look-at-the-night",
    where: "Diary",
    title: "Read a night",
    steps: [
      "Open Diary (bottom left).",
      "Choose Day, Week, Month, Year or List view along the top.",
      "Day view shows the date and curtain time. Tap to view personnel is on the night.",
      "The night also shows its status. This screen shows Confirmed off and Re-confirming John.",
    ],
    shot: DAY_VIEW,
  },
  {
    id: "ask-someone",
    where: "Diary",
    title: "Ask a dep to cover",
    steps: [
      "Open Diary.",
      "Open the night that needs covering.",
      "Pick a dep.",
      "The app sends the request. They tap yes in the app or in the message. The response lands in the diary.",
    ],
  },
  {
    id: "auto-book",
    where: "Diary",
    title: "Use Auto Book",
    steps: [
      "Open the night in Diary.",
      "Start Auto Book.",
      "Auto Book works down your dep list until the dates are filled.",
    ],
  },
  {
    id: "they-tap-available",
    where: "Diary",
    title: "When they tap Available",
    steps: [
      "They tap Available in the app, or on WhatsApp. They do not have to download ShowBuz.",
      "On WhatsApp they can also tap Unavailable.",
      "The answer shows up in both diaries.",
    ],
  },
  {
    id: "auto-reconfirm",
    where: "Diary",
    title: "Auto reconfirm on the day of the show",
    steps: [
      "At 9:00am on the day of the show, Auto reconfirm sends a confirmation request.",
      "One tap covers both shows that day.",
      "Day view can show a Re-confirming row on the night, for example Re-confirming John.",
    ],
    shot: {
      ...DAY_VIEW,
      caption:
        "Day view showing Re-confirming John on the night, with Confirmed off above it.",
    },
  },
  {
    id: "your-deps",
    where: "Deps",
    title: "The Deps tab",
    steps: [
      "Open Deps (middle of the bottom bar).",
      "This is your list of deps.",
    ],
  },
];

const depGuides: Guide[] = [
  {
    id: "no-app-needed",
    where: "WhatsApp",
    title: "Answer without installing the app",
    steps: [
      "You do not have to download ShowBuz. WhatsApp is enough.",
      "Tap Available or Unavailable on the WhatsApp message.",
      "The chair opens Diary and can see the night is covered.",
    ],
  },
  {
    id: "requests-in-one-place",
    where: "ShowBuz",
    title: "Answer in the app",
    steps: [
      "Open ShowBuz. Requests from chairs are in one list.",
      "Tap Available.",
      "You can see what is already booked.",
    ],
  },
  {
    id: "your-own-show",
    where: "Same login",
    title: "If you also hold a chair",
    steps: [
      "Same login. Same app.",
      "Add your own show in Settings. The dates are in Diary.",
    ],
    shot: {
      ...DAY_VIEW,
      caption: "Diary is the left tab. Deps is the middle tab. Settings is the right tab.",
    },
  },
];

export function AppGuide() {
  return (
    <div className="app-guide">
      <div className="app-guide-wrap">
        <nav className="app-guide-toc" aria-label="On this page">
          <p>Chair-Holders</p>
          <ul>
            {chairGuides.map((guide) => (
              <li key={guide.id}>
                <a href={`#${guide.id}`}>{guide.title}</a>
              </li>
            ))}
          </ul>
          <p>Deps</p>
          <ul>
            {depGuides.map((guide) => (
              <li key={guide.id}>
                <a href={`#${guide.id}`}>{guide.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="app-guide-intro">
          <h1>How to use ShowBuz</h1>
          <p className="intro">
            Step-by-step instructions for the iPhone app. Deps on Android can
            answer on WhatsApp; that still updates the diary.
          </p>
        </div>

        <div className="app-guide-body">
          <GuideAudience
            id="chair-holders"
            heading="Chair-Holders"
            guides={chairGuides}
          />
          <GuideAudience id="for-deps" heading="Deps" guides={depGuides} />

          <p className="contact">
            Questions: <ContactEmail />
          </p>
        </div>
      </div>
    </div>
  );
}

function GuideAudience({
  id,
  heading,
  guides,
}: {
  id: string;
  heading: string;
  guides: Guide[];
}) {
  return (
    <section id={id} className="app-guide-section scroll-mt-24">
      <h2>{heading}</h2>
      {guides.map((guide) => (
        <GuideBlock key={guide.id} guide={guide} />
      ))}
    </section>
  );
}

function GuideBlock({ guide }: { guide: Guide }) {
  return (
    <article
      id={guide.id}
      className={`app-guide-block scroll-mt-24${guide.shot ? " has-shot" : ""}`}
    >
      <div>
        <p className="where">{guide.where}</p>
        <h3>{guide.title}</h3>
        <ol className="steps">
          {guide.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      {guide.shot ? (
        <figure>
          <PhoneFrame quiet src={guide.shot.src} alt={guide.shot.alt} />
          <figcaption>{guide.shot.caption}</figcaption>
        </figure>
      ) : null}
    </article>
  );
}
