const BettingContract = artifacts.require("Betting");
const truffleAssert = require('truffle-assertions');
const BigNumber = require('bignumber.js');

// TODO: Add linter and prettier
// TODO: Rename Betting to betting

contract("User registration", async accounts => {

  let Betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];

  beforeEach(async () => {
    Betting = await BettingContract.new({from: ownerAccount});
  })

  it("should fail to register owner", async () => {
    await truffleAssert.reverts(
      Betting.registerUser(ownerAccount),
      "Owner can not be registered"
    )
  });

  it("should successfully register user", async () => {
    const success = await Betting.registerUser.call(userAccount);
    assert.equal(success, true);
  });

  it("should emit LogRegisterUser event", async () => {
    const tx = await Betting.registerUser(userAccount);
    truffleAssert.eventEmitted(tx, 'LogRegisterUser', (ev) => {
      return ev._address === userAccount
    })
  })
})


contract("Add Funds", async accounts => {

  let Betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];
  const amount = 100;

  beforeEach(async () => {
    Betting = await BettingContract.new({from: ownerAccount});
  })

  it("should fail if user is not registered", async () => {
    await truffleAssert.reverts(
      Betting.addFunds({ from: userAccount, value: amount}),
      "User not registered"
    )
  });

  it("should successfully add funds to user wallet", async () => {
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: amount});
    const userBalance = await Betting.usersBalance(userAccount);
    assert.equal(userBalance.toString(), amount);
  })

  it("should successfully transfer ether to smart contract address", async () => {
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: amount});
    const contractBalance = await web3.eth.getBalance(Betting.address);
    assert.equal(contractBalance, amount);
  })

  it("should emit LogAddFunds event", async () => {
    await Betting.registerUser(userAccount);
    const tx = await Betting.addFunds({from: userAccount, value: amount});
    truffleAssert.eventEmitted(tx, 'LogAddFunds', (ev) => {
      return ev._sender === userAccount && ev._amount.toString() == amount
    })
  })
})

contract("Withdraw Funds", async accounts => {

  let Betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];
  const receiverAccount = accounts[2]
  const fundAmount = 100;
  const smallWithdrawAmount = 50;
  const largeWithdrawAmount = 150;

  beforeEach(async () => {
    Betting = await BettingContract.new({from: ownerAccount});
  })

  it("should fail if user is not registered", async () => {
    await truffleAssert.reverts(
      Betting.withdrawFunds(receiverAccount, fundAmount, { from: userAccount }),
      "User not registered"
    )
  });

  it("should fail if user balance is less than withdraw amount", async () => {
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: fundAmount});
    await truffleAssert.reverts(
      Betting.withdrawFunds(receiverAccount, largeWithdrawAmount, { from: userAccount }),
      "Insufficient balance"
    )
  });

  it("should successfully withdraw fund from user app wallet", async () => {
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: fundAmount});
    await Betting.withdrawFunds(receiverAccount, smallWithdrawAmount, {from: userAccount});
    const userBalance = await Betting.usersBalance(userAccount);
    const expectedUserBalance = fundAmount - smallWithdrawAmount;
    assert.equal(userBalance.toString(), expectedUserBalance);
  })

  it("should successfully withdraw fund from the smart contract address", async () => {
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: fundAmount});
    await Betting.withdrawFunds(receiverAccount, smallWithdrawAmount, {from: userAccount});
    const smartContractBalance = await web3.eth.getBalance(Betting.address);
    const expectedUserBalance = fundAmount - smallWithdrawAmount;
    assert.equal(smartContractBalance, expectedUserBalance);
  })

  it("should successfully withdraw fund into the receiver's account", async () => {
    const receiverPrevBalance = await web3.eth.getBalance(receiverAccount);
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: fundAmount});
    await Betting.withdrawFunds(receiverAccount, smallWithdrawAmount, {from: userAccount});
    const receiverBalance = await web3.eth.getBalance(receiverAccount);
    const expectedUserBalance = +receiverPrevBalance + +smallWithdrawAmount;
    assert.equal(receiverBalance, expectedUserBalance);
  })

  it("should emit LogWithdrawFunds event", async () => {
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: fundAmount});
    const tx = await Betting.withdrawFunds(receiverAccount, smallWithdrawAmount, {from: userAccount});
    truffleAssert.eventEmitted(tx, 'LogWithdrawFunds', (ev) => {
      return ev._to === userAccount && ev._amount.toString() == smallWithdrawAmount
    })
  })
})

contract("Add Bet", async accounts => {
  let Betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];
  const teamA = 'Lakers';
  const teamB = 'OKC';
  const betId = 1;
  const startTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript
  const endTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript

  beforeEach(async () => {
    Betting = await BettingContract.new({from: ownerAccount});
  })

  it("should only be accessible to contract owner", async () => {
    await truffleAssert.reverts(
      Betting.addBet(teamA, teamB, startTime, endTime, {from: userAccount}),
      "Only contract owner can perform this action"
    )
  })

  it("should successfully add bet", async () => {
    await Betting.addBet(teamA, teamB, startTime, endTime, {from: ownerAccount});
    const newBet = await Betting.bets(betId);
    const newBetId = await Betting.betId();
    const expectedNewBetId = betId + 1;

    assert.equal(newBet.teamA, teamA);
    assert.equal(newBet.teamB, teamB);
    assert.equal(newBet.winner, '');
    assert.equal(newBet.totalAmountStaked.toString(), '0');
    assert.equal(newBet.usersCount.toString(), '0');
    assert.equal(newBet.startTime.toNumber(), startTime);
    assert.equal(newBet.endTime.toNumber(), endTime);
    assert.equal(newBet.isOpen, true);
    assert.equal(newBetId, expectedNewBetId);
  })

  it("should emit LogAddBet event", async () => {
    const tx = await Betting.addBet(teamA, teamB, startTime, endTime, {from: ownerAccount});
    truffleAssert.eventEmitted(tx, "LogAddBet", (ev) => {
      return ev._teamA === teamA && ev._teamB === teamB && ev._startTime == startTime && ev._endTime == endTime
    })
  })
})

contract("Submit Bet", async accounts => {
  let Betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];
  const fundAmount = 100;
  const smallBetStakeAmount = 50;
  const largeBetStakeAmount = 150;
  const invalidBetStakeAmount = 0;
  const additionalBetStakeAmount = 50;
  const teamA = 'Lakers';
  const teamB = 'OKC';
  const teamToWin = 'Lakers';
  const betId = 1;
  const startTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript
  const endTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript

  beforeEach(async () => {
    Betting = await BettingContract.new({from: ownerAccount});
  })

  it("should fail if user is not registered", async () => {
    await truffleAssert.reverts(
      Betting.submitBet(betId, teamToWin, smallBetStakeAmount, { from: userAccount }),
      "User not registered"
    )
  });

  it("should fail if user balance is less than bet stake amount", async () => {
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: fundAmount});
    await truffleAssert.reverts(
      Betting.submitBet(betId, teamToWin, largeBetStakeAmount, { from: userAccount }),
      "Insufficient balance"
    )
  });

  it("should not allow staking on closed bets", async () => {
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: fundAmount});
    await Betting.addBet(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await Betting.closeBet(betId, { from: ownerAccount });
    await truffleAssert.reverts(
      Betting.submitBet(betId, teamToWin, smallBetStakeAmount, { from: userAccount }),
      "This bet is no longer accepting stakes"
    )
  });

  it("should not allow for invalid (less than 0) bet stake amount", async () => {
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: fundAmount});
    await Betting.addBet(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await truffleAssert.reverts(
      Betting.submitBet(betId, teamToWin, invalidBetStakeAmount, { from: userAccount }),
      "Bet stake amount must be greater than 0"
    )
  });

  it("should successfully submit a new bet stake", async () => {
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: fundAmount});
    await Betting.addBet(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await Betting.submitBet(betId, teamToWin, smallBetStakeAmount, {from: userAccount});

    const bet = await Betting.bets(betId);
    const userStaking = await Betting.usersStakings(userAccount, betId);
    const userBalance = await Betting.usersBalance(userAccount);
    
    const expectedUserBalance = fundAmount - smallBetStakeAmount;
    const expectedStakePercentage = new BigNumber(userStaking.totalAmountStaked).dividedBy(bet.totalAmountStaked).times(100).toString();

    assert.equal(userStaking.teamToWin, teamToWin);
    assert.equal(userStaking.totalAmountStaked.toString(), smallBetStakeAmount);
    assert.equal(userStaking.stakePercentage.toString(), expectedStakePercentage);
    assert.equal(bet.totalAmountStaked.toString(), smallBetStakeAmount);
    assert.equal(userBalance, expectedUserBalance);
  });

  it("should successfully increase totalAmountStaked on a existing bet stake", async () => {
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: fundAmount});
    await Betting.addBet(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await Betting.submitBet(betId, teamToWin, smallBetStakeAmount, {from: userAccount});

    // Initial bet stake results
    const {totalAmountStaked: initialBetTotalAmountStaked} = await Betting.bets(betId);
    const {totalAmountStaked: initialUserTotalAmountStaked, stakePercentage: initialStakePercentage} = await Betting.usersStakings(userAccount, betId);
    const initialUserBalance = await Betting.usersBalance(userAccount);
    const expectedInitialUserBalance = fundAmount - smallBetStakeAmount;
    const expectedInitialStakePercentage = new BigNumber(initialUserTotalAmountStaked).dividedBy(initialBetTotalAmountStaked).times(100).toString();

    // Final bet stake results
    await Betting.submitBet(betId, teamToWin, additionalBetStakeAmount, {from: userAccount});
    const {totalAmountStaked: finalBetTotalAmountStaked} = await Betting.bets(betId);
    const {totalAmountStaked: finalUserTotalAmountStaked, stakePercentage: finalStakePercentage} = await Betting.usersStakings(userAccount, betId);
    const finalUserBalance = await Betting.usersBalance(userAccount);
    const expectedFinalStakePercentage = new BigNumber(finalUserTotalAmountStaked).dividedBy(finalBetTotalAmountStaked).times(100).toString();
    const expectedFinalTotalAmountStaked = smallBetStakeAmount + additionalBetStakeAmount;
    const expectedFinalUserBalance = fundAmount - expectedFinalTotalAmountStaked;

    assert.equal(initialUserTotalAmountStaked.toString(), smallBetStakeAmount);
    assert.equal(initialStakePercentage.toString(), expectedInitialStakePercentage);
    assert.equal(initialBetTotalAmountStaked.toString(), smallBetStakeAmount);
    assert.equal(initialUserBalance, expectedInitialUserBalance);

    assert.equal(finalUserTotalAmountStaked.toString(), expectedFinalTotalAmountStaked);
    assert.equal(finalStakePercentage.toString(), expectedFinalStakePercentage);
    assert.equal(finalBetTotalAmountStaked.toString(), expectedFinalTotalAmountStaked);
    assert.equal(finalUserBalance, expectedFinalUserBalance);
  });

  it("should emit LogSubmitBet event", async () => {
    await Betting.registerUser(userAccount);
    await Betting.addFunds({from: userAccount, value: fundAmount});
    await Betting.addBet(teamA, teamB, startTime, endTime, {from: ownerAccount});
    const tx = await Betting.submitBet(betId, teamToWin, smallBetStakeAmount, {from: userAccount});

    truffleAssert.eventEmitted(tx, "LogSubmitBet", (ev) => {
      return ev._user === userAccount && ev._betId.toNumber() === betId && ev._sideToWin == teamToWin && ev._betStakeAmount == smallBetStakeAmount
    })
  })
})

contract("Settle Bet", async accounts => {
  let Betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];
  const fundAmount = 100;
  const smallBetStakeAmount = 50;
  const largeBetStakeAmount = 150;
  const invalidBetStakeAmount = 0;
  const additionalBetStakeAmount = 50;
  const teamA = 'Lakers';
  const teamB = 'OKC';
  const winner = 'Lakers';
  const betId = 1;
  const startTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript
  const endTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript

  beforeEach(async () => {
    Betting = await BettingContract.new({from: ownerAccount});
  })

  it("should only be accessible to contract owner", async () => {
    await truffleAssert.reverts(
      Betting.settleBet(betId, winner, {from: userAccount}),
      "Only contract owner can perform this action"
    )
  })

  it("should fail if bet status is Open", async () => {
    await Betting.addBet(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await truffleAssert.reverts(
      Betting.settleBet(betId, winner, { from: ownerAccount }),
      "Can not settle an open bet"
    )
  });

  it("should fail if bet is already settled", async () => {
    const newWinner = 'OKC'
    await Betting.addBet(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await Betting.closeBet(betId);
    await Betting.settleBet(betId, winner, {from: ownerAccount});
    await truffleAssert.reverts(
      Betting.settleBet(betId, newWinner, { from: ownerAccount }),
      "This bet has already been settled"
    )
  });

  it("should successfully settle bet", async () => {
    await Betting.addBet(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await Betting.closeBet(betId);
    await Betting.settleBet(betId, winner, {from: ownerAccount});
    
    const { isOpen, winner: gameWinner } = await Betting.bets(betId);
    assert.equal(isOpen, false);
    assert.equal(gameWinner, winner)
  });

  it("should emit LogSettleBet event", async () => {
    await Betting.addBet(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await Betting.closeBet(betId);
    const tx = await Betting.settleBet(betId, winner, {from: ownerAccount});

    truffleAssert.eventEmitted(tx, "LogSettleBet", (ev) => {
      return ev._betId.toNumber() === betId && ev._winner == winner
    })
  })
})
