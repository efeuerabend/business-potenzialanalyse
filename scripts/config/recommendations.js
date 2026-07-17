/*
 * Recommendation Library — modular report building blocks (verbindlicher Flow).
 *
 * Product release: 1.0.0 — versioning unified at the product level (see CHANGELOG.md).
 *
 * Per Standards/report-design.md, recommendation texts are NOT stored as
 * finished prose. Each insight maps to four separately configurable blocks:
 *   beobachtung  - what the answers show (from answers only)
 *   einordnung   - why this catches our attention (unternehmerische Einordnung)
 *   bedeutung    - economic consequences (Zeit/Umsatz/Wachstum/Abhängigkeit)
 *   offeneTuer   - why this can only be seriously quantified in the KI-Analyse
 * A cross-area synthesis ("roter Faden") connects patterns into one bigger
 * insight. RC1: the closing "nextStep" section stays strictly informational —
 * it names the questions this free analysis deliberately leaves open, with no
 * product name, no comparison and no link (see sections.nextStepQuestions/
 * nextStepClosing). A CTA to the paid KI-Potenzialanalyse is reintroduced once
 * that product exists.
 *
 * The report advises, it does not describe. Each block adds a thought the
 * entrepreneur likely would not reach alone — no restating of known facts.
 * Address form: "Sie". Short sentences. No superlatives, no exact money
 * amounts, no tool names.
 *
 * Personalisation is modular: the report references the first motivation and
 * the original reason for self-employment via configurable phrase maps and
 * sentence pieces — never a hardcoded finished sentence. Differing motivation
 * and reason are framed as "damals" (reason) vs. "heute" (motivation), not as a
 * contradiction.
 */

export const recommendations = {
  version: '1.0.0',

  // Report/compass display logic — centrally configurable.
  display: {
    // Minimum aggregated process score for an active area to count as a
    // notable potential (a real lever). Matches the lower bound of "mittleres
    // Potenzial" in config/scoring.js. Below this, an active area is shown
    // compactly under "Aktuell unauffällige Bereiche" instead of as a low
    // potential. Non-relevant chapters are excluded entirely (engine `active`).
    noticeableFrom: 5,
    quietAreasTitle: 'Aktuell unauffällige Bereiche',
    quietAreasNote: 'In diesen Bereichen zeigt sich aktuell kein besonderer Handlungsbedarf.',
    noNotablePotentials: 'In den betrachteten Bereichen zeigt sich aktuell kein herausragender einzelner Hebel. Das spricht für eine insgesamt ausgewogene Aufstellung.',
  },

  // Jeder Block liefert vier Bausteine (beobachtung/einordnung/bedeutung/
  // offeneTuer) plus `impact` — eine kurze, wertende Folge-Klausel, aus der
  // recommendation-engine.js den dynamischen "roten Faden" zusammensetzt
  // (siehe unten). `beobachtung` ist als Array mit zwei sprachlichen Varianten
  // hinterlegt; welche Variante ein Report zeigt, entscheidet eine konkrete,
  // für dieses Muster relevante Antwort (siehe VARIANT_SELECTORS in
  // recommendation-engine.js) — nicht der Zufall. So liest sich derselbe
  // Befund je nach tatsächlicher Ausprägung unterschiedlich, bleibt aber bei
  // gleichen Antworten immer reproduzierbar gleich.
  patternBlocks: {
    pat_owner_dependency: {
      beobachtung: [
        'Viele zentrale Aufgaben laufen ausschliesslich über Sie persönlich.',
        'Ohne Sie stockt in mehreren wichtigen Bereichen Ihres Unternehmens sofort etwas.',
      ],
      einordnung: 'Am Anfang ist das normal und oft ein Zeichen von Qualität. Kritisch wird es, wenn ohne Sie nichts mehr rund läuft. Dann ist nicht Ihre Arbeitszeit der Engpass, sondern Ihre Verfügbarkeit.',
      bedeutung: 'Ihre Zeit wird zur Obergrenze für Wachstum. Urlaub oder Krankheit werden zum Risiko. Und der Unternehmenswert sinkt: Ein Käufer oder Nachfolger würde vor allem Sie übernehmen, kein funktionierendes System.',
      offeneTuer: 'Was Sie diese Abhängigkeit konkret kostet, lässt sich erst anhand Ihrer tatsächlichen Unternehmensdaten seriös berechnen. Genau das leistet die KI-Potenzialanalyse.',
      impact: 'bremst, wie schnell Ihr Unternehmen wachsen kann',
    },
    pat_missing_delegation: {
      beobachtung: [
        'Sie haben ein Team, und trotzdem bleibt vieles bei Ihnen.',
        'Ihr Team ist da – bei den wichtigen Aufgaben greifen Sie trotzdem selbst ein.',
      ],
      einordnung: 'Oft liegt das nicht am Team. Es liegt daran, dass Aufgaben nie sauber übergeben wurden. Was nur in Ihrem Kopf existiert, kann niemand übernehmen.',
      bedeutung: 'Sie zahlen doppelt: Gehalt für Ihr Team und Ihre eigene Zeit für Aufgaben, die andere erledigen könnten. Gleichzeitig wächst Ihr Team nicht in Verantwortung hinein.',
      offeneTuer: 'Welche Aufgaben sich mit welchem Aufwand übergeben lassen, zeigt erst eine genauere Betrachtung Ihrer Prozesse in der KI-Potenzialanalyse.',
      impact: 'lässt Ihr Team nicht in echte Verantwortung hineinwachsen',
    },
    pat_delayed_handling: {
      beobachtung: [
        'Anfragen werden bei Ihnen nicht immer schnell beantwortet.',
        'Zwischen einer Anfrage und Ihrer Antwort vergeht bei Ihnen oft mehr Zeit, als Interessenten bereit sind zu warten.',
      ],
      einordnung: 'Interessenten entscheiden oft nach Tempo, nicht nach Qualität. Wer zuerst antwortet, bekommt häufig den Auftrag. Auch dann, wenn ein anderer das bessere Angebot hätte.',
      bedeutung: 'Langsame Reaktion kostet Aufträge, die Sie nie als Verlust sehen. Der Kunde meldet sich einfach nicht mehr. Dieser Umsatz taucht in keiner Statistik auf.',
      offeneTuer: 'Wie viele Aufträge Ihnen so entgehen, lässt sich erst schätzen, wenn man Ihre Anfragewege konkret ansieht. Das ist Teil der KI-Potenzialanalyse.',
      impact: 'kostet Ihnen Aufträge, die Sie nie als Verlust sehen',
    },
    pat_lost_inquiries: {
      beobachtung: [
        'Manche Anfragen bleiben im Alltag liegen.',
        'Nicht jede Anfrage, die bei Ihnen eingeht, findet auch tatsächlich den Weg zu einer Antwort.',
      ],
      einordnung: 'Das ist selten Nachlässigkeit. Meist fehlt ein fester Ort, an dem Anfragen landen und nachgehalten werden. Was nicht erfasst ist, wird vergessen. Nicht aus Absicht.',
      bedeutung: 'Jede verlorene Anfrage ist bereits bezahlt. Hinter jeder Kundenanfrage steckt meist ein erheblicher Aufwand – sei es durch Werbung, Ihre Sichtbarkeit im Markt oder die Qualität Ihrer bisherigen Arbeit. Der teuerste Kunde ist der, den Sie schon fast hatten.',
      offeneTuer: 'Wo genau Anfragen verloren gehen und was das wert ist, lässt sich erst mit Blick auf Ihre konkreten Kanäle beziffern. Dafür ist die KI-Potenzialanalyse da.',
      impact: 'lässt bereits bezahlte Anfragen ungenutzt liegen',
    },
    pat_recurring_communication: {
      beobachtung: [
        'Ein grosser Teil Ihrer Kundenkommunikation besteht aus ähnlichen Fragen.',
        'Viele Ihrer Kundengespräche drehen sich im Kern um dieselben wenigen Themen.',
      ],
      einordnung: 'Wiederkehrende Fragen wirken harmlos, weil jede einzelne wenig Zeit kostet. In Summe sind sie oft der grösste stille Zeitfresser. Gerade weil sie nie als Problem auffallen.',
      bedeutung: 'Diese Zeit fehlt für die Gespräche, die wirklich über Aufträge entscheiden. Sie sind beschäftigt, aber nicht mit dem Wertvollsten.',
      offeneTuer: 'Welcher Anteil sich sinnvoll automatisieren lässt, ohne unpersönlich zu wirken, klärt die KI-Potenzialanalyse anhand Ihrer echten Anfragen.',
      impact: 'bindet Zeit, die für die entscheidenden Gespräche fehlt',
    },
    pat_manual_scheduling: {
      beobachtung: [
        'Ein erheblicher Teil Ihrer Zeit fliesst in Terminabsprachen statt in wertschöpfende Arbeit.',
        'Termine kommen bei Ihnen selten auf Anhieb zustande – meist braucht es mehrere Abstimmungsrunden.',
      ],
      einordnung: 'Terminkoordination fühlt sich wie Kleinkram an. Deshalb wird sie selten hinterfragt. Genau solche unscheinbaren Abläufe summieren sich am stärksten.',
      bedeutung: 'Jede Abstimmungsschleife bindet zweimal Zeit: Ihre und die des Kunden. Und jeder vergessene oder verschobene Termin ist verlorener Umsatz oder Leerlauf.',
      offeneTuer: 'Wie viel Zeit hier tatsächlich gebunden ist, zeigt erst eine konkrete Betrachtung Ihres Terminaufkommens in der KI-Potenzialanalyse.',
      impact: 'unterbricht ständig Ihr eigentliches Tagesgeschäft',
    },
    pat_recurring_offers: {
      beobachtung: [
        'Ähnliche Angebote erstellen Sie immer wieder neu.',
        'Ein grosser Teil Ihrer Angebote ähnelt sich stark – geschrieben wird trotzdem jedes Mal von vorn.',
      ],
      einordnung: 'Ein Angebot entsteht oft in dem Moment, in dem der Kunde am heissesten ist. Jeder Tag Verzögerung kühlt das Interesse ab. Wiederholte Handarbeit bremst genau dort, wo Tempo zählt.',
      bedeutung: 'Langsame oder aufwendige Angebote senken Ihre Abschlussquote, ohne dass Sie es merken. Sie führen es auf den Kunden zurück, nicht auf den Ablauf.',
      offeneTuer: 'Wie stark Angebotstempo und -qualität Ihre Abschlüsse beeinflussen, lässt sich erst mit Ihren Zahlen bewerten. Dafür ist die KI-Potenzialanalyse da.',
      impact: 'bremst Sie genau in dem Moment, in dem der Kunde am interessiertesten ist',
    },
    pat_admin_overload: {
      beobachtung: [
        'Verwaltung und Routine binden bei Ihnen viel Zeit, oft nach Feierabend.',
        'Büroarbeit erledigen Sie auffällig oft dann, wenn eigentlich schon Feierabend ist.',
      ],
      einordnung: 'Arbeit, die abends liegen bleibt, betrifft meist keinen Kunden direkt. Deshalb rutscht sie tagsüber immer nach hinten. Sie erledigen sie dann in Ihrer eigentlichen Erholungszeit.',
      bedeutung: 'Das kostet nicht nur Stunden, sondern Energie. Auf Dauer führt das zu Erschöpfung, nicht zu Wachstum. Und die Zeit fehlt für das, was Ihr Unternehmen wirklich voranbringt.',
      offeneTuer: 'Welche dieser Aufgaben sich mit welchem Aufwand ordnen lassen, zeigt die KI-Potenzialanalyse anhand Ihres konkreten Arbeitsalltags.',
      impact: 'frisst Zeit und Energie ausserhalb Ihrer eigentlichen Arbeitszeit',
    },
    pat_growth_bottleneck: {
      beobachtung: [
        'Neue Kunden kommen bei Ihnen unregelmässig, oder es fehlen spürbar Anfragen.',
        'Wie viele neue Kunden bei Ihnen ankommen, hängt sichtbar vom Zufall ab – nicht von einem verlässlichen Weg.',
      ],
      einordnung: 'Unregelmässige Kundengewinnung ist selten ein Nachfrageproblem. Meist fehlt ein verlässlicher Weg, der auch läuft, wenn Sie im Tagesgeschäft stecken. Marketing passiert dann nur, wenn gerade Zeit ist. Also selten.',
      bedeutung: 'Schwankender Zufluss macht Planung, Einstellungen und Investitionen zum Risiko. Wachstum ist schwer, wenn Sie nicht wissen, was nächsten Monat hereinkommt.',
      offeneTuer: 'Welcher Weg für Ihr Unternehmen verlässlich trägt, lässt sich erst nach einem genauen Blick auf Ihre Kundenquellen sagen. Dafür ist die KI-Potenzialanalyse da.',
      impact: 'macht Ihr Wachstum vom Zufall abhängig',
    },
  },

  // Der "rote Faden" ist keine statische Kombinationstabelle mehr — er wird in
  // recommendation-engine.js aus den tatsächlich erkannten Mustern und ihrem
  // `impact` zusammengesetzt (siehe buildSynthesis()). `none` bleibt der
  // einzige feste Text: der Fall "kein Muster erkannt" hat naturgemäss nichts
  // Individuelles zu verknüpfen.
  synthesisFallback: {
    none: 'Ihre Antworten ergeben ein stimmiges Bild. Es gibt keinen einzelnen grossen Bruch. Der Hebel liegt eher in gezielter Feinjustierung als in einem grossen Umbau.',
  },

  overallByLevel: {
    low: {
      headline: 'Ihr Unternehmen wirkt in vielen Bereichen bereits solide aufgestellt.',
      text: 'Ihre Angaben zeigen keine grossen offensichtlichen Engpässe. Das ist ein gutes Zeichen. Auch dann kann sich ein gezielter Blick von aussen lohnen — etwa um die gute Ausgangslage abzusichern und einzelne Bereiche bewusst weiterzuentwickeln.',
    },
    medium: {
      headline: 'Ihr Unternehmen zeigt einige konkrete Ansatzpunkte.',
      text: 'In einzelnen Bereichen deutet sich Potenzial an, das sich mit überschaubarem Aufwand heben lässt. Eine genauere Betrachtung hilft, die sinnvollste Reihenfolge festzulegen.',
    },
    high: {
      headline: 'In Ihrem Unternehmen zeigen sich deutliche wirtschaftliche Potenziale.',
      text: 'Mehrere Bereiche deuten auf spürbaren Handlungsbedarf hin. Das ist kein Grund zur Sorge, sondern eine konkrete Chance — vorausgesetzt, die richtigen Bereiche werden zuerst angegangen.',
    },
    very_high: {
      headline: 'Ihre Angaben zeigen ein hohes wirtschaftliches Potenzial.',
      text: 'In mehreren zentralen Bereichen deutet sich erheblicher Hebel an. Gerade dann ist eine klare Priorisierung entscheidend, damit Aufwand dort eingesetzt wird, wo er den grössten Unterschied macht.',
    },
  },

  // Modular personalisation. The report assembles a short personal statement
  // from the maps below; nothing is a hardcoded finished sentence.
  personalization: {
    reasonPrefix: 'Sie haben sich ursprünglich selbstständig gemacht, um ',
    reasonLabel: {
      freiheit: 'mehr Freiheit zu gewinnen',
      eigener_chef: 'Ihr eigener Chef zu sein',
      familie: 'mehr Zeit für Ihre Familie zu haben',
      verdienen: 'mehr zu verdienen',
      leidenschaft: 'Ihre Leidenschaft zum Beruf zu machen',
      aufbauen: 'etwas Eigenes aufzubauen',
      entscheiden: 'selbst entscheiden zu können',
      sinn: 'etwas Sinnvolles zu schaffen',
      chance: 'eine berufliche Chance zu nutzen',
    },
    todayPrefix: 'Heute ist Ihnen vor allem ',
    todaySuffix: ' wichtig.',
    motivationLabel: {
      zeit_alltag: 'mehr Zeit im Alltag',
      umsatz: 'mehr Umsatz',
      stress: 'weniger Stress',
      struktur: 'mehr Struktur im Unternehmen',
      routine: 'weniger Routinearbeit',
      zeit_kunden: 'mehr Zeit für Ihre Kunden',
      freizeit: 'mehr Freizeit',
      planbarkeit: 'bessere Planbarkeit',
      unabhaengig: 'mehr Unabhängigkeit von Ihrer Person',
    },
  },

  sections: {
    steps: [
      { id: 'recognized', title: 'Relevante Bereiche in Ihrem Unternehmen', intro: 'Diese Bereiche haben wir uns anhand Ihrer Angaben angesehen.' },
      { id: 'meaning', title: 'Was uns dabei auffällt', intro: 'Zu jedem Bereich eine Beobachtung, eine Einordnung und was sie wirtschaftlich bedeuten kann.' },
      { id: 'potentials', title: 'Ihre grössten wirtschaftlichen Potenziale', intro: 'Nach Bedeutung geordnet. Dort lohnt sich ein genauerer Blick am ehesten.' },
      { id: 'assessment', title: 'Der rote Faden', intro: 'Einzelne Beobachtungen ergeben zusammen ein Bild.' },
      { id: 'limits', title: 'Warum endet die Analyse hier?', intro: 'Diese kostenlose Erstorientierung zeigt, wo Potenziale und Engpässe liegen. Sie sagt bewusst noch nicht, welche Lösung für Sie sinnvoll ist. Auch Kosten, Anbieter, Datenschutz und Aufwand bleiben offen. Diese Fragen brauchen einen genaueren Blick.' },
      {
        id: 'nextStep',
        title: 'Der nächste sinnvolle Schritt',
        intro: 'Diese Business-Potenzialanalyse zeigt Ihnen, in welchen Unternehmensbereichen die grössten Chancen für KI-gestützte Automatisierung liegen. Sie beantwortet bewusst noch nicht Fragen wie:',
      },
    ],
    opening: 'Danke, dass Sie sich die Zeit genommen haben. Diese Zusammenfassung zeigt Ihnen, welche unternehmerischen Muster sich aus Ihren Antworten erkennen lassen. Verstehen Sie sie als das Ergebnis einer ersten Bestandsaufnahme, nicht als fertiges Konzept.',
    disclaimer: 'Diese Auswertung ist eine fundierte Erstorientierung auf Basis Ihrer Angaben — keine exakte Unternehmensbewertung und keine individuelle Beratung.',
    noFindings: 'Aus Ihren Angaben ergeben sich aktuell keine auffälligen Muster. Das spricht dafür, dass Ihre Abläufe in den betrachteten Bereichen grundsätzlich gut funktionieren.',

    // Neutrale fachliche Abgrenzung zur späteren, vertiefenden Analyse — kein
    // Verkauf, kein Produktname, keine Verlinkung (RC1, siehe roadmap).
    nextStepQuestions: [
      'Welche konkreten Prozesse sollten zuerst automatisiert werden?',
      'Welche KI-Lösungen eignen sich für Ihr Unternehmen?',
      'Welche Zeit- und Kostenersparnis ist realistisch?',
      'Welche Investition wäre erforderlich?',
      'Wann rechnet sich die Umsetzung?',
    ],
    nextStepClosing: 'Diese Fragen lassen sich erst anhand Ihrer tatsächlichen Unternehmensabläufe seriös bewerten. Verstehen Sie diesen Report daher als Ergebnis einer ersten Bestandsaufnahme — nicht als fertiges Konzept.',
  },
};
