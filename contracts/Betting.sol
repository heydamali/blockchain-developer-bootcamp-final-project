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
    uint256 gameId;
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
  }

  struct History {
    uint256 gameId;
    string teamA;
    string teamB;
    string winner;
    uint256 gameTotalAmountStaked;
    uint256 usersCount;
    uint256 startTime;
    uint256 endTime;
    string teamToWin;
    bytes32 teamToWinHash;
    uint256 userTotalAmountStaked;
    uint256 userStakePercentage;
  }

  address public owner;
  uint256 private appBalance;
  uint256 public gameId;
  mapping (address => bool) public users;
  mapping (address => uint256) public usersBalance;
  mapping (address => uint256[]) public usersBetList;
  mapping (uint256 => Game) public games;
  mapping (address => mapping (uint256 => Stake)) public allBets;

  constructor() {
    owner = msg.sender;
    gameId = 1;
    appBalance = 0;
  }

  modifier isOwner {
    require(msg.sender == owner, "Only contract owner can perform this action");
    _;
  }

  modifier isSignedIn {
    require(users[msg.sender] == true, "User not registered");
    _;
  }

  modifier checkAmount(uint256 _amount) {
    require(_amount <= usersBalance[msg.sender], "Insufficient balance");
    _;
  }

  function signInUser(address _address) external {
    require(_address != owner, "Owner can not be registered");
    if(!users[_address] == true) {
      users[_address] = true;
      usersBalance[_address] = 0;

      emit LogSignInUser(_address);
    }
  }

  function signInStatus(address _address) external view returns (bool) {
    return users[_address];
  } 

  function addFunds() external payable isSignedIn { // Fund user in app wallet
    usersBalance[msg.sender] += msg.value;
    emit LogAddFunds(msg.sender, msg.value, usersBalance[msg.sender]);
  }

  function withdrawFunds(address payable _to, uint256 _amount) external payable isSignedIn checkAmount(_amount) returns (uint256) { // Withdraw funds to external wallet
    usersBalance[msg.sender] -= _amount;
    (bool success, ) = _to.call{value: _amount}("");
    require(success, "Withdrawal failed");
    emit LogWithdrawFunds(msg.sender, _amount);
    return _amount;
  }

  function addGame(string memory teamA, string memory teamB, uint256 startTime, uint256 endTime) external isOwner {
    Game memory game;
      game.gameId = gameId;
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

  function getUserBetsHistory() external view returns (History[] memory) {
    uint256 resultLength = usersBetList[msg.sender].length;
    History[] memory result = new History[](resultLength);

    for (uint256 i = 0; i < resultLength; i++) {
      uint256 id = usersBetList[msg.sender][i];
      Game memory game = games[id];
      Stake memory stake = allBets[msg.sender][id];
      History memory history;

      history.gameId = id;
      history.teamA = game.teamA;
      history.teamB = game.teamB;
      history.startTime = game.startTime;
      history.endTime = game.endTime;
      history.gameTotalAmountStaked = game.totalAmountStaked;
      history.usersCount = game.usersCount;
      history.winner = game.winner;
      history.teamToWin = stake.teamToWin;
      history.teamToWinHash = stake.teamToWinHash;
      history.userTotalAmountStaked = stake.totalAmountStaked;

      uint256 userStakePercentage = stake.totalAmountStaked.mul(10000).div(game.totalAmountStaked).mul(100);
      history.userStakePercentage = userStakePercentage; // will be stored as actualPercentage * 10000 e.g 12.5 would equal 125000. This is because of solidity's inablity to handle floating number properly

      result[i] = history;
    }

    return result;
  }

  function submitBet(uint256 _gameId, string memory _teamToWin, uint256 _betStakeAmount) external isSignedIn checkAmount(_betStakeAmount) { // Register a bet with money from app wallet
    require(games[_gameId].isOpen == true, "This game is no longer accepting stakes");
    require(_betStakeAmount > 0, "Bet stake amount must be greater than 0");
    address user = msg.sender;
    bytes32 teamToWinHash = keccak256(abi.encodePacked(_teamToWin));
    Stake storage bet = allBets[user][_gameId];

    // User might be staking this bet for the first time or increasing thier initial stake
    if(bet.totalAmountStaked == 0) {
      Stake memory newBet;
      newBet.teamToWin = _teamToWin;
      newBet.teamToWinHash = teamToWinHash;
      newBet.totalAmountStaked =  _betStakeAmount;

      usersBetList[user].push(_gameId);
      allBets[user][_gameId] = newBet;
      games[_gameId].usersCount = games[_gameId].usersCount.add(1);
    } else {
      require(bet.teamToWinHash == teamToWinHash, "You're not allowed to stake on both sides of a game");
      bet.totalAmountStaked = bet.totalAmountStaked.add(_betStakeAmount);
    }

    usersBalance[user] = usersBalance[user].sub(_betStakeAmount);
    games[_gameId].totalAmountStaked = games[_gameId].totalAmountStaked.add(_betStakeAmount);
    appBalance = appBalance.add(_betStakeAmount);

    emit LogSubmitBet(msg.sender, _gameId, _teamToWin, _betStakeAmount, usersBalance[msg.sender]);
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
  event LogSignInUser(address indexed _address);
  event LogAddFunds(address indexed _sender, uint256 _amount, uint256 _userBalance);
  event LogWithdrawFunds(address indexed _to, uint256 _amount);
  event LogAddGame(string _teamA, string _teamB, uint256 indexed _startTime, uint256 indexed _endTime);
  event LogSubmitBet(address indexed _user, uint256 indexed _gameId, string _sideToWin, uint256 _betStakeAmount, uint256 _userBalance);
  event LogUpdateGameWinner(uint256 indexed _gameId, string _winner);
  event LogDisburseBetFunds(uint256 indexed _gameId);
  event LogCloseGame(uint256 indexed _gameId);
  
}
