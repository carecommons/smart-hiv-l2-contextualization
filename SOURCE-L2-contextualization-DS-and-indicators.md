# Source Document — Adapting WHO HIV DAK L2 Artifacts to Ethiopia: Authoring a Contextualized Decision-Support Table and Indicator

**For:** workshop session — adopting and adapting additional L2 artifacts to the Ethiopian context, with a hands-on focus on authoring contextualized decision-support and indicator `.xlsx` artifacts for the HIV DAK.
**Audience:** national HIV program + digital health teams; the L2/L3 working groups.
**Scope (locked):** one decision-support table and one indicator, authored end-to-end as worked examples.
**How to use this:** Parts A–C are the method (what an L2 DAK is, the adopt-and-adapt process, the authoring conventions). Parts D–E are the two worked artifacts. Part F is the validation checklist and pitfalls. Part G is the open items to settle with the room. Appendix = evidence base and confidence.

> **Evidence note.** The WHO methodology and authoring conventions below are verified against WHO primary sources (SMART Guidelines IG Starter Kit v2.0.0; WHO HIV DAK 2nd ed.; HIV IG v1.0.0). The **Ethiopia specifics** are now read directly from the **localized data dictionary**, diffed row-by-row against the WHO default — see the companion **`REPORT-Ethiopia-DAK-adaptation.md`** for the full delta (298 added, 204 removed, 1,124 modified elements). What remains `[confirm: ETH]` is narrower: cross-checking specific changes against current national guidelines.

---

## Part A — The premise: the adaptation already exists; review, wire, and validate it

WHO publishes the HIV guidance as a **Digital Adaptation Kit (DAK)** — software-neutral documentation that distils clinical, public-health and data-use guidance into a form digital systems can implement. WHO's DAK outputs are **intentionally generic and meant to be contextualized**; the recommended workflow is *adopt the WHO DAK, then adapt its content to local needs* rather than authoring from scratch.

**Ethiopia has already done much of that adaptation.** The localized data dictionary differs from the WHO default by **298 added, 204 removed, and 1,124 modified data elements** (full delta in `REPORT-Ethiopia-DAK-adaptation.md`): a new **Surveillance** module, **national PrEP/PEP/ART regimens** (incl. injectable Lenacapavir), a **maternal testing algorithm**, **"Invalid" results** and **retest-before-ART** steps, and **updated value sets** across registration, regimens, and disaggregators.

- So the session's job is **not** to author the ~20% from a blank generic DAK — it is to **review** what was changed, **wire** the many added elements that aren't yet connected to a decision table or indicator, **re-derive** the affected logic, and **validate** it.
- Where Ethiopia changed a value set, the artifacts simply **adopt the localized values** — treated the same as any other modification.
- The two worked examples below are reframed accordingly: each shows **completing and wiring the existing Ethiopia changes**, in the WHO formats, so the output drops into the national DAK and then the L3 IG.

## Part B — What an L2 DAK contains, and where our two artifacts live

The L2 DAK has **nine components**, delivered as a narrative PDF plus four Excel web annexes:

| Web annex (.xlsx) | Component | This is where… |
|---|---|---|
| **Annex A** | Core data elements (data dictionary) | where every input/output value lives |
| **Annex B** | Decision-support logic | **our decision table is authored** |
| **Annex C** | Indicators & performance metrics | **our indicator is authored** |
| **Annex D** | Functional / non-functional requirements | system requirements |

(Other components: health interventions/recommendations, generic personas, user scenarios, business processes/workflows, scheduling logic. Note: some older WHO material lists *eight* components, folding scheduling into decision support — participants may have seen that framing.)

**The binding rule that connects the three annexes:** *collect once, use many times.* Every value used by a decision table or an indicator **must exist as a data element in Annex A**. In the attached dictionary this is explicit — each data element row carries `Linkages to Decision Support Tables` and `Linkages to Aggregate Indicators`. That linkage is the backbone we author against.

**Where it goes next (L2 → L3):** L3 authoring takes the L2 as input and produces FHIR artifacts that correspond to it — **decision tables → `PlanDefinition` + `Library` + CQL**; **indicators → FHIR `Measure` + CQL**. So a clean L2 artifact is the direct, traceable input to fixing/building the L3 IG. WHO also recommends **tracking versions of L2 content when adapting locally**, to record changes and assess their impact (provenance).

## Part C — The authoring conventions (use these exactly)

### C1. Decision-support table (Annex B)
- Tables follow the **DMN (Decision Model and Notation)** standard, authored in a spreadsheet.
- Column structure used by the WHO HIV IG: **`Rule ID` · `Condition Inputs` (one variable-named column per input) · `Output Type` · `Action` · `Guidance` · `Annotations` · `Reference(s)`**.
- Declare a **Hit Policy** (e.g., *Rule order* / *First*) so the engine knows how rules are evaluated.
- Use explicit operators in cells: `=`, `IN`, `>=`, `<`, `is NULL`, `=True/=False`.
- **Guardrail: avoid tables with 10+ inputs** — split into separate tables. (Directly relevant to refactoring complex/buggy tables.)
- Every input/output references an **Annex A data element** (coded value sets, not free text).

### C2. Indicator (Annex C)
Author each indicator with these L2 template fields: **short name · indicator definition · category · what it measures · rationale · numerator definition · numerator calculation · denominator definition · denominator calculation · disaggregation description · reference** (plus DAK ID and the WHO Strategic Information reference number).
- Numerator and denominator are built **only from data elements already in Annex A**.
- Prioritize indicators **derivable from routine primary-care data** (collect once, use many).
- **Computability test before you start (critical):** some HIV indicators are *not* computable from DAK routine data and must not be authored as clinical logic — e.g. condoms distributed (IND.1), needles/syringes (IND.10), condom use (IND.17), key populations who know status (IND.26), KP living with HIV on ART (IND.36) are labeled in the IG as *"Not included in DAK; survey-based"* or *"…from multiple data sources."* The authorable pattern is a **count over coded data elements** — model example: **HIV.IND.2 / PRV.2 (PrEP recipients)** = `COUNT of clients with "PrEP for HIV prevention" prescribed in the reporting period`, denominator = 1.

> **ID crosswalk caveat.** The DAK data dictionary uses family IDs (`HTS.*`, `ART.*`, `VER.*`…); the L3 IG renumbers indicators as `HIV.IND.N`. The exact published `HIV.IND` inventory/numbering (including whether the remediation plan's IND.23, 97–100 exist) was **not verified** — check the live indicators page before relying on a specific number.

---

## Part D — Worked artifact #1 (decision support): `HIV.B7.DT` — National HIV testing algorithm

**Why this one.** It is the single most country-specific artifact in the DAK, foundational (every diagnosis depends on it), and **Ethiopia has already changed it** — `HIV.B7.DT` is among the most-adapted tables in the dictionary (**+21 elements, −1, 31 modified**). Ethiopia added an **"Invalid" assay-result** value, **verification-on-discordance** and **retest-before-ART** steps (the latter wired to `HIV.D12.DT`), and a **maternal-serology reuse** in PMTCT (`HIV.E.ET.DE200–220`, wired to `B7`/`E4`). Several of those additions still have **blank linkage cells** — added as data but not yet connected to the table. So this example is **wiring and reconciling the existing Ethiopia changes**, not authoring from scratch — which also fixes the real L3 gap (the smart-hiv B7 logic is hard-coded non-functional: `define "Non-reactive result": false`).

**Clinical-safety logic to PRESERVE (WHO baseline — do not lose in adaptation):**
- Everyone is tested on **Assay 1 (A1)**.
- **A1 non-reactive → report HIV-negative.**
- Reactive results proceed **A1 → A2 → A3** (serial).
- **Discrepant handling:** e.g., `A1+ ; A2−` → **repeat Assay 1**.
- **Inconclusive outcomes → schedule retest at visit date + 14 days.**
- (Infants <18 months are diagnosed by **virologic/EID** testing, not this serology table — route to the EID/indeterminate-results logic, HIV.E12.DT.)

**Decision table skeleton (Annex B format).** Hit policy: *Rule order*. Inputs are the assay-result data elements from Annex A (`HIV.B.DE94/97/100`); the output is the **HIV test result** element (`HIV.B.DE107`, coded HIV-positive / HIV-negative / HIV-inconclusive).

| Rule ID | A1 result | A2 result | A3 result | Output: HIV test result | Action / Guidance | Reference |
|---|---|---|---|---|---|---|
| B7-R1 | `= Non-reactive` | — | — | HIV-negative | Report negative; counsel on window period / re-test if recent exposure | WHO HTS 2019; `[confirm: ETH]` |
| B7-R2 | `= Reactive` | `= Reactive` | `= Reactive` | HIV-positive | **Verify** positive status before ART per policy; link to care/ART | WHO HTS 2019; `[confirm: ETH]` |
| B7-R3 | `= Reactive` | `= Reactive` | `= Non-reactive` | HIV-inconclusive | Retest at **visit date + 14 days** | WHO HTS 2019; `[confirm: ETH interval]` |
| B7-R4 | `= Reactive` | `= Non-reactive` | — | (discrepant) repeat A1 | Repeat Assay 1; if still discrepant → inconclusive → retest +14d | WHO HTS 2019 |

**Ethiopia adaptation slots — settle with the room `[confirm: ETH]`:**
1. **Which assays** are A1 / A2 / A3 (national product list), and is the strategy **serial** (as above) or any **parallel** step?
2. **Retest interval** — confirm Ethiopia uses 14 days for inconclusive.
3. **Verification testing** before ART initiation — national policy (WHO recommends re-testing to verify a positive status before ART).
4. **Entry points / who tests** (PITC, VCT, index, ANC, community) — affects the modality value set used by the indicator.
5. Age routing: confirm the <18-month EID handoff and self-test confirmatory path.

**L3 target:** `PlanDefinition` (HIVB7DT) + CQL `Library` — replacing the current non-functional logic; preserve the rules above so the safety behavior is not re-broken.

---

## Part E — Worked artifact #2 (indicator): HIV testing positivity (yield)

**Why this one.** Simple, high-value, computable from routine data, and it runs off the **same element** the B7 table produces (the HIV test result) — so one piece of contextualized logic drives both the point-of-care result and the report. Two Ethiopia-specific wrinkles make it a real worked example, not a copy:
- The HIV test result now **also lives in the new Surveillance module** (`HIV.Surveil.DE2`, wired to `HTS.2/3/7/8`). The example must decide the **source of truth** the indicator reads (HTS visit vs Surveillance).
- Several referenced elements **moved or were removed** (e.g. `Date HIV test results returned`), and disaggregation uses the **localized value sets** — re-point to the localized/Surveillance elements and adopt the national values.

**Definition (Annex C fields):**
- **Short name:** HIV testing positivity (yield).
- **What it measures / rationale:** the share of HIV tests that return positive — testing efficiency and case-finding yield; guides where to target testing.
- **Numerator definition:** number of individuals with **HIV test result = HIV-positive** (`HIV.B.DE107`, the B7 outcome) during the reporting period.
  **Numerator calculation:** `COUNT of clients where [HIV test result] = HIV-positive AND [HIV test date] in reporting period`.
- **Denominator definition:** number of individuals **tested for HIV** during the period.
  **Denominator calculation:** `COUNT of clients where [HIV test performed/date] in reporting period`.
- **Disaggregation:** **age band — include <1 and 1–14 explicitly** (the pediatric case-finding gap), plus 15–19/20–24/25+; **sex**; **testing modality/entry point**; location. (KP disaggregation is sensitive and partly survey-bound — handle separately; do not fold KP-status indicators into this routine count.)

**Simplest authorable variant** (mirrors the IND.2 count pattern): *number of individuals newly diagnosed HIV-positive in the period*, denominator = 1 — useful if the team wants to start from a pure count before adding the denominator.

**Maps to what Ethiopia reports `[confirm: ETH]`:** PEPFAR MER **`HTS_TST` / `HTS_TST_POS`**; DHIS2/HMIS HTS testing+positivity. Confirm the exact national definitions/disaggregations so the contextualized indicator reconciles with existing numbers (a strong validation step — the new indicator should reproduce known totals).

**L3 target:** FHIR `Measure` + CQL (shared `IndicatorLogic` library).

---

## Part F — Contextualization pitfalls & validation checklist

Run every authored artifact through this before calling it done:

- [ ] **Every input/output is an Annex A data element** (coded value set, not free text). Add missing elements to the dictionary first.
- [ ] **Computability:** the indicator's numerator and denominator come from routine DAK data — not a survey or external aggregate (the IND.1/10/17/26/36 trap).
- [ ] **≤10 inputs** per decision table; split if larger.
- [ ] **Hit policy and operators** declared explicitly.
- [ ] **Preserve safety logic** (B7: A1− → negative; serial A1→A2→A3; discrepant repeat-A1; 14-day retest).
- [ ] **Avoid the documented smart-hiv bugs** when adapting related logic: key-population stratifier must test the data element's **value, not its code** (`O.value`, not `O.code`); PEP vs PrEP must use the **correct dose/threshold** (don't apply a methadone threshold to buprenorphine, etc.); watch **operator precedence** in numerators; keep Measure↔Library **population names** consistent (`Numerator`/`Denominator`).
- [ ] **Disaggregation** matches national reporting (so the indicator reconciles with HMIS/MER).
- [ ] **Provenance:** record what diverged from the WHO DAK and why (version note) — feeds the L2→L3 change log.
- [ ] **Reconcile a known total** (e.g., last quarter's HTS_TST_POS) against the authored indicator as a validity check.

## Part G — Open items to resolve with the room

Now grounded in the actual adaptation (see `REPORT-Ethiopia-DAK-adaptation.md` and the work plan in `IMPACT-ANALYSIS-DD-to-DT-indicators.md`):
1. **Wiring gaps** — 233 added `.ET` elements have blank linkage cells. Connect each to its decision table / indicator (value-options inherit the parent's linkage; the impact analysis lists the targets).
2. **Update Annexes B and C** — they are still the WHO defaults; apply the Annex-A delta to the decision tables and indicators (this is the workshop's core output).
3. **Re-derive the national-regimen tables** — `HIV.C23.DT` (PrEP/PEP) and `HIV.D21.x` (ART / drug interactions) to the national formulary (incl. injectable Lenacapavir in `PRV.*`).
4. **Govern the new Surveillance module** — who owns it; its relationship to routine HMIS/MER; whether it is the indicator source of truth.
5. **Terminology bindings** for the coded elements (ICD-11/LOINC/SNOMED/national) and confirm the live `HIV.IND` numbering.

---

## Appendix — Evidence base & confidence

**Verified (WHO primary sources):** the nine-component / four-annex DAK structure; adopt-and-adapt premise and replicable process; DMN decision-table conventions (columns, hit policy, ≤10-input guardrail); indicator template fields and "collect once, use many"; the non-computable survey-based indicators (IND.1/10/17/26/36); the count-based authorable pattern (IND.2/PRV.2); the named decision tables (B7, E4, E12, D17, D21.1); B7's A1/A2/A3 + discrepant + 14-day-retest logic; the L2→L3 mapping (PlanDefinition/Library/CQL; Measure/CQL); version/provenance recommendation.

**To confirm against Ethiopian sources (`[confirm: ETH]`):** national testing assays/intervals; ART/PMTCT/EID/PrEP specifics; the 52% pediatric-diagnosed figure; Ethiopia's actual MER/HMIS reporting set and definitions; terminology bindings; the live `HIV.IND` inventory.

**Key references**
- WHO SMART Guidelines IG Starter Kit v2.0.0 — L2 authoring overview & DAK authoring: https://smart.who.int/ig-starter-kit/l2_authoring_overview.html · https://smart.who.int/ig-starter-kit/l2_dak_authoring.html · authoring overview (L2→L3): https://smart.who.int/ig-starter-kit/authoring_overview.html
- WHO HIV DAK, 2nd ed. (Dec 2023): https://www.who.int/publications/i/item/9789240085138
- WHO HIV IG v1.0.0 — decision logic: https://smart.who.int/hiv/decision-logic.html · indicators: https://smart.who.int/hiv/indicators.html · example indicator logic: https://smart.who.int/hiv/Library-HIVIND2Logic.html
- SMART Guidelines Pathfinder study (incl. Ethiopia), JMIR Med Inform 2025: https://medinform.jmir.org/2025/1/e58858
- WHO Consolidated Guidelines on HIV Testing Services (2019) — testing-strategy basis for B7.
- Ethiopia national HIV / PMTCT guidance (validate specifics): Ethiopia HIV guideline (policyvault.africa ETH32); National Guideline for PMTCT of HIV; Ethiopia PEPFAR Strategic Direction Summary 2023.
- Companion: `smart-hiv` IG `REMEDIATION-PLAN.md` (gap/safety items referenced in Parts D–F).
