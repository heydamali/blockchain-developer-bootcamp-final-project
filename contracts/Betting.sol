// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

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

// TODOs
// Anotate functions with comments
// USE Open zieppelin as much as possible
// USE pausable contract
// CHECK for possible re-enterecy pitfalls

contract Betting {
  using SafeMath for uint256;
  struct Game {
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
  uint256 public gameId;
  mapping (address => bool) public users;
  mapping (address => uint256) public usersBalance;
  mapping (uint256 => Game) public games;
  mapping (address => mapping (uint256 => Stake)) public usersStakings;

  constructor() {
    owner = msg.sender;
    gameId = 1;
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

  function registerUser(address payable _address) external returns (bool) { // Register new user
    require(_address != owner, "Owner can not be registered");

    users[_address] = true;
    usersBalance[_address] = 0;

    emit LogRegisterUser(_address);
    return true;
  }

  function addFunds() external payable isRegistered { // Fund user in app wallet
    usersBalance[msg.sender] += msg.value;
    emit LogAddFunds(msg.sender, msg.value);
  }

  function withdrawFunds(address payable _to, uint256 _amount) external payable isRegistered checkAmount(_amount) returns (uint256) { // Withdraw funds to external wallet
    usersBalance[msg.sender] -= _amount;
    (bool success, ) = _to.call{value: _amount}("");
    require(success, "Withdrawal failed");
    emit LogWithdrawFunds(msg.sender, _amount);
    return _amount;
  }

  function addGame(string memory teamA, string memory teamB, uint256 startTime, uint256 endTime) external isOwner {
    Game memory game;
      game.teamA = teamA;
      game.teamB = teamB;
      game.winner = "";
      game.totalAmountStaked = 0;
      game.usersCount = 0;
      game.startTime = startTime;
      game.endTime = endTime;
      game.isOpen = true;

    games[gameId] = game;
    gameId += 1;
    emit LogAddGame(teamA, teamB, startTime, endTime);
  }

  function closeGame(uint256 _gameId) external isOwner {
    require(games[_gameId].isOpen == true, "This game is already closed");
    games[_gameId].isOpen = false;
    emit LogCloseGame(_gameId);
  }

  function getAllGames() external view returns (Game[] memory) {
    uint256 resultLength = gameId - 1;
    Game[] memory result = new Game[](resultLength);
    for(uint256 i = 0; i < resultLength; i++) {
      result[i] = games[i + 1];
    }
    return result;
  }

  function submitBet(uint256 _gameId, string memory _teamToWin, uint256 _betStakeAmount) external isRegistered checkAmount(_betStakeAmount) { // Register a bet with money from app wallet
    require(games[_gameId].isOpen == true, "This game is no longer accepting stakes");
    require(_betStakeAmount > 0, "Bet stake amount must be greater than 0");
    address user = msg.sender;
    bytes32 teamToWinHash = keccak256(abi.encodePacked(_teamToWin));
    Stake storage userStaking = usersStakings[user][_gameId];

    // User might be staking this bet for the first time or increasing thier initial stake
    if(userStaking.totalAmountStaked == 0) {
      Stake memory stake;
      stake.teamToWin = _teamToWin;
      stake.teamToWinHash = teamToWinHash;
      stake.totalAmountStaked =  _betStakeAmount;

      usersStakings[user][_gameId] = stake;
      games[_gameId].usersCount = games[_gameId].usersCount.add(1);
    } else {
      require(userStaking.teamToWinHash == teamToWinHash, "You're not allowed to stake on both sides of a game");
      userStaking.totalAmountStaked = userStaking.totalAmountStaked.add(_betStakeAmount);
    }

    usersBalance[user] = usersBalance[user].sub(_betStakeAmount);
    games[_gameId].totalAmountStaked = games[_gameId].totalAmountStaked.add(_betStakeAmount);
    appBalance = appBalance.add(_betStakeAmount);

    // Compute user's stake percentage WRT total stake on this game
    uint256 userTotalAmountStaked = userStaking.totalAmountStaked;
    uint256 stakePercentage = userTotalAmountStaked.div(games[_gameId].totalAmountStaked).mul(100);
    userStaking.stakePercentage = stakePercentage;
    emit LogSubmitBet(msg.sender, _gameId, _teamToWin, _betStakeAmount, appBalance);
  }

  function updateGameWinner(uint256 _gameId, string memory _winner) external isOwner {
    require(games[_gameId].isOpen == false, "Can not update winner of an open game");
    require(bytes(games[_gameId].winner).length == 0, "This game already has a winner");

    games[_gameId].winner = _winner;
    emit LogUpdateGameWinner(_gameId, _winner);
  }

  function disburseBetFunds(uint256 _gameId) external isOwner returns (bool) {

  }

  // Events
  event LogRegisterUser(address payable indexed _address);
  event LogAddFunds(address indexed _sender, uint256 _amount);
  event LogWithdrawFunds(address indexed _to, uint256 _amount);
  event LogAddGame(string _teamA, string _teamB, uint256 indexed _startTime, uint256 indexed _endTime);
  event LogSubmitBet(address indexed _user, uint256 indexed _gameId, string _sideToWin, uint256 _betStakeAmount, uint256 _appBalance);
  event LogUpdateGameWinner(uint256 indexed _gameId, string _winner);
  event LogDisburseBetFunds(uint256 indexed _gameId);
  event LogCloseGame(uint256 indexed _gameId);
  
}
