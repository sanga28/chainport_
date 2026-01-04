// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VerifierRegistry is Ownable {
    mapping(address => bool) public isVerifier;

    event VerifierAdded(address verifier);
    event VerifierRemoved(address verifier);

    constructor() Ownable(msg.sender) {}

    function addVerifier(address verifier) external onlyOwner {
        isVerifier[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) external onlyOwner {
        isVerifier[verifier] = false;
        emit VerifierRemoved(verifier);
    }
}
