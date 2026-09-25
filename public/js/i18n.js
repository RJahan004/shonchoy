/**
 * $honchoy — language system (English / বাংলা)
 * ---------------------------------------------------------------
 * - Every visible string lives in STRINGS.en / STRINGS.bn under the same key.
 * - t('key', {param}) returns the string in the current language
 *   and fills in {param} placeholders.
 * - money(n) / num(n) format numbers; Bangla uses Bangla digits (০-৯).
 * - HTML: <span data-i18n="key"></span> is filled automatically by applyI18n().
 *   Use data-i18n-placeholder / data-i18n-aria for attributes.
 *
 * Language is stored in the shared schema as state.user.language ('en'|'bn').
 * To add a string: add it to BOTH en and bn. A missing bn key falls back to en.
 */
import { getState, update } from './store.js'

export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'bn', label: 'বাংলা', short: 'বাং' }
]

export const STRINGS = {
  en: {
    'app.tagline': 'Your savings, your strength',
    'lang.label': 'Language',
    'common.next': 'Continue', 'common.back': 'Back', 'common.add': 'Add', 'common.save': 'Save',
    'common.remove': 'Remove', 'common.cancel': 'Cancel', 'common.edit': 'Edit',
    'common.name': 'Name', 'common.amount': 'Amount (৳)', 'common.perMonth': '/month',
    'common.months': '{n} months', 'common.month1': '1 month', 'common.never': 'Not reachable yet',
    'common.monthsShort': 'mo', 'common.total': 'Total', 'common.empty': 'Nothing added yet.',
    'common.required': 'Please fill in a name and an amount above 0.',

    // Navigation
    'nav.home': 'Home', 'nav.money': 'Money', 'nav.plan': 'Plan', 'nav.goals': 'Goals', 'nav.learn': 'Learn',
    'nav.settings': 'Settings',

    // Onboarding — step indicator
    'ob.step': 'Step {n} of {total}',

    // Welcome + age gate
    'age.title': 'Welcome to $honchoy',
    'age.subtitle': 'A calm, private place to plan your money, save for what matters and grow your confidence.',
    'age.point1': 'Plan your monthly budget in minutes',
    'age.point2': 'Build a safety net and reach your goals',
    'age.point3': 'Learn money basics in plain words',
    'age.checkbox': 'I confirm that I am 18 years old or older.',
    'age.privacy': 'We never ask for your exact age or date of birth. Your data stays on this device.',
    'age.start': 'Get started',
    'age.needConfirm': 'Please tick the box to confirm you are 18 or older.',
    'age.demo': 'Try with sample data',

    // Income
    'inc.title': 'Your income',
    'inc.subtitle': 'How do you usually get paid? Add every source, even small ones.',
    'inc.typeLabel': 'Income type',
    'inc.type.monthly': 'Monthly', 'inc.type.monthly.hint': 'Same amount every month',
    'inc.type.yearly': 'Yearly', 'inc.type.yearly.hint': 'Paid once or twice a year',
    'inc.type.irregular': 'Irregular', 'inc.type.irregular.hint': 'Changes month to month',
    'inc.sourcesLabel': 'Income sources',
    'inc.amountMonthly': 'Monthly amount (৳)', 'inc.amountYearly': 'Yearly amount (৳)',
    'inc.amountIrregular': 'Typical month (৳)',
    'inc.irregularNote': 'Enter what you earn in a normal month. We will suggest a bigger safety net for you.',
    'inc.kind': 'Source',
    'inc.kind.salary': 'Salary', 'inc.kind.freelancing': 'Freelancing', 'inc.kind.business': 'Business',
    'inc.kind.scholarship': 'Scholarship', 'inc.kind.other': 'Other',
    'inc.addSource': 'Add another source',
    'inc.total': 'Total per month',
    'inc.needOne': 'Add at least one income source with an amount.',
    'inc.finish': 'Save & continue',
    'inc.namePh': 'e.g. Tailoring orders',

    // Money (expenses + debts)
    'money.title': 'Money in & out',
    'exp.title': 'Expenses', 'exp.subtitle': 'Fixed costs stay the same each month. Variable costs change.',
    'exp.type.fixed': 'Fixed', 'exp.type.variable': 'Variable',
    'exp.category': 'Category', 'exp.namePh': 'e.g. House rent',
    'exp.cat.rent': 'Rent', 'exp.cat.food': 'Food', 'exp.cat.utilities': 'Utilities & bills',
    'exp.cat.transport': 'Transport', 'exp.cat.health': 'Health', 'exp.cat.education': 'Education',
    'exp.cat.family': 'Family support', 'exp.cat.personal': 'Personal', 'exp.cat.other': 'Other',
    'exp.add': 'Add expense', 'exp.fixedTotal': 'Fixed', 'exp.variableTotal': 'Variable',
    'exp.total': 'Total expenses',

    'debt.title': 'Debts', 'debt.subtitle': 'Loans and money you owe. Knowing them clearly is the first step to freedom.',
    'debt.type': 'Type of debt',
    'debt.type.bank': 'Bank loan', 'debt.type.microloan': 'Microloan / MFI',
    'debt.type.informal': 'Informal / family loan', 'debt.type.credit': 'Credit purchase (kisti)',
    'debt.amount': 'Amount owed (৳)', 'debt.rate': 'Interest rate (% per year)',
    'debt.min': 'Minimum monthly payment (৳)', 'debt.add': 'Add debt',
    'debt.totalOwed': 'Total owed', 'debt.monthly': 'Monthly payments', 'debt.dti': 'Share of income',
    'debt.dti.ok': 'Your debt payments look manageable.',
    'debt.dti.warn': 'Careful: debt payments take {pct}% of your income. Try to stay under 30%.',
    'debt.dti.danger': 'High risk: debt payments take {pct}% of your income. Over 40% can be hard to keep up with. Avoid new loans and talk to your lender about options.',
    'debt.highRate': 'This interest rate looks unusually high. Compare with a bank or a registered MFI.',
    'debt.payoff': 'Paid off in {time} · total interest ৳{interest}',
    'debt.neverEnds': 'This payment does not cover the interest. The debt will keep growing.',
    'debt.calcTitle': 'Payoff calculator',
    'debt.calcHint': 'Move the slider to see how paying more each month shortens your debt.',
    'debt.calcPay': 'If I pay per month',
    'debt.calcResult': 'Debt-free in {time}. You would pay ৳{interest} in interest.',
    'debt.calcSaved': 'That is {months} months sooner and ৳{saved} less interest than paying the minimum.',
    'debt.none': 'No debts added. That is great!',
    'debt.ratePh': 'e.g. 20',

    // Plan
    'plan.title': 'Your monthly plan',
    'plan.subtitle': 'Built automatically from your income, expenses and debts.',
    'plan.income': 'Income', 'plan.expenses': 'Expenses', 'plan.disposable': 'Left after expenses',
    'plan.debt': 'Debt payments', 'plan.extraDebt': 'includes ৳{amount} extra to clear costly debt faster',
    'plan.leftover': 'Free to plan',
    'plan.split': 'How to use your ৳{amount}',
    'plan.emergency': 'Emergency fund', 'plan.goals': 'Goals', 'plan.flexible': 'Flexible spending',
    'plan.why.efLow': 'Your safety net is still small, so most goes there first.',
    'plan.why.efMid': 'Your safety net is growing. Goals now get a bigger share.',
    'plan.why.efFull': 'Your emergency fund is full! Everything now goes to goals and life.',
    'plan.shortfall': 'You are short by ৳{amount} each month. Look at variable expenses first, or talk to lenders about smaller payments.',
    'plan.noIncome': 'Add your income to see your plan.',
    'plan.formula': 'How we calculate',
    'plan.formulaText': 'Income − expenses = left after expenses. Minus debt payments = free to plan. That is split between your emergency fund, goals and flexible spending, with more going to the emergency fund until it is full.',
    'plan.logTitle': 'Log a saving',
    'plan.logHint': 'Put money aside? Log it here. It counts toward your emergency fund.',
    'plan.logNote': 'Note (optional)', 'plan.logAdd': 'Log saving', 'plan.logs': 'Recent savings',

    // Goals
    'goals.title': 'Goals',
    'ef.title': 'Emergency fund',
    'ef.explain': 'Your safety net for surprises like illness or job loss. Target: {months} months of essential costs.',
    'ef.irregular': 'Your income is irregular, so we aim for 6 months.',
    'ef.saved': '৳{saved} of ৳{target}',
    'ef.eta': 'At ৳{monthly}/month you will be there in {time}.',
    'ef.done': 'Fully funded. Well done! 🎉',
    'ef.noExpenses': 'Add your expenses to set a target.',

    'goal.customTitle': 'My goals',
    'goal.add': 'Add goal', 'goal.cost': 'Total cost (৳)', 'goal.saved': 'Already saved (৳)',
    'goal.type': 'Kind of goal',
    'goal.type.education': 'Education', 'goal.type.business': 'Business', 'goal.type.purchase': 'Major purchase',
    'goal.type.travel': 'Travel', 'goal.type.custom': 'Other',
    'goal.namePh': 'e.g. Sewing machine',
    'goal.slider': 'Monthly contribution',
    'goal.eta': 'Reach it in {time}. Around {date}.',
    'goal.suggested': 'Your plan suggests ৳{amount}/month',
    'goal.useSuggested': 'Use suggestion',
    'goal.reached': 'Goal reached! 🎉',
    'goal.addSaved': 'Add savings',
    'goal.addSavedPh': 'Amount (৳)',

    'inv.title': 'Investment planning',
    'inv.subtitle': 'Answer 3 questions for simple, educational guidance.',
    'inv.disclaimer': 'This is general education, not financial advice. We never recommend specific products. Check with a licensed advisor before investing.',
    'inv.goal': 'What are you investing for?',
    'inv.goal.education': 'Education', 'inv.goal.business': 'Growing a business', 'inv.goal.home': 'A home',
    'inv.goal.retirement': 'Old age / retirement', 'inv.goal.other': 'Something else',
    'inv.years': 'When will you need the money?', 'inv.yearsVal': 'In {n} years',
    'inv.risk': 'If your investment dropped 20% in a bad year, how would you feel?',
    'inv.risk.low': 'Very worried. I want my money safe',
    'inv.risk.medium': 'Uneasy, but I can wait',
    'inv.risk.high': 'Fine. I think long-term',
    'inv.show': 'Show guidance',
    'inv.profile': 'Your comfort level: {p}',
    'inv.profile.low': 'Careful', 'inv.profile.medium': 'Balanced', 'inv.profile.high': 'Growth-focused',
    'inv.tip.efFirst': 'Build your emergency fund first. Money you might need soon should not be invested.',
    'inv.tip.debtFirst': 'Paying off high-interest debt is a guaranteed "return". Do that before investing.',
    'inv.tip.horizon.short': 'Under 3 years: keep the money safe and easy to reach, such as savings accounts or fixed deposits (FDR). Short timelines cannot recover from losses.',
    'inv.tip.horizon.medium': '3–7 years: a mix works well. Most in safe options (FDR, savings certificates such as Sanchayapatra), some in slower-growing assets.',
    'inv.tip.horizon.long': 'Over 7 years: you have time to ride out ups and downs, so some growth assets (such as mutual funds) can make sense alongside safe savings.',
    'inv.tip.risk.low': 'Careful profile: focus on protecting what you have. Choose options where your original amount is protected, even if growth is slower.',
    'inv.tip.risk.medium': 'Balanced profile: many people keep roughly two-thirds in safe options and one-third in growth, then review once a year.',
    'inv.tip.risk.high': 'Growth profile: a larger growth share is possible, but only with money you will not need for many years, and always spread out.',
    'inv.tip.capped': 'We suggest a more careful mix than your comfort level because your timeline is short.',
    'inv.tip.diversify': 'Do not put all your eggs in one basket. Spread money across different types of savings.',
    'inv.tip.regulated': 'Only use institutions registered with Bangladesh Bank, BSEC or MRA. Ask for their licence.',
    'inv.tip.fees': 'Ask about all fees before you sign. Small fees add up over many years.',

    // Dashboard
    'dash.hello': 'Hello! 👋',
    'dash.subtitle': 'Here is your money at a glance.',
    'dash.health': 'Financial health', 'dash.health.good': 'Strong', 'dash.health.fair': 'Getting there',
    'dash.health.weak': 'Needs care',
    'dash.incVsExp': 'Income vs. expenses',
    'dash.savings': 'Emergency fund', 'dash.goalProgress': 'Goal progress',
    'dash.insights': 'Insights for you',
    'dash.scoreParts': 'What makes up your score',
    'dash.part.cashflow': 'Spending within income', 'dash.part.savingsRate': 'Saving rate',
    'dash.part.debt': 'Debt load', 'dash.part.emergency': 'Safety net', 'dash.part.goals': 'Goals',
    'dash.savedMonth': 'Saved / month',
    'dash.noGoals': 'No goals yet. Add one in Goals.',

    'ins.noIncome': 'Add your income so we can build your plan and give you personal insights.',
    'ins.shortfall': 'Right now you spend ৳{amount} more than you earn each month. Start with one variable expense you can cut. Small changes add up.',
    'ins.dti.warn': 'Debt payments use {pct}% of your income. Try to avoid new loans until this is under 30%.',
    'ins.dti.danger': 'Debt payments use {pct}% of your income, which is heavy. Focus on clearing the costliest loan first and avoid new borrowing.',
    'ins.highInterest': 'One of your loans has a very high interest rate. Clearing it early will save you real money.',
    'ins.ef': 'Your safety net is {pct}% of the {months}-month target. Putting aside ৳{monthly} each month gets you there steadily.',
    'ins.efDone': 'Your emergency fund is complete. That is a strong foundation!',
    'ins.savingGreat': 'You can save about {pct}% of your income. That is excellent. Keep it up!',
    'ins.savingSome': 'You have ৳{amount} free each month ({pct}% of income). Even saving part of it builds security.',
    'ins.goal': 'At your planned pace, “{name}” is about {months} months away.',
    'ins.bigCategory': '{cat} takes {pct}% of your income. It is worth checking if there is room to save here.',

    // Learn
    'learn.title': 'Learn',
    'learn.lessons': 'Money basics', 'learn.lessonsSub': 'Short lessons in plain words. Tap a card to read.',
    'learn.read': 'Read', 'learn.close': 'Close', 'learn.tryThis': 'Try this',
    'l1.t': 'Why save?', 'l1.b': 'Saving means keeping a part of your money for later. It turns surprises into small problems instead of big crises, and it slowly makes your dreams possible.', 'l1.x': 'Pay yourself first: the day money comes in, put aside a small amount before spending. Even ৳200 counts.',
    'l2.t': 'Your safety net', 'l2.b': 'An emergency fund is money only for real emergencies: illness, losing work, urgent repairs. Having it means you do not need to borrow at high interest when life happens.', 'l2.x': 'Keep it separate from daily money, such as in a different account or mobile wallet.',
    'l3.t': 'Needs vs. wants', 'l3.b': 'Needs are things you must have: food, rent, medicine. Wants are nice to have. Both are okay, but needs come first. A budget simply helps you decide ahead of time.', 'l3.x': 'Before a purchase, wait one day. If you still want it tomorrow, it may be worth it.',
    'l4.t': 'What is interest?', 'l4.b': 'Interest is the price of using money. When you borrow, you pay interest. When you save in a bank, the bank pays you interest. The rate is shown as a percentage per year.', 'l4.x': 'Borrowing ৳10,000 at 20% a year costs about ৳2,000 extra in one year.',
    'l5.t': 'Understanding debt', 'l5.b': 'Debt is not always bad. A loan for a sewing machine that earns money can help. But loans for daily spending can trap you. Try to keep all loan payments under 30% of your income.', 'l5.x': 'If you have several loans, pay the minimum on all, then put extra toward the one with the highest interest.',
    'l6.t': 'Inflation', 'l6.b': 'Inflation means prices go up over time, so the same ৳100 buys less next year. Money kept under the mattress slowly loses value. Saving where it earns some interest helps protect it.', 'l6.x': 'If prices rise 9% a year, ৳1,000 of groceries today costs about ৳1,090 next year.',
    'l7.t': 'Investing basics', 'l7.b': 'Investing means putting money into something that can grow, like a business, savings certificates or funds. Higher possible growth always comes with higher risk of loss.', 'l7.x': 'Only invest money you will not need for a few years, and never money from your emergency fund.',
    'l8.t': 'Diversification', 'l8.b': 'Diversification means not putting all your eggs in one basket. If money is spread across different places, one bad result does not ruin everything.', 'l8.x': 'Instead of one big investment, split it: some in safe savings, some in a longer-term option.',

    'scam.title': 'Scam check',
    'scam.subtitle': 'Got an offer that sounds too good? Tick anything that is true about it.',
    'scam.f1': 'Promises guaranteed or very high returns (like “double your money”)',
    'scam.f2': 'Pressures you to decide quickly (“today only”)',
    'scam.f3': 'Asks for an upfront fee before you get a loan, job or prize',
    'scam.f4': 'The agent or company cannot show a registration or licence',
    'scam.f5': 'Asks for your PIN, OTP or password',
    'scam.f6': 'Pays you for bringing in new members',
    'scam.f7': 'Contacted you out of nowhere by phone, SMS or social media',
    'scam.f8': 'Asks you to keep it secret from family',
    'scam.r0': 'No red flags ticked. Still, always check the company is registered before paying anything.',
    'scam.r1': 'Be careful. This offer has a warning sign. Ask questions and check with someone you trust before paying.',
    'scam.r2': 'High risk: this looks like a scam. Do not send money or share codes. Talk to family or your bank first.',
    'scam.tips': 'Stay safe',
    'scam.tip1': 'Real banks and bKash/Nagad will never ask for your PIN or OTP.',
    'scam.tip2': 'No honest investment can guarantee high returns.',
    'scam.tip3': 'Take your time. Real offers will still be there tomorrow.',
    'scam.tip4': 'To report fraud, contact your bank or the police (999).',

    // Settings
    'set.title': 'Settings', 'set.export': 'Download my data (JSON)', 'set.reset': 'Delete all my data',
    'set.resetConfirm': 'This removes everything saved on this device. Continue?',
    'set.editIncome': 'Edit income', 'set.privacy': 'All data is saved only in this browser. Nothing is sent to a server.',
    'set.demo': 'Load sample data'
  },

  bn: {
    'app.tagline': 'আপনার সঞ্চয়, আপনার শক্তি',
    'lang.label': 'ভাষা',
    'common.next': 'এগিয়ে যান', 'common.back': 'পেছনে', 'common.add': 'যোগ করুন', 'common.save': 'সংরক্ষণ',
    'common.remove': 'মুছুন', 'common.cancel': 'বাতিল', 'common.edit': 'সম্পাদনা',
    'common.name': 'নাম', 'common.amount': 'পরিমাণ (৳)', 'common.perMonth': '/মাস',
    'common.months': '{n} মাস', 'common.month1': '১ মাস', 'common.never': 'এখনো সম্ভব নয়',
    'common.monthsShort': 'মাস', 'common.total': 'মোট', 'common.empty': 'এখনো কিছু যোগ করা হয়নি।',
    'common.required': 'একটি নাম এবং ০-এর বেশি পরিমাণ লিখুন।',

    'nav.home': 'হোম', 'nav.money': 'টাকা', 'nav.plan': 'পরিকল্পনা', 'nav.goals': 'লক্ষ্য', 'nav.learn': 'শিখুন',
    'nav.settings': 'সেটিংস',

    'ob.step': 'ধাপ {n} / {total}',

    'age.title': '$honchoy-তে স্বাগতম',
    'age.subtitle': 'নিরাপদে ও নিশ্চিন্তে টাকার পরিকল্পনা করুন, প্রয়োজনের জন্য সঞ্চয় করুন, আত্মবিশ্বাস বাড়ান।',
    'age.point1': 'কয়েক মিনিটে মাসিক বাজেট তৈরি করুন',
    'age.point2': 'জরুরি তহবিল গড়ুন, লক্ষ্যে পৌঁছান',
    'age.point3': 'সহজ ভাষায় টাকার মূল বিষয় শিখুন',
    'age.checkbox': 'আমি নিশ্চিত করছি যে আমার বয়স ১৮ বছর বা তার বেশি।',
    'age.privacy': 'আমরা কখনো আপনার সঠিক বয়স বা জন্মতারিখ জানতে চাই না। আপনার তথ্য শুধু এই ডিভাইসেই থাকে।',
    'age.start': 'শুরু করুন',
    'age.needConfirm': 'আপনার বয়স ১৮ বা তার বেশি, তা নিশ্চিত করতে বক্সে টিক দিন।',
    'age.demo': 'নমুনা তথ্য দিয়ে দেখুন',

    'inc.title': 'আপনার আয়',
    'inc.subtitle': 'সাধারণত কীভাবে টাকা পান? ছোট-বড় সব আয়ের উৎস যোগ করুন।',
    'inc.typeLabel': 'আয়ের ধরন',
    'inc.type.monthly': 'মাসিক', 'inc.type.monthly.hint': 'প্রতি মাসে একই পরিমাণ',
    'inc.type.yearly': 'বার্ষিক', 'inc.type.yearly.hint': 'বছরে এক-দুবার পান',
    'inc.type.irregular': 'অনিয়মিত', 'inc.type.irregular.hint': 'মাসে মাসে বদলায়',
    'inc.sourcesLabel': 'আয়ের উৎস',
    'inc.amountMonthly': 'মাসিক পরিমাণ (৳)', 'inc.amountYearly': 'বার্ষিক পরিমাণ (৳)',
    'inc.amountIrregular': 'সাধারণ মাসে (৳)',
    'inc.irregularNote': 'একটি সাধারণ মাসে যা আয় করেন তা লিখুন। আপনার জন্য আমরা একটু বড় জরুরি তহবিলের পরামর্শ দেব।',
    'inc.kind': 'উৎস',
    'inc.kind.salary': 'বেতন', 'inc.kind.freelancing': 'ফ্রিল্যান্সিং', 'inc.kind.business': 'ব্যবসা',
    'inc.kind.scholarship': 'বৃত্তি', 'inc.kind.other': 'অন্যান্য',
    'inc.addSource': 'আরেকটি উৎস যোগ করুন',
    'inc.total': 'মাসে মোট',
    'inc.needOne': 'অন্তত একটি আয়ের উৎস ও পরিমাণ যোগ করুন।',
    'inc.finish': 'সংরক্ষণ করে এগিয়ে যান',
    'inc.namePh': 'যেমন: সেলাইয়ের অর্ডার',

    'money.title': 'আয় ও খরচ',
    'exp.title': 'খরচ', 'exp.subtitle': 'নির্দিষ্ট খরচ প্রতি মাসে একই থাকে। পরিবর্তনশীল খরচ বদলায়।',
    'exp.type.fixed': 'নির্দিষ্ট', 'exp.type.variable': 'পরিবর্তনশীল',
    'exp.category': 'খাত', 'exp.namePh': 'যেমন: বাসা ভাড়া',
    'exp.cat.rent': 'ভাড়া', 'exp.cat.food': 'খাবার', 'exp.cat.utilities': 'বিল ও ইউটিলিটি',
    'exp.cat.transport': 'যাতায়াত', 'exp.cat.health': 'স্বাস্থ্য', 'exp.cat.education': 'শিক্ষা',
    'exp.cat.family': 'পরিবারকে সহায়তা', 'exp.cat.personal': 'ব্যক্তিগত', 'exp.cat.other': 'অন্যান্য',
    'exp.add': 'খরচ যোগ করুন', 'exp.fixedTotal': 'নির্দিষ্ট', 'exp.variableTotal': 'পরিবর্তনশীল',
    'exp.total': 'মোট খরচ',

    'debt.title': 'ঋণ', 'debt.subtitle': 'আপনার ঋণ ও দেনা। স্পষ্টভাবে জানাই মুক্তির প্রথম ধাপ।',
    'debt.type': 'ঋণের ধরন',
    'debt.type.bank': 'ব্যাংক ঋণ', 'debt.type.microloan': 'ক্ষুদ্রঋণ / এনজিও',
    'debt.type.informal': 'অনানুষ্ঠানিক / পারিবারিক ঋণ', 'debt.type.credit': 'কিস্তিতে কেনা',
    'debt.amount': 'বাকি ঋণ (৳)', 'debt.rate': 'সুদের হার (% বছরে)',
    'debt.min': 'ন্যূনতম মাসিক কিস্তি (৳)', 'debt.add': 'ঋণ যোগ করুন',
    'debt.totalOwed': 'মোট ঋণ', 'debt.monthly': 'মাসিক কিস্তি', 'debt.dti': 'আয়ের অংশ',
    'debt.dti.ok': 'আপনার ঋণের কিস্তি সামলানোর মতো।',
    'debt.dti.warn': 'সাবধান: ঋণের কিস্তিতে আয়ের {pct}% যাচ্ছে। ৩০%-এর নিচে রাখার চেষ্টা করুন।',
    'debt.dti.danger': 'উচ্চ ঝুঁকি: ঋণের কিস্তিতে আয়ের {pct}% যাচ্ছে। ৪০%-এর বেশি হলে চালিয়ে যাওয়া কঠিন হতে পারে। নতুন ঋণ এড়িয়ে চলুন এবং ঋণদাতার সাথে বিকল্প নিয়ে কথা বলুন।',
    'debt.highRate': 'এই সুদের হার অস্বাভাবিক বেশি মনে হচ্ছে। ব্যাংক বা নিবন্ধিত এনজিওর সাথে তুলনা করুন।',
    'debt.payoff': '{time}-এ শোধ হবে · মোট সুদ ৳{interest}',
    'debt.neverEnds': 'এই কিস্তি সুদও পূরণ করে না। ঋণ বাড়তেই থাকবে।',
    'debt.calcTitle': 'ঋণ শোধের হিসাব',
    'debt.calcHint': 'স্লাইডার সরিয়ে দেখুন, মাসে বেশি দিলে কত তাড়াতাড়ি ঋণ শোধ হয়।',
    'debt.calcPay': 'মাসে যদি দিই',
    'debt.calcResult': '{time}-এ ঋণমুক্ত। সুদ দিতে হবে ৳{interest}।',
    'debt.calcSaved': 'ন্যূনতম কিস্তির চেয়ে {months} মাস আগে, এবং ৳{saved} কম সুদ।',
    'debt.none': 'কোনো ঋণ যোগ করা হয়নি। দারুণ!',
    'debt.ratePh': 'যেমন: ২০',

    'plan.title': 'আপনার মাসিক পরিকল্পনা',
    'plan.subtitle': 'আপনার আয়, খরচ ও ঋণ থেকে নিজে থেকেই তৈরি।',
    'plan.income': 'আয়', 'plan.expenses': 'খরচ', 'plan.disposable': 'খরচের পর বাকি',
    'plan.debt': 'ঋণের কিস্তি', 'plan.extraDebt': 'দামি ঋণ দ্রুত শোধে ৳{amount} বাড়তি সহ',
    'plan.leftover': 'পরিকল্পনার জন্য বাকি',
    'plan.split': 'আপনার ৳{amount} কীভাবে ভাগ করবেন',
    'plan.emergency': 'জরুরি তহবিল', 'plan.goals': 'লক্ষ্য', 'plan.flexible': 'নিজের খরচ',
    'plan.why.efLow': 'আপনার জরুরি তহবিল এখনো ছোট, তাই বেশিরভাগ টাকা আগে সেখানে যাবে।',
    'plan.why.efMid': 'জরুরি তহবিল বাড়ছে। এখন লক্ষ্যগুলো বড় অংশ পাবে।',
    'plan.why.efFull': 'জরুরি তহবিল পূর্ণ! এখন সব যাবে লক্ষ্য আর জীবনের জন্য।',
    'plan.shortfall': 'প্রতি মাসে ৳{amount} কম পড়ছে। আগে পরিবর্তনশীল খরচগুলো দেখুন, অথবা কিস্তি কমানো নিয়ে ঋণদাতার সাথে কথা বলুন।',
    'plan.noIncome': 'পরিকল্পনা দেখতে আপনার আয় যোগ করুন।',
    'plan.formula': 'আমরা কীভাবে হিসাব করি',
    'plan.formulaText': 'আয় − খরচ = খরচের পর বাকি। তা থেকে ঋণের কিস্তি বাদ দিলে = পরিকল্পনার জন্য বাকি। এই টাকা জরুরি তহবিল, লক্ষ্য ও নিজের খরচে ভাগ হয়। জরুরি তহবিল পূর্ণ না হওয়া পর্যন্ত সেখানে বেশি যায়।',
    'plan.logTitle': 'সঞ্চয় লিখে রাখুন',
    'plan.logHint': 'টাকা জমিয়েছেন? এখানে লিখুন। এটি জরুরি তহবিলে যোগ হবে।',
    'plan.logNote': 'নোট (ঐচ্ছিক)', 'plan.logAdd': 'সঞ্চয় যোগ করুন', 'plan.logs': 'সাম্প্রতিক সঞ্চয়',

    'goals.title': 'লক্ষ্য',
    'ef.title': 'জরুরি তহবিল',
    'ef.explain': 'অসুখ বা কাজ হারানোর মতো হঠাৎ বিপদের জন্য আপনার নিরাপত্তা। লক্ষ্য: {months} মাসের প্রয়োজনীয় খরচ।',
    'ef.irregular': 'আপনার আয় অনিয়মিত, তাই লক্ষ্য ৬ মাস।',
    'ef.saved': '৳{target}-এর মধ্যে ৳{saved}',
    'ef.eta': 'মাসে ৳{monthly} করে জমালে {time}-এ পৌঁছে যাবেন।',
    'ef.done': 'সম্পূর্ণ জমা হয়েছে। অভিনন্দন! 🎉',
    'ef.noExpenses': 'লক্ষ্য ঠিক করতে আপনার খরচ যোগ করুন।',

    'goal.customTitle': 'আমার লক্ষ্য',
    'goal.add': 'লক্ষ্য যোগ করুন', 'goal.cost': 'মোট খরচ (৳)', 'goal.saved': 'ইতিমধ্যে জমানো (৳)',
    'goal.type': 'লক্ষ্যের ধরন',
    'goal.type.education': 'শিক্ষা', 'goal.type.business': 'ব্যবসা', 'goal.type.purchase': 'বড় কেনাকাটা',
    'goal.type.travel': 'ভ্রমণ', 'goal.type.custom': 'অন্যান্য',
    'goal.namePh': 'যেমন: সেলাই মেশিন',
    'goal.slider': 'মাসিক জমা',
    'goal.eta': '{time}-এ পৌঁছাবেন। আনুমানিক {date}।',
    'goal.suggested': 'আপনার পরিকল্পনা অনুযায়ী মাসে ৳{amount}',
    'goal.useSuggested': 'এটি ব্যবহার করুন',
    'goal.reached': 'লক্ষ্য পূরণ হয়েছে! 🎉',
    'goal.addSaved': 'জমা যোগ করুন',
    'goal.addSavedPh': 'পরিমাণ (৳)',

    'inv.title': 'বিনিয়োগ পরিকল্পনা',
    'inv.subtitle': '৩টি প্রশ্নের উত্তর দিন, সহজ শিক্ষামূলক নির্দেশনা পান।',
    'inv.disclaimer': 'এটি সাধারণ শিক্ষা, আর্থিক পরামর্শ নয়। আমরা কখনো নির্দিষ্ট কোনো পণ্যের সুপারিশ করি না। বিনিয়োগের আগে লাইসেন্সধারী পরামর্শদাতার সাথে কথা বলুন।',
    'inv.goal': 'কীসের জন্য বিনিয়োগ করছেন?',
    'inv.goal.education': 'শিক্ষা', 'inv.goal.business': 'ব্যবসা বাড়ানো', 'inv.goal.home': 'বাড়ি',
    'inv.goal.retirement': 'বৃদ্ধ বয়স / অবসর', 'inv.goal.other': 'অন্য কিছু',
    'inv.years': 'টাকাটা কবে লাগবে?', 'inv.yearsVal': '{n} বছর পর',
    'inv.risk': 'খারাপ এক বছরে বিনিয়োগ ২০% কমে গেলে আপনার কেমন লাগবে?',
    'inv.risk.low': 'খুব চিন্তা হবে, টাকা নিরাপদ চাই',
    'inv.risk.medium': 'অস্বস্তি হবে, তবে অপেক্ষা করতে পারব',
    'inv.risk.high': 'ঠিক আছে, আমি দীর্ঘমেয়াদে ভাবি',
    'inv.show': 'নির্দেশনা দেখুন',
    'inv.profile': 'আপনার স্বস্তির মাত্রা: {p}',
    'inv.profile.low': 'সতর্ক', 'inv.profile.medium': 'ভারসাম্যপূর্ণ', 'inv.profile.high': 'প্রবৃদ্ধিমুখী',
    'inv.tip.efFirst': 'আগে জরুরি তহবিল গড়ুন। যে টাকা শিগগির লাগতে পারে, তা বিনিয়োগ করবেন না।',
    'inv.tip.debtFirst': 'উচ্চ সুদের ঋণ শোধ করা একটি নিশ্চিত "লাভ"। বিনিয়োগের আগে সেটা করুন।',
    'inv.tip.horizon.short': '৩ বছরের কম: টাকা নিরাপদ ও সহজে তোলা যায় এমন জায়গায় রাখুন, যেমন সঞ্চয়ী হিসাব বা এফডিআর। অল্প সময়ে ক্ষতি পুষিয়ে নেওয়া যায় না।',
    'inv.tip.horizon.medium': '৩–৭ বছর: মিশ্রণ ভালো কাজ করে। বেশিরভাগ নিরাপদ জায়গায় (এফডিআর, সঞ্চয়পত্র), কিছুটা ধীরে বাড়ে এমন সম্পদে।',
    'inv.tip.horizon.long': '৭ বছরের বেশি: ওঠানামা সামলানোর সময় আছে, তাই নিরাপদ সঞ্চয়ের পাশাপাশি কিছু প্রবৃদ্ধিমূলক সম্পদ (যেমন মিউচুয়াল ফান্ড) বিবেচনা করা যায়।',
    'inv.tip.risk.low': 'সতর্ক: যা আছে তা রক্ষায় মনোযোগ দিন। প্রবৃদ্ধি কম হলেও মূল টাকা নিরাপদ থাকে এমন বিকল্প বেছে নিন।',
    'inv.tip.risk.medium': 'ভারসাম্যপূর্ণ: অনেকে মোটামুটি তিন ভাগের দুই ভাগ নিরাপদ বিকল্পে আর এক ভাগ প্রবৃদ্ধিতে রাখেন, বছরে একবার পর্যালোচনা করেন।',
    'inv.tip.risk.high': 'প্রবৃদ্ধিমুখী: প্রবৃদ্ধির অংশ বেশি রাখা যায়, তবে শুধু সেই টাকা দিয়ে যা অনেক বছর লাগবে না, এবং সবসময় ছড়িয়ে রাখুন।',
    'inv.tip.capped': 'আপনার সময় কম, তাই আপনার স্বস্তির মাত্রার চেয়ে একটু বেশি সতর্ক মিশ্রণের পরামর্শ দিচ্ছি।',
    'inv.tip.diversify': 'সব ডিম এক ঝুড়িতে রাখবেন না। বিভিন্ন ধরনের সঞ্চয়ে টাকা ছড়িয়ে রাখুন।',
    'inv.tip.regulated': 'শুধু বাংলাদেশ ব্যাংক, বিএসইসি বা এমআরএ-তে নিবন্ধিত প্রতিষ্ঠান ব্যবহার করুন। তাদের লাইসেন্স দেখতে চান।',
    'inv.tip.fees': 'সই করার আগে সব ফি সম্পর্কে জেনে নিন। ছোট ফি অনেক বছরে বড় হয়ে যায়।',

    'dash.hello': 'শুভেচ্ছা! 👋',
    'dash.subtitle': 'এক নজরে আপনার টাকার অবস্থা।',
    'dash.health': 'আর্থিক স্বাস্থ্য', 'dash.health.good': 'মজবুত', 'dash.health.fair': 'এগোচ্ছে',
    'dash.health.weak': 'যত্ন দরকার',
    'dash.incVsExp': 'আয় বনাম খরচ',
    'dash.savings': 'জরুরি তহবিল', 'dash.goalProgress': 'লক্ষ্যের অগ্রগতি',
    'dash.insights': 'আপনার জন্য পরামর্শ',
    'dash.scoreParts': 'আপনার স্কোর যা দিয়ে তৈরি',
    'dash.part.cashflow': 'আয়ের মধ্যে খরচ', 'dash.part.savingsRate': 'সঞ্চয়ের হার',
    'dash.part.debt': 'ঋণের চাপ', 'dash.part.emergency': 'জরুরি তহবিল', 'dash.part.goals': 'লক্ষ্য',
    'dash.savedMonth': 'মাসে সঞ্চয়',
    'dash.noGoals': 'এখনো কোনো লক্ষ্য নেই। "লক্ষ্য" থেকে যোগ করুন।',

    'ins.noIncome': 'আপনার আয় যোগ করুন, তাহলে আমরা পরিকল্পনা ও ব্যক্তিগত পরামর্শ দিতে পারব।',
    'ins.shortfall': 'এখন প্রতি মাসে আয়ের চেয়ে ৳{amount} বেশি খরচ হচ্ছে। কমানো যায় এমন একটি পরিবর্তনশীল খরচ দিয়ে শুরু করুন। ছোট পরিবর্তনও কাজে দেয়।',
    'ins.dti.warn': 'ঋণের কিস্তিতে আয়ের {pct}% যাচ্ছে। এটি ৩০%-এর নিচে না নামা পর্যন্ত নতুন ঋণ এড়িয়ে চলুন।',
    'ins.dti.danger': 'ঋণের কিস্তিতে আয়ের {pct}% যাচ্ছে, যা ভারী। আগে সবচেয়ে দামি ঋণটি শোধে মন দিন, নতুন ঋণ নেবেন না।',
    'ins.highInterest': 'আপনার একটি ঋণের সুদের হার খুব বেশি। তাড়াতাড়ি শোধ করলে সত্যিই টাকা বাঁচবে।',
    'ins.ef': 'আপনার জরুরি তহবিল {months} মাসের লক্ষ্যের {pct}%। প্রতি মাসে ৳{monthly} জমালে ধীরে ধীরে পৌঁছে যাবেন।',
    'ins.efDone': 'আপনার জরুরি তহবিল সম্পূর্ণ। এটি একটি মজবুত ভিত্তি!',
    'ins.savingGreat': 'আপনি আয়ের প্রায় {pct}% সঞ্চয় করতে পারেন। চমৎকার, এভাবেই চালিয়ে যান!',
    'ins.savingSome': 'প্রতি মাসে আপনার ৳{amount} বাকি থাকে (আয়ের {pct}%)। এর কিছু অংশ জমালেও নিরাপত্তা বাড়ে।',
    'ins.goal': 'পরিকল্পিত গতিতে “{name}” আর প্রায় {months} মাস দূরে।',
    'ins.bigCategory': '{cat}-এ আয়ের {pct}% যাচ্ছে। এখানে কিছু সাশ্রয়ের সুযোগ আছে কিনা দেখুন।',

    'learn.title': 'শিখুন',
    'learn.lessons': 'টাকার মূল বিষয়', 'learn.lessonsSub': 'সহজ ভাষায় ছোট পাঠ। পড়তে কার্ডে চাপুন।',
    'learn.read': 'পড়ুন', 'learn.close': 'বন্ধ করুন', 'learn.tryThis': 'চেষ্টা করুন',
    'l1.t': 'কেন সঞ্চয়?', 'l1.b': 'সঞ্চয় মানে টাকার একটি অংশ ভবিষ্যতের জন্য রেখে দেওয়া। এতে হঠাৎ বিপদ বড় সংকট না হয়ে ছোট সমস্যা হয়ে যায়, আর ধীরে ধীরে স্বপ্নগুলো সম্ভব হয়।', 'l1.x': 'আগে নিজেকে দিন: টাকা হাতে আসার দিনই খরচের আগে অল্প কিছু আলাদা করুন। ২০০ টাকাও গুরুত্বপূর্ণ।',
    'l2.t': 'আপনার নিরাপত্তা জাল', 'l2.b': 'জরুরি তহবিল হলো শুধু সত্যিকারের বিপদের টাকা: অসুখ, কাজ হারানো, জরুরি মেরামত। এটি থাকলে বিপদে চড়া সুদে ধার করতে হয় না।', 'l2.x': 'এটি দৈনন্দিন টাকা থেকে আলাদা রাখুন, যেমন আলাদা হিসাব বা মোবাইল ওয়ালেটে।',
    'l3.t': 'প্রয়োজন বনাম চাওয়া', 'l3.b': 'প্রয়োজন হলো যা না হলেই নয়: খাবার, ভাড়া, ওষুধ। চাওয়া হলো যা থাকলে ভালো। দুটোই ঠিক আছে, তবে প্রয়োজন আগে। বাজেট শুধু আগে থেকে সিদ্ধান্ত নিতে সাহায্য করে।', 'l3.x': 'কিছু কেনার আগে একদিন অপেক্ষা করুন। কালও চাইলে হয়তো কেনাটা সঠিক।',
    'l4.t': 'সুদ কী?', 'l4.b': 'সুদ হলো টাকা ব্যবহারের দাম। ধার নিলে আপনি সুদ দেন। ব্যাংকে জমালে ব্যাংক আপনাকে সুদ দেয়। হারটি বছরে শতকরা হিসেবে লেখা থাকে।', 'l4.x': 'বছরে ২০% সুদে ১০,০০০ টাকা ধার নিলে এক বছরে প্রায় ২,০০০ টাকা বেশি দিতে হয়।',
    'l5.t': 'ঋণ বোঝা', 'l5.b': 'ঋণ সবসময় খারাপ নয়। আয় বাড়ায় এমন সেলাই মেশিনের ঋণ কাজে আসে। কিন্তু দৈনন্দিন খরচের ঋণ ফাঁদে ফেলতে পারে। সব কিস্তি মিলিয়ে আয়ের ৩০%-এর নিচে রাখার চেষ্টা করুন।', 'l5.x': 'একাধিক ঋণ থাকলে সবগুলোর ন্যূনতম কিস্তি দিন, তারপর বাড়তি টাকা সবচেয়ে বেশি সুদের ঋণে দিন।',
    'l6.t': 'মূল্যস্ফীতি', 'l6.b': 'মূল্যস্ফীতি মানে সময়ের সাথে দাম বাড়ে, তাই একই ১০০ টাকায় আগামী বছর কম জিনিস পাওয়া যায়। বালিশের নিচে রাখা টাকার মূল্য ধীরে ধীরে কমে। সুদ পাওয়া যায় এমন জায়গায় সঞ্চয় করলে তা কিছুটা রক্ষা পায়।', 'l6.x': 'দাম বছরে ৯% বাড়লে আজকের ১,০০০ টাকার বাজার আগামী বছর প্রায় ১,০৯০ টাকা হবে।',
    'l7.t': 'বিনিয়োগের প্রাথমিক কথা', 'l7.b': 'বিনিয়োগ মানে এমন কিছুতে টাকা রাখা যা বাড়তে পারে, যেমন ব্যবসা, সঞ্চয়পত্র বা ফান্ড। বেশি লাভের সম্ভাবনার সাথে সবসময় ক্ষতির ঝুঁকিও বেশি থাকে।', 'l7.x': 'শুধু সেই টাকা বিনিয়োগ করুন যা কয়েক বছর লাগবে না। জরুরি তহবিলের টাকা কখনো নয়।',
    'l8.t': 'বৈচিত্র্য (ঝুঁকি ভাগ করা)', 'l8.b': 'বৈচিত্র্য মানে সব ডিম এক ঝুড়িতে না রাখা। টাকা বিভিন্ন জায়গায় ছড়িয়ে থাকলে একটির খারাপ ফলে সবকিছু নষ্ট হয় না।', 'l8.x': 'একটি বড় বিনিয়োগের বদলে ভাগ করুন: কিছু নিরাপদ সঞ্চয়ে, কিছু দীর্ঘমেয়াদি বিকল্পে।',

    'scam.title': 'প্রতারণা যাচাই',
    'scam.subtitle': 'এমন কোনো প্রস্তাব পেয়েছেন যা শুনতে বেশি ভালো লাগে? যেগুলো সত্যি, সেগুলোতে টিক দিন।',
    'scam.f1': 'নিশ্চিত বা খুব বেশি লাভের প্রতিশ্রুতি দেয় (যেমন “টাকা দ্বিগুণ”)',
    'scam.f2': 'দ্রুত সিদ্ধান্ত নিতে চাপ দেয় (“শুধু আজকে”)',
    'scam.f3': 'ঋণ, চাকরি বা পুরস্কারের আগে অগ্রিম ফি চায়',
    'scam.f4': 'এজেন্ট বা প্রতিষ্ঠান নিবন্ধন বা লাইসেন্স দেখাতে পারে না',
    'scam.f5': 'আপনার পিন, ওটিপি বা পাসওয়ার্ড চায়',
    'scam.f6': 'নতুন সদস্য আনলে টাকা দেয়',
    'scam.f7': 'হঠাৎ ফোন, এসএমএস বা সোশ্যাল মিডিয়ায় যোগাযোগ করেছে',
    'scam.f8': 'পরিবারের কাছ থেকে গোপন রাখতে বলে',
    'scam.r0': 'কোনো সতর্কসংকেতে টিক দেওয়া হয়নি। তবুও টাকা দেওয়ার আগে প্রতিষ্ঠানটি নিবন্ধিত কিনা যাচাই করুন।',
    'scam.r1': 'সাবধান। এই প্রস্তাবে একটি সতর্কসংকেত আছে। টাকা দেওয়ার আগে প্রশ্ন করুন এবং বিশ্বস্ত কারো সাথে কথা বলুন।',
    'scam.r2': 'উচ্চ ঝুঁকি: এটি প্রতারণা বলে মনে হচ্ছে। টাকা পাঠাবেন না, কোড দেবেন না। আগে পরিবার বা ব্যাংকের সাথে কথা বলুন।',
    'scam.tips': 'নিরাপদ থাকুন',
    'scam.tip1': 'আসল ব্যাংক বা বিকাশ/নগদ কখনো আপনার পিন বা ওটিপি চায় না।',
    'scam.tip2': 'কোনো সৎ বিনিয়োগ বেশি লাভের নিশ্চয়তা দিতে পারে না।',
    'scam.tip3': 'সময় নিন। আসল প্রস্তাব কালও থাকবে।',
    'scam.tip4': 'প্রতারণার অভিযোগ জানাতে আপনার ব্যাংক বা পুলিশে (৯৯৯) যোগাযোগ করুন।',

    'set.title': 'সেটিংস', 'set.export': 'আমার তথ্য ডাউনলোড করুন (JSON)', 'set.reset': 'আমার সব তথ্য মুছুন',
    'set.resetConfirm': 'এই ডিভাইসে সংরক্ষিত সব তথ্য মুছে যাবে। চালিয়ে যাবেন?',
    'set.editIncome': 'আয় সম্পাদনা', 'set.privacy': 'সব তথ্য শুধু এই ব্রাউজারে সংরক্ষিত। কোনো সার্ভারে পাঠানো হয় না।',
    'set.demo': 'নমুনা তথ্য লোড করুন'
  }
}

// ---------------------------------------------------------------------
export function lang() { return getState().user.language }

/** Translate a key. Params replace {name} placeholders. Numbers become localised. */
export function t(key, params = {}) {
  const l = lang()
  let s = STRINGS[l]?.[key] ?? STRINGS.en[key] ?? key
  return s.replace(/\{(\w+)\}/g, (_, k) => {
    const v = params[k]
    if (v === undefined) return ''
    return typeof v === 'number' ? num(v) : String(v)
  })
}

const BN_DIGITS = '০১২৩৪৫৬৭৮৯'
/** Format a number with thousands separators (Bangla digits when lang = bn). */
export function num(n, opts = {}) {
  if (!Number.isFinite(n)) return '∞'
  const s = Math.round(n).toLocaleString('en-IN', opts) // South-Asian grouping: 1,00,000
  return lang() === 'bn' ? s.replace(/\d/g, (d) => BN_DIGITS[d]) : s
}
/** "৳20,000" */
export function money(n) { return '৳' + num(n) }
/** "12 months" / "১২ মাস" · "1 year 3 months" style kept simple on purpose */
export function duration(months) {
  if (!Number.isFinite(months)) return t('common.never')
  if (months === 1) return t('common.month1')
  return t('common.months', { n: months })
}
/** Month + year label, e.g. "March 2027" / "মার্চ ২০২৭" */
export function futureMonth(monthsAhead) {
  const d = new Date()
  d.setMonth(d.getMonth() + monthsAhead)
  return d.toLocaleDateString(lang() === 'bn' ? 'bn-BD' : 'en-GB', { month: 'long', year: 'numeric' })
}

/** Fill every [data-i18n] element under root. Call after rendering. */
export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n) })
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder) })
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)) })
  document.documentElement.lang = lang()
}

export function setLanguage(code) {
  if (!LANGUAGES.some((l) => l.code === code)) return
  update((s) => { s.user.language = code })
}

/**
 * Language toggle component (segmented EN | বাং). Returns an HTML string.
 * Wire-up is global: any [data-set-lang] click switches language (see app.js).
 */
export function languageToggle() {
  return `<div class="lang-toggle" role="group" aria-label="${t('lang.label')}">
    ${LANGUAGES.map((l) => `<button type="button" data-set-lang="${l.code}" aria-pressed="${lang() === l.code}"
      class="${lang() === l.code ? 'is-active' : ''}" lang="${l.code}">${l.short}</button>`).join('')}
  </div>`
}
