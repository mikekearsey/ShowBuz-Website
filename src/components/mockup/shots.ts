import { screens } from "@/components/screens";

export type Shot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  screenColor?: string;
  /** The picture is already a home screen, so it is not put inside another phone frame. */
  bare?: boolean;
};

const guide = {
  width: 1206,
  height: 2622,
} as const;

export const dayShot: Shot = {
  ...guide,
  src: "/guide/05-day.webp",
  alt: "Day view for High Tides at The Irving Theatre on Wednesday 11 November, with 14:30 and 19:30 and nobody booked.",
};

export const createShowShot: Shot = {
  ...guide,
  src: "/guide/03-create-show.webp",
  alt: "Create show search with High Tides typed in, and a line to add it as a new show.",
};

export const datesShot: Shot = {
  ...guide,
  src: "/guide/06-dates.webp",
  alt: "Dates grid for High Tides in November. Columns are CG, LD, JT, SH and JW, with booked, hold, asked and confirm cells.",
};

export const sendCardShot: Shot = {
  ...guide,
  src: "/guide/19-send-card-poll.webp",
  alt: "Check availability card to Chloe for High Tides, listing three November curtains, with send and cancel.",
};

export const ticksShot: Shot = {
  ...guide,
  src: "/guide/51-messages.webp",
  alt: "Messages with Chloe Green about High Tides on Friday 6 November at 7:30pm. A blue tick and the word read.",
};

export const holdShot: Shot = {
  ...guide,
  src: "/guide/25-todo-hold.webp",
  alt: "To Do for High Tides. Lauren on hold, held 3 days, for Tuesday 10 November at 19:30.",
};

export const morningShot: Shot = {
  ...guide,
  src: "/guide/29-reconfirming.webp",
  alt: "Thursday 5 November at 19:30 for High Tides. The pill says Re-confirming Chloe, before they answer on the day.",
};

export const clashShot: Shot = {
  ...guide,
  src: "/guide/10-clash.webp",
  alt: "Saturday 14 November at 14:30 for High Tides. A line says Tap to view clash.",
};

export const requestsShot: Shot = {
  ...guide,
  src: "/guide/45-dep-current.webp",
  alt: "Requests. A booking to accept for High Tides on 18 November at 19:30, and an availability request for Friday 6 November at 19:30.",
};

export const invoicesShot: Shot = {
  ...guide,
  src: "/guide/49-dep-invoices.webp",
  alt: "Invoices for High Tides. Circles under Invoiced. One row says Invoiced 5 Nov and one says Paid 5 Nov.",
};

export const widgetShot: Shot = {
  ...guide,
  src: "/guide/53-widget.webp",
  alt: "iPhone home screen. The ShowBuz widget shows High Tides on Friday 6 November, curtains at 14:30 and 19:30, and Chloe G.",
};

/** No High Tides WhatsApp shot. This is the picture already on the live homepage. */
export const whatsappShot: Shot = {
  src: screens.whatsapp.src,
  alt: screens.whatsapp.alt,
  width: screens.whatsapp.width,
  height: screens.whatsapp.height,
  screenColor: screens.whatsapp.screenColor,
};
