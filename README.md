# Ethereum Smart Contract to play Stone, Paper, Scissors, Lizard, Spock
This repository contains smart contract to play Stone, Paper, Scissors, Lizard, Spock. The project including building a smart contract for the Ethereum Blockchain using Vyper. Testing was done using the Truffle suite.
The smart contract enables users to play Stone, Paper, Scissors, Lizard, Spock against an agent (computer) or another player. Commit-reveal scheme was used to prevent cheating. The player having the maximum wins after ten rounds is declared as winner. The implementation also allows the owner of the contract to change the game fee. Player need to pay that fee on registering for the game. In case of a Player vs Player match (PvP), the winner gets a payout equal to the value of contract (2 * game fee). A draw results in the value of the contract to be transferred to the owner of the contract. When playing with the agent (computer), the amount paid during registration is returned to the player irrespective of the outcome of the game.

Brief information about the files and directories in the repository is as follows:
- **SPSLS_truffle:** This directory contains the truffle project containg the smart contact and various test cases.
- **Game_Choices.md:** This file contains the different choices (rock, paper, etc.) along with hash of the choice and nonce. This file was used for testing purposes.
- **Readme.md:** This file contains brief information about the project.
- **SPSLS.vy:** This file contains the Vyper source-code for the smart contract.
