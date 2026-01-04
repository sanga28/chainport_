// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VerifierRegistry.sol";

contract BehaviorAttestation {

    struct Attestation {
        uint256 containerId;
        string behaviorCID;
        address verifier;
        uint256 timestamp;
    }

    uint256 public nextAttestationId;
    mapping(uint256 => Attestation) public attestations;

    VerifierRegistry public verifierRegistry;

    event BehaviorAttested(
        uint256 indexed attestationId,
        uint256 indexed containerId,
        string behaviorCID,
        address verifier
    );

    constructor(address _verifierRegistry) {
        verifierRegistry = VerifierRegistry(_verifierRegistry);
    }

    function mintAttestation(
        uint256 containerId,
        string calldata behaviorCID
    ) external returns (uint256) {

        require(
            verifierRegistry.isVerifier(msg.sender),
            "Not authorized verifier"
        );

        uint256 attestationId = ++nextAttestationId;

        attestations[attestationId] = Attestation({
            containerId: containerId,
            behaviorCID: behaviorCID,
            verifier: msg.sender,
            timestamp: block.timestamp
        });

        emit BehaviorAttested(
            attestationId,
            containerId,
            behaviorCID,
            msg.sender
        );

        return attestationId;
    }
}
