
Privacy on Starknet Pt. 2 | Private Computation & Pokémon (Stwokémon)

![Image](https://pbs.twimg.com/media/GjMl1DEWcAA1N1i?format=jpg&name=small)





](https://pbs.twimg.com/media/GjMl1DEWcAA1N1i.jpg)

Much, if not all, of this article is inspired by many conversations with Provable Games & Cartridge.

Last week’s article introduced the world of on-chain privacy by exploring design patterns for anonymity and confidentiality. Today, we’re taking a playful detour into private off-chain computations. Imagine playing your very own Pokémon game, where every encounter, move, and battle is both secret and provably fair. Stwo makes this a reality, as anyone can run complex game logic off-chain and prove to everyone on-chain that they played by the rules—and they need not reveal any inkling of how they achieved it!

There is off-chain proving in the on-chain confidentiality and anonymity design patterns, but those design patterns can involve smaller computational sizes. Proving you are conserving value in a confidential transaction is much less computation than an hour of battling the Elite Four! STARKs are damn good at scaling, so let’s quickly refresh ourselves on what that means.

## Proving System Recap

Imagine a scenario where instead of grading an exam by checking all 100 answers, a professor only has to do the equivalent work of marking 2 or 3 questions and still knows that the student aced the test. That’s partly the magic of proving systems; a verifier can efficiently check the work without re-executing. In our Pokemon world, a verifier would efficiently check the user earned a set amount of XP, beat a gym, lost to the Elite 4, encountered a shiny Pokemon, and didn’t access new parts of the map they have yet to unlock. Starknet, being the verifier, can efficiently & inexpensively verify a significant amount of computation. “[A single reliable PC can monitor the operation of a herd of supercomputers](https://dl.acm.org/doi/10.1145/103418.103428).” With STARKs, we’re harnessing this power to scale verifiable computation—and it’s precisely what makes off-chain games possible without sacrificing trust or privacy.

Stwo is blazingly fast and the enabler of these provable off-chain games; this means that:

- Players only need to interact with Starknet when they want to begin a new game session or save their game state.
- The nitty-gritty details of your in-game behaviour—how you navigated the map, battled wild Pokémon, speed ran a  [nuzlocke](https://bulbapedia.bulbagarden.net/wiki/Nuzlocke_Challenge), or executed a perfect strategy—can remain off-chain. Only a succinct cryptographic proof is later published on-chain, keeping your gameplay private and verifiable.

## Stwokemon: An Off-Chain Pokémon Game Under Lock and Key

[

![Image](https://pbs.twimg.com/media/GjMWvLPWgAAimzz?format=jpg&name=medium)





](https://pbs.twimg.com/media/GjMWvLPWgAAimzz.jpg)

Let’s break down how a Pokémon-inspired game might work in this new paradigm.

[Some of you may remember this from my Q5 project series!](https://x.com/franklyteddy/status/1872798855630365125)

Traditional Pokémon games use a pseudo-random number generator (PRNG) to decide everything from which Pokémon appears in the tall grass to NPC behaviour. Here’s how we can translate that into our off-chain, provable computation world:

### Starting the Adventure & Seeding the Game

When you start your Neudo-random generator with a Verifiable Random Function (VRF) output. This VRF seed is published on-chain (for my security friends, I know if the user can see the seed, theyN can have a much more significant influence on the gameplay, but stay with me now. I have an idea below!). What a VRF allows for is

- Unpredictability is something nobody (not even the user) can predict or determine the game session’s seed.
- The seed is provably generated as specified, ensuring fair play from the start.
- Interestingly, this puts a value on seed hacking; if you want to find a shiny Lugia, there will be a lot of VRF calls!). 

### The Heart of the Game - A Linear Congruential Generator (LCG)

Behind the scenes, the game uses an LCG—a simple algorithm (a recurrence relation) that generates a long string of “random” numbers based on the initial seed. Every game action (like stepping through tall grass or engaging in a battle) advances the LCG.

[Here's a quick explainer](https://x.com/franklyteddy/status/1872798855630365125)

. Consider this simplified example:
- Initialisation: Let’s say the seed is X₀ = 1000.
First Move: When you take your first step, the game computes: X₁ = (1103515245 × X₀ + 12345) mod 2³²

- Suppose this gives us X₁ = 4003629569. To decide if you encounter a wild Pokémon, the game might only use a portion of X₁—for example, the upper 16 bits, which might yield a value like 61127. If this number exceeds a threshold (say, 30000), boom—a wild Pokémon appears!
- Which Pokemon appears, the wild Pokemon’s stats and the likelihood of catching the Pokemon are constrained by this sequence!
- Each move or battle event advances the RNG further, and every single action alters the entire sequence of upcoming “random” events. Understanding the sequence is key in a world where every extra step can change your fate—even for speedrunners and RNG manipulators.

### Preventing Manipulation with TEEs and on-chain Diffie-Hellman

A natural concern in any game is manipulation. If players could influence the random outcomes (say, by hacking the RNG), they’d have an unfair advantage. Here’s how we secure the game:

- The on-chain VRF ensures the seed is unpredictable and verifiable.
- Trusted Execution Environments (TEEs) are secure hardware enclaves that keep secrets safe. The TEE runs the off-chain game logic, including all RNG calls, in an environment shielded from tampering.
- Diffie-Hellman Exchange: To further secure the seed, the TEE and the on-chain VRF can perform an on-chain Diffie-Hellman key exchange. This allows only the TEE to derive our game’s seed without exposing sensitive information to the player. The TEE’s private key never leaves the secure hardware, ensuring that the seed (and thus every game event) is beyond external influence.

### Proofs, Verification, and the On-Chain Gatekeeper

Once the game session concludes, the TEE compiles a cryptographic proof of every game event—from the initial VRF seed to each RNG call. This proof is then submitted to an on-chain verifier smart contract, which:
- The smart contract verifies that the new state was achieved per the game's rules using the publicly available VRF output, the TEE’s public key, and the predetermined game logic.
- Game results (such as earned rewards or progression) are considered final if the proof is valid. Otherwise, the outcome is rejected, preserving fairness in the game.
##  How would “Stwokemon” Actually Work?

I think the best design pattern for this would be equivalent to Starknet’s. In many ways, these Stwokemon instances are ephemeral app chains on Starknet with a single user base. If you saw my Starknet ELI5 tweet, this should be familiar, too!

### Level 1: Bird’s-Eye View — The Local Chain

- The local game state is a “chain”, & each time you perform an operation in Stwokemon (move, battle, catch, etc.), those operations form a batch that updates your local game state from, say, State 3 to State 4.
- The Game Session Executor keeps track of your party, items, and position on the map. Crucially, it also runs the LCG (Linear Congruential Generator) locally. Think of it as a mini “sequencer” that takes in your operation batch, updates the RNG, and produces the next state.
- After each batch, the executor emits “metadata” describing the incremental changes. In Stwokemon, this metadata is captured as a Conflict‐Free Replicated Data Type (CRDT)—structures like grow‐only counters for XP and sets for your Pokémon storage (Bill’s PC). Each operation batch thus yields a CRDT delta that can be merged (or “squashed”) with other deltas if needed.

Just as Starknet produces blocks on-chain, your local chain grows by adding these operation batches and creating new states. The difference is that everything happens off-chain in your private game session, with cryptographic proofs generated behind the scenes (yes, with Stwo!).

[

![Image](https://pbs.twimg.com/media/GjMVOd6WQAE6Z-b?format=jpg&name=medium)





](https://pbs.twimg.com/media/GjMVOd6WQAE6Z-b.jpg)

### Level 2: Inside the Executor — Running the Cairo VM & LCG

- Per-Operation LCG Calls happen whenever you perform an action—like stepping onto tall grass—the executor advances the LCG and determines whether a wild Pokémon appears, which species, its stats, or how an NPC behaves in battle, etc.
- After processing all operations in the batch, the executor outputs:

1. An Execution Summary of what transpired (e.g., Pokémon caught, XP gained).
2. The following state (State 4 in the diagram).
3. CRDT Metadata that encodes the changes (e.g., +1 Pokémon in Bill’s PC).

- This metadata is then applied to the prior state to create the new state in your local game. Importantly, because CRDTs merge changes conflict-free, partial updates from different branches (think offline sessions or multiple device sessions) can later be reconciled.

[

![Image](https://pbs.twimg.com/media/GjMVfGTX0AAKpM3?format=jpg&name=medium)





](https://pbs.twimg.com/media/GjMVfGTX0AAKpM3.jpg)

Essentially, the executor is your local “Pokémon OS runtime” that ensures every step adheres to game rules (e.g., you can’t use a Pokémon you don’t own or skip directly to Victory Road if you haven’t cleared earlier routes).

### Level 3: PokeOS — Validating Off-Chain Batches

- “PokeOS” can be thought of as a Cairo program that re-checks the validity of each operation batch. It starts from a known state S, a specific LCG sequence R, and a batch of operations B. If everything lines up (i.e., you used only valid Pokémon, the RNG calls match, etc.), PokeOS certifies that going from State 3 to State 4 is legitimate.
- This check results in a detailed “PokeOS Trace” plus the same CRDT metadata. This trace and the associated metadata feed into Stwo, which generates proof that “yes, the state transition from S3 to S4 happened correctly under these RNG conditions.”
- Why CRDTs? CRDT-based metadata ensures that if you have parallel branches of gameplay (say, playing from multiple devices), merging them offline or on-chain is conflict‐free. PokeOS simply re‐verifies and merges the resulting CRDT deltas at proof time.
[

![Image](https://pbs.twimg.com/media/GjMVlKqWAAECfEd?format=jpg&name=medium)





](https://pbs.twimg.com/media/GjMVlKqWAAECfEd.jpg)

### Level 4: Pokémon Applicative Recursion (PAR) — Squashing Everything

- Once you have several certified transitions (e.g., S0 → S1, S1 → S2, S2 → S3, etc.), PAR “squashes” all the proofs and CRDT metadata into a single root proof plus a single merged state. Conceptually, PAR merges child proofs and the corresponding CRDT deltas—no matter how many steps you take.
- At the root, the “Pokemon Applicative Bootloader” creates a single aggregated proof that says: All the transitions from S₀ up to Sₙ are valid, and here is the final squashed CRDT representing the state after all merges. This single piece of metadata captures the combined effect of all your gameplay sessions.
- After squashing, you can post the final “root proof” on Starknet and the merged CRDT state (e.g., your updated Bill’s PC, XP counters, etc.). Because CRDT merges are deterministic and conflict-free, any local or offline sessions can be consolidated with minimal fuss.

[

![Image](https://pbs.twimg.com/media/GjMVquUXwAAyoi8?format=jpg&name=medium)





](https://pbs.twimg.com/media/GjMVquUXwAAyoi8.jpg)

## The Magic of Stwo: Invisible Proving at Lightning Speed

A key ingredient in all this is Stwo—a proving engine so fast that you don’t even realise you’re proving something. Stwo’s ensure:

1. **A Smooth User Experience**. The proof generation happens in the background (e.g., every time you finish a batch or after you accumulate multiple batches). If anything, from a player’s perspective, it could feel like you’re just saving your game—there’s no noticeable lag.
2. **Massive Scalability**. Even if you perform thousands of RNG calls (multiple hours of gameplay), Stwo can efficiently handle the final proof generation. When you hit “sync” or “save” to publish your progress on Starknet, your proof is practically ready.
3. **A Tiny On-Chain Footprint**. Starknet only needs to verify the final PAR proof. Verifying STARK proofs is extremely cost-effective, meaning your complex off-chain gameplay translates to minimal on-chain overhead.

Bringing It All Together

- **Local Execution, Global Verification**. You play Stwokemon locally, generating state updates and CRDT deltas.
- **PokeOS + Stwo + PAR**. Each batch is proved & verified off-chain by PokeOS and finally aggregated by the Applicative Recursion system with Stwo.
- **On-Chain Sync**. You intermittently post your squashed proof to Starknet, which checks it in a fraction of a second. The CRDT metadata is updated on-chain so everyone sees the correct global state.

The net effect is a fully private and provably fair Pokémon experience. You own your gameplay data, and keep your strategy hidden, and yet anyone can confirm you haven’t cheated. And because Stwo’s prover is so fast, you’ll scarcely realize a cryptographic miracle is happening under the hood every time you “save” your game.

Consider Starknet as that simple yet mighty computer keeping tabs on a swarm of high-powered machines (or, in our case, countless off-chain game sessions). With this architecture, players can enjoy a fully featured, immersive Pokémon world that’s as fun as it is fair—without compromising privacy.

Whether you’re a seasoned gamer or just a curious observer, you can appreciate the elegance of cryptographic proofs and verifiable computations. These make our favourite games even more secure in the decentralised world. Happy gaming on Starknet!