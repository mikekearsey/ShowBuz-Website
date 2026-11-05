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

const guides: Guide[] = [
  {
    id: "getting-started",
    where: "Start",
    title: "Getting started",
    steps: [
      "ShowBuz is one app. You can run a chair, cover other people’s shows, or both. It is the same login.",
      "Create an account. Under “I am a…”, choose Chair if you run the show, or Dep if you cover. Add your name, then your mobile. Enter the 6-digit code from the text, then your email and password. Open the confirmation email on this iPhone.",
      "Sign in with that email and password. If the phone has Face ID or Touch ID, you can turn on “Use Face ID to sign in”. The name matches the phone.",
      "A chair with no show yet sees “Which show do you chair?” Search the list. The published curtains fill the diary. You do not type the times.",
      "Along the bottom: Diary, Deps, Requests if you cover, Messages, and Settings.",
    ],
  },
  {
    id: "bring-in-what-you-have",
    where: "Diary",
    title: "Bring in what you already have",
    steps: [
      "Keep the shows you already play in one place. If you chair, search “Which show do you chair?” The published curtains fill the diary.",
      "Add the deps who already cover you. The first time, Diary can show Finish setting up, with Add your deps. That opens Deps. Anytime, add their name, then Add to Dep List. They are marked as already sat in. Nobody is messaged.",
      "Copy bookings you already made. That same first-time card has Bring in bookings. Later, open Settings, tap your show, then Bring in existing bookings. Choose Phone calendar or Spreadsheet.",
      "On Phone calendar, tick the calendars on this iPhone and tap Find bookings. On Spreadsheet, tap Choose a file. Use Excel or CSV. From Numbers, export as CSV or Excel first. Check the list. Nothing is saved, and nobody is messaged, until you tap Import. Undo import stays in Settings for 14 days, if you have not changed those curtains.",
      "If you only cover, the app asks “What shows do you cover?” Tap Add show and type the name. You can Skip. Anyone who covers can open the same list later: Settings, then Shows, then Add show.",
      "That list names the shows you follow. It does not copy a chair’s curtains, or their dep list. If that chair already has you as a dep, a join request is sent. ShowBuz can then match the show to the calendar on this phone. A matched curtain on your covers diary says “Added from your external diary”. There is no Bring in bookings screen for a dep.",
    ],
  },
  {
    id: "reading-your-diary",
    where: "Diary",
    title: "Reading your diary",
    steps: [
      "See the run at a glance. The chair views are Day, Dates, Month, and List.",
      "Day shows the date, each curtain time, and who is on it.",
      "Dates is a grid. Deps go across the top. Curtains go down the side. Tap Key for the full colour list.",
      "A cyan outline means you are waiting. A green outline means they are free, and not booked yet. Amber is a hold. Solid green is booked. A red outline means they can’t do it.",
      "On the date, a day off you have asked for is amber. A confirmed day off is green. A clash with your iPhone calendar is amber, bold, and italic. The switch is Highlight diary clashes, in Settings. A matinee and an evening on the same day stay separate.",
    ],
  },
  {
    id: "booking-a-dep",
    where: "Diary",
    title: "Booking a dep",
    steps: [
      "See who’s covering you. You see the message before it goes. Nothing is sent until the blue plane. The red ✕ cancels.",
      "One curtain: open the day, tap Choose cover, then the name, then Options. The rows are Availability, Hold Show, and Confirm Show. Confirm Show appears only once that day off is approved. Tap send, read the card, then the plane or the ✕.",
      "Several curtains: open Dates, tap the cells, then Check availability. Hold and Confirm are the boxes on that row. Confirm stays hidden until those days off are approved. If the dates were one ask, Cancel whole poll clears every date in it.",
      "“I’m free” is not a booking. The pill becomes “{Name} is free”, in a green outline. A hold becomes “{Name} is held”, in amber, until you confirm it or release it. On Deps → To Do, a held curtain shows how long it has lasted, such as “held 3 days”. When the curtain is 48 hours away, one phone alert opens the send card. Nothing is sent from the lock screen.",
      "After you confirm them, they still have to Accept or Decline. Until they Accept, the pill is “Confirming {Name}”. After Accept it is “{Name} Confirmed”, in solid green. If they Decline, or they can’t do it, they are not booked. The line is “{Name} can’t do it”, in a red outline.",
      "People with the app answer in Requests, and get a phone alert. The card says App. People without the app tap Available or Unavailable on WhatsApp. If they have neither, the card says No app or WhatsApp. If you already agreed in person, the day page has Confirm manually. The morning check is in The 09:00 check.",
    ],
  },
  {
    id: "the-0900-check",
    where: "Diary",
    title: "The 09:00 check",
    steps: [
      "Peace of mind on the day. You do not have to chase. At 09:00 the booked dep is asked if they are still OK.",
      "Turn it on for each show. Open Settings, then Messaging, then Day-of reminders.",
      "The message goes to the dep booked to cover. They get it on WhatsApp, and as a phone alert if they use the app. It asks if they are set for that show today, and tells them to tap below.",
      "On WhatsApp they tap Confirm OK. In the app they tap Still OK. Can’t make it is there if they cannot do it.",
      "One answer covers both curtains that day. Until they answer, your pill reads “Re-confirming {Name}”. After they confirm, it reads “{Name} re-confirmed ✓”, and that curtain is solid green.",
    ],
  },
  {
    id: "sit-ins",
    where: "Diary",
    title: "Sit-ins",
    steps: [
      "A dep who has not sat in can still be asked to cover. A sit-in is a separate ask, for a curtain you are still playing.",
      "If you are still playing, Options can offer Sit-in as well as Availability.",
      "The pill says “Confirming {Name} to sit in”, then “{Name} sitting in”. They Accept or Decline that sit-in the same way as a cover.",
    ],
  },
  {
    id: "days-off",
    where: "Diary",
    title: "Days off",
    steps: [
      "Mark the curtain off before you confirm a dep onto it. Confirm Show stays hidden until the day off is approved.",
      "On the day page, tap Request off. On Dates, select the curtains and tap Request off.",
      "While it waits, the date is amber. When it is approved, the date is green, and the day page can show Confirmed off.",
      "Reset show is on Confirmed off and on Request Denied. It clears that day off so you can start again.",
    ],
  },
  {
    id: "changing-or-cancelling",
    where: "Diary",
    title: "Changing or cancelling",
    steps: [
      "Releasing is a message too. You see the card first. Nothing goes until the blue plane. The red ✕ cancels.",
      "While you are only asking, tap Withdraw request. If several dates were one ask, Cancel whole poll clears every date in that ask.",
      "A hold, or a booking you confirmed, uses Release.",
      "If they were only free, not booked, they can use Change to unavailable on a future curtain.",
      "If they have not tapped Accept, they can Decline. On the day of the show, they can answer Can’t make it.",
    ],
  },
  {
    id: "your-deps-list",
    where: "Deps",
    title: "Your Deps list",
    steps: [
      "Deps opens on To Do, then Dep list, then Payments.",
      "To Do is what is waiting on you: holds, clashes, and days off that still need a cover. If there is nothing, it says Nothing to do. A held curtain shows how long it has lasted, such as “held 3 days”.",
      "Dep list is the people you can ask. Add to Dep List is for someone who already covers this show. No invite is sent, and they are marked as already sat in. Invite new dep & save details sends this show’s details. It needs a mobile.",
      "Payments is for finished covers that have been invoiced, until you mark them Paid.",
    ],
  },
  {
    id: "for-deps",
    where: "Requests",
    title: "For deps",
    steps: [
      "You can answer with no app. On WhatsApp, tap Available or Unavailable. Saying you are free is not a booking.",
      "With the app, the ask is in Requests, and you also get a phone alert. Current holds asks that are still open, and bookings waiting for Accept. History is what is finished. Invoices is after you have played. Mark invoiced when you have sent one.",
      "After the chair confirms you, Current shows Accept and Decline. Decline asks “Are you sure?” A sit-in uses the same buttons. On the day, Still OK and Can’t make it are on your cover.",
      "If you only cover, the Diary tab is your covers. If you also chair a show, Diary is the show you run, and the asks stay under Requests.",
    ],
  },
  {
    id: "home-screen-widget",
    where: "Home",
    title: "The home screen widget",
    steps: [
      "One look at your home screen tells you what is next. You do not have to open the app.",
      "In the widget list the name is ShowBuz. Choose the small size or the medium size. Both show the date, the show, and the curtain times.",
      "If you chair, that is your next curtain. When someone is on it, the small widget shows their initials, or a short name when there is only one curtain. The medium widget shows a short name, such as J. Smith. If the tile has moved to a show you are covering, and someone is on your own show, a short line can show that show and their initials.",
      "If you cover, that is your next cover: which show, and when. Your own name is not written on it. If it is only a hold, the tile says On hold for.",
      "A red number shows when something is unread. Tap the tile to open the app. To add it, touch and hold the home screen, tap Edit, tap Add Widget, choose ShowBuz, pick the size, then tap Add Widget. A chair can also open Settings, then Widget.",
    ],
  },
  {
    id: "messages-and-alerts",
    where: "Messages",
    title: "Messages and alerts",
    steps: [
      "Messages is one conversation per person. Each curtain is a heading inside that conversation.",
      "The bell is for alerts you have not opened.",
      "The Requests tab shows a count of asks still open, including a booking waiting for Accept.",
    ],
  },
  {
    id: "settings",
    where: "Settings",
    title: "Settings",
    steps: [
      "Appearance: Stage is the dark look, and it is the default. Paper is the light look. Contrast is the third.",
      "Open Messaging. Under How they hear from you, Direct messaging on means the booking message is sent for you. Off means you still book in the diary, and nothing is sent.",
      "Show messages before sending is on by default. You see who it goes to, App or WhatsApp, and the words, with the red ✕ and the blue plane. A send to 3 or more people always shows the full card.",
      "Day-of reminders, on that same Messaging screen, is the 09:00 check. It is per show. One confirmation covers both curtains that day.",
      "Highlight diary clashes is the switch for your iPhone calendars. All-day events are ignored. Create show is the same search as when you first add a show.",
    ],
  },
];

export function AppGuide() {
  return (
    <div className="app-guide">
      <div className="app-guide-wrap">
        <nav className="app-guide-toc" aria-label="On this page">
          <p>On this page</p>
          <ul>
            {guides.map((guide) => (
              <li key={guide.id}>
                <a href={`#${guide.id}`}>{guide.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="app-guide-intro">
          <h1>How to use ShowBuz</h1>
          <p className="intro">
            A short guide to the iPhone app. Deps without the app can answer on
            WhatsApp. That still updates the diary.
          </p>
        </div>

        <div className="app-guide-body">
          {guides.map((guide) => (
            <GuideBlock key={guide.id} guide={guide} />
          ))}

          <p className="contact">
            Questions: <ContactEmail />
          </p>
        </div>
      </div>
    </div>
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
