# Island language drafts — federation review required

These are deliberately incomplete, unapproved draft glossaries, not complete website translations. Missing source strings must fall back to English. Do not describe these locales as fully translated, certified, or speaker reviewed. All entries need review by fluent speakers nominated by the relevant federations, including spelling, register, and fitness for interface labels.

| File | Language | Draft entries | Scope |
| --- | --- | ---: | --- |
| ch.json | CHamoru | 3 | Information, regulations, contact navigation |
| pau.json | Palauan | 3 | Name placeholder and search labels |
| na.json | Nauruan | 0 | Empty dictionary; English fallback throughout |
| gil.json | Gilbertese / Kiribati | 4 | Information, skip link, search labels |
| mh.json | Marshallese | 6 | Information, regulations, name, message, search labels |
| ho.json | Hiri Motu | 3 | Name placeholder and search labels |

The keys match English visible source text from `app/navigation.ts`, `components/site-shell.tsx`, and `components/contact-form.tsx`, with whitespace trimmed and collapsed. No names, addresses, URLs, dates, identifiers, or tournament facts were changed. In particular, chess categories and technical regulations are not translated from uncertain general vocabulary.

The full home welcome paragraph remains in English in all six files: a greeting alone would not faithfully translate that paragraph, and a responsible full translation was not available. Most headings, navigation, forms, content, and accessibility text likewise remain English. Small entry counts reflect verified vocabulary limits, not completed coverage.

## Sources and adaptations

Sources were consulted on 7 November 2026. These provide vocabulary and examples, not an endorsement of these drafts.

- CHamoru: [Kumisión i Fino’ CHamoru](https://kumisionchamoru.guam.gov/) pairs “Aligao ham” with “Contact Us”. [Guam Department of Land Management](https://dlm.guam.gov/division-of-geographic-information-system-land-information-system/) supplies “Infotmasión” in its official bilingual division name. [CNMI Commonwealth Register, 28 October 2023](https://labor.cnmi.gov/storage/2024/06/45_10-28-2023_Number_10.pdf) uses “regulasion siha”. General regulatory vocabulary still needs review for tournament navigation and Guam/CNMI orthographic preference.
- Palauan: [TeKinged common phrases](https://tekinged.com/dosuub/phrases.php) and [ngklem entry](https://tekinged.com/index.php?p=ngklem) support the second-person name form. TeKinged operates in partnership with the Palau Language Commission. Search labels adapt the publisher’s own [Palauan interface](https://www.jw.org/pau/), “Mosiik a Tekoi er a JW.ORG”, substituting the generic website noun. This adaptation is a draft, especially the preferred modern term for website.
- Nauruan: [SIL Australia’s Nauruan dictionary resource](https://www.sila.org.au/flourishing/resources/nauruan/nauruan-dictionary/) points to Delaporte’s 1907 dictionary, but its linked text could not be fetched (HTTP 403). No contemporary interface translation could be responsibly established from the available material. `na.json` is intentionally `{}`; it contains neither guessed Nauruan nor English filler.
- Gilbertese / Kiribati: [Kiribati President’s Office published Kiribati text](https://www.president.gov.ki/presidentgovki/wp-content/uploads/2019/04/TKB-manifesto-Kiribati-version.pdf) explicitly pairs “Rongorongo” with information. The [publisher’s Kiribati interface](https://www.jw.org/gil/) supplies “Nakoni kanoana”, “Kakaae n te JW.ORG”, and “Atureti n te Intanete”. Search labels combine those attested interface expressions; a reviewer must confirm that this is idiomatic for a general website search action.
- Marshallese: [Practical Marshallese glossary](https://marshallese.org/glossary-of-useful-words/) supplies “meḷeḷe”; the [dictionary](https://marshallese.org/dictionary/?input=en&langChoose=mh) lists “ennaan” as message/news. [Spokane County’s bilingual form](https://www.spokanecounty.gov/DocumentCenter/View/48721/Protection-Order-Packet-Marshallese?bidId=) supplies “etam” in “Print name here” and uses “kakien ko” for rules/laws. Search labels adapt “Kappok Mel̦el̦e ilo JW.ORG” from the [publisher’s Marshallese interface](https://www.jw.org/mh/), using the glossary’s Unicode orthography. The generic website term and choice of orthographic convention need local review.
- Hiri Motu: The [publisher’s Hiri Motu interface](https://www.jw.org/ho/) supplies “JW.ORG tahua” and the spelling “websait”; the labels adapt that expression. Its [Hiri Motu article](https://www.jw.org/ho/laibri/buka/March-1-2012-Watchtower/Oiemu-Ladana-Lau-Hadibaia/) supplies “Oiemu ladana” in a title explicitly about “your name”. No Tok Pisin or vernacular Motu substitutes have been inserted. Search wording and possessive register require Hiri Motu speaker review.

## Review priorities

Ask fluent reviewers to confirm the existing entries first, then supply the remaining navigation, registration controls, welcome paragraph, contact form, schedule, and accessibility labels. Tournament regulations and payment/eligibility guidance need complete sentence-level review, preserving factual meaning. Sparse fallback is intentional until that work is complete.
