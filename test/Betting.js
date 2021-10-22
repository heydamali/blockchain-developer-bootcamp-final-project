const BettingContract = artifacts.require("Betting");
const truffleAssert = require('truffle-assertions');
const BigNumber = require('bignumber.js');

// TODO: Add linter and prettier
// TODO: Add test for CloseGame

contract("User sign in", async accounts => {

  let betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];

  beforeEach(async () => {
    betting = await BettingContract.new({from: ownerAccount});
  })

  it("should fail to sign in owner", async () => {
    await truffleAssert.reverts(
      betting.signInUser(ownerAccount),
      "Owner can not be registered"
    )
  });

  it("should successfully sign in user", async () => {
    await betting.signInUser(userAccount);
    const isSignedIn = await betting.users(userAccount);
    assert.equal(isSignedIn, true);
  });

  it("should emit LogSignInUser event", async () => {
    const tx = await betting.signInUser(userAccount);
    truffleAssert.eventEmitted(tx, 'LogSignInUser', (ev) => {
      return ev._address === userAccount
    })
  })
})


contract("User sign in status", async accounts => {

  let betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];

  beforeEach(async () => {
    betting = await BettingContract.new({from: ownerAccount});
  })

  it("should return false sign in status", async () => {
    const status = await betting.signInStatus(ownerAccount);
    assert.equal(status, false);
  });

  it("should return true sign in status", async () => {
    await betting.signInUser(userAccount);
    const status = await betting.signInStatus(userAccount);
    assert.equal(status, true);
  });
})


contract("Add Funds", async accounts => {

  let betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];
  const amount = 100;

  beforeEach(async () => {
    betting = await BettingContract.new({from: ownerAccount});
  })

  it("should fail if user is not registered", async () => {
    await truffleAssert.reverts(
      betting.addFunds({ from: userAccount, value: amount}),
      "User not registered"
    )
  });

  it("should successfully add funds to user wallet", async () => {
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: amount});
    const userBalance = await betting.usersBalance(userAccount);
    assert.equal(userBalance.toString(), amount);
  })

  it("should successfully transfer ether to smart contract address", async () => {
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: amount});
    const contractBalance = await web3.eth.getBalance(betting.address);
    assert.equal(contractBalance, amount);
  })

  it("should emit LogAddFunds event", async () => {
    await betting.signInUser(userAccount);
    const tx = await betting.addFunds({from: userAccount, value: amount});
    const userBalance = await betting.usersBalance(userAccount);
    truffleAssert.eventEmitted(tx, 'LogAddFunds', (ev) => {
      return ev._sender === userAccount && ev._amount.toString() == amount && ev._userBalance.toString() == userBalance
    })
  })
})

contract("Withdraw Funds", async accounts => {

  let betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];
  const receiverAccount = accounts[2]
  const fundAmount = 100;
  const smallWithdrawAmount = 50;
  const largeWithdrawAmount = 150;

  beforeEach(async () => {
    betting = await BettingContract.new({from: ownerAccount});
  })

  it("should fail if user is not registered", async () => {
    await truffleAssert.reverts(
      betting.withdrawFunds(receiverAccount, fundAmount, { from: userAccount }),
      "User not registered"
    )
  });

  it("should fail if user balance is less than withdraw amount", async () => {
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: fundAmount});
    await truffleAssert.reverts(
      betting.withdrawFunds(receiverAccount, largeWithdrawAmount, { from: userAccount }),
      "Insufficient balance"
    )
  });

  it("should successfully withdraw fund from user app wallet", async () => {
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: fundAmount});
    await betting.withdrawFunds(receiverAccount, smallWithdrawAmount, {from: userAccount});
    const userBalance = await betting.usersBalance(userAccount);
    const expectedUserBalance = fundAmount - smallWithdrawAmount;
    assert.equal(userBalance.toString(), expectedUserBalance);
  })

  it("should successfully withdraw fund from the smart contract address", async () => {
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: fundAmount});
    await betting.withdrawFunds(receiverAccount, smallWithdrawAmount, {from: userAccount});
    const smartContractBalance = await web3.eth.getBalance(betting.address);
    const expectedUserBalance = fundAmount - smallWithdrawAmount;
    assert.equal(smartContractBalance, expectedUserBalance);
  })

  it("should successfully withdraw fund into the receiver's account", async () => {
    const receiverPrevBalance = await web3.eth.getBalance(receiverAccount);
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: fundAmount});
    await betting.withdrawFunds(receiverAccount, smallWithdrawAmount, {from: userAccount});
    const receiverBalance = await web3.eth.getBalance(receiverAccount);
    const expectedUserBalance = +receiverPrevBalance + +smallWithdrawAmount;
    assert.equal(receiverBalance, expectedUserBalance);
  })

  it("should emit LogWithdrawFunds event", async () => {
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: fundAmount});
    const tx = await betting.withdrawFunds(receiverAccount, smallWithdrawAmount, {from: userAccount});
    truffleAssert.eventEmitted(tx, 'LogWithdrawFunds', (ev) => {
      return ev._to === userAccount && ev._amount.toString() == smallWithdrawAmount
    })
  })
})

contract("Add Game", async accounts => {
  let betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];
  const teamA = 'Lakers';
  const teamB = 'OKC';
  const gameId = 1;
  const startTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript
  const endTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript

  beforeEach(async () => {
    betting = await BettingContract.new({from: ownerAccount});
  })

  it("should only be accessible to contract owner", async () => {
    await truffleAssert.reverts(
      betting.addGame(teamA, teamB, startTime, endTime, {from: userAccount}),
      "Only contract owner can perform this action"
    )
  })

  it("should successfully add game", async () => {
    await betting.addGame(teamA, teamB, startTime, endTime, {from: ownerAccount});
    const newGame = await betting.games(gameId);
    const newGameId = await betting.gameId();
    const expectedNewBetId = gameId + 1;

    assert.equal(newGame.teamA, teamA);
    assert.equal(newGame.teamB, teamB);
    assert.equal(newGame.winner, '');
    assert.equal(newGame.totalAmountStaked.toString(), '0');
    assert.equal(newGame.usersCount.toString(), '0');
    assert.equal(newGame.startTime.toNumber(), startTime);
    assert.equal(newGame.endTime.toNumber(), endTime);
    assert.equal(newGame.isOpen, true);
    assert.equal(newGameId, expectedNewBetId);
  })

  it("should emit LogAddGame event", async () => {
    const tx = await betting.addGame(teamA, teamB, startTime, endTime, {from: ownerAccount});
    truffleAssert.eventEmitted(tx, "LogAddGame", (ev) => {
      return ev._teamA === teamA && ev._teamB === teamB && ev._startTime == startTime && ev._endTime == endTime
    })
  })
})

contract("Get All Games", async accounts => {
  let betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];
  const teamA = 'Lakers';
  const teamB = 'OKC';
  const gameId = 1;
  const startTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript
  const endTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript

  beforeEach(async () => {
    betting = await BettingContract.new({from: ownerAccount});
  })

  it("should successfully get all games", async () => {
    await betting.addGame(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await betting.addGame(teamB, teamA, startTime, endTime, {from: ownerAccount});
    const games = await betting.getAllGames();
    assert.equal(games.length, 2);
  })
})

contract("Submit Bet", async accounts => {
  let betting;
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
  const gameId = 1;
  const startTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript
  const endTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript

  beforeEach(async () => {
    betting = await BettingContract.new({from: ownerAccount});
  })

  it("should fail if user is not registered", async () => {
    await truffleAssert.reverts(
      betting.submitBet(gameId, teamToWin, smallBetStakeAmount, { from: userAccount }),
      "User not registered"
    )
  });

  it("should fail if user balance is less than bet stake amount", async () => {
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: fundAmount});
    await truffleAssert.reverts(
      betting.submitBet(gameId, teamToWin, largeBetStakeAmount, { from: userAccount }),
      "Insufficient balance"
    )
  });

  it("should not allow staking on closed games", async () => {
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: fundAmount});
    await betting.addGame(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await betting.closeGame(gameId, { from: ownerAccount });
    await truffleAssert.reverts(
      betting.submitBet(gameId, teamToWin, smallBetStakeAmount, { from: userAccount }),
      "This game is no longer accepting stakes"
    )
  });

  it("should not allow for invalid (less than 0) bet stake amount", async () => {
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: fundAmount});
    await betting.addGame(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await truffleAssert.reverts(
      betting.submitBet(gameId, teamToWin, invalidBetStakeAmount, { from: userAccount }),
      "Bet stake amount must be greater than 0"
    )
  });

  it("should successfully submit a new bet stake", async () => {
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: fundAmount});
    await betting.addGame(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await betting.submitBet(gameId, teamToWin, smallBetStakeAmount, {from: userAccount});

    const bet = await betting.games(gameId);
    const userStaking = await betting.usersStakings(userAccount, gameId);
    const userBalance = await betting.usersBalance(userAccount);
    
    const expectedUserBalance = fundAmount - smallBetStakeAmount;
    const expectedStakePercentage = new BigNumber(userStaking.totalAmountStaked).dividedBy(bet.totalAmountStaked).times(100).toString();

    assert.equal(userStaking.teamToWin, teamToWin);
    assert.equal(userStaking.totalAmountStaked.toString(), smallBetStakeAmount);
    assert.equal(userStaking.stakePercentage.toString(), expectedStakePercentage);
    assert.equal(bet.totalAmountStaked.toString(), smallBetStakeAmount);
    assert.equal(userBalance, expectedUserBalance);
  });

  it("should successfully increase totalAmountStaked on a existing bet stake", async () => {
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: fundAmount});
    await betting.addGame(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await betting.submitBet(gameId, teamToWin, smallBetStakeAmount, {from: userAccount});

    // Initial bet stake results
    const {totalAmountStaked: initialBetTotalAmountStaked} = await betting.games(gameId);
    const {totalAmountStaked: initialUserTotalAmountStaked, stakePercentage: initialStakePercentage} = await betting.usersStakings(userAccount, gameId);
    const initialUserBalance = await betting.usersBalance(userAccount);
    const expectedInitialUserBalance = fundAmount - smallBetStakeAmount;
    const expectedInitialStakePercentage = new BigNumber(initialUserTotalAmountStaked).dividedBy(initialBetTotalAmountStaked).times(100).toString();

    // Final bet stake results
    await betting.submitBet(gameId, teamToWin, additionalBetStakeAmount, {from: userAccount});
    const {totalAmountStaked: finalBetTotalAmountStaked} = await betting.games(gameId);
    const {totalAmountStaked: finalUserTotalAmountStaked, stakePercentage: finalStakePercentage} = await betting.usersStakings(userAccount, gameId);
    const finalUserBalance = await betting.usersBalance(userAccount);
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
    await betting.signInUser(userAccount);
    await betting.addFunds({from: userAccount, value: fundAmount});
    await betting.addGame(teamA, teamB, startTime, endTime, {from: ownerAccount});
    const tx = await betting.submitBet(gameId, teamToWin, smallBetStakeAmount, {from: userAccount});

    truffleAssert.eventEmitted(tx, "LogSubmitBet", (ev) => {
      return ev._user === userAccount && ev._gameId.toNumber() === gameId && ev._sideToWin == teamToWin && ev._betStakeAmount == smallBetStakeAmount
    })
  })
})

contract("Update Game Winner", async accounts => {
  let betting;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];
  const teamA = 'Lakers';
  const teamB = 'OKC';
  const winner = 'Lakers';
  const gameId = 1;
  const startTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript
  const endTime = Math.floor((new Date()).getTime() / 1000) // Express time in unix https://stackoverflow.com/questions/68709142/how-to-input-date-as-function-parameters-for-solidity-in-javascript

  beforeEach(async () => {
    betting = await BettingContract.new({from: ownerAccount});
  })

  it("should only be accessible to contract owner", async () => {
    await truffleAssert.reverts(
      betting.updateGameWinner(gameId, winner, {from: userAccount}),
      "Only contract owner can perform this action"
    )
  })

  it("should fail if bet status is Open", async () => {
    await betting.addGame(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await truffleAssert.reverts(
      betting.updateGameWinner(gameId, winner, { from: ownerAccount }),
      "Can not update winner of an open game"
    )
  });

  it("should fail if bet is already settled", async () => {
    const newWinner = 'OKC'
    await betting.addGame(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await betting.closeGame(gameId);
    await betting.updateGameWinner(gameId, winner, {from: ownerAccount});
    await truffleAssert.reverts(
      betting.updateGameWinner(gameId, newWinner, { from: ownerAccount }),
      "This game already has a winner"
    )
  });

  it("should successfully settle bet", async () => {
    await betting.addGame(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await betting.closeGame(gameId);
    await betting.updateGameWinner(gameId, winner, {from: ownerAccount});
    
    const { isOpen, winner: gameWinner } = await betting.games(gameId);
    assert.equal(isOpen, false);
    assert.equal(gameWinner, winner)
  });

  it("should emit LogUpdateGameWinner event", async () => {
    await betting.addGame(teamA, teamB, startTime, endTime, {from: ownerAccount});
    await betting.closeGame(gameId);
    const tx = await betting.updateGameWinner(gameId, winner, {from: ownerAccount});

    truffleAssert.eventEmitted(tx, "LogUpdateGameWinner", (ev) => {
      return ev._gameId.toNumber() === gameId && ev._winner == winner
    })
  })
})
