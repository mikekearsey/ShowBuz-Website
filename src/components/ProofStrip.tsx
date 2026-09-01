const facts = [
  {
    title: "Schedule magic!",
    body: "Enter the show name and the full schedule appears in your diary... every published date and time. No typing the PDF. No keeping it in your head.",
  },
  {
    title: "At a glance",
    body: "Requested, Available, Confirmed. You can see the night is covered without fishing through chats.",
  },
  {
    title: "We've got this",
    body: "Autobook goes through your dep list until dates are filled. Autoconfirm re-confirms on the day.",
  },
];

export function ProofStrip() {
  return (
    <section aria-label="What ShowBuz is" className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-3 sm:px-6">
        {facts.map((fact) => (
          <article
            key={fact.title}
            className="rounded-2xl border border-line bg-surface px-6 py-6"
          >
            <h2 className="font-display text-lg font-bold tracking-tight">
              {fact.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{fact.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
