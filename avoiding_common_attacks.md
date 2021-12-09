# Avoiding common attacks
The following measures where taken to avoid common attacks:
 - Use specific compiler pragma: compiler pragma version `0.8.0` was used.
 - Proper use of `Require`: `Require` checks were placed at important points in the contract to enforce certain requirements.
 - Protection against Re-entrancy by ensuring the use of withdrawal payment design to prevent loss of control by external caller.
 - Automated unit tests were written to ensure that contract logic behaves as expected.
 - State variables and functions visibility was optimized so that malicious access is restricted.
 - Modifiers were used with reverts to control and restrict malicious access.
