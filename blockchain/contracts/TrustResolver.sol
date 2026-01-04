// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TrustResolver {

    enum TrustState {
        UNVERIFIED,
        VERIFIED,
        DRIFTED
    }

    mapping(uint256 => uint256) public containerAttestation;
    mapping(uint256 => uint256) public containerDrift;

    event AttestationLinked(uint256 containerId, uint256 attestationId);
    event DriftLinked(uint256 containerId, uint256 driftId);

    function linkAttestation(uint256 containerId, uint256 attestationId) external {
        containerAttestation[containerId] = attestationId;
        emit AttestationLinked(containerId, attestationId);
    }

    function linkDrift(uint256 containerId, uint256 driftId) external {
        containerDrift[containerId] = driftId;
        emit DriftLinked(containerId, driftId);
    }

    function getTrustState(uint256 containerId)
        public
        view
        returns (TrustState)
    {
        if (containerDrift[containerId] != 0) {
            return TrustState.DRIFTED;
        }

        if (containerAttestation[containerId] != 0) {
            return TrustState.VERIFIED;
        }

        return TrustState.UNVERIFIED;
    }

    function canDeploy(uint256 containerId)
        external
        view
        returns (bool)
    {
        return getTrustState(containerId) == TrustState.VERIFIED;
    }
}
