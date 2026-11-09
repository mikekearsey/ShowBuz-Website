import { ContactEmail } from "./ContactEmail";
import { PhoneFrame } from "./PhoneFrame";

type Shot = {
  src: string;
  alt: string;
  caption: string;
};

type Step = {
  text: string;
  shots?: Shot[];
};

type Guide = {
  id: string;
  where: string;
  title: string;
  steps: Step[];
  shot?: Shot;
};

function shot(file: string, alt: string, caption: string): Shot {
  return { src: `/guide/${file}`, alt, caption };
}

function step(text: string, ...shots: Shot[]): Step {
  return shots.length > 0 ? { text, shots } : { text };
}

const guides: Guide[] = [
  {
    id: "getting-started",
    where: "Start",
    title: "Getting started",
    steps: [
      step(
        "ShowBuz is one app. You can run a chair, cover other people’s shows, or both. It is the same login.",
      ),
      step(
        "Create an account. Under “I am a…”, choose Chair if you run the show, or Dep if you cover. Add your name, then your mobile. Enter the 6-digit code from the text, then your email and password. Open the confirmation email on this iPhone.",
        shot(
          "01-you.webp",
          "Create an account. Choose Chair or Dep, with the name still empty.",
          "Create an account. Choose Chair or Dep.",
        ),
      ),
      step(
        "Sign in with that email and password. If the phone has Face ID or Touch ID, you can turn on “Use Face ID to sign in”. The name matches the phone.",
        shot(
          "02-sign-in.webp",
          "Sign in, with email and password empty, and a link to create an account.",
          "Sign in with your email and password.",
        ),
      ),
      step(
        "A chair with no show yet sees “Which show do you chair?” Search the list. The published curtains fill the diary. You do not type the times.",
        shot(
          "03-set-up.webp",
          "An empty diary. It says no show yet, and the button is Set up your show.",
          "No show yet. Tap Set up your show.",
        ),
        shot(
          "03-create-show.webp",
          "Create show, with High Tides typed in the search, and a line to add it as a new show.",
          "Search, or add the show if it is not in the list.",
        ),
      ),
      step(
        "Along the bottom: Diary, Deps, Requests if you cover, Messages, and Settings.",
      ),
    ],
  },
  {
    id: "bring-in-what-you-have",
    where: "Diary",
    title: "Bring in what you already have",
    steps: [
      step(
        "Keep the shows you already play in one place. If you chair, search “Which show do you chair?” The published curtains fill the diary.",
      ),
      step(
        "Add the deps who already cover you. The first time, Diary can show Finish setting up, with Add your deps. That opens Deps. Anytime, add their name, then Add to Dep List. They are marked as already sat in. Nobody is messaged.",
      ),
      step(
        "Copy bookings you already made. That same first-time card has Bring in bookings. Later, open Settings, tap your show, then Bring in existing bookings. Choose Phone calendar or Spreadsheet.",
      ),
      step(
        "On Phone calendar, tick the calendars on this iPhone and tap Find bookings. On Spreadsheet, tap Choose a file. Use Excel or CSV. From Numbers, export as CSV or Excel first. Check the list. Nothing is saved, and nobody is messaged, until you tap Import. Undo import stays in Settings for 14 days, if you have not changed those curtains.",
      ),
      step(
        "If you only cover, the app asks “What shows do you cover?” Tap Add show and type the name. You can Skip. Anyone who covers can open the same list later: Settings, then Shows, then Add show.",
      ),
      step(
        "That list names the shows you follow. It does not copy a chair’s curtains, or their dep list. If that chair already has you as a dep, a join request is sent. ShowBuz can then match the show to the calendar on this phone. A matched curtain on your covers diary says “Added from your external diary”. There is no Bring in bookings screen for a dep.",
      ),
    ],
  },
  {
    id: "reading-your-diary",
    where: "Diary",
    title: "Reading your diary",
    steps: [
      step(
        "See the run at a glance. The chair views are Day, Dates, Month, and List.",
        shot(
          "08-month.webp",
          "Month view for November, with green, blue, amber, and red days.",
          "Month. The colours are the same as on the day.",
        ),
        shot(
          "09-list.webp",
          "List view, a run of November curtains for High Tides.",
          "List. One row for each curtain.",
        ),
      ),
      step(
        "Day shows the date, each curtain time, and who is on it.",
        shot(
          "05-day.webp",
          "Day view for High Tides at The Irving Theatre. Wednesday 11 November has a 14:30 curtain and a 19:30 curtain, and nobody is booked.",
          "Day. Both curtains, and who is on each one.",
        ),
      ),
      step(
        "Dates is a grid. Deps go across the top. Curtains go down the side. Tap Key for the full colour list.",
        shot(
          "06-dates.webp",
          "Dates grid. The columns are CG, LD, JT, SH, and JW. Cells show booked, asked, hold, and confirm.",
          "Dates. The columns are the deps’ initials.",
        ),
      ),
      step(
        "A cyan outline means you are waiting. A green outline means they are free, and not booked yet. Amber is a hold. Solid green is booked. A red outline means they can’t do it.",
        shot(
          "07-key.webp",
          "The Key. Eight cell colours, plus the date colours for a plain day, a clash, a day off asked, and a day off confirmed.",
          "Key. Every colour in one list.",
        ),
      ),
      step(
        "On the date, a day off you have asked for is amber. A confirmed day off is green. A clash with your iPhone calendar is amber, bold, and italic. The switch is Highlight diary clashes, in Settings. A matinee and an evening on the same day stay separate.",
        shot(
          "10-clash.webp",
          "Saturday 14 November, 14:30. A red lightning line says Tap to view clash.",
          "A clash on the curtain. Tap the line.",
        ),
        shot(
          "11-clash-card.webp",
          "The clash card for Recording Session, 13:00 to 16:00, from Calendar.",
          "The clash card shows the other event and its time.",
        ),
      ),
    ],
  },
  {
    id: "booking-a-dep",
    where: "Diary",
    title: "Booking a dep",
    steps: [
      step(
        "See who’s covering you. You see the message before it goes. Nothing is sent until the blue plane. The red ✕ cancels.",
        shot(
          "15-send-card-ask.webp",
          "A send card for one curtain. It says this dep has no app or WhatsApp. The blue plane sends. The red cross cancels.",
          "Read the card. The plane sends. The ✕ cancels.",
        ),
      ),
      step(
        "One curtain: open the day, tap Choose cover, then the name. The options are one box: Sit-in, Availability, and Hold Show. Confirm Show is in that box only once the day off is approved. Tap the row, read the card, then the plane or the ✕.",
        shot(
          "12-choose-cover.webp",
          "Choose cover, listing Lauren Davies, Chloe Green, Sophie Harrison, Jessica Taylor, and Jack Williams.",
          "Choose cover. Tap a name.",
        ),
        shot(
          "13-options.webp",
          "One options box for Jack Williams: Sit-in, Availability, and Hold Show.",
          "One box: Sit-in, Availability, Hold Show.",
        ),
        shot(
          "16-asked.webp",
          "Friday 6 November at 19:30. The line says Waiting for Chloe, asked 23 minutes ago, and read.",
          "While you wait, the line says Waiting for Chloe…",
        ),
      ),
      step(
        "Several curtains: open Dates, tap the cells, then Check availability. Hold and Confirm are the boxes on that row. Confirm stays hidden until those days off are approved. If the dates were one ask, Cancel whole poll clears every date in it. For a dep with the app, the poll card lists the curtains. For WhatsApp, the dep picks dates in “Choose dates”, and the message itself does not list them.",
        shot(
          "18-dates-selected.webp",
          "Dates with three cells selected. The bar says 3 dates selected. Check availability is ticked. Hold is not.",
          "Tap the cells, then Check availability.",
        ),
        shot(
          "19-send-card-poll.webp",
          "Check availability card to a dep who has the app. The card lists three curtains in November.",
          "With the app, the card lists the curtains.",
        ),
      ),
      step(
        "“I’m free” is not a booking. The pill becomes “{Name} is free”, in a green outline. A hold becomes “Lauren on hold”, in amber, until you confirm it or release it. Show messages before sending is on by default, so tapping Hold opens the send card. On Deps → To Do, a held curtain shows how long it has lasted, such as “held 3 days”. When the curtain is 48 hours away, one phone alert opens the send card. Nothing is sent from the lock screen.",
        shot(
          "17-free.webp",
          "Tuesday 17 November at 19:30. The pill says Lauren is free, in a green outline.",
          "Free is a green outline. It is not a booking yet.",
        ),
        shot(
          "23-on-hold.webp",
          "Tuesday 10 November at 19:30. The amber pill says Lauren on hold.",
          "The pill says Lauren on hold.",
        ),
        shot(
          "22-send-card-hold.webp",
          "The send card titled Check and hold. The blue plane sends. The red cross cancels.",
          "Tapping Hold opens the send card.",
        ),
        shot(
          "24-dates-holding.webp",
          "Dates grid with an amber H on Tuesday 10 evening and Wednesday 11 matinee.",
          "A hold is an amber H on Dates.",
        ),
      ),
      step(
        "After you confirm them, they still have to accept or decline. Until they accept, the pill is “Confirming {Name}”. After they accept it is “{Name} Confirmed”, in solid green. If they decline, or they can’t do it, they are not booked. In the Choose cover list they show in red under “Unavailable Deps”.",
        shot(
          "26-confirming.webp",
          "Wednesday 18 November at 19:30. The pill says Confirming Chloe, and the line says Waiting for Chloe, not sent.",
          "Confirming, until they accept.",
        ),
        shot(
          "27-confirmed.webp",
          "Thursday 19 November at 19:30. The pill says Chloe Confirmed, in solid green.",
          "After they accept: Chloe Confirmed.",
        ),
        shot(
          "28-cant.webp",
          "Choose cover. Sophie Harrison is in red under the heading Unavailable Deps.",
          "Someone who can’t do it is in red under Unavailable Deps.",
        ),
        shot(
          "20-two-dots.webp",
          "Tuesday 24 November at 19:30. The line says Waiting for Jessica. Choose cover has two small dots.",
          "Two dots on Choose cover: one asked, one who can’t.",
        ),
      ),
      step(
        "People with the app answer in Requests, and get a phone alert. The card says App. People without the app tap Available or Unavailable on WhatsApp. If they have neither, the card says No app or WhatsApp. If you already agreed in person, the day page has Confirm manually. The morning check is in The 09:00 check.",
      ),
    ],
  },
  {
    id: "the-0900-check",
    where: "Diary",
    title: "The 09:00 check",
    steps: [
      step(
        "Peace of mind on the day. You do not have to chase. At 09:00 the booked dep is asked if they are still OK.",
      ),
      step(
        "Turn it on for each show. Open Settings, then Messaging, then Day-of reminders.",
      ),
      step(
        "The message goes to the dep booked to cover. They get it on WhatsApp, and as a phone alert if they use the app. It asks if they are set for that show today, and tells them to tap below.",
      ),
      step(
        "On WhatsApp they tap Confirm OK. In the app they tap Still OK. Can’t make it is there if they cannot do it.",
      ),
      step(
        "One answer covers both curtains that day. Until they answer, your pill reads “Re-confirming {Name}”. After the dep says yes on the day, the pill goes back to “Chloe Confirmed”, in solid green.",
        shot(
          "29-reconfirming.webp",
          "The pill says Re-confirming Chloe, with a tick, before they answer on the day.",
          "Before they answer: Re-confirming Chloe.",
        ),
        shot(
          "30-chloe-confirmed.webp",
          "Friday 6 November at 19:30. After the dep says yes, the pill says Chloe Confirmed, in solid green.",
          "After they say yes: Chloe Confirmed.",
        ),
      ),
    ],
  },
  {
    id: "sit-ins",
    where: "Diary",
    title: "Sit-ins",
    steps: [
      step(
        "A dep who has not sat in can still be asked to cover. A sit-in is a separate ask, for a curtain you are still playing.",
      ),
      step(
        "If you are still playing, that same box can offer Sit-in as well as Availability.",
      ),
      step(
        "The pill says “Confirming {Name} to sit in”, then “{Name} sitting in”. They accept or decline that sit-in the same way as a cover.",
        shot(
          "32-sit-in-card.webp",
          "Send card titled Ask to sit in. Nothing is sent until the blue plane. The red cross cancels.",
          "The sit-in card. The plane sends it.",
        ),
        shot(
          "33-sit-in-waiting.webp",
          "Friday 27 November at 19:30. The pill says Confirming Ryan to sit in, and the line says Waiting for Ryan, not sent.",
          "Confirming Ryan to sit in.",
        ),
        shot(
          "34-sitting-in.webp",
          "Saturday 28 November at 19:30. The pill says Ryan sitting in.",
          "After they accept: Ryan sitting in.",
        ),
      ),
    ],
  },
  {
    id: "days-off",
    where: "Diary",
    title: "Days off",
    steps: [
      step(
        "Mark the curtain off before you confirm a dep onto it. Confirm Show stays hidden until the day off is approved.",
        shot(
          "14-confirm-line.webp",
          "The box for Jack Williams on Thursday 26 November, a day off that is already approved. It lists Availability, Hold Show, and Confirm Show.",
          "Once the day off is approved, Confirm Show is in the box.",
        ),
      ),
      step(
        "On the day page, tap Request off. On Dates, select the curtains. The button names the count. With two curtains selected it says “Request 2 shows off”.",
        shot(
          "35-request-off.webp",
          "Wednesday 2 December, 14:30 and 19:30, both empty. The buttons are Request off and Choose cover.",
          "On the day page the button says Request off.",
        ),
        shot(
          "36-dates-off.webp",
          "Two curtains selected on Dates. The button says Request 2 shows off.",
          "Two curtains selected: Request 2 shows off.",
        ),
      ),
      step(
        "While it waits, the date is amber. When it is approved, the date is green, and the day page can show Confirmed off.",
        shot(
          "37-day-off-waiting.webp",
          "Tuesday 24 evening is amber, a day off still waiting. Wednesday 25 evening is green, a day off approved.",
          "Amber while it waits. Green when it is approved.",
        ),
      ),
      step(
        "Reset show is on Confirmed off and on Request Denied. It clears that day off so you can start again.",
      ),
    ],
  },
  {
    id: "changing-or-cancelling",
    where: "Diary",
    title: "Changing or cancelling",
    steps: [
      step(
        "Releasing is a message too. You see the card first. Nothing goes until the blue plane. The red ✕ cancels.",
      ),
      step(
        "While you are only asking, tap Withdraw request. If several dates were one ask, Cancel whole poll clears every date in that ask.",
        shot(
          "39-withdraw.webp",
          "The menu on an ask for Chloe. The rows are Mark unavailable and Withdraw request. The pill Mark Chloe Green confirmed is one line.",
          "Withdraw request, from the pill’s menu.",
        ),
      ),
      step(
        "A hold uses Release. A booking you confirmed uses Withdraw.",
        shot(
          "40-release-hold.webp",
          "A Release card for a hold. The blue plane sends. The red cross cancels.",
          "Release lets go of a hold.",
        ),
        shot(
          "41-release-booking.webp",
          "A Withdraw card for a confirmed booking. The blue plane sends. The red cross cancels.",
          "Withdraw lets go of a confirmed booking.",
        ),
      ),
      step(
        "If they were only free, not booked, they can use Change to unavailable on a future curtain.",
      ),
      step(
        "If they have not accepted yet, they can tap the red ✕. That asks “Are you sure?” On the day of the show, they can answer Can’t make it.",
      ),
    ],
  },
  {
    id: "your-deps-list",
    where: "Deps",
    title: "Your Deps list",
    steps: [
      step("Deps opens on To Do, then Dep list, then Payments."),
      step(
        "To Do is what is waiting on you: holds, clashes, and days off that still need a cover. If there is nothing, it says Nothing to do. A held curtain shows how long it has lasted, such as “held 3 days”.",
        shot(
          "25-todo-hold.webp",
          "To Do. One row says Lauren on hold, held 3 days, for Tuesday 10 November at 19:30.",
          "To Do. A hold shows how long it has lasted.",
        ),
      ),
      step(
        "Dep list is the people you can ask. The list shows the deps you can reach. People you can’t reach are left off on purpose. Add to Dep List is for someone who already covers this show. No invite is sent, and they are marked as already sat in. Invite new dep & save details sends this show’s details. It needs a mobile.",
        shot(
          "42-dep-list.webp",
          "Dep List for High Tides, with five people: Lauren, Chloe, Sophie, Jessica, and Jack.",
          "Five deps. People you can’t reach are left off.",
        ),
        shot(
          "44-dep-card.webp",
          "Chloe Green’s card. Email is filled in. Phone is empty. Sat-in is ticked.",
          "A dep’s card. This one has an email and no phone.",
        ),
        shot(
          "43-import-contact.webp",
          "Import contact, listing six demo people. The phone numbers are the drama range used for examples, and the emails are example addresses.",
          "Add someone from your contacts.",
        ),
      ),
      step(
        "Payments is for finished covers that have been invoiced, until you mark them Paid.",
        shot(
          "50-payments.webp",
          "Chair Payments for Chloe. Paid circles are empty. Rows say Invoiced 5 Nov or Not invoiced yet. No amounts and no bank details.",
          "Payments. Empty circles under Paid.",
        ),
      ),
    ],
  },
  {
    id: "for-deps",
    where: "Requests",
    title: "For deps",
    steps: [
      step(
        "You can answer with no app. On WhatsApp, tap Available or Unavailable. Saying you are free is not a booking.",
      ),
      step(
        "With the app, the ask is in Requests, and you also get a phone alert. Current holds asks that are still open, and bookings waiting for you to accept. History is what is finished. Invoices is after you have played. Tap the circle under “Invoiced?”.",
        shot(
          "49-dep-invoices.webp",
          "Invoices. Circles under Invoiced. One row says Invoiced 5 Nov, one says Paid 5 Nov, and two are still open. No amounts.",
          "Invoices. Tap the circle under Invoiced.",
        ),
      ),
      step(
        "After the chair confirms you, Current shows a green tick and a red ✕. Decline asks “Are you sure?” A sit-in uses the same buttons. On the day, Still OK and Can’t make it are on your cover.",
        shot(
          "45-dep-current.webp",
          "Requests, on Current. Each row has a green tick and a red cross, with no words on the buttons.",
          "A green tick, and a red ✕.",
        ),
        shot(
          "47-decline-confirm.webp",
          "A confirm step: Are you sure? Cancel and Decline.",
          "Decline asks “Are you sure?” first.",
        ),
      ),
      step(
        "If you only cover, the Diary tab is your covers. If you also chair a show, Diary is the show you run, and the asks stay under Requests.",
        shot(
          "48-dep-diary.webp",
          "The covers diary. Thursday 19 November at 19:30 says Covering the chair, with a green tick on High Tides, and 1 cover ask waiting.",
          "Your covers diary, when you only cover.",
        ),
      ),
    ],
  },
  {
    id: "home-screen-widget",
    where: "Home",
    title: "The home screen widget",
    steps: [
      step(
        "One look at your home screen tells you what is next. You do not have to open the app.",
      ),
      step(
        "In the widget list the name is ShowBuz. Choose the small size or the medium size. Both show the date, the show, and the curtain times.",
      ),
      step(
        "If you chair, that is your next curtain. When the same person is on both curtains, the small widget shows a short name under the times, such as Chloe G. The medium widget shows a short name, such as J. Smith. If the tile has moved to a show you are covering, and someone is on your own show, a short line can show that show and their initials.",
        shot(
          "53-widget.webp",
          "The iPhone home screen. The small ShowBuz widget shows High Tides on Friday 6 November, the 14:30 and 19:30 curtains, and Chloe G. under the times.",
          "Both curtains, and a short name when it is the same person.",
        ),
      ),
      step(
        "If you cover, that is your next cover: which show, and when. Your own name is not written on it. If it is only a hold, the tile says On hold for.",
      ),
      step(
        "A red number shows when something is unread. Tap the tile to open the app. To add it, touch and hold the home screen, tap Edit, tap Add Widget, choose ShowBuz, pick the size, then tap Add Widget. A chair can also open Settings, then Widget.",
      ),
    ],
  },
  {
    id: "messages-and-alerts",
    where: "Messages",
    title: "Messages and alerts",
    steps: [
      step(
        "Messages is one conversation per person. Each curtain is a heading inside that conversation.",
        shot(
          "51-messages.webp",
          "Messages with Chloe Green. The heading is High Tides, Friday 6 November, 7:30pm. One reply is in the thread.",
          "One conversation. The curtain is the heading.",
        ),
      ),
      step(
        "The bell is for alerts you have not opened. A dep’s reply appears in Messages, not on the bell.",
      ),
      step(
        "The Requests tab shows a count of asks still open, including a booking waiting for them to accept.",
      ),
    ],
  },
  {
    id: "settings",
    where: "Settings",
    title: "Settings",
    steps: [
      step(
        "Appearance: Stage is the dark look, and it is the default. Paper is the light look. Contrast is the third.",
        shot(
          "55-settings-appearance.webp",
          "Appearance, with Stage selected. The sample card is Les Misérables at the Sondheim Theatre, the app’s built-in preview, with the line Tap to view personnel.",
          "Stage. The sample card is the app’s built-in preview.",
        ),
      ),
      step(
        "Open Messaging. Under How they hear from you, Direct messaging on means the booking message is sent for you. Off means you still book in the diary, and nothing is sent.",
        shot(
          "54-settings-messaging.webp",
          "Messaging settings. Direct messaging is off. Show messages before sending is on. Day-of reminders is off.",
          "Messaging. Show messages before sending is on.",
        ),
      ),
      step(
        "Show messages before sending is on by default. You see who it goes to, App or WhatsApp, and the words, with the red ✕ and the blue plane. A send to 3 or more people always shows the full card.",
      ),
      step(
        "Day-of reminders, on that same Messaging screen, is the 09:00 check. It is per show. One confirmation covers both curtains that day.",
      ),
      step(
        "Highlight diary clashes is the switch for your iPhone calendars. All-day events are ignored. Create show is the same search as when you first add a show.",
      ),
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
          {guide.steps.map((item) => {
            const shots = item.shots ?? [];
            return (
              <li key={item.text}>
                <div
                  className={`app-guide-step${shots.length > 0 ? " has-shot" : ""}${shots.length > 1 ? " has-many" : ""}`}
                >
                  <p>{item.text}</p>
                  {shots.length > 0 ? (
                    <div className="app-guide-shots">
                      {shots.map((itemShot) => (
                        <figure key={itemShot.src}>
                          <PhoneFrame
                            guide
                            src={itemShot.src}
                            alt={itemShot.alt}
                            width={1206}
                            height={2622}
                          />
                          <figcaption>{itemShot.caption}</figcaption>
                        </figure>
                      ))}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      {guide.shot ? (
        <figure>
          <PhoneFrame
            quiet
            src={guide.shot.src}
            alt={guide.shot.alt}
            width={1206}
            height={2622}
          />
          <figcaption>{guide.shot.caption}</figcaption>
        </figure>
      ) : null}
    </article>
  );
}
