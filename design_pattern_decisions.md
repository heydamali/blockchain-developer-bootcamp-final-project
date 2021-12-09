# Design Pattern Decisions
## Inheritance and Interfaces
The contract inherits from two Openzeppelin contract modules namely:
 - `Ownable`: Implements a basic access control mechanism.
 - `Pausable`: Implements an emergency stop mechanism that can be triggered by authorized account.

## Access Control Design Patterns
The contract uses the Openzeppelin `Ownable` contract module for access control.
