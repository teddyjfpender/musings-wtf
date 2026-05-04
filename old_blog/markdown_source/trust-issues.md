# Trust Issues & Insights as a Service

I've been thinking about information finance and its relevance to rollups for the past few weeks. After reading Dave White's [article](https://www.paradigm.xyz/2024/12/distribution-markets) on distribution markets, I realized this is the common thread I sought.

Whether it's fantasy sports or pricing blob fees, the ability to provide valuable information that drives more informed decisions is a game-changer. Providing insights as a service ("IaaS"?) resolves trust issues when providers can compete through incentivized markets. Distribution markets bridge these seemingly disparate domains, enabling new users to provide insights and informees to extract insights, hedge risks, and make smarter decisions.

## The Rise of Info Finance and Neglect of Power Users

At its core, information finance is about monetizing information by aligning incentives between data producers and consumers. For consumers, the goal is to make better decisions based on the insights they consume. For producers, it's about showcasing the value of their predictive prowess or predictions or models.

I see two core users of information finance: (1.) market participants and (2.) informees. Market participants can differ depending on the type of information finance application. In prediction markets, they are comfortable with providing discrete outcomes. In decision markets, they can express a continuous distribution describing the uncertainty they believe represents the future. Prediction markets, as they exist today, have discrete outcomes. They ask simple questions, like "Will X happen tomorrow?" (yes/no).

![[../images/prediction-markets.png]]


While this works for some use cases, it falls short for and neglects personas like machine learning engineers, statisticians, or data scientists who prefer expressing predictions as distributions over a range of outcomes. This is where distribution markets shine. These markets allow for continuous outcomes, providing a more natural way for data-savvy individuals (and teams) to showcase their predictive models and better serve them to provide their insights as a service.

![[../images/distribution-markets.png]]

Got an example? Of course, I do! Everyone loves election statistics; let's start there. When a newspaper like The Economist posts its election model updates, it shows it as a distribution (although this isn't a continuous distribution, it'll serve its purpose for now).

![[../images/election-distribution-market.png]]

Informees can see that Trump's likely range of electoral votes is between 189 and 327 (he got 312–inside the range). Does this map to a prediction market? Yes and no. It does map because one could take the model's median scenario and participate in a prediction market. It certainly doesn't map well to being able to express what the model is describing, though! Thus, I would lean that prediction markets neglect the producer of these insights. It is also hard to evaluate two different election models based solely on their median prediction–one model could have the correct median but a vast domain (i.e. a median of 312 and a domain spanning from 0 to 538). Another could have an incorrect median but a very narrow domain (i.e. a median of 301 and a domain of 287 to 313). The latter could be considered the better model, but this cannot be expressed well in a discrete prediction market; in such a case, the latter model is a losing model when using the median simulation.

Then we have trust issues with all these different election models–who has the best model? Why should we trust one model over another? Is there a hivemind model of models we can look to for a collective view?

Elections don't happen often enough, and data sampling is expensive and time-consuming for pollsters. Not least, [BTS](https://x.com/C1aranMurray/status/1854292152689262703) approaches are more accurate than commonplace polling techniques.

## Fantasy Sports: Trust Issues but Data Rich

Alternatively, sports are rich with data. Fantasy sports, like ESPN's Fantasy Football, thrive on predictive analytics. In ~2019, ESPN integrated [IBM Watson](https://developer.ibm.com/articles/player-insights-with-watson/) to help inform users about players they could put into their starting lineups, giving users insights into potential weekly performance.

![[../images/watson-boom-bust.png]]

But once again how accurate are these insights? Could other models outperform Watson? Trust issues abound and users were often frustrated with the product they received.

![[../images/watson-reddit-review.png]]

Today, there is no central hub to compare the effectiveness of such models (a real shame when we look at how [popular LLM rankings](https://openrouter.ai/rankings) are and how that drives good competition). Platforms like [Stokastic](https://www.stokastic.com/join/?gad_source=1&gclid=Cj0KCQiAsOq6BhDuARIsAGQ4-zjs9VuY1C_t09PHqFTngUsZ7KchF8IroILW-ric5M_iqxbWL6DOMiUaAkf2EALw_wcB) provide premium insights; users pay to optimize their fantasy rosters. However, consumers need a transparent way to evaluate which provider offers the best value.

Distribution markets could change this. They allow predictive model providers to compete in a market catered towards their predictive style in a transparent, verifiable manner. By expressing predictions as distributions rather than discrete values, these markets could inform fantasy sports enthusiasts about the true value of different insights/analytics providers. Informees could:

- Better choose models.
- Benefit from a hivemind (i.e. the market's insight).
- Maximize projected scores.
- Optimize for specific risk-reward profiles.
- Hedge against undesirable scenarios.

Insights providers could:
- Better price their models.
- Compete to drive real innovation.

Distribution markets fundamentally eliminate users' trust issues when buying services from these predictive insights providers and Starknet is a natural platform for showcasing these insights through distribution markets. Natural incentive alignment exists because ranking and showcasing your model as better than another makes for a fantastic, immutable marketing campaign.

## Extending the Vision: Rollup Dynamics

Now, let's shift to a seemingly unrelated domain: rollups. Rollups like Starknet involve costs like sequencing, proving, data availability (DA), and verification. These costs can fluctuate, introducing fee variance for rollup creators and users. For more information on Starknet's costs and fees, check out [Ilia's forum post](https://community.starknet.io/t/starknet-costs-and-fees/113853)!

A relevant example of where there is volatility (i.e. uncertainty) is in blob gas fees. High volatility can make it challenging for rollup operators to price rollup blockspace effectively. Here's where distribution markets come in:

- Sequencers can inspect predictive markets, like distribution markets, that forecast the distribution of blob gas prices, helping them better price in (or hedge against) volatility when posting state updates to Ethereum.
- Rollup Users could assess whether hedging strategies, informed by distribution markets, are worth pursuing to mitigate their activity costs.

But this requires some kind of futures market on blob prices to help create a real hedging strategy should one want to create a hedging strategy. This is not to say one could participate in a prediction market on blob prices to act as a pseudo-futures market (sometimes, I think they are pseudo-futures markets).

But this isn't much of a concern given [Starknet v0.13.3](https://community.starknet.io/t/starknet-v0-13-3/115053) and more compression on the horizon! It was more of a fun random example.
## Rollup-as-a-Service (RaaS): on-chain SLAs Pricing with Predictive Insights

Tooting my own horn from the app-chain omakase article--many different types of rollups can live on top of Starknet. Those wishing to spin up an ephemeral rollup (e.g., some battle royal season finale) with a RaaS might like to get a fair price for the operational costs. Still, these operational costs depend on user activity. A RaaS provider might also like to hedge their risk should the season finale battle royal go viral. distribution markets could:

- Help RaaS providers forecast potential user activity and thus operating costs, enabling better pricing strategies.
- Inform rollup creators about expected infrastructure costs.

This is where on-chain SLAs enter the picture. By leveraging distribution markets, RaaS providers and rollup creators can price the SLA, describing the operational costs of this example battle royal season finale ephemeral rollup better, reducing risk for both parties.

At first glance, fantasy sports and pricing on-chain SLAs might seem worlds apart. However, both involve the need to be well-informed about uncertainty and the need for informed decision-making. Distribution markets serve to resolve trust issues and be better informed.

I am biased, but Starknet is the best place to see distribution markets thrive for empowering the data-savvy user who is neglected information finance as it stands.