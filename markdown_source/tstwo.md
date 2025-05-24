TStwo: A Weekend Side Quest Porting Stwo to TypeScript with Codex

I do plan to write more on this, but these are some quick and dirty thoughts on an AI engineering sidequest I'm finding fun and how I see it and the experience evolving.

## Why I Picked Up This Side Quest

[

![Image](https://pbs.twimg.com/media/GrVhFr6WwAEfFz2?format=jpg&name=medium)





](https://pbs.twimg.com/media/GrVhFr6WwAEfFz2.jpg)

I wanted to see how a mixed AI engineering experience, one that is both local (with Cursor) and cloud-based (with Codex) would be when the task is decidedly not a LeetCode toy. That's what this [TStwo](https://github.com/teddyjfpender/tstwo) repo is, an attempt at porting parts of Stwo's Rust-based repository to TypeScript. My choice of porting Stwo to TypeScript was partly because my thesis was good code begets good code—feed the copier great Rust and watch what spills out the other end; there are few better contexts to provide than good code.

DeepMind's research has been my north star for gauging AI progress, so I decided to review this mixed experience (more specifically, Codex, though) with DeepMind's Levels of AGI lens as I went.

*TL;DR - sparks flew, but we're still one notch shy of fireworks.*

## Reviewing Codex with DeepMind's "Levels of AGI"

The following is a rough, posthumous first attempt at porting Stwo to TypeScript.

**Performance — How strong is it at the exact task?**

Better than the 90th percentile human engineer. Task completion, like Cursor, is way faster too. It tore through boilerplate and started nailing some finite-field arithmetic when primed with Rust snippets.

**Generality — Can it leave its sandbox?**

Is it learning new tasks? Maybe, but not really. One can argue that Codex is learning what Stwo is and how Circle STARKs work. "Artificially Capable Intelligence" is a good description. This project has been great in Rust → TypeScript land because it can already translate Rust to TypeScript. But it wouldn't be possible if I gave it only the Circle STARK paper and expected Stwo to come out the other end.

**Implementation Design — Does it invent a clean architecture?**

Middling. It mirrored some patterns but never asked, "Hey, want to go functional instead?" In hindsight, I should've nudged it toward a more functional programming layout.

**Economically Valuable Work — Would anyone pay for what it produced?**

Yes, at least I did, by learning a ton. Even half-baked, the repo is already a teaching tool for me.

**Autonomy — Fire-and-forget or babysitting?**

Zero autonomy. I'm the helicopter engineering manager in this scenario. One day, after a few hours of unsupervised hacking, I'd like Codex to DM me on Slack to chat about the project; it waits for the next prompt.

Net score: comfortably Level 3, "Artificially Capable" and better than the 90th percentile. Level 4—the one with design creativity—remains out of reach.

## The Actual Mechanics (a.k.a. "So What Did I Do?")

I only properly started this yesterday so I've only managed a couple of things. Specifically that means

1. Repo bootstrap. Set up a TypeScript monorepo mirroring the Rust crate's core/ directory, and left the Rust code comment for context.
2. Prompt routine. Either I hand-picked a root node task (i.e., something that unlocks other tasks, like porting the field ops) or asked Codex to suggest one. Every prompt carried a mini-template—Typescript-style notes, best-practice reminders, and testing guidance.
3. A twelve-hour speed bump. The environment setup for Codex was friction personified. Ditching any setup scripts unlocked real velocity.
4. Two-step dance. Codex spit out TypeScript; Cursor (and my brain) patched any errors and edge cases on the fly. One annoying one was CI hanging on an infinite loop (yikes).

[

![Image](https://pbs.twimg.com/media/GrVgC2PWMAEHshz?format=png&name=large)





](https://pbs.twimg.com/media/GrVgC2PWMAEHshz.png)

Was my effort parallelisable? Not really. Most green-field ports aren't. But every finished module widens the blast radius for parallel work next weekend (or later tonight).

## Velocity Hacks I'm Still Missing

If I could wave a magic feature-flag, Codex would gain:

- Trade-off Tracker. "Want functional purity or raw speed?" Let me pick a branch and remember the alternative. I think this would be fun if it were possible to track all trade-offs in git and have a universe of implementations with different trade-offs (yay combinatorial spaces)
- SME Plug-ins. Could you drop a cryptography-pro agent next to Codex to implement Chaum–Pedersen over STARK curves without me Googling for half a day? Or add an agent with significant Cairo context to help build new contracts? That'd be fun; Agents are the new widgets in workflows.
- Automated Roadmap. Continuous repo analysis that ranks PRs by expected impact—think mempool ordering for code changes.
- Performance Hawk. This past week's AlphaEvolve blog highlights the value of this much. Imagine if Stwo or other important core-tech products had an agent scouring through the codebase, finding 1% improvements every week or month (that'd be equivalent to a ~10x improvement in Stone, since Stwo is 1000x faster than Stone).

These are the accelerants that would be valuable for any GitHub repository.

## Open-Source Etiquette (A Quick Interlude)

Fork the repo, respect the license, and credit the original authors. In DHH's words, OSS is a gift exchange; don't regift without a thank-you note. When possible, give back. Thank you, Stwo engineering team <3.

## What I Took Away (Besides Less Sleep)

[

![Image](https://pbs.twimg.com/media/GrVee_DXIAArLUy?format=png&name=900x900)





](https://pbs.twimg.com/media/GrVee_DXIAArLUy.png)

What I'm missing in the development process is another human. Or maybe just a friend to build with. I really hate building things alone and few things are as fun as building something with someone else. When Codex (or a similar product) gains a that humanness, it'll be crazy cool. Some other things more generally,

- I'm learning, but it's different. I absorbed repo layout wisdom much more than cryptographic nuance. Next up: auto-generate deep-dive docs to close that gap and educate myself.
- There is a new kind of pride emerging. Pre-GPT, finishing a feature felt heroic. I feel like the thrill of this Agent-Oriented Development comes from (1.) steering the AI and making judgment calls it can't yet make, (2.) understanding what the AI has done, and (3.) building a personal relationship with the AI, which makes it feel like a team effort.
- Human-in-the-loop matters. The fun sparks when I focus on architecture or try to discuss or decide if Codex's suggestion is "clever" or "clever but wrong".
## Prompt Craft in Three Points

It is no fun to wait 12 minutes expecting something large only to see a two-line diff file. My advice is to work on that prompt.

1. Know your direction before you write the prompt. North star optional; compass mandatory. You need to know what the hell you're trying to achieve. "Codex, build me a B2B SaaS", ain't it.
2. Template the boring bits. Reusable headers for docs, tests, best practices, and style notes.
3. Good inputs → good outputs. Yes, the cliché is still correct in 2025. That's why I chose to port good code.

## Zooming Out: Tiny Sparks of AGI (And Why That's Fine)

Some argue that AGI will feel underwhelming when it arrives, as progress creeps in stages. I'd agree with that after a weekend (truthfully, it was about 6 hours of real work) with Codex. The line between "assisted porting" and "autonomous development" is already smudging. For me, crossing that boundary in this project requires some scaffolding. Add the velocity hacks above, and the sparks might catch.

When intelligence is abundant, the real puzzle becomes what to build next:

- Use generative benchmarks to simulate the payoff of a code change before writing it.
- Let agents queue potential PRs like high-value transactions, ordered for maximum compound gains.
## Final Musings

TStwo is both a barely there proof-of-concept and an invitation to

1. **Pick a codebase you love or have forgotten about**. Fork it (respect the license) and upload it to Codex. See if you can make some improvements. Add value to Open Source projects.
2. **Seed your AI copilot with rich context**. Leave breadcrumbs for it—comments, examples, tests.    
3. **Design feedback loops early**. Whether it's unit tests that justify the AI through utility functions that make sense.

I'm excited to see where TStwo goes, but I'm more excited about how much Open Source Software in the Starknet ecosystem can win with more of these models and the scaffolding that unlocks velocity and greater knowledge dissemination.