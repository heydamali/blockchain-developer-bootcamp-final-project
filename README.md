# A Blockchain Betting Platform 
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

### Materials
- Access control for limiting access to funds raised as well as setting a time limit before after which funds can be disbursed https://courses.consensys.net/courses/take/blockchain-developer-bootcamp-registration-2021/multimedia/25117355-access-control-design-patterns

## Project Directory Structure
**/client** - contains frontend code written in react.js.
**/contracts** - contains smart contract code written is solidity.
**/migrations** - contains migration scripts for deploying smart contract.
**/test** - contains unit tests for smart contract code.

## Link to deployed frontend project
https://shrouded-forest-22128.herokuapp.com
## Public Ethereum account for NFT certification
`arinze.eth(0x5F0ACdE83F858014bc9723B356095E28fc8880B1)` 

## Running app locally
### Smart Contract
Can be found in `/contracts` directory

Follow these steps to run smart contract:

 - Navigate to the project root `/blockchain-developer-bootcamp-final-project`
 - Install all dependencies with `yarn install`
 - Compile contracts with `truffle compile`
 - Compile and deploy contracts with `truffle migrate --network develop`
 - Run unit tests with `truffle test`, ensure you have Ganache UI running in the background.
 - 
### User interface

Follow these steps to run UI:

 - Navigate to the `client` directory
 - Install all dependencies with `yarn install`
 - Start the application on locally with `yarn start`
 - Open web browser and navigate to  `localhost:3000`

### Deploying to testnet/mainnet
To deploy to any testnet or the mainnet, you'll need to create a `.secret` file in the root of the project and add your mnemonic see phrase.




