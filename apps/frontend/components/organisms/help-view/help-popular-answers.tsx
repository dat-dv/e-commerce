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
      <h2 className="text-content text-xl font-black">{title}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {answers.map((answer, index) => (
          <Link
            key={answer}
            href={APP_ROUTES.FAQ}
            className="border-content/5 bg-surface text-content/75 hover:border-primary/30 hover:text-primary focus-visible:ring-primary/20 flex min-w-0 items-start gap-3 rounded-lg border px-4 py-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none sm:items-center sm:gap-4"
          >
            <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md text-xs">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 break-words">{answer}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
