# Peer Prediction Markets

TL;DR – Prediction markets, as we know them today, show us just one slice of what a group knows, and they break down whenever settlement is messy. Peer prediction markets, incentivised through Bayesian Truth Serum (BTS) and powered by privacy‑preserving tools, surface a much richer picture of collective belief (including tails and variance) while sidestepping reliance on third‑party real‑world oracles. Peer prediction markets are friendlier venues for hard questions (from the truthfulness of a statement on AI doom to the next CPI print) and they protect contributors from herding and reputational risk. [@OlasProtocol](https://x.com/@OlasProtocol) are building such a Peer Prediction Market on Starknet.

## A 41 % Chance of Human Extinction?

On an ordinary Tuesday, a motley Telegram channel of AI researchers and armchair futurists polls itself on p(doom), the probability that advanced AI wipes us out before 2100. The mean lands at 41 per cent. Interesting, but what does that really tell us? How many think the risk is negligible? How fat is the tail at 90 %? And, grimly, who is going to pay out if the pessimists are right?

So far, classical prediction markets have been our sharpest tool for turning disagreement into numbers. Yet they stumble the moment the outcome is unobservable or the incentives to speak plainly are weak. Enter peer prediction markets, the next generation of collective‑intelligence infrastructure.

## How Classical Prediction Markets Work

A modern prediction market is based on a settlement contract that functions, in essence, like a vending machine for probabilistic assets. Deposit one unit of collateral, like 1 USDC and the contract mints an n‑tuple of outcome tokens.

- Binary → (1 YES, 1 NO)
- Categorical → (1 APPLE, 1 ORANGE, 1 BANANA, …)
- Scalar → (UP, DOWN) or (LONG, SHORT) and a [min, max] range

Return the full unit token set at any time, and you recover the unit collateral. Once the real‑world result is known, the branch that matches reality becomes redeemable for the entire unit on its own, while the rest expire worthless. Arbitrage across those states is what drags prices towards the crowd‑implied probability.

Two pillars must be immovable:

1. Deterministic settlement logic – the oracle, dispute window, and time‑to‑live must be fixed up front. For followers of Polymarket, there is at least one lesson to be learned from what happens when the "winner" is left fuzzy (cc: suitgate).
2. Collateral integrity – traders must always know and verify that a matched tuple always converts back to its underlying asset; otherwise, the market merely imports counterparty risk.

With the contract specified, you still need a venue for price discovery. On-chain builders choose either CLOBs or AMMs (with a preference for CLOBs). Either mechanism suffices, provided it allows liquidity and belief to flow until prices converge.

This canonical design is elegant, but as we shall see next, it exposes two blind spots that peer prediction markets aim to close.
## Gap #1 One Slice of a Bigger Pie
Classical markets are brilliant at surfacing a point estimate but largely mute on the shape of collective belief. In a binary contract, the mid‑price is simply the implied probability; in a scalar AMM, say a $‑per‑basis‑point CPI market, the clearing price hovers at the crowd's expected print. What remains invisible is the distribution around that point: are traders tightly clustered around 2.1 % or is there a wide, bimodal rift between deflationists and stagflation hawks?

Why does that matter? Because real‑world decisions live in the tails. A 41 % mean for p(doom) could be the midpoint of a gentle bell curve or a knife‑edge blend of "certain extinction" and "near‑zero risk" camps. Policymakers setting AI governance thresholds, reinsurers writing catastrophe coverage, and even chip-makers pondering hardened fabs all need to know how much mass sits beyond 80%, not just where the midpoint lies.

Formally, we are concerned with the higher moments, namely the variance (spread), skew (asymmetry), and kurtosis (tail weight). These dimensions are unidentifiable from price time‑series alone; even liquidity‑weighted order‑book depth only hints at them indirectly. Traders wishing to express a view on dispersion must resort to exotic side bets or, more often, stay silent.

Put differently, binary and scalar markets carve out a single cross-section through a multi-dimensional probability landscape. Peer prediction markets, incentivised through Bayesian Truth Serum, allow the probability distribution to emerge without complex option scaffolding.

## Gap #2 The Settlement Paradox
A prediction market lives or dies by its oracle, yet many of the questions we most care about resist neat verification.
- Unverifiable end‑states – "Will AGI end civilisation?" leaves no claimant standing to redeem a winning coupon.
- Long‑horizon payoffs – Questions like "Sea‑level rise in 2150" or "Who governs Mars in 2080?" require locking capital for decades and are liquidity poison.
- Privileged information – "Does Senator Sanders privately support Bill PN55-6?" can be known, but only through a diary leak, subpoena, or whistleblowing.
- Subjective judgements – ESG ratings, artistic success, and even perceived inflation hinge on personal or cultural lenses.
When settlement is slow, costly or politically fraught, classical markets haemorrhage trust. Spreads widen to price oracle risk, liquidity deserts the book, and bad actors can profit merely by seeding doubt. Each disputed outcome dents the protocol's credibility.

Peer prediction markets circumvent this chokepoint by self-settling. Every participant's report becomes part of the payout calculus. Rather than litigating an external truth, the contract rewards internal consistency and information novelty. That makes it possible to interrogate precisely the topics that traditional venues must ignore.

Uncoupling settlement from a hard oracle unleashes a long tail of questions (e.g. existential, reputational, speculative) that are otherwise off‑limits. Once you see this, you realise the real frontier for markets isn't sharper oracles; it's protocols that thrive even when no oracle exists.

## Enter Peer Prediction Markets
A peer prediction market flips the script. Instead of deferring to an outside oracle, the market settles itself by analysing how each participant's report compares with the aggregate. The engine under the hood is the Bayesian Truth Serum (BTS).

Early peer‑prediction mechanisms like pair‑wise proper‑scoring rules, Schelling‑point voting, and plain majority bonuses ran into two stubborn incentive failures:
1. Popularity pull meant safe, mainstream answers minimised variance, so genuinely new information was discouraged.
2. Reflexive equilibria. If everyone tries to predict the crowd, answers can spiral into self‑fulfilling loops or multiple brittle equilibria.

BTS neutralises both by paying on two orthogonal axes: information novelty and prediction accuracy. Reporting something rare but wrong (or something popular but perfectly forecast) earns only half the prize. The unique strategy that maximises expected utility is therefore to (i) state your true belief and (ii) offer your best forecast of the distribution. That single, focal equilibrium tidies the entire incentive landscape.

In formal terms, BTS is strictly proper for the joint task, ex-post budget-balanced (all payouts come from participants, with no protocol subsidy), and coalition-robust under common priors. Unlike classical prediction markets, which rely on capital-weighted bets and can exclude low-risk contributors, BTS extracts truthful signals even from participants with minimal bankrolls. Truth, rather than wealth, steers the outcome.

BTS in a Nutshell

1. Every participant submits:
	- Their belief (e.g. “I think p(doom) is 30 %.”)
	- Their forecast of everyone else's belief (e.g. "I reckon the average answer will be 50 %.")
2. After the deadline, the protocol scores each entry as:
	- Information score – You earn more the rarer (and thus more informative) your answer is.
	- Prediction score – You earn more the closer your forecast is to the actual distribution.
3. The sum is your payoff. Under fairly mild assumptions, being honest maximises your expected reward; that's a Bayesian‑Nash equilibrium.

ELI5 version: The market pays you when you say something surprising and correctly guess what others will say. Bluffing rarely pays; honest insight does. What Olas ends up with is a merging of prediction markets and cutting edge forecasting/decision science in a single protocol.

## Why Privacy Is the Enabler, Not a Bolt‑On
Markets that expose raw order flow or individual answers create a game within the game. The first movers reveal their hand; everyone else can copy-paste, coordinate, or punish. Three pathologies follow:
1. Early votes anchor expectations, so later participants tend to cluster near the visible mean, driven by herding inertia, and the tails tend to dissipate.
2. Domain experts with reputations to protect opt out rather than publish an outlier that could be career-limiting, leading to strategic silence.
3. Retaliation risk. On polarised questions like party politics, whistleblowing, or boardroom sentiment, a wallet address becomes a political dossier.

Sealing answers until the book closes restores simultaneity and, with it, honest revelation. On‑chain, we can achieve that with a three‑layer cryptographic shield:
- Commit–reveal hashes fix the submission immutably while hiding its contents until revealed.
- Zero‑knowledge proofs show your entry is well‑formed (e.g. an integer 0–100) without exposing the value.
- Anonymity mixers or stealth addresses sever the link between answer and payout, deterring doxxing.

Only after expiry does a decrypted aggregate emerge. The crowd sees the complete distribution, but never the mapping back to individuals. Bad data cannot slip through: if a proof fails, the contract reduces the bond before final scores are calculated.

From an incentive lens, privacy super‑charges BTS. Because payoffs depend on how informative and predictive your answer is, you actively want to avoid seeing others' reports; opacity removes the temptation to mimic the median for a safe result. Privacy is, therefore, not a cosmetic add‑on; privacy is the mechanism that turns BTS's theoretical equilibrium into a practical one.

Think of it as the secret ballot of information finance. Without privacy, you get crowd‑pleasing speeches; with it, you get the electorate's real mind.

Confidentiality and anonymity are the scaffolding on which truthful crowds stand.

## Mapping p(doom) Without Doomsday

A peer prediction market for AI‑induced extinction could run like this:
1. Setup – The market opens for one week. Participants stake 1 USDC (or equivalent) and submit a belief + forecast.
2. Expiry – At the deadline, the smart contract computes the full distribution, including the mean, variance, skew, kurtosis, and more.
3. Payout – BTS scores are calculated; winnings are paid in the same currency. No external oracle needed; no apocalypse required.

Policymakers get a richer risk profile, researchers spot consensus gaps, and doomers can't unduly sway the curve by shouting the loudest.

## Five Domains Where Peer Prediction Shines
Peer prediction markets are not a one‑trick fix for existential angst; they are a general‑purpose lens for collective uncertainty. In my mind, five distinct domains showcase what a distribution‑first view unlocks.
1. Existential & Catastrophic Risk – From runaway nanotech to rogue climate feedback loops, the tails matter far more than the mean. A peer market reveals whether experts quietly assign 5% or 25% probability to worst-case pathways, guiding how aggressively to fund mitigation.
2. Macro‑economic & Financial Forecasts – CPI prints, GDP nowcasts, or sovereign default probabilities usually appear as a headline consensus number. Seeing the skew tells a central‑bank desk whether traders fear disinflation on the left or inflation shocks on the right, and kurtosis flags how fragile that consensus really is.
3. Governance & Public Policy – Questions like "Will Senator King vote for the AM‑Radio Bill?" or "Is Statement X factually correct?" lack a cheap external oracle yet can shape legislation and public trust. BTS‑powered markets let insiders share probabilistic intelligence without exposing their sources, and the resulting spread signals how contested a claim truly is.
4. Knowledge Verification & Fact‑Checking – Real‑time news claims, Wikipedia edits, or scientific pre‑print assertions gain credibility when a crowd of field specialists wagers on their truthfulness. A tight distribution around 95 % says the statement is near‑settled; a flat, bi‑modal curve warns editors and journalists to tread cautiously.
5. Meme & Cultural Temperature Checks – Whether a silverback could defeat 100 humans or which pop‑star album will age best may sound frivolous. Yet, the variance of such markets is a goldmine for sociologists. High dispersion signals fault lines in cultural tribes; rapid convergence reveals where a joke has crystallised into shared lore.

Across these five buckets, the common dividend is shape awareness. We learn not just what the crowd thinks, but also how confidently and where disagreement lies. That richer picture is impossible to obtain from price data or polls alone; it is the comparative advantage of peer prediction protocols.

## Considerations for Protocol Designers
Designing a peer prediction market is a combination of protocol engineering and editorial craft. Begin with the prompt. Every loose adjective, undefined unit, or fuzzy time horizon injects noise directly into the distribution you are trying to measure. Spell out the domain, measurement scale, and expiry conditions up front; only then are traders bidding on their view rather than on your ambiguities.

Privacy is not a garnish but the structural beam that holds the room up. Encryption, one-shot commitment hashes, succinct zero-knowledge proofs, and deep MACI integration are the tools that enable participants to reveal insight without revealing their identity. When the reputational downside is removed from the calculus, sharp outliers feel as safe speaking as cautious centrists, and the market gains the variance it needs to map reality.

Finally, commit to open data the moment the book closes. Publish the anonymised belief distribution, scoring parameters, and audit trails so that anyone can verify the outcome. Transparency reinforces trust. Contributors see that their information has moved the curve, researchers can stress-test the methodology, and designers have a feedback loop for continual, prompt refinement.

## Trade Your Truth
If you've ever rolled your eyes at noisy polls or wished you could peek at the whole crowd's belief, peer prediction markets are the friendly venue for this and more. [@OlasProtocol](https://x.com/@OlasProtocol) is actively building a peer prediction market on Starknet that embodies these principles, using Bayesian Truth Serum to incentivise honest signals and privacy tools to protect participants. By leveraging Starknet's scalability and low costs, Olas makes it easier for anyone to contribute to collective intelligence on tough questions. Collective intelligence is richest when everyone can speak frankly and settle fairly.