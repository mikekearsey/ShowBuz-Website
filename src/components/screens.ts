export type ScreenShot = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Screen colour around the shot inside the phone frame. */
  screenColor?: string;
};

export const screens = {
  diary: {
    src: "/screens/diary-day.webp",
    width: 1125,
    height: 2282,
    alt: "ShowBuz diary for The Last Horizon at The Irving Theatre on Saturday 31 October. The 2:30pm show is waiting for Ren Santo.",
  },
  sendCard: {
    src: "/screens/check-availability.webp",
    width: 1036,
    height: 1080,
    screenColor: "#080a09",
    alt: "Send card for a WhatsApp message to Ren Santo, checking availability for The Last Horizon at 2:30pm on 31 October, with send and cancel.",
  },
  dates: {
    src: "/screens/dates-grid.webp",
    width: 1125,
    height: 2436,
    alt: "Dates grid for The Last Horizon in October, with every dep on one screen and nights held, unavailable, waiting and confirmed.",
  },
  receipts: {
    src: "/screens/read-receipts-v2.webp",
    width: 1125,
    height: 2436,
    alt: "Messages with Ren Santo about The Last Horizon. Blue ticks show a WhatsApp message was read, and Ren can't do Friday 30 October at 7:30pm.",
  },
  whatsapp: {
    src: "/screens/whatsapp-reply.webp",
    width: 739,
    height: 1504,
    screenColor: "#101010",
    alt: "WhatsApp message from ShowBuz asking Ren Santo to hold The Last Horizon at 7:30pm on 31 October, with Available and Unavailable.",
  },
  relax: {
    src: "/screens/hold-notification.webp",
    width: 1125,
    height: 2285,
    alt: "Notification that Ren Santo is free for The Last Horizon on Thursday 29 October at 7:30pm, with that night held in the diary.",
  },
  morning: {
    src: "/screens/day-of-confirm.webp",
    width: 1062,
    height: 450,
    screenColor: "#05060e",
    alt: "WhatsApp message from Kit on the morning of the show: Hi Ren, just checking you're all set for The Last Horizon today at 14:30? Please tap below to confirm. Blue ticks show it was read.",
  },
} satisfies Record<string, ScreenShot>;
