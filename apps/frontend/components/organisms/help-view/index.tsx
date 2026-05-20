"use client";

import AppContainer from "@/components/atoms/app-container";
import { useTranslations } from "next-intl";
import HelpHeader from "./help-header";
import { useState, useMemo } from "react";
import { getRawI18nValue } from "@/utils/i18n";
import { HelpCardItem } from "./help-view.types";
import { filterHelpCards } from "./help-view.utils";
import { HelpContactPanel } from "./help-contact-panel";
import { HelpPopularAnswers } from "./help-popular-answers";
import { HelpQuickLinks } from "./help-quick-links";

export function HelpView(): React.ReactElement {
  const tHelp = useTranslations("HelpCenter.help");
  const [query, setQuery] = useState("");

  const filteredCards = useMemo(() => {
    const cards = getRawI18nValue<HelpCardItem[]>(tHelp.raw("cards"));
    return filterHelpCards(cards, query);
  }, [query, tHelp]);

  return (
    <div className="pb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <HelpHeader searchQuery={query} setSearchQuery={setQuery} />

      <AppContainer size="2xl" className="py-10">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
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
