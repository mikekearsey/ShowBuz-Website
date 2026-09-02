import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email verified",
  description: "Thank you. Email verified. Please return to the ShowBuz app.",
};

export default function EmailConfirmedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
