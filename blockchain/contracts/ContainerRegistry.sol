// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ContainerRegistry is ERC721, Ownable {

    struct ContainerMeta {
        string metadataCID;
        uint256 parentVersion;
        uint256 createdAt;
    }

    uint256 public nextTokenId;
    mapping(uint256 => ContainerMeta) public containerData;

    uint256 public constant MINT_FEE = 0.001 ether;

    event ContainerMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string metadataCID,
        uint256 parentVersion
    );

    constructor() ERC721("ChainPortContainer", "CPC") Ownable(msg.sender) {}

    /* ================= MINT ================= */

    function mintContainer(
        string calldata metadataCID,
        uint256 parentVersion
    ) external payable returns (uint256) {

        require(msg.value == MINT_FEE, "Mint fee is 0.001 ETH");

        uint256 tokenId = ++nextTokenId;
        _safeMint(msg.sender, tokenId);

        containerData[tokenId] = ContainerMeta({
            metadataCID: metadataCID,
            parentVersion: parentVersion,
            createdAt: block.timestamp
        });

        emit ContainerMinted(
            tokenId,
            msg.sender,
            metadataCID,
            parentVersion
        );

        return tokenId;
    }

    /* ================= ERC721 METADATA ================= */

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _ownerOf(tokenId) != address(0),
            "URI query for nonexistent token"
        );

        return string(
            abi.encodePacked(
                "ipfs://",
                containerData[tokenId].metadataCID
            )
        );
    }

    /* ================= HELPERS ================= */

    function getParentVersion(uint256 tokenId)
        external
        view
        returns (uint256)
    {
        return containerData[tokenId].parentVersion;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
