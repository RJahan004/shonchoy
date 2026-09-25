/**
 * $honchoy — core financial engine
 * ---------------------------------------------------------------
 * This is PURE logic: no DOM, no language strings, no storage. Every
 * number the UI shows comes from here, so there is one place to check
 * and one place to test.
 *
 *   computePlan(state)            → ALL budget/debt/emergency/goal/health numbers
 *   debtPayoff(amount, rate, pay) → months + total interest for one debt
 *   monthsToGoal(remaining, pay)  → months to reach a goal
 *   investmentGuidance(answers)   → rule-based EDUCATIONAL tips (keys only)
 *
 * Insights and flags are returned as i18n KEYS + params. The UI turns
 * them into English or Bangla.
 */

// ---------- Tunable constants (keep all "magic numbers" here) ----------
export const RULES = {
  // Debt-to-income: monthly debt payments ÷ monthly income
  dtiWarn: 0.30, // over 30% → caution
  dtiDanger: 0.40, // over 40% → high risk

  // Annual interest rate (%) above which we flag a debt as "unusually high".
  // Bangladesh reference: MFI rates are capped at 24% flat-equivalent (MRA),
  // bank personal loans are usually well under ~16%.
  highInterest: { bank: 16, microloan: 24, informal: 24, credit: 24 },
  extremeInterest: 36, // anything above this is flagged regardless of type

  // Emergency fund target, in months of ESSENTIAL expenses
  efMonthsStable: 3, // monthly / yearly income
  efMonthsIrregular: 6, // irregular income

  // Expense categories that count as "essential" even when variable
  essentialCategories: ['rent', 'food', 'utilities', 'transport', 'health', 'education'],

  // How the leftover (after expenses + debt) is split: [emergency, goals, flexible].
  // Stronger weight on the emergency fund until it is fully funded.
  split: {
    efLow: [0.6, 0.2, 0.2], // emergency fund under 50% funded
    efMid: [0.4, 0.35, 0.25], // 50–99% funded
    efFull: [0, 0.65, 0.35] // fully funded → no more emergency saving needed
  },

  // Extra debt pay-down: share of the leftover added on top of minimum
  // payments when any debt is high-interest (paying it off early saves money).
  extraDebtShareHighInterest: 0.15
}

const sum = (arr, f = (x) => x) => arr.reduce((t, x) => t + (Number(f(x)) || 0), 0)
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const round = (v) => Math.round(v)

/**
 * Convert the income block to a MONTHLY figure.
 * - monthly:   sum of sources
 * - yearly:    sum ÷ 12
 * - irregular: user enters a *typical* monthly amount per source; we plan
 *              with it as-is and compensate with a bigger emergency fund.
 */
export function monthlyIncome(income) {
  const total = sum(income?.sources || [], (s) => s.amount)
  return income?.type === 'yearly' ? total / 12 : total
}

/**
 * Months to repay a loan with fixed monthly payments (standard amortisation).
 * Returns { months, totalInterest, neverEnds }.
 * neverEnds = true when the payment doesn't even cover the monthly interest.
 */
export function debtPayoff(amount, annualRatePct, monthlyPayment) {
  const B = Number(amount) || 0
  const P = Number(monthlyPayment) || 0
  const r = (Number(annualRatePct) || 0) / 100 / 12
  if (B <= 0) return { months: 0, totalInterest: 0, neverEnds: false }
  if (P <= 0 || (r > 0 && P <= B * r)) return { months: Infinity, totalInterest: Infinity, neverEnds: true }
  const months = r === 0 ? Math.ceil(B / P) : Math.ceil(-Math.log(1 - (r * B) / P) / Math.log(1 + r))
  return { months, totalInterest: Math.max(0, round(months * P - B)), neverEnds: false }
}

/** Months to reach a goal. Infinity when nothing is contributed. */
export function monthsToGoal(remaining, monthly) {
  if (remaining <= 0) return 0
  if (!monthly || monthly <= 0) return Infinity
  return Math.ceil(remaining / monthly)
}

/** Is this debt's interest rate unusually high for its type? */
export function isHighInterest(debt) {
  const limit = RULES.highInterest[debt.type] ?? 24
  return debt.interestRate > limit || debt.interestRate > RULES.extremeInterest
}

/* =====================================================================
 * computePlan(state): THE core calculation (one function on purpose)
 * =====================================================================
 * Steps:
 *   1. Monthly income
 *   2. Expenses → fixed / variable / essential
 *   3. Debt → minimum payments, DTI ratio, flags, payoff timelines
 *   4. Disposable income = income − expenses
 *   5. Debt carve-out   = minimum payments (+ extra if high-interest debt)
 *   6. Leftover         = disposable − debt carve-out
 *   7. Split leftover   → emergency fund / goals / flexible
 *      (weighted toward the emergency fund until it is full)
 *   8. Goals            → each goal's share of the goals budget + ETA
 *   9. Health score 0–100 + insight keys
 */
export function computePlan(state) {
  // 1 ── Income ────────────────────────────────────────────────────────
  const income = monthlyIncome(state.income)
  const irregular = state.income?.type === 'irregular'

  // 2 ── Expenses ──────────────────────────────────────────────────────
  const expenses = state.expenses || []
  const fixedExpenses = sum(expenses.filter((e) => e.type === 'fixed'), (e) => e.amount)
  const variableExpenses = sum(expenses.filter((e) => e.type === 'variable'), (e) => e.amount)
  const totalExpenses = fixedExpenses + variableExpenses
  // Essentials = every fixed cost + variable costs in essential categories
  const essentialExpenses = sum(
    expenses.filter((e) => e.type === 'fixed' || RULES.essentialCategories.includes(e.category)),
    (e) => e.amount
  )
  const byCategory = {}
  expenses.forEach((e) => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount })

  // 3 ── Debt ──────────────────────────────────────────────────────────
  const debts = (state.debts || []).map((d, index) => ({
    ...d,
    index,
    highInterest: isHighInterest(d),
    payoff: debtPayoff(d.amount, d.interestRate, d.minMonthlyPayment)
  }))
  const totalDebt = sum(debts, (d) => d.amount)
  const minDebtPayments = sum(debts, (d) => d.minMonthlyPayment)
  const dti = income > 0 ? minDebtPayments / income : minDebtPayments > 0 ? 1 : 0
  const dtiLevel = dti > RULES.dtiDanger ? 'danger' : dti > RULES.dtiWarn ? 'warn' : 'ok'
  const hasHighInterest = debts.some((d) => d.highInterest)

  // 4 ── Disposable income ─────────────────────────────────────────────
  const disposable = income - totalExpenses

  // 5 ── Debt carve-out ────────────────────────────────────────────────
  const afterMinimums = disposable - minDebtPayments
  const extraDebt = hasHighInterest && afterMinimums > 0 && totalDebt > 0
    ? Math.min(afterMinimums * RULES.extraDebtShareHighInterest, totalDebt)
    : 0
  const debtCarveOut = minDebtPayments + extraDebt

  // 6 ── Leftover to split ─────────────────────────────────────────────
  const leftover = Math.max(0, disposable - debtCarveOut)
  const shortfall = Math.max(0, debtCarveOut - disposable) // money missing each month

  // Emergency fund status (needed for the weighting in step 7)
  const efMonths = irregular ? RULES.efMonthsIrregular : RULES.efMonthsStable
  const efTarget = essentialExpenses * efMonths
  const efSaved = sum(state.logs || [], (l) => l.amount)
  const efProgress = efTarget > 0 ? clamp(efSaved / efTarget, 0, 1) : efSaved > 0 ? 1 : 0
  const efRemaining = Math.max(0, efTarget - efSaved)

  // 7 ── Split ─────────────────────────────────────────────────────────
  const stage = efTarget > 0 && efProgress >= 1 ? 'efFull' : efProgress >= 0.5 ? 'efMid' : 'efLow'
  let [wEf, wGoals, wFlex] = RULES.split[stage]
  // No unfinished goals → the goals share goes to flexible spending
  if (!(state.goals || []).some((g) => g.cost > g.saved)) { wFlex += wGoals; wGoals = 0 }
  let toEmergency = leftover * wEf
  let toGoals = leftover * wGoals
  let toFlexible = leftover * wFlex
  // Never put more into the emergency fund than it still needs;
  // share the extra between goals and flexible in the same ratio.
  if (toEmergency > efRemaining) {
    const spare = toEmergency - efRemaining
    toEmergency = efRemaining
    const goalShare = wGoals + wFlex > 0 ? wGoals / (wGoals + wFlex) : 0
    toGoals += spare * goalShare
    toFlexible += spare * (1 - goalShare)
  }

  // 8 ── Goals ─────────────────────────────────────────────────────────
  // Each goal gets a share of the goals budget in proportion to what it still needs.
  const openNeed = sum(state.goals || [], (g) => Math.max(0, g.cost - g.saved))
  const goals = (state.goals || []).map((g) => {
    const remaining = Math.max(0, g.cost - g.saved)
    const suggestedMonthly = openNeed > 0 ? (toGoals * remaining) / openNeed : 0
    return {
      ...g,
      remaining,
      progress: g.cost > 0 ? clamp(g.saved / g.cost, 0, 1) : 0,
      suggestedMonthly: round(suggestedMonthly),
      months: monthsToGoal(remaining, suggestedMonthly)
    }
  })
  const goalsCost = sum(goals, (g) => g.cost)
  const goalsSaved = sum(goals, (g) => Math.min(g.saved, g.cost))
  const goalsProgress = goalsCost > 0 ? goalsSaved / goalsCost : 0

  // 9 ── Health score (0–100) ──────────────────────────────────────────
  // Five simple, explainable parts:
  const savingsRate = income > 0 ? leftover / income : 0
  const parts = {
    cashflow: disposable - minDebtPayments >= 0 ? 20 : 0, // not overspending
    savingsRate: round(clamp(savingsRate / 0.2, 0, 1) * 25), // 20%+ saved → full marks
    debt: round(dti <= 0.1 ? 25 : dti >= 0.5 ? 0 : 25 * (1 - (dti - 0.1) / 0.4)) - (hasHighInterest ? 5 : 0),
    emergency: round(efProgress * 20),
    goals: round(goalsCost > 0 ? goalsProgress * 10 : 5)
  }
  parts.debt = Math.max(0, parts.debt)
  const healthScore = income > 0 ? clamp(sum(Object.values(parts)), 0, 100) : 0
  const healthLevel = healthScore >= 70 ? 'good' : healthScore >= 40 ? 'fair' : 'weak'

  // Insights: pick the 3 most useful, most urgent first
  const insights = []
  if (income <= 0) insights.push({ key: 'ins.noIncome' })
  else {
    if (shortfall > 0) insights.push({ key: 'ins.shortfall', p: { amount: round(shortfall) } })
    if (dtiLevel !== 'ok') insights.push({ key: 'ins.dti.' + dtiLevel, p: { pct: round(dti * 100) } })
    if (hasHighInterest) insights.push({ key: 'ins.highInterest' })
    if (efProgress < 1 && efTarget > 0) {
      insights.push({ key: 'ins.ef', p: { months: efMonths, pct: round(efProgress * 100), monthly: round(toEmergency) } })
    } else if (efTarget > 0) insights.push({ key: 'ins.efDone' })
    if (savingsRate >= 0.2) insights.push({ key: 'ins.savingGreat', p: { pct: round(savingsRate * 100) } })
    else if (leftover > 0) insights.push({ key: 'ins.savingSome', p: { amount: round(leftover), pct: round(savingsRate * 100) } })
    const nextGoal = goals.filter((g) => g.remaining > 0 && isFinite(g.months)).sort((a, b) => a.months - b.months)[0]
    if (nextGoal) insights.push({ key: 'ins.goal', p: { name: nextGoal.name, months: nextGoal.months } })
    const biggest = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]
    if (biggest && biggest[1] / income > 0.35) insights.push({ key: 'ins.bigCategory', p: { cat: biggest[0], pct: round((biggest[1] / income) * 100) } })
  }

  return {
    income: round(income), irregular,
    fixedExpenses, variableExpenses, totalExpenses, essentialExpenses, byCategory,
    debts, totalDebt, minDebtPayments, dti, dtiLevel, hasHighInterest,
    disposable: round(disposable),
    debtCarveOut: round(debtCarveOut), extraDebt: round(extraDebt),
    leftover: round(leftover), shortfall: round(shortfall),
    split: { emergency: round(toEmergency), goals: round(toGoals), flexible: round(toFlexible), stage },
    emergency: { months: efMonths, target: round(efTarget), saved: efSaved, progress: efProgress, remaining: round(efRemaining),
      monthsToFull: monthsToGoal(efRemaining, toEmergency) },
    goals, goalsProgress,
    savingsRate, healthScore, healthLevel, healthParts: parts,
    insights: insights.slice(0, 3)
  }
}

/**
 * Rule-based investment EDUCATION (never a specific product).
 * answers = { goal: 'education'|'business'|'home'|'retirement'|'other',
 *             years: number, risk: 'low'|'medium'|'high' }
 * Returns { horizon, profile, tips: [i18nKey...] }
 */
export function investmentGuidance({ years, risk }, plan) {
  const horizon = years < 3 ? 'short' : years <= 7 ? 'medium' : 'long'
  const tips = []
  // Safety comes before investing
  if (plan && plan.emergency.progress < 1) tips.push('inv.tip.efFirst')
  if (plan && plan.hasHighInterest) tips.push('inv.tip.debtFirst')
  // Horizon rules
  tips.push('inv.tip.horizon.' + horizon)
  // Risk comfort, capped by horizon: short timelines can't absorb big drops
  const effective = horizon === 'short' ? 'low' : horizon === 'medium' && risk === 'high' ? 'medium' : risk
  tips.push('inv.tip.risk.' + effective)
  if (effective !== risk) tips.push('inv.tip.capped')
  tips.push('inv.tip.diversify', 'inv.tip.regulated', 'inv.tip.fees')
  return { horizon, profile: effective, tips }
}
