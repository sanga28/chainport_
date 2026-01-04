// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IContainerRegistry {
    function ownerOf(uint256 tokenId) external view returns (address);
}
