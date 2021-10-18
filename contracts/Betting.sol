// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

contract Betting {
  using SafeMath for uint256;
  struct Bet {
    string teamA;
    string teamB;
    string winner;
    uint256 totalAmountStaked;
    uint256 usersCount;
    uint256 startTime;
    uint256 endTime;
    bool isOpen;
  }

  struct Stake {
    string teamToWin;
    bytes32 teamToWinHash;
    uint256 totalAmountStaked;
    uint256 stakePercentage;
  }

  address private owner;
  uint256 private appBalance;
  uint256 public betId;
  mapping (address => bool) public users;
  mapping (address => uint256) public usersBalance;
  mapping (uint256 => Bet) public bets;
  mapping (address => mapping (uint256 => Stake)) public usersStakings;

  constructor() {
    owner = msg.sender;
    betId = 1;
    appBalance = 0;
  }

  modifier isOwner {
    require(msg.sender == owner, "Only contract owner can perform this action");
    _;
  }

  modifier isRegistered {
    require(users[msg.sender] == true, "User not registered");
    _;
  }

  modifier checkAmount(uint256 _amount) {
    require(_amount <= usersBalance[msg.sender], "Insufficient balance");
    _;
  }

  function registerUser(address payable _address) public returns (bool) { // Register new user
    require(_address != owner, "Owner can not be registered");

    users[_address] = true;
    usersBalance[_address] = 0;

    emit LogRegisterUser(_address);
    return true;
  }

  function addFunds() external payable isRegistered returns (uint256) { // Fund user in app wallet
    usersBalance[msg.sender] += msg.value;

    emit LogAddFunds(msg.sender, msg.value);
    return msg.value;
  }

  function withdrawFunds(address payable _to, uint256 _amount) public payable isRegistered checkAmount(_amount) returns (uint256) { // Withdraw funds to external wallet
    usersBalance[msg.sender] -= _amount;
    (bool success, ) = _to.call{value: _amount}("");
    require(success, "Withdrawal failed");
    emit LogWithdrawFunds(msg.sender, _amount);
    return _amount;
  }

  function addBet(string memory teamA, string memory teamB, uint256 startTime, uint256 endTime) public isOwner {
    Bet memory newBet = Bet({
      teamA: teamA,
      teamB: teamB,
      winner: "",
      totalAmountStaked: 0,
      usersCount: 0,
      startTime: startTime,
      endTime: endTime,
      isOpen: true
    });

    bets[betId] = newBet;
    betId += 1;

    emit LogAddBet(teamA, teamB, startTime, endTime);
  }

  function closeBet(uint256 _betId) public isOwner {
    require(bets[_betId].isOpen == true, "This bet is already closed");
    bets[_betId].isOpen = false;
    emit LogCloseBet(_betId);
  }

  function submitBet(uint256 _betId, string memory _teamToWin, uint256 _betStakeAmount) public isRegistered checkAmount(_betStakeAmount) { // Register a bet with money from app wallet
    require(bets[_betId].isOpen == true, "This bet is no longer accepting stakes");
    require(_betStakeAmount > 0, "Bet stake amount must be greater than 0");
    address user = msg.sender;
    bytes32 teamToWinHash = keccak256(abi.encodePacked(_teamToWin));
    Stake storage userStaking = usersStakings[user][_betId];

    // User might be staking this bet for the first time or increasing thier initial stake
    if(userStaking.totalAmountStaked == 0) {
      Stake memory stake;
      stake.teamToWin = _teamToWin;
      stake.teamToWinHash = teamToWinHash;
      stake.totalAmountStaked =  _betStakeAmount;

      usersStakings[user][_betId] = stake;
      bets[_betId].usersCount = bets[_betId].usersCount.add(1);
    } else {
      require(userStaking.teamToWinHash == teamToWinHash, "You're not allowed to stake on both sides of a bet");
      userStaking.totalAmountStaked = userStaking.totalAmountStaked.add(_betStakeAmount);
    }

    usersBalance[user] = usersBalance[user].sub(_betStakeAmount);
    bets[_betId].totalAmountStaked = bets[_betId].totalAmountStaked.add(_betStakeAmount);
    appBalance = appBalance.add(_betStakeAmount);

    // Compute user's stake percentage WRT total stake on this bet
    uint256 userTotalAmountStaked = userStaking.totalAmountStaked;
    uint256 stakePercentage = userTotalAmountStaked.div(bets[_betId].totalAmountStaked).mul(100);
    userStaking.stakePercentage = stakePercentage;

    emit LogSubmitBet(msg.sender, _betId, _teamToWin, _betStakeAmount, appBalance);
  }

  function settleBet(uint256 _betId, string memory _winner) public isOwner {
    require(bets[_betId].isOpen == false, "Can not settle an open bet");
    require(bytes(bets[_betId].winner).length == 0, "This bet has already been settled");

    bets[_betId].winner = _winner;
    emit LogSettleBet(_betId, _winner);
  }

  function disburseBetFunds(uint256 _betId) private isOwner returns (bool) {

  }

  // Events
  event LogRegisterUser(address payable indexed _address);
  event LogAddFunds(address indexed _sender, uint256 _amount);
  event LogWithdrawFunds(address indexed _to, uint256 _amount);
  event LogAddBet(string _teamA, string _teamB, uint256 indexed _startTime, uint256 indexed _endTime);
  event LogSubmitBet(address indexed _user, uint256 indexed _betId, string _sideToWin, uint256 _betStakeAmount, uint256 _appBalance);
  event LogSettleBet(uint256 indexed _betId, string _winner);
  event LogDisburseBetFunds(uint256 indexed _betId);
  event LogCloseBet(uint256 indexed _betId);
  
}
