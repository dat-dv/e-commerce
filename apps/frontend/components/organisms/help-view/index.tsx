"use client";

import { AppContainer } from "@ecommerce/ui";
import { getRawI18nValue } from "@/utils/i18n";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { HelpContactPanel } from "./help-contact-panel";
import HelpHeader from "./help-header";
import { HelpPopularAnswers } from "./help-popular-answers";
import { HelpQuickLinks } from "./help-quick-links";
import { HelpCardItem } from "./help-view.types";
import { filterHelpCards } from "./help-view.utils";

export function HelpView(): React.ReactElement {
  const tHelp = useTranslations("HelpCenter.help");
  const [query, setQuery] = useState("");

  const filteredCards = useMemo(() => {
    const cards = getRawI18nValue<HelpCardItem[]>(tHelp.raw("cards"));
    return filterHelpCards(cards, query);
  }, [query, tHelp]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 pb-12 duration-700 sm:pb-16">
      <HelpHeader searchQuery={query} setSearchQuery={setQuery} />

      <AppContainer size="2xl" className="py-6 sm:py-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <HelpQuickLinks
            cards={filteredCards}
            title={tHelp("quick")}
            description={tHelp("supportNote")}
            emptyText={tHelp("noResults")}
          />

          <HelpContactPanel
            title={tHelp("contactTitle")}
            description={tHelp("contactDesc")}
            ctaLabel={tHelp("contactCta")}
          />
        </section>

        <HelpPopularAnswers
          title={tHelp("popular")}
          answers={tHelp.raw("answers") as string[]}
        />
      </AppContainer>
    </div>
  );
}

export default HelpView;
