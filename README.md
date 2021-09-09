# A Betting platform 
A Betting platform where users are allowed to bet on a number of possible outcomes of an event. Say for example Man-united are playing Arsenal this weekend. The possible outcomes are that Man-united wins or Arsenal wins. Now users of the platform can bet on either of the possible outcomes staking an amount. This amount is the expressed as a percentage of the total amount of that side of the bet. Said percentage would be used for rewarding each participant.

### Example
Alice is an Arsenal fan while Bob is a Man-united fan. Both teams are playing a game this weekend and Both Alice and Bob have decided to bet on their teams winning the game.
Alice decides to stake 500USD while Bob decides to stake a 1000USD. Here's how the platform calculates possible win shares.
Assuming Arsenal ends up winning the game, here's what alice is going to end up with for betting 500USD on Arsenal winning the game.
### Assumptions
30 folks put money on Arsenal
50 folks put their money on Man-united

Total money put on Arsenal = 40000USD
Total money put on Man-united = 90000USD

**NOTE:** 
Arsenal has lower chances of winning, this can be seen by the number of folks betting on them as well as the total amount raised. There if Arsenal ends up winning, Those who put money on them would reap higher rewards.

### Computation
For every money that hits the platform for the sake of the game, The percentage contribution of each individual would be recomputed like so (Using Alice and Bob as examples)

**FORMULA:**
Percentage gain = (Money put in by a single user / Total monies put in by one side) * 100
Total win = (Percentage gain / 100) * total money staked by losing side + total money put in by user
### Alice
(500 / 40000) * 100 = 1.25%
Possible returns = ((1.25 / 100) * 90000) + 500 = 1625USD
### Bob
(1000 / 90000) * 100 = 1.1%
Possible returns = ((1.1 / 100) * 40000) + 1000 = 1440USD


# A dollar cost average investing platform for ETHEREUM
A dollar cost average investing platform for ETH that allows a user to set specific amount of cash they want to spend on buying ETH on a consistent basis say monthly, daily, biweekly, hourly etc.

### Key Components
- Signup mechanism: Signup on this platform and create a fresh ETH account/address or use an exiting ETH account/address.
- Payment collection mechanism: Allow users to deposit money to be used for buying crypto
- Smart contract: To make the actual purchase of crypto at specified times

### Workflow
- Bob signs up to this platform, he's asked if he wants to create a new ETH account/address or use an existing one
    - Bob opts to create a new one as he's new to crypto: a new ETH address is created on his behalf and used to create his wallet
    - Bob opts to use an existing address as he's been into crypto for some time, his ETH address is collected and used to create his wallet
- Bob is asked to set the frequency (Daily, Monthly, Weekly, Biweekly etc) to which he intends to buy ETH, this can be updated subsequently.
- Bob is asked to make an initial deposit to begin or he can do that some other time, but until then, no ETH is purchased (Where would this money leave? maybe use that money to purchase a stable coin and hold that instead? most likely)
- Assuming Bob opts for daily purchase at 12 Noon and make initial deposit, A smart contract is setup to make purchase of ETH using a stable coin based on the frequency set by Bob




