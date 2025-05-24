Privacy on Starknet Pt.1

This is a short (maybe long) introductory, high-level post on "privacy" & simple "privacy" design patterns on Starknet. Because the target audience of this post is less technical, I've omitted considerable details on the contract designs and constraints. For those who are more technical, these details are left as an exercise to convince yourselves.

This is a grounding post. I've got some follow-up blogs planned around accumulators for compliance, zkKYC, and more. These are essential topics to talk about because of their necessity and because the solutions are technically beautiful! Let's get to it, anon!

## Why Do We Need Privacy: Fun Thoughts

Many features, experiences, and design patterns are impossible on public, transparent platforms. Many users do not want to reveal information about themselves or allow themselves to be tracked. To achieve these privacy features on Starknet, a fantastic library called Garaga exists.

For readers familiar with the privacy space (or maybe not), your thoughts might quickly turn toward DeFi. While I'll describe a fun DeFi feature in this post (see the end), forget DeFi for the moment.

Consider the game [Among Us](https://en.wikipedia.org/wiki/Among_Us), for example. It is a popular social deduction game; there is hidden information about players & the goal is to uncover the secret roles of some imposters. With anonymity and confidentiality-focused features, fully on-chain (FOCG) social deduction games are possible. Imagine being an imposter in Among Us, and your transaction that "kills" a crewmember is not anonymous; everyone will know it is you! However, with anonymity, users can orchestrate transactions that obscure who they are.

Maybe I've lost you already. Back to the start we go!

## A Quick Privacy Introduction

Mentioning "Privacy" in broad strokes is lazy. To ground that comment & for your reading pleasure, [A Cypherpunk's Manifesto](https://www.activism.net/cypherpunk/manifesto.html) is a must-read.

A quick disclaimer: users of privacy protocols don't always have "privacy". This might not be obvious to newcomers to the privacy world, but users of privacy protocols tend to shield and unshield depending on what operation they are performing, and viewers may be able to infer from those operations what is happening (or has happened) in the black box. An easy example when users deposit into a privacy-focused ERC20, everyone can see which account deposited and how much. The same applies to withdrawals, too!

![Image](https://pbs.twimg.com/media/GioR9TiXQAAkNIj?format=jpg&name=medium)
](https://pbs.twimg.com/media/GioR9TiXQAAkNIj.jpg)

What most people refer to as "privacy" lives somewhere on a continuum. In my opinion, the topic "privacy" is an interval starting at 0 (things are totally public) and approaches 1 (but not including 1!) – anything that is entirely "private" and available/known only to yourself is a secret. I've got five examples on this continuum to help you build a better mental model of this privacy continuum on Starknet.

[

![Image](https://pbs.twimg.com/media/GioStgJWcAAXHk2?format=jpg&name=medium)





](https://pbs.twimg.com/media/GioStgJWcAAXHk2.jpg)

## Pseudo-anonymity

States on most blockchains like Starknet are public–all data can be read and understood all the time–your balances & transaction histories are viewable by anyone. Still, there is some level of anonymity in these scenarios. For example, while I can see an account contract's balances and transactions, I might not know who that is. Users of networks can obscure their assets and activity across multiple addresses to make observations, making it difficult to know which addresses are yours. Sometimes, the most someone looking at a blockchain can do is guess; pseudo-anonymity is quite popular on UTxO networks like Bitcoin & Cardano, as those networks use [HD wallets](https://hdwallet.readthedocs.io/en/v3.2.3/), which are not always single-address wallets. Users might be familiar with having many accounts with Metamask or Argent, this follows from HD wallets, too!

While it is possible to have pseudo-anonymity on Cardano with multiple addresses, this is often lost because Cardano addresses comprise two key pairs' public components: a spending public key and a staking public key. Wallets usually default to using the same staking key pair across all addresses, and thus, users can be easily tracked.

## Selective Disclosure

If you've looked into the topic of privacy before, you might have seen the example that goes as follows:

- You want to prove you're over 18 without revealing your date of birth or any other information on your form of identity

You can extrapolate this example to many other scenarios, such as:

- You want to prove you're KYC'd without showing who you are or where you're from
- You want to prove you own more than $100 and less than $500 of Bitcoin but don't want to disclose your on-chain address 

More generically, there exists data in your possession that describes you (age, address, travel history, parent names, nationality, phone number, credit score, bank balance, political opinions, etc.). You may want to say something about one or many of those data without revealing anything else–that is selective disclosure. The fewer data revealed (1% vs 85%), or the more you obscure the statement (balance between 100 and 105 vs between 100 and 10,000), the more you move across the privacy continuum towards secrecy.

## Confidential Transfers

I'm sticking to transfers as the main operation to consider here, in an effort to not let complexity loom too large. The semantics start to change toward more UTxO semantics, and the design patterns look more or less to emulate UTxO accounting in accounts.

Moving more towards secrecy now, we can think of confidential transfers as a means of obscuring the amount being spent ("spent" being our first use of UTxO semantics here!), but the public owner (and spender) is viewable.

In such a confidential protocol, you could look at a contract's storage and see, for example, a mapping of a note's hash to an address. Hold up, what's a note? A note represents value and comprises a public owner and some encrypted value. The encrypted value is only recoverable (i.e., it can be decrypted) by the note owner. Here's what a note registry might look like:

[

![Image](https://pbs.twimg.com/media/GioTYWSWcAEgOLN?format=jpg&name=medium)


](https://pbs.twimg.com/media/GioTYWSWcAEgOLN.jpg)

Owners of notes can spend them and, in spending them, create new notes (i.e. outputs) and burn the spent notes (i.e. the inputs). If Alice owns a confidential note, she can send Bob some of it by constructing a transaction that creates two new notes, one of which is a change note to herself and the other of which is the amount she wants Bob to receive.

How would this look on Starknet? A verifier contract constrains the transaction to spend a note; this verifier could be a Noir program verifier (built with Garaga) that checks Alice is the note owner and the transaction conserved value (i.e. no new amount was minted). If the verification passes, then the contract will check to make sure the notes Alice is spending exist in the note registry, and finally, remove the spent notes and add the new notes to the registry. Once the transaction has made it onto Starknet, the contract will emit an event with metadata required by the note owner to recover and decrypt their note.

Now that Bob has received some confidential notes, he or his wallet can scan the note registry and recover the encrypted value of the note to discover how much of an asset he has. For more on this, check out this viewing key thread I posted!

## Anonymous Transfers

I didn't mention it explicitly, but in the confidential transfers, the owner doesn't care that they can be seen using a confidential protocol; more specifically, in the confidential transfers scenario, the transaction fee payer is usually the note owner. In an anonymous transfer protocol, the owner (i.e. spender) of some note should not invoke the spend operation from their account contract on Starknet; that would reveal them! The cool thing about Starknet is that we can remove relayers from the design pattern and that users can proxy as another account (i.e., the protocol itself) to cover the transaction fee.

Stealth addresses allow users anonymity in a protocol. For a quick refresher on stealth addresses, check out this walk-through. Stealth addresses are easy to calculate.

Like confidential transfers, we'll have some note registry again, but everyone can view the note value. The note (or the note creation event must emit) must contain all metadata so the owner can discover if this note is locked at one of their stealth addresses.

[

![Image](https://pbs.twimg.com/media/GioTu09W4AARAun?format=jpg&name=medium)





](https://pbs.twimg.com/media/GioTu09W4AARAun.jpg)

You might think Starknet's native account abstraction is a blocker because we're using stealth addresses, but it's a huge value add. This anonymous transfer protocol can be thought of as a multi-owner account contract where the transfer method allows users to proxy as the contract and spend the contract's balance to cover transaction fees. In an anonymous spend, the note owner proves they are the spender, and that value is conserved in the spend using a zk proof (e.g. a Noir proof verified by Garaga), and the contract will check if the notes spent exist in the registry, remove the spent notes and add the new notes. If you're wondering how this all starts, users first deposit into the contract and create new notes in the note registry at stealth addresses. Here's a diagram for my visual friends:

[

![Image](https://pbs.twimg.com/media/GioUhOcXIAAvN_l?format=jpg&name=medium)





](https://pbs.twimg.com/media/GioUhOcXIAAvN_l.jpg)

## Confidential and Anonymous Transfers

This is the composition of the above two sections. Nobody knows how much one is spending or who is spending it. There exists a note registry that maps note hash to a stealth address. The transfer methods emit events that contain all relevant information to allow receivers to recover the note and check if a stealth address is theirs. Transfer operations are constrained by spenders providing a zk proof of note ownership and value conservation, and in doing so, the user proxies as the contract to cover the transaction fees.

## Anonymous DeFi on Starknet

Today, there are many cool DeFi features on Starknet; DCA and Limit Orders are two great examples. DCA is done using an account contract's execute from outside method, which defines the constraints a user imposes on the executor (e.g., buy $10 of BTC every day for 30 days).

Can we get anonymity here? Well sure! Let's revisit the mental model of the anonymity protocol being a meta multi-owner account. It is possible to define some similar execute from outside methods on this contract, too, and each stealth address owner can specify the constraints of spending a specific note. There are two examples of scenarios here: (1.) ERC20 to Anonymous ERC20 via DCA (2.) Anonymous ERC20 to Anonymous ERC20. In the first scenario, the DCA feature would spend $10 from a user's public balance once per day and send the swapped BTC to an anonymous ERC20 contract; there is likely some more to do to constrain the DCA operator from sending funds to a random address, for example, construct a proof that the stealth address is indeed the user's. The second scenario is quite similar, but instead of spending public balances, the DCA operator spends notes per the constraints of the execute form outside the method the user has defined.

You could get funky with this and have this meta multi-owner anonymous account where people pool their assets together, DCA as an anonymous collective, and vote on DCA intents (how often, how much, etc.).