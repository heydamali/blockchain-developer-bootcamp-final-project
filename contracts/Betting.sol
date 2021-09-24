// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Betting {
  struct Bet {
    string teamA;
    string teamB;
    uint totalAmountStaked;
    uint usersCount;
    uint startTime;
    uint endTime;
    bool isOpen;
  }

  address private owner;
  uint private appBalance;
  uint public betId;
  mapping (address => bool) public users;
  mapping (address => uint) public usersBalance;
  mapping (uint => Bet) public bets;
  mapping (uint => mapping (address => uint)) public betStakeAmountPerAccount; 
  mapping (uint => mapping (address => uint)) public betStakePercentagePerAccount;

  constructor() public {
    owner = msg.sender;
    betId = 0;
    appBalance = 0;
  }

  modifier isOwner {
    _;
  }

  modifier isRegistered {
    _;
  }

  modifier checkAmount {
    _;
  }

  function registerUser(address _address) public returns (bool) {
    require(_address != owner, "Owner can not be registered");
    // Logic here
    emit LogRegisterUser(_address);
    return true;
  }

  function addFunds(uint _amount) public payable isRegistered checkAmount returns (uint) {

  }

  function withdrawFunds(address _to, uint _amount) public payable isRegistered returns (uint) {

  }

  function registerBet(uint _betId, string memory _sideToWin, uint _betStakeAmount) public isRegistered returns (bool) {

  }

  function settleBet(uint _betId, string memory _winner) public isOwner returns (bool) {

  }

  function disburseBetFunds(uint _betId) private isOwner returns (bool) {

  }

  function lockBet(uint _betId) private isOwner returns (bool) {

  }

  // Events
  event LogRegisterUser(address indexed _address);
  event LogAddFunds(address indexed _sender, uint _amount);
  event LogWithdrawFunds(address indexed _to, uint _amount);
  event LogRegisterBet(address indexed _user, uint indexed _betId, string indexed _sideToWin, uint _betStakeAmount);
  event LogSettleBet(uint indexed _betId, string indexed _winner);
  event LogDisburseBetFunds(uint indexed _betId);
  event LogLockBet(uint indexed _betId);
  
}
