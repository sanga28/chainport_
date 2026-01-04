// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BehaviorDrift {

    struct DriftRecord {
        uint256 containerId;
        string oldBehaviorCID;
        string newBehaviorCID;
        uint256 detectedAt;
    }

    uint256 public nextDriftId;
    mapping(uint256 => DriftRecord) public drifts;

    event DriftRecorded(
        uint256 indexed driftId,
        uint256 indexed containerId,
        string oldBehaviorCID,
        string newBehaviorCID
    );

    function recordDrift(
        uint256 containerId,
        string calldata oldCID,
        string calldata newCID
    ) external returns (uint256) {

        uint256 driftId = ++nextDriftId;

        drifts[driftId] = DriftRecord({
            containerId: containerId,
            oldBehaviorCID: oldCID,
            newBehaviorCID: newCID,
            detectedAt: block.timestamp
        });

        emit DriftRecorded(
            driftId,
            containerId,
            oldCID,
            newCID
        );

        return driftId;
    }
}
