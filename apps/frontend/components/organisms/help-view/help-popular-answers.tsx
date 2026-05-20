"use client";

import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";

interface HelpPopularAnswersProps {
  title: string;
  answers: string[];
}

export function HelpPopularAnswers({
  title,
  answers,
}: HelpPopularAnswersProps): React.ReactElement {
  return (
    <section className="mt-8 sm:mt-10">
      <h2 className="text-xl font-black text-content">{title}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {answers.map((answer, index) => (
          <Link
            key={answer}
            href={APP_ROUTES.FAQ}
            className="flex min-w-0 items-start gap-3 rounded-lg border border-content/5 bg-surface px-4 py-3 text-sm font-bold text-content/75 transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 sm:items-center sm:gap-4"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 break-words">{answer}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
